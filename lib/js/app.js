let lat = "";
let lng = "";
let currentCountry = "Empty" ;
$.standardMap = 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png';
$.satelliteMap = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

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
		console.log(lat);
		lng = position.coords.longitude;
		console.log(lng);


		if ($.mymap.hasLayer($.homeMarker)) {
			$.mymap.removeLayer($.homeMarker);
		}
			$.homeIcon = L.icon({
				iconUrl: 'lib/img/home.svg',
				iconSize:     [25, 25],
				iconAnchor:   [22, 94],
			});

			$( "#homeMarker" ).click(function() {
				if ($.mymap.hasLayer($.homeMarker)) {
					$.mymap.removeLayer($.homeMarker);
				} else {
					$.homeMarker = L.marker([lat, lng], {icon: $.homeIcon}).addTo($.mymap).bindPopup("You are here!!");
				}
			});
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

// Map leafletjs.com
	$.mymap = L.map('mapid').setView([lat, lng], 7);
	$.tileUrl = $.standardMap;
	$.tiles = L.tileLayer($.tileUrl, );
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
					color: 'black',
					weight: 5,
					opacity: 1
				}).addTo($.mymap);         
				$.mymap.fitBounds($.border.getBounds());			
// Capital City - Navbar and Marker
				if ($.mymap.hasLayer($.capCity)) {
					$.mymap.removeLayer($.capCity);
				}

				let capCityIcon = L.icon({
					iconUrl: 'lib/img/capcity.svg',			
					iconSize:     [25, 25], 
					iconAnchor:   [0, 0], 
				});

				$('#capitalcity').html("Capital City: " + result.capCityName);

				$( "#capitalcity" ).click(function() {
					if ($.mymap.hasLayer($.capCity)) {
						$.mymap.removeLayer($.capCity);
					} else {
						$.capCity = L.marker([result.phplat, result.phplng], {icon: capCityIcon}).addTo($.mymap).bindPopup("The currency in " + result.countryName + " is " + result.currency + " and the current exchange rate against the USD is " + result.exchangeRate +"." );
					}
				});
// Population
				$('#population').html("Population: " + result.population);
// Language
				$('#language').html("Language: " + result.language);
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
	if ($.mymap.hasLayer($.wikiButton)) {
		$.mymap.removeLayer($.wikiButton);
	}
	change()
});

L.easyButton('<img src="lib/img/map.svg"" width="40vh" height="40vh">', function(){
	function mapChange(){
		
		if ($.tileUrl == $.satelliteMap){
			$.tileUrl = $.standardMap;
			$.tiles = L.tileLayer($.tileUrl, );
			$.tiles.addTo($.mymap);
		}else {
			$.tileUrl = $.satelliteMap;
			$.tiles = L.tileLayer($.tileUrl, );
			$.tiles.addTo($.mymap);
		}
	};
	mapChange();	
}).addTo( $.mymap );



