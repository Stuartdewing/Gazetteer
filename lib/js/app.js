let lat = "";
let lng = "";
let currentCountry = "Empty";

const standardMapUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png';
const satelliteMapUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

const 	standardMap = L.tileLayer(standardMapUrl, {id: 'MapID', tileSize: 512, zoomOffset: -1}),
		satelliteMap = L.tileLayer(satelliteMapUrl, {id: 'MapID', tileSize: 512, zoomOffset: -1});
let eqOverlay = L.layerGroup([]);
let wikiOverlay = L.layerGroup([]);
let capCity = L.marker([]);
let layerscontrol = L.marker([]);



// Sets Map Div height and width to size of window
$("#map").height($(window).height());
$("#map").width($(window).width());


//////////////////////////////////
//Creates Map
let mymap = L.map('mapid', {
	center: [lat, lng],
	zoom: 9,
	layers: [standardMap, ]
});
//////////////////////////////////

//////////////////////////////////
//Populate <Select>
$.ajax({
	url: 'lib/php/countryindex.php',
	type: "POST",
	dataType: "json",
	success: function(result) { 		
		for (i = 0; i < result.length; i++) {
			$.countryname = result[i][0];
			$.iso = result[i][1];
// Creates <option> and adds to <select> 
			$.newoption = document.createElement("option");
			$.newoption.text = $.countryname;
			$.newoption.value = $.iso;
			$.select = document.getElementById("select");
			$.select.add($.newoption);	
// Re orders <options> in alphabetical order
			$(function() {
				var select = $('select');
				select.html(select.find('option').sort(function(x, y) {
// Sorts <option> in targeted <select> in alphabetical order
					return $(x).text() > $(y).text() ? 1 : -1;
				}));
			});
		}
// Get users current location
	navigator.geolocation.getCurrentPosition(
    function(position) {
		lat = position.coords.latitude;
		lng = position.coords.longitude;
		
		const homeIcon = L.icon({
			iconUrl: 'lib/img/home.png',
			iconSize:     [40, 40],
			iconAnchor:   [20, 40],
		})

		const homeMarker = L.marker([lat, lng], {icon: homeIcon}).addTo(mymap).bindPopup("You are here!!");

// Get users location's iso code  
		$.ajax({
			url: 'lib/php/location.php',
			type: "POST",
			dataType: "json",
			data: {
				lat: lat,
				lng: lng
			},
			success: function(result) {
				if (result.status.name == "ok") {
// Selects returned country ISO <option> 
				$( document ).ready(function() {
					currentCountry = result.iso;
					iso2 = result.iso2;
					$("select").val(currentCountry);
					change();
				});	
				}
			},
			error: function(jqXHR, textStatus, errorThrow) {
				console.log("Error!!!!", textStatus, errorThrow);
			}	
		});
	},
		function(error){
			alert(error.message);
		}, {
			enableHighAccuracy: true
				,timeout : 5000
		});	
	},
	error: function(jqXHR, textStatus, errorThrow) {
		console.log("Error!!!!", textStatus, errorThrow);
	}
});
//Populate <Select>
//////////////////////////////////


//////////////////////////////////
// Function to change data - Called on change <select> and when getting users location
function change() {		
	$.ajax({
		url: 'lib/php/borders.php',
		type: "GET",
		dataType: "json",
		data: {iso_a3: currentCountry},
		success: function (result) {
			if (result.status.name == "ok") {
//////////////////////////////////
// Map
		// Removes Layers and Markers from Map
				mymap.eachLayer(function (layer) {
					mymap.removeLayer(layer);
				});
		// Removes Control Panel from Map		
				mymap.removeControl(layerscontrol);
		// Adds Standard map layer to Map		
				L.tileLayer(standardMapUrl, {id: 'MapID', tileSize: 512, zoomOffset: -1}).addTo(mymap)
//////////////////////////////////
//Border
				if (mymap.hasLayer($.border)) {
					mymap.removeLayer($.border);
				}
				$.border = L.geoJson(result.data,{
					color: "green",
					weight: 5,
					opacity: 1
				}).addTo(mymap);         
				mymap.fitBounds($.border.getBounds());	
//////////////////////////////////
//Info
	// Capital City 
				$('#capitalcity').html(result.capCityName);
		// Marker
				if (mymap.hasLayer(capCity)) {
					mymap.removeLayer(capCity);
				}

				let capCityIcon = L.icon({
					iconUrl: 'lib/img/capcity.png',			
					iconSize:     [50, 50], 
					iconAnchor:   [25, 50], 
					// popupAnchor: [100, 100]
				});

				capCity = L.marker([result.phplat, result.phplng], {icon: capCityIcon}).addTo(mymap).bindPopup("The capital city of " + result.countryName + " is " + result.capCityName);
	
	// Population
		// Breakers the answer down with , ever 3 units 1,000,000,000
				let populationResults = result.population
				let population
				function numberWithCommas(x) {
					population =  x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
				}
				numberWithCommas(populationResults)
				$('#population').html(population);
	// Language
				$('#language').html(result.language);
	//Flag
				$('#flagid').attr("src",result.flag);
	//Currency
				$('#currency').html(result.currency);
	//Time Zone
				$('#time').html(result.timeName + " " + result.time);
//Info				
//////////////////////////////////

//////////////////////////////////			
// News
			$('#newstitle').html(result.newsTitle);
			$('#newsdescription').html(result.newsDescription);
			$('#newsurl').attr("href", result.newsUrl);
			$('#newsimg').attr("src", result.newsImg);
			
			$('#newstitle2').html(result.newsTitle2);
			$('#newsdescription2').html(result.newsDescription2);
			$('#newsurl2').attr("href", result.newsUrl2);
			$('#newsimg2').attr("src", result.newsImg2);

			$('#newstitle3').html(result.newsTitle3);
			$('#newsdescription3').html(result.newsDescription3);
			$('#newsurl3').attr("href", result.newsUrl3);
			$('#newsimg3').attr("src", result.newsImg3);
		

//News			
//////////////////////////////////

//////////////////////////////////
// Weather
	//Today
			$('#weathericontoday').attr("src","lib/img/weather/"+result.weather.icon.today+".png");
			$('#weatherdescriptiontoday').html("Today: " + result.weather.description.today);
			$('#weathertemptoday').html("Temp: " + result.weather.temp.today + "c Feels Like: " + result.weather.feels.today+"c");
		
		//Sunrise Time
			// multiplied by 1000 so that the argument is in milliseconds, not seconds.
			let date = new Date(result.weather.rise.today * 1000);
			// Hours part from the timestamp
			let hours = date.getHours();
			// Minutes part from the timestamp
			let minutes = "0" + date.getMinutes();
			// Seconds part from the timestamp
			let seconds = "0" + date.getSeconds();
			// Will display time in 10:30:23 format
			let todaysunrise = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
		//Sunset Time
			let dateset = new Date(result.weather.set.today * 1000);
			let hoursset = dateset.getHours();
			let minutesset = "0" + dateset.getMinutes();
			let secondsset = "0" + dateset.getSeconds();
			let todaysunset = hoursset + ':' + minutesset.substr(-2) + ':' + secondsset.substr(-2);

			$('#weathersuntoday').html("Sunrise: "  + todaysunrise + " Sunset: " + todaysunset);
	//Tomrrow		 
			$('#weathericontomorrow').attr("src","lib/img/weather/"+result.weather.icon.tomorrow+".png");
			$('#weatherdescriptiontomorrow').html("Tomorrow: "+ result.weather.description.tomorrow);
			$('#weathertemptomorrow').html("Temp: " + result.weather.temp.tomorrow + "c Feels Like: " + result.weather.feels.tomorrow+"c");

		//Sunrise Time
			let dateto = new Date(result.weather.rise.tomorrow * 1000);
			let hoursto = date.getHours();
			let minutesto = "0" + dateto.getMinutes();
			let secondsto = "0" + dateto.getSeconds();
			let tomorrowsunrise = hoursto + ':' + minutesto.substr(-2) + ':' + secondsto.substr(-2);
		//Sunset Time
			let datetoset = new Date(result.weather.set.tomorrow * 1000);
			let hourstoset = datetoset.getHours();
			let minutestoset = "0" + datetoset.getMinutes();
			let secondstoset = "0" + datetoset.getSeconds();
			let tomorrowsunset = hourstoset + ':' + minutestoset.substr(-2) + ':' + secondstoset.substr(-2);

			$('#weathersuntomorrow').html("Sunrise: "  + tomorrowsunrise + " Sunset: " + tomorrowsunset);
	//Next Day			
			$('#weathericonnext').attr("src","lib/img/weather/"+result.weather.icon.next+".png");
			$('#weatherdescriptionnext').html("Next Day: " + result.weather.description.next);
			$('#weathertempnext').html("Temp: " + result.weather.temp.next + "c Feels Like: " + result.weather.feels.next+"c");
		//Sunrise
			let datex = new Date(result.weather.rise.next * 1000);
			let hoursx = datex.getHours();
			let minutesx = "0" + datex.getMinutes();
			let secondsx = "0" + datex.getSeconds();
			let sunrisenext = hoursx + ':' + minutesx.substr(-2) + ':' + secondsx.substr(-2);
		//Sunset
			let datexset = new Date(result.weather.set.next * 1000);
			let hoursxset = datexset.getHours();
			let minutesxset = "0" + datexset.getMinutes();
			let secondsxset = "0" + datexset.getSeconds();
			let sunsetnext = hoursxset + ':' + minutesxset.substr(-2) + ':' + secondsxset.substr(-2);

			$('#weathersunnext').html("Sunrise: "  + sunrisenext + " Sunset: " + sunsetnext);
// Weather
//////////////////////////////////		 

//////////////////////////////////
//Wiki
			let wikiIcon = L.icon({
				iconUrl: "lib/img/wiki.svg.png",			
				iconSize:     [40, 40], 
				iconAnchor:   [20, 40], 
			});

		// Wiki Markers	
			let wikiMarker1 = L.marker([result.wikiLat1, result.wikiLng1], {icon: wikiIcon}).addTo(mymap)	
			.bindPopup(result.wikiTitle1 + ": " + result.wikisummary1 + "<a href='https://" + result.wikiurl1 + "' target='_blank' > Click for more info</a>");
		 
			let wikiMarker2 = L.marker([result.wikiLat2, result.wikiLng2], {icon: wikiIcon}).addTo(mymap)
			.bindPopup(result.wikiTitle2 + ": " + result.wikisummary2+ "<a href='https://" + result.wikiurl2 + "' target='_blank'> Click for more info</a>");
		
			let wikiMarker3 = L.marker([result.wikiLat3, result.wikiLng3], {icon: wikiIcon}).addTo(mymap)
			.bindPopup(result.wikiTitle3 + ": " + result.wikisummary3+ "<a href='https://" + result.wikiurl3 + "' target='_blank' > Click for more info</a>");
		
			let wikiMarker4 = L.marker([result.wikiLat4, result.wikiLng4], {icon: wikiIcon}).addTo(mymap)
			.bindPopup(result.wikiTitle4 + ": " + result.wikisummary4+ "<a href='https://" + result.wikiurl4 + "' target='_blank'> Click for more info</a>");
		
			let wikiMarker5 = L.marker([result.wikiLat5, result.wikiLng5], {icon: wikiIcon}).addTo(mymap)	
			.bindPopup(result.wikiTitle5 + ": " + result.wikisummary5+ "<a href='https://" + result.wikiurl5 + "' target='_blank'> Click for more info</a>");
		
		// Wiki Marker Featured Group
			wikiOverlay = L.layerGroup([wikiMarker1, wikiMarker2, wikiMarker3, wikiMarker4, wikiMarker5]);

//////////////////////////////////
// Earthquake
			let eqIcon1 = L.icon({
				iconUrl: "lib/img/eq.png",			
				iconSize:     [50, 50], 
				iconAnchor:   [25, 50], 
			});
		// Earthquake Markers
			let dayEq1 = result.earthquake.one.date.slice(8,10);
			let monthEq1 = result.earthquake.one.date.slice(5,7);
			let yearEq1 = result.earthquake.one.date.slice(0,4);

			let eqMarker1 = L.marker([result.earthquake.one.lat, result.earthquake.one.lng], {icon: eqIcon1}).addTo(mymap)
			.bindPopup("Earthquate Date: "+ dayEq1 + "-" + monthEq1 + "-" + yearEq1 + " Magnitude:" + result.earthquake.one.magnitude);

			let dayEq2 = result.earthquake.two.date.slice(8,10);
			let monthEq2 = result.earthquake.two.date.slice(5,7);
			let yearEq2 = result.earthquake.two.date.slice(0,4);
			
			let eqMarker2 = L.marker([result.earthquake.two.lat, result.earthquake.two.lng], {icon: eqIcon1}).addTo(mymap)
			.bindPopup("Earthquate Date: "+ dayEq2 + "-" + monthEq2 + "-" + yearEq2 + " Magnitude:" + result.earthquake.two.magnitude);

			let dayEq3 = result.earthquake.three.date.slice(8,10);
			let monthEq3 = result.earthquake.three.date.slice(5,7);
			let yearEq3 = result.earthquake.three.date.slice(0,4);

			let eqMarker3 = L.marker([result.earthquake.three.lat, result.earthquake.three.lng], {icon: eqIcon1}).addTo(mymap)
			.bindPopup("Earthquate Date: "+ dayEq3 + "-" + monthEq3 + "-" + yearEq3 + " Magnitude:" + result.earthquake.three.magnitude);

			let dayEq4 = result.earthquake.four.date.slice(8,10);
			let monthEq4 = result.earthquake.four.date.slice(5,7);
			let yearEq4 = result.earthquake.four.date.slice(0,4);

			let eqMarker4 = L.marker([result.earthquake.four.lat, result.earthquake.four.lng], {icon: eqIcon1}).addTo(mymap)
			.bindPopup("Earthquate Date: "+ dayEq4 + "-" + monthEq4 + "-" + yearEq4 + " Magnitude:" + result.earthquake.four.magnitude);
			let dayEq5 = result.earthquake.five.date.slice(8,10);
			let monthEq5 = result.earthquake.five.date.slice(5,7);
			let yearEq5 = result.earthquake.five.date.slice(0,4);

			let eqMarker5 = L.marker([result.earthquake.five.lat, result.earthquake.five.lng], {icon: eqIcon1}).addTo(mymap)
			.bindPopup("Earthquate Date: "+  dayEq5 + "-" + monthEq5 + "-" + yearEq5 + " Magnitude:" + result.earthquake.five.magnitude);
			
		// Earthquake Marker Featured Group
			eqOverlay = L.layerGroup([eqMarker1, eqMarker2, eqMarker3, eqMarker4, eqMarker5]);

//////////////////////////////////
// Map Control Panel		
	// BaseMaps - Collection of Map Layers
			let baseMaps = {
				"Standard": standardMap,
				"Satellite": satelliteMap
			};
	//Overlays - Collection of Featured Groups		
			let overlays = {
				"Wikipedia" : wikiOverlay,
				"Earthquakes" : eqOverlay,
				"Capital City" : capCity,
			}
	// Control Button for Maps and Overlays
			layerscontrol = L.control.layers(baseMaps, overlays).addTo(mymap);			
//////////////////////////////////			
			}
		},
		error: function(jqXHR, textStatus, errorThrow) {
			console.log("Error!!!!", textStatus, errorThrow);
		}
	});

};
//////////////////////////////////

//////////////////////////////////
//On Change - <select>
$('select').on('change', function() { 
	$('.info').remove();
	currentCountry = this.value;
	if (mymap.hasLayer($.wikiButton)) {
		mymap.removeLayer($.wikiButton);
	}
	change()
});
//////////////////////////////////

//////////////////////////////////
//Buttons
	//Info
L.easyButton('<img src="lib/img/i.png" width="40vh" height="40vh">', function() {
    $('#infomodal').modal('show');
}, 'Informacije').addTo(mymap);
	//News
L.easyButton('<img src="lib/img/news.png" width="40vh" height="40vh">', function() {
    $('#news').modal('show');
}, 'Informacije').addTo(mymap);
	//Weather
L.easyButton('<img src="lib/img/weather/01d.png" width="40vh" height="40vh">', function() {
    $('#weather').modal('show');
}, 'Informacije').addTo(mymap);
//////////////////////////////////

$('.close').click(function() {
    $('.hide').modal('hide');
});


