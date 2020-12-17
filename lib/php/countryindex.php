<?php
	$url='www.stuartdewing.co.uk/Gazetteer/lib/php/countryBorders.geo.json';

	$decode = json_decode(file_get_contents("countryBorders.geo.json"), true);

	$countryIso = [];
	for ($i=0; $i<count($decode['features']); $i++) {
		$country[$i] = [];
		array_push($country[$i], $decode['features'][$i]['properties']['name']);
		array_push($country[$i], $decode['features'][$i]['properties']['iso_a3']);
		array_push($countryIso, $country[$i]);
		array_push($country[$i], $decode['features'][$i]['properties']['iso_a2']);
	}

	$output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success - countryindex.php";

	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($countryIso, true);
?>


