let lat = "";
let lng = "";
let currentCountry = "Empty" ;
$.standardMap = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png';
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
		lng = position.coords.longitude;
		


		if ($.mymap.hasLayer($.homeMarker)) {
			$.mymap.removeLayer($.homeMarker);
		}
			$.homeIcon = L.icon({
				iconUrl: 'lib/img/home.png',
				iconSize:     [25, 25],
				iconAnchor:   [0, 0],
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
					color: "green",
					weight: 5,
					opacity: 1
				}).addTo($.mymap);         
				$.mymap.fitBounds($.border.getBounds());			
// Capital City - Navbar and Marker
				$('#capitalcity').html("Capital City: " + result.capCityName);
				
				if ($.mymap.hasLayer($.capCity)) {
					$.mymap.removeLayer($.capCity);
				}

				let capCityIcon = L.icon({
					iconUrl: 'lib/img/capcity.png',			
					iconSize:     [25, 25], 
					iconAnchor:   [0, 0], 
				});

				$( "#capitalcity" ).click(function() {
					if ($.mymap.hasLayer($.capCity)) {
						$.mymap.removeLayer($.capCity);
					} else {
						$.capCity = L.marker([result.phplat, result.phplng], {icon: capCityIcon}).addTo($.mymap).bindPopup();
					}
				});
// Population
				$.populationResults = result.population
				function numberWithCommas(x) {
					$.population =  x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
				}
				numberWithCommas($.populationResults)
				$('#population').html("Population: " + $.population);
// Language
				$('#language').html("Language: " + result.language);
			}
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






