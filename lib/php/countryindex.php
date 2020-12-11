<?php
	$url='www.stuartdewing.co.uk/Gazetteer/lib/php/countryBorders.geo.json';

	$curl = curl_init();

	curl_setopt($curl, CURLOPT_URL,$url);
	
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	
	$result=curl_exec($curl);
-	
	curl_close($curl);

	$decode = json_decode($result,true);


	$countryIso = [];
	for ($i=0; $i<count($decode['features']); $i++) {
		$country[$i] = [];
		array_push($country[$i], $decode['features'][$i]['properties']['name']);
		array_push($country[$i], $decode['features'][$i]['properties']['iso_a3']);
		array_push($countryIso, $country[$i]);
	}

	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($countryIso, true);

?>


