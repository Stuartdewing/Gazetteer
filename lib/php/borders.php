<?php
    $iso3 = $_REQUEST['iso_a3'];
    // ini_set('display_errors', 'On');
    // error_reporting(E_ALL);
    $executionStartTime = microtime(true);
// Border
    $countryBorders = json_decode(file_get_contents("countryBorders.geo.json"), true);
    $border = null;

    foreach ($countryBorders['features'] as $feature) {
        if ($feature["properties"]["iso_a3"] ==  $_REQUEST['iso_a3']) {
            $border = $feature;
        break;
        }
    }

// Capital City Name / Flag / Population / Language / 
    $urlCapCity='https://restcountries.eu/rest/v2/alpha/'.$iso3;

    $curl = curl_init();
	curl_setopt($curl, CURLOPT_URL,$urlCapCity);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	$result=curl_exec($curl);
	curl_close($curl);
    $decodeCountryData = json_decode($result,true);


   

    $countryNameTest = isset($decodeCountryData['name']);
    if ($countryNameTest == false) {
        $countryName = "Unknown Country Name Data";    
    } else {
        $countryName = $decodeCountryData['name'];
    };

    $nativeNameTest = isset($decodeCountryData['nativename']);
    if ($nativeNameTest == false) {
        $nativeName = "Unknown Country Native Name Data";    
    } else {
        $nativeName = $decodeCountryData['nativename'];
    };

    $capCityNameTest = isset($decodeCountryData['capital']);
    if ($capCityNameTest == false) {
        $capCityName = "London";    
    } else {
        $capCityNameO = $decodeCountryData['capital'];
        $capCityName = str_replace(' ', '', $capCityNameO);
    };

    $populationTest = isset($decodeCountryData['population']);
    if ($populationTest == false) {
        $population = "London";    
    } else {
        $population = $decodeCountryData['population'];
    };
    
    $languageTest = isset($decodeCountryData['languages'][0]['name']);
    if ($languageTest == false) {
        $language = "London";    
    } else {
        $language = $decodeCountryData['languages'][0]['name'];
    };

    $flagTest = isset($decodeCountryData['flag']);
    if ($flagTest == false) {
        $flag = "No Flag Data";    
    } else {
        $flag = $decodeCountryData['flag'];
    };

// Currency/ Driving / Time
    $urlOpenCage='https://api.opencagedata.com/geocode/v1/json?q='. $capCityName. '&key=b018e21e70aa43d1828f1331f00d1fab&language=en&pretty=1';

    $curl = curl_init();
	curl_setopt($curl, CURLOPT_URL,$urlOpenCage);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	$result=curl_exec($curl);
	curl_close($curl);
    $decodeOpenCage= json_decode($result,true);

    $currencyTest = isset($decodeOpenCage['results'][0]['annotations']['currency']['name']);
    if ($currencyTest == false) {
        $currency = "Unknown Currency";    
    } else {
        $currency = $decodeOpenCage['results'][0]['annotations']['currency']['name'];
    };

    
    $currencyIsoTest = isset($decodeOpenCage['results'][0]['annotations']['currency']['iso_code']);
    if ($currencyIsoTest == false) {
        $currencyIso = "GBP";    
    } else {
        $currencyIso = $decodeOpenCage['results'][0]['annotations']['currency']['iso_code'];
    };

    $driveOnTest = isset($decodeOpenCage['results'][0]['annotations']['roadinfo']['drive_on']);
    if ($driveOnTest == false) {
        $driveOn = "Unknown What Side";
    } else {
        $driveOn = $decodeOpenCage['results'][0]['annotations']['roadinfo']['drive_on'];
    };

    $speedInTest = isset($decodeOpenCage['results'][0]['annotations']['roadinfo']['speed_in']);
    if ($speedInTest == false) {
        $speedIn = "Unknown What Speed";
    } else {
        $speedIn = $decodeOpenCage['results'][0]['annotations']['roadinfo']['speed_in'];
    };

    $timeTest = isset($decodeOpenCage['results'][0]['annotations']['timezone']['offset_string']);
    if ($timeTest == false) {
        $time = "Unknown Time Zone";
    } else {
        $time = $decodeOpenCage['results'][0]['annotations']['timezone']['offset_string'];
    };

    $timeNameTest = isset($decodeOpenCage['results'][0]['annotations']['timezone']['short_name']);
    if ($timeNameTest == false) {
        $timeName = "Unknown Time Zone Name";
    } else {
        $timeName = $decodeOpenCage['results'][0]['annotations']['timezone']['short_name'];
    };
    
    $latTest = isset($decodeOpenCage['results'][0]['geometry']['lat']);
    if ($latTest == false) {
        $lat = "0";
    } else {
        $lat = $decodeOpenCage['results'][0]['geometry']['lat'];
    };

    $lngTest = isset($decodeOpenCage['results'][0]['geometry']['lng']);
    if ($lngTest == false) {
        $lng = "0";
    } else {
        $lng = $decodeOpenCage['results'][0]['geometry']['lng'];
    };



// Weather

    $urlWeather='http://api.geonames.org/findNearByWeatherJSON?lat=' . $lat . '&lng='.$lng.'&username=stuartdewing';
    

    $curl = curl_init();
	curl_setopt($curl, CURLOPT_URL,$urlWeather);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	$result=curl_exec($curl);
	curl_close($curl);
    $decodeWeather= json_decode($result,true);

   
    

    $cloudsTest = isset($decodeWeather["weatherObservation"]['clouds']);
    if ($cloudsTest == false) {
        $clouds = "Unknown Cloud Data";
    } else {
        $clouds = $decodeWeather["weatherObservation"]['clouds'];
    };

    $windTest = isset($decodeWeather["weatherObservation"]['windSpeed']);
    if ($windTest == false) {
        $wind = "Unknown Wind Data";
    } else {
        $wind = $decodeWeather["weatherObservation"]['windSpeed'];
    };


    $humidityTest = isset($decodeWeather["weatherObservation"]['humidity']);
    if ($humidityTest == false) {
        $humidity = "Unknown Humidity Data";
    } else {
        $humidity = $decodeWeather["weatherObservation"]['humidity'];
    };

    $temperatureTest = isset($decodeWeather["weatherObservation"]['temperature']);
    if ($temperatureTest == false) {
        $temperature = "Unknown Humidity Data";
    } else {
        $temperature = $decodeWeather["weatherObservation"]['temperature'];;
    };

    $weatherLatTest = isset($decodeWeather["weatherObservation"]['lat']);
    if ($weatherLatTest == false) {
        $weatherLat = "Unknown Weather Lat Data";
    } else {
        $weatherLat = $decodeWeather["weatherObservation"]['lat'];;
    };

    $weatherLngTest = isset($decodeWeather["weatherObservation"]['lng']);
    if ($weatherLngTest == false) {
        $weatherLng = "Unknown Weather Lng Data";
    } else {
        $weatherLng = $decodeWeather["weatherObservation"]['lng'];;
    };

// Excahnge Rate

$urlExchangeRate='http://api.currencylayer.com/live?access_key=4078a140a6af0714e384913388cc1ac7';
    
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL,$urlExchangeRate);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$result=curl_exec($curl);
curl_close($curl);
$decodeExchangeRate = json_decode($result,true);
$countryExchangeRate =  $decodeExchangeRate["quotes"]['USD'.$currencyIso];








    
   





    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success - borders.php";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    
    $output['data'] = $border;
    $output['countryName'] = $countryName;
    $output['capCityName'] = $capCityName;
    $output['language'] = $language;
    $output['population'] = $population;
    $output['flag'] = $flag;
    $output['currency'] = $currency;
    $output['driveOn'] = $driveOn;
    $output['speedIn'] = $speedIn;
    $output['time'] = $time;
    $output['timeName'] = $timeName;
    $output['phplat'] = $lat;
    $output['phplng'] = $lng;


    $output['clouds'] = $clouds;
    $output['wind'] = $wind;
    $output['humidity'] = $humidity;
    $output['temperature'] = $temperature;
    $output['weatherLat'] = $weatherLat;
    $output['weatherLng'] = $weatherLng;

    $output['exchangeRate'] = $countryExchangeRate;
   
    
          
    
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
?>






