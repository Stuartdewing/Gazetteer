let lat = "";
let lng = "";
let currentCountry = "Empty" ;

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
			$.select = document.getElementById("selectCountry");
			$.select.add($.newoption);	
// Re orders <options> in alphabetical order
			$(function() {
				var select = $('selectCountry');
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
		console.log(lat);
		lng = position.coords.longitude;
		console.log(lng);
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
//Marker for user location
					var youAreHere = L.icon({
						iconUrl: 'lib/img/home.png',
						iconSize:     [100, 100],
						iconAnchor:   [22, 94],
					});
					L.marker([lat, lng], {icon: youAreHere}).addTo($.mymap).bindPopup("You are here!!");
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

// Map leafletjs.com
	$.mymap = L.map('mapid').setView([lat, lng], 7);
	const attribution = '&copy; <a href="http://stamen.com">Stamen Design</a>, contributors';
	$.tileUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png';
	$.tiles = L.tileLayer($.tileUrl, {attribution} );
	$.tiles.addTo($.mymap);






	

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
					color: 'green',
					weight: 9,
					opacity: 1
				}).addTo($.mymap);         
				$.mymap.fitBounds($.border.getBounds());			
// Display Data in Control Panel
				$.info = L.control();
				$.info.onAdd = function (map) {
					this._div = L.DomUtil.create('div', 'info'); 
					this._div.innerHTML = 
						`<h2>Information</h2>
						<img id="flag" src="${result.flag}" height="50px" width="100px"> 
						<br />
						<h3>Country:</h3> ${result.countryName} 
						<h3>Capital City:</h3> ${result.capCityName}
						<h3>Language:</h3> ${result.language}
						<h3>Population:</h3> ${result.population}
						<h3>Time Zone:</h3> ${result.timeName}  ${result.time}
						<h2>Weather</h2>
						<h3>Clouds:</h3> ${result.clouds}
						<h3>Wind Speed:</h3> ${result.wind}kph
						<h3>Humidity:</h3> ${result.humidity}%
						<h3>Temperature:</h3> ${result.temperature}'C							
						`;
					return this._div;
				};
				$.info.addTo($.mymap);
// Coin
				let coinIcon = L.icon({
					iconUrl: 'lib/img/coin.png',			
					iconSize:     [75, 75], 
					iconAnchor:   [0, 100], 
				});
// Clear previous Coin Marker
				if ($.mymap.hasLayer($.coinMarker)) {
					$.mymap.removeLayer($.coinMarker);
				}
// Display Coin Marker
				$.coinMarker = L.marker([result.phplat, result.phplng], {icon: coinIcon}).addTo($.mymap).bindPopup("The currency in " + result.countryName + " is " + result.currency + " and the current exchange rate against the USD is " + result.exchangeRate +"." );
// Population
				let population = L.icon({
					iconUrl: 'lib/img/people.svg.png',			
					iconSize:     [75, 75], 
					iconAnchor:   [100, 0], 
				});
// Clear previous population Marker
				if ($.mymap.hasLayer($.populationMarker)) {
					$.mymap.removeLayer($.populationMarker);
				}
// Display population Marker
				$.populationMarker = L.marker([result.phplat, result.phplng], {icon: population}).addTo($.mymap).bindPopup("The population of " + result.countryName + " is " + result.population + "." );
// Assigns a car facing the direction taht the country drives
				$.drivingSideImg = "";
				if (result.driveOn === "right") {
					$.drivingSideImg = 'lib/img/green.png';
				} else {
					$.drivingSideImg = 'lib/img/car-left.png';
				}
// Car
				let driveSide = L.icon({
					iconUrl: $.drivingSideImg,			
					iconSize:     [75, 150], 
					iconAnchor:   [-100, 40], 
				});
// Clear previous driving side Marker
				if ($.mymap.hasLayer($.driveSideMarker)) {
					$.mymap.removeLayer($.driveSideMarker);
				}
// Display driving side Marker
				$.driveSideMarker = L.marker([result.phplat, result.phplng], {icon: driveSide}).addTo($.mymap).bindPopup("The people in " + result.countryName + " drive on the " + result.driveOn + ", the speed is measured in " + result.speedIn + "." );
// Assigns a image for cold if the country temp is under 20 and an image for hot if over 20		
				$.temperatureImg = "";
				if (result.temperature < 20) {
					$.temperatureImg = 'lib/img/cold.jpg';
				} else {
					$.temperatureImg = 'lib/img/hot.jpg';
				}
// Thermometer
				let temperatureIcon = L.icon({
					iconUrl: $.temperatureImg,			
					iconSize:     [75, 75], 
					iconAnchor:   [0, -100], 
				});
// Clear previous temperature Marker
				if ($.mymap.hasLayer($.temperatureMarker)) {
					$.mymap.removeLayer($.temperatureMarker);
				}
// Display temperature Marker
				$.temperatureMarker = L.marker([result.phplat, result.phplng], {icon: temperatureIcon}).addTo($.mymap).bindPopup("The temperature in  " + result.countryName + " is " + result.temperature + "'C." );
			}
		},
		error: function(jqXHR, textStatus, errorThrow) {
			console.log("Error!!!!", textStatus, errorThrow);
		}
	});

};



//On Change - <s
$('select').on('change', function() { 
	$('.info').remove();
	currentCountry = this.value;
	if ($.mymap.hasLayer($.wikiButton)) {
		$.mymap.removeLayer($.wikiButton);
	}
	change()
});


// Wiki Button
L.easyButton('<img src="lib/img/wiki.png" width="40vh" height="40vh">', function(){
	function newTab() {
	window.open("https://en.wikipedia.org/wiki/"+ $selectedCountry);
	}
	newTab();
}).addTo( $.mymap );

//Button for users Location
$.homeButton =L.easyButton('<img src="lib/img/home.png" width="40vh" height="40vh">', function(btn, map){
			$home = [lat,lng];
			map.setView($home);
}).addTo( $.mymap );

			