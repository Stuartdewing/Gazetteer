<?php
    $iso3 = $_REQUEST['iso_a3'];
    // ini_set('display_errors', 'On');
    // error_reporting(E_ALL);
    $executionStartTime = microtime(true);

//      Country Borders JSON 
    $countryBorders = json_decode(file_get_contents("countryBorders.geo.json"), true);
    $border = null;
// Borders
    foreach ($countryBorders['features'] as $feature) {
        if ($feature["properties"]["iso_a3"] ==  $_REQUEST['iso_a3']) {
            $border = $feature;
        break;
        }
    }

    $output['data'] = $border;
  
//      Rest Countries 
    $urlCapCity='https://restcountries.eu/rest/v2/alpha/'.$iso3;

    $curl = curl_init();
	curl_setopt($curl, CURLOPT_URL,$urlCapCity);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	$result=curl_exec($curl);
	curl_close($curl);
    $decodeCountryData = json_decode($result,true);
// Country Name
    $countryNameTest = isset($decodeCountryData['name']);
    if ($countryNameTest == false) {
        $countryName = "Unknown Country Name Data";    
    } else {
        $countryName = $decodeCountryData['name'];
    };
    $output['countryName'] = $countryName;
// Capital City Name
    $capCityNameTest = isset($decodeCountryData['capital']);
    if ($capCityNameTest == false) {
        $capCityName = "London";    
    } else {
        $capCityNameO = $decodeCountryData['capital'];
        $capCityName = str_replace(' ', '', $capCityNameO);
    };
    $output['capCityName'] = $capCityName;
// Population
    $populationTest = isset($decodeCountryData['population']);
    if ($populationTest == false) {
        $population = "London";    
    } else {
        $population = $decodeCountryData['population'];
    };
    $output['population'] = $population;
// Languages
    $languageTest = isset($decodeCountryData['languages'][0]['name']);
    if ($languageTest == false) {
        $language = "London";    
    } else {
        $language = $decodeCountryData['languages'][0]['name'];
    };
    $output['language'] = $language;
// Flag
    $flagTest = isset($decodeCountryData['flag']);
    if ($flagTest == false) {
        $flag = "No Flag Data";    
    } else {
        $flag = $decodeCountryData['flag'];
    };
    $output['flag'] = $flag;

//      Opencage
    $urlOpenCage='https://api.opencagedata.com/geocode/v1/json?q='. $capCityName. '&key=b018e21e70aa43d1828f1331f00d1fab&language=en&pretty=1';

    $curl = curl_init();
	curl_setopt($curl, CURLOPT_URL,$urlOpenCage);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	$result=curl_exec($curl);
	curl_close($curl);
    $decodeOpenCage= json_decode($result,true);
// Currency
    $currencyTest = isset($decodeOpenCage['results'][0]['annotations']['currency']['name']);
    if ($currencyTest == false) {
        $currency = "Unknown Currency";    
    } else {
        $currency = $decodeOpenCage['results'][0]['annotations']['currency']['name'];
    };
    $output['currency'] = $currency;
// Currency ISO
    $currencyIsoTest = isset($decodeOpenCage['results'][0]['annotations']['currency']['iso_code']);
    if ($currencyIsoTest == false) {
        $currencyIso = "GBP";    
    } else {
        $currencyIso = $decodeOpenCage['results'][0]['annotations']['currency']['iso_code'];
    };
// Drive on side of Road
    // $driveOnTest = isset($decodeOpenCage['results'][0]['annotations']['roadinfo']['drive_on']);
    // if ($driveOnTest == false) {
    //     $driveOn = "Unknown What Side";
    // } else {
    //     $driveOn = $decodeOpenCage['results'][0]['annotations']['roadinfo']['drive_on'];
    // };
// Country Speed Measure
    // $speedInTest = isset($decodeOpenCage['results'][0]['annotations']['roadinfo']['speed_in']);
    // if ($speedInTest == false) {
    //     $speedIn = "Unknown What Speed";
    // } else {
    //     $speedIn = $decodeOpenCage['results'][0]['annotations']['roadinfo']['speed_in'];
    // };
// Time Zone
    $timeTest = isset($decodeOpenCage['results'][0]['annotations']['timezone']['offset_string']);
    if ($timeTest == false) {
        $time = "Unknown Time Zone";
    } else {
        $time = $decodeOpenCage['results'][0]['annotations']['timezone']['offset_string'];
    };
    $output['time'] = $time;
// Time Zone Name
    $timeNameTest = isset($decodeOpenCage['results'][0]['annotations']['timezone']['short_name']);
    if ($timeNameTest == false) {
        $timeName = "Unknown Time Zone Name";
    } else {
        $timeName = $decodeOpenCage['results'][0]['annotations']['timezone']['short_name'];
    };
    $output['timeName'] = $timeName;
// Capital City Latitude
    $latTest = isset($decodeOpenCage['results'][0]['geometry']['lat']);
    if ($latTest == false) {
        $lat = "0";
    } else {
        $lat = $decodeOpenCage['results'][0]['geometry']['lat'];
    };
    $output['phplat'] = $lat;
// Capital City Longitude
    $lngTest = isset($decodeOpenCage['results'][0]['geometry']['lng']);
    if ($lngTest == false) {
        $lng = "0";
    } else {
        $lng = $decodeOpenCage['results'][0]['geometry']['lng'];
    };
    $output['phplng'] = $lng;

// Geonames

    // $urlWeather='http://api.geonames.org/findNearByWeatherJSON?lat=' . $lat . '&lng='.$lng.'&username=stuartdewing';
    
    // $curl = curl_init();
	// curl_setopt($curl, CURLOPT_URL,$urlWeather);
	// curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	// $result=curl_exec($curl);
	// curl_close($curl);
    // $decodeWeather= json_decode($result,true);

    // $cloudsTest = isset($decodeWeather["weatherObservation"]['clouds']);
    // if ($cloudsTest == false) {
    //     $clouds = "Unknown Cloud Data";
    // } else {
    //     $clouds = $decodeWeather["weatherObservation"]['clouds'];
    // };

    // $windTest = isset($decodeWeather["weatherObservation"]['windSpeed']);
    // if ($windTest == false) {
    //     $wind = "Unknown Wind Data";
    // } else {
    //     $wind = $decodeWeather["weatherObservation"]['windSpeed'];
    // };


    // $humidityTest = isset($decodeWeather["weatherObservation"]['humidity']);
    // if ($humidityTest == false) {
    //     $humidity = "Unknown Humidity Data";
    // } else {
    //     $humidity = $decodeWeather["weatherObservation"]['humidity'];
    // };

    // $temperatureTest = isset($decodeWeather["weatherObservation"]['temperature']);
    // if ($temperatureTest == false) {
    //     $temperature = "Unknown Humidity Data";
    // } else {
    //     $temperature = $decodeWeather["weatherObservation"]['temperature'];;
    // };

    // $weatherLatTest = isset($decodeWeather["weatherObservation"]['lat']);
    // if ($weatherLatTest == false) {
    //     $weatherLat = "Unknown Weather Lat Data";
    // } else {
    //     $weatherLat = $decodeWeather["weatherObservation"]['lat'];;
    // };

    // $weatherLngTest = isset($decodeWeather["weatherObservation"]['lng']);
    // if ($weatherLngTest == false) {
    //     $weatherLng = "Unknown Weather Lng Data";
    // } else {
    //     $weatherLng = $decodeWeather["weatherObservation"]['lng'];;
    // };

// // Excahnge Rate

// $urlExchangeRate='http://api.currencylayer.com/live?access_key=4078a140a6af0714e384913388cc1ac7';
    
// $curl = curl_init();
// curl_setopt($curl, CURLOPT_URL,$urlExchangeRate);
// curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
// $result=curl_exec($curl);
// curl_close($curl);
// $decodeExchangeRate = json_decode($result,true);

//      News API
    $urlNews='http://newsapi.org/v2/everything?q=' .$capCityName. '&from=' . date("Y/m/d") . '&sortBy=publishedAt&apiKey=8babb18fb77a418eaa6dab33205ba7b4';
        
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL,$urlNews);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $result=curl_exec($curl);
    curl_close($curl);
    $decodeNews = json_decode($result,true);
    $output['newsSource'] = $decodeNews;

// News Title
    $newsTitleTest = isset($decodeNews["articles"][0]['title']);
    if ($newsTitleTest == false) {
        $newsTitle = "No Current News";
        $newsTitle2 = "No Current News";
        $newsTitle3 = "No Current News";
    } else {
        $newsTitle= $decodeNews['articles'][0]["title"];
        $newsTitle2= $decodeNews['articles'][2]["title"];
        $newsTitle3= $decodeNews['articles'][4]["title"];
    };
    $output['newsTitle'] = $newsTitle;
    $output['newsTitle2'] = $newsTitle2;
    $output['newsTitle3'] = $newsTitle3;

// News Description
    $newsDescriptionTest = isset($decodeNews['articles'][0]["description"]);
    if ($newsDescriptionTest == false) {
        $newsDescription = "No Current News";
        $newsDescription2 = "No Current News";
        $newsDescription3 = "No Current News";
    } else {
        $newsDescription = $decodeNews['articles'][0]["description"];
        $newsDescription2 = $decodeNews['articles'][2]["description"];
        $newsDescription3 = $decodeNews['articles'][4]["description"];
    };
    $output['newsDescription'] = $newsDescription;
    $output['newsDescription2'] = $newsDescription2;
    $output['newsDescription3'] = $newsDescription3;

// News Url
    $newsUrlTest = isset($decodeNews['articles'][0]["url"]);
    if ($newsUrlTest == false) {
        $newsUrl = "Unknown News URL Data";
        $newsUrl2 = "Unknown News URL Data";
        $newsUrl3 = "Unknown News URL Data";
    } else {
        $newsUrl = $decodeNews['articles'][0]["url"];
        $newsUrl2 = $decodeNews['articles'][2]["url"];
        $newsUrl3 = $decodeNews['articles'][4]["url"];
    };
    $output['newsUrl'] = $newsUrl;
    $output['newsUrl2'] = $newsUrl2;
    $output['newsUrl3'] = $newsUrl3;

    // News Url
    $newsImgTest = isset($decodeNews['articles'][0]["urlToImage"]);
    if ($newsImgTest == false) {
        $newsImg = "Unknown News URL Data";
        $newsImg2 = "Unknown News URL Data";
        $newsImg3 = "Unknown News URL Data";
    } else {
        $newsImg = $decodeNews['articles'][0]["urlToImage"];
        $newsImg2 = $decodeNews['articles'][2]["urlToImage"];
        $newsImg3 = $decodeNews['articles'][3]["urlToImage"];
    };
    $output['newsImg'] = $newsImg;
    $output['newsImg2'] = $newsImg2;
    $output['newsImg3'] = $newsImg3;

    
   





    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success - borders.php";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
?>






