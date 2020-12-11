<?php
	 $executionStartTime = microtime(true);
	$url='https://api.opencagedata.com/geocode/v1/json?q=' . $_REQUEST['lat'] . ',' . $_REQUEST['lng'] . '&pretty=1&key=b018e21e70aa43d1828f1331f00d1fab';
	// $url='https://api.opencagedata.com/geocode/v1/json?q=50.8302846,-1.0766864&pretty=1&key=b018e21e70aa43d1828f1331f00d1fab';
	
	$curl = curl_init();

	curl_setopt($curl, CURLOPT_URL,$url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	
	$result=curl_exec($curl);
	                                                                                                                     
	curl_close($curl);
	$decode = json_decode($result,true);
	
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success - location.php";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['iso'] = $decode['results'][0]["components"]['ISO_3166-1_alpha-3'];
	
	
	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($output, true);

?>