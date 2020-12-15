let lat = "";
let lng = "";
let currentCountry = "Empty" ;
$.standardMap = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png';
$.satelliteMap = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

var standardMap = L.tileLayer($.standardMap, {id: 'MapID', tileSize: 512, zoomOffset: -1}),
	satelliteMap = L.tileLayer($.satelliteMap, {id: 'MapID', tileSize: 512, zoomOffset: -1});


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
		
		$.homeIcon = L.icon({
			iconUrl: 'lib/img/home.png',
			iconSize:     [25, 25],
			iconAnchor:   [0, 0],
		})

		$.homeMarker = L.marker([lat, lng], {icon: $.homeIcon}).addTo($.mymap).bindPopup("You are here!!");

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


	$.mymap = L.map('mapid', {
		center: [lat, lng],
		zoom: 1,
		layers: [standardMap, ]
	});

	$.baseMaps = {
		"Standard": standardMap,
		"Satellite": satelliteMap
	};

	L.control.layers($.baseMaps).addTo($.mymap);
	
// Function to change data - Called on change <select> and when getting users location
function change() {		
	$.ajax({
		url: 'lib/php/borders.php',
		type: "GET",
		dataType: "json",
		data: {iso_a3: currentCountry},
		success: function (result) {
			if (result.status.name == "ok") {
				$selectedCountry = result.countryName;
// Display border for country
				if ($.mymap.hasLayer($.border)) {
					$.mymap.removeLayer($.border);
				}
				$.border = L.geoJson(result.data,{
					color: "green",
					weight: 5,
					opacity: 1
				}).addTo($.mymap);         
				$.mymap.fitBounds($.border.getBounds());			
// Capital City - (Info Button & Marker)
				$('#capitalcity').html(result.capCityName);
				
				if ($.mymap.hasLayer($.capCity)) {
					$.mymap.removeLayer($.capCity);
				}

				let capCityIcon = L.icon({
					iconUrl: 'lib/img/capcity.png',			
					iconSize:     [50, 50], 
					iconAnchor:   [0, 0], 
				});

				$.capCity = L.marker([result.phplat, result.phplng], {icon: capCityIcon}).addTo($.mymap).bindPopup("The capital city of " + result.countryName + " is " + result.capCityName);
	
// Population
				$.populationResults = result.population
				function numberWithCommas(x) {
					$.population =  x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
				}
				numberWithCommas($.populationResults)
				$('#population').html($.population);
// Language
				$('#language').html(result.language);

//Flag
				$('#flagid').attr("src",result.flag);
//Currency
				$('#currency').html(result.currency);
//Time
				$('#time').html(result.timeName + " " + result.time);
			
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

//Wiki	
	// Wiki Marker 1
			if ($.mymap.hasLayer($.wikiMarker1)) {
				$.mymap.removeLayer($.wikiMarker1);
			}
			let wikiIcon1 = L.icon({
				iconUrl: result.wikithumbnailImg1,			
				iconSize:     [75, 75], 
				iconAnchor:   [0, 0], 
			});
			$.wikiMarker1 = L.marker([result.wikiLat1, result.wikiLng1], {icon: wikiIcon1}).addTo($.mymap).bindPopup(result.wikiTitle1 + ": " + result.wikisummary1);
	// Wiki Marker 2
			if ($.mymap.hasLayer($.wikiMarker2)) {
				$.mymap.removeLayer($.wikiMarker2);
			}
			let wikiIcon2 = L.icon({
				iconUrl: result.wikithumbnailImg2,			
				iconSize:     [75, 75], 
				iconAnchor:   [0, 0], 
			});
			$.wikiMarker2 = L.marker([result.wikiLat2, result.wikiLng2], {icon: wikiIcon2}).addTo($.mymap).bindPopup(result.wikiTitle2 + ": " + result.wikisummary2);
	// Wiki Marker 3
		if ($.mymap.hasLayer($.wikiMarker3)) {
			$.mymap.removeLayer($.wikiMarker3);
		}
		let wikiIcon3 = L.icon({
			iconUrl: result.wikithumbnailImg3,			
			iconSize:     [75, 75], 
			iconAnchor:   [0, 0], 
		});
		$.wikiMarker3 = L.marker([result.wikiLat3, result.wikiLng3], {icon: wikiIcon3}).addTo($.mymap).bindPopup(result.wikiTitle3 + ": " + result.wikisummary3);
			}
		},
		error: function(jqXHR, textStatus, errorThrow) {
			console.log("Error!!!!", textStatus, errorThrow);
		}
	});

};

//On Change - <select>
$('select').on('change', function() { 
	$('.info').remove();
	currentCountry = this.value;
	$.phpname = this;
	console.log($.phpname)
	if ($.mymap.hasLayer($.wikiButton)) {
		$.mymap.removeLayer($.wikiButton);
	}
	change()
});








