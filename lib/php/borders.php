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

// PHP Country Name - No Spaces
    if ($decodeCountryData['name'] == "United States of America"){
        $phpCountryName = "america";
    } elseif ($decodeCountryData['name'] == "United Kingdom of Great Britain and Northern Ireland"){
        $phpCountryName = "england";
    } else {
    $phpCountryNameO = $decodeCountryData['name'];
    $phpCountryName = str_replace(' ', '', $phpCountryNameO);
    };
    $output['php'] = $phpCountryName;




   


    
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
        $language = "Unknown";    
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
    $driveOnTest = isset($decodeOpenCage['results'][0]['annotations']['roadinfo']['drive_on']);
    if ($driveOnTest == false) {
        $driveOn = "Unknown What Side";
    } else {
        $driveOn = $decodeOpenCage['results'][0]['annotations']['roadinfo']['drive_on'];
    };
    $output['driveOn'] = $driveOn;
// Country Speed Measure
    $speedInTest = isset($decodeOpenCage['results'][0]['annotations']['roadinfo']['speed_in']);
    if ($speedInTest == false) {
        $speedIn = "Unknown What Speed";
    } else {
        $speedIn = $decodeOpenCage['results'][0]['annotations']['roadinfo']['speed_in'];
    };
    $output['speed'] = $speedIn;
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

// // Excahnge Rate

// $urlExchangeRate='http://api.currencylayer.com/live?access_key=4078a140a6af0714e384913388cc1ac7';
    
// $curl = curl_init();
// curl_setopt($curl, CURLOPT_URL,$urlExchangeRate);
// curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
// $result=curl_exec($curl);
// curl_close($curl);
// $decodeExchangeRate = json_decode($result,true);

//      News API
//     $urlNews='http://newsapi.org/v2/everything?q=' .$phpCountryName. '&from=' . date("Y/m/d") . '&sortBy=publishedAt&apiKey=8babb18fb77a418eaa6dab33205ba7b4';
        
//     $curl = curl_init();
//     curl_setopt($curl, CURLOPT_URL,$urlNews);
//     curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
//     $result=curl_exec($curl);
//     curl_close($curl);
//     $decodeNews = json_decode($result,true);
//     $output['newsSource'] = $decodeNews;

// // News Title
//     $newsTitleTest = isset($decodeNews["articles"][0]['title']);
//     if ($newsTitleTest == false) {
//         $newsTitle = "No Current News";
//         $newsTitle2 = "No Current News";
//         $newsTitle3 = "No Current News";
//     } else {
//         $newsTitle= $decodeNews['articles'][0]["title"];
//         $newsTitle2= $decodeNews['articles'][2]["title"];
//         $newsTitle3= $decodeNews['articles'][4]["title"];
//     };
//     $output['newsTitle'] = $newsTitle;
//     $output['newsTitle2'] = $newsTitle2;
//     $output['newsTitle3'] = $newsTitle3;

// // News Description
//     $newsDescriptionTest = isset($decodeNews['articles'][0]["description"]);
//     if ($newsDescriptionTest == false) {
//         $newsDescription = "No Current News";
//         $newsDescription2 = "No Current News";
//         $newsDescription3 = "No Current News";
//     } else {
//         $newsDescription = $decodeNews['articles'][0]["description"];
//         $newsDescription2 = $decodeNews['articles'][2]["description"];
//         $newsDescription3 = $decodeNews['articles'][4]["description"];
//     };
//     $output['newsDescription'] = $newsDescription;
//     $output['newsDescription2'] = $newsDescription2;
//     $output['newsDescription3'] = $newsDescription3;

// // News Url
//     $newsUrlTest = isset($decodeNews['articles'][0]["url"]);
//     if ($newsUrlTest == false) {
//         $newsUrl = "Unknown News URL Data";
//         $newsUrl2 = "Unknown News URL Data";
//         $newsUrl3 = "Unknown News URL Data";
//     } else {
//         $newsUrl = $decodeNews['articles'][0]["url"];
//         $newsUrl2 = $decodeNews['articles'][2]["url"];
//         $newsUrl3 = $decodeNews['articles'][4]["url"];
//     };
//     $output['newsUrl'] = $newsUrl;
//     $output['newsUrl2'] = $newsUrl2;
//     $output['newsUrl3'] = $newsUrl3;

//     // News Url
//     $newsImgTest = isset($decodeNews['articles'][0]["urlToImage"]);
//     if ($newsImgTest == false) {
//         $newsImg = "Unknown News URL Data";
//         $newsImg2 = "Unknown News URL Data";
//         $newsImg3 = "Unknown News URL Data";
//     } else {
//         $newsImg = $decodeNews['articles'][0]["urlToImage"];
//         $newsImg2 = $decodeNews['articles'][2]["urlToImage"];
//         $newsImg3 = $decodeNews['articles'][4]["urlToImage"];
//     };
//     $output['newsImg'] = $newsImg;
//     $output['newsImg2'] = $newsImg2;
//     $output['newsImg3'] = $newsImg3;
    
   //      Wiki API
   $urlWiki='http://api.geonames.org/wikipediaSearchJSON?q=' . $phpCountryName . '&maxRows=10&username=stuartdewing';
        
   $curl = curl_init();
   curl_setopt($curl, CURLOPT_URL,$urlWiki);
   curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
   $result=curl_exec($curl);
   curl_close($curl);
   $decodeWiki = json_decode($result,true);
   
// Wiki Title
    $wikiTitleTest = isset($decodeWiki["geonames"][0]['title']);
    if ($wikiTitleTest == false) {
        $wikiTitle1 = "No Wiki Title 1";
        $wikiTitle2 = "No Wiki Title 2";
        $wikiTitle3 = "No Wiki Title 3";
    } else {
        $wikiTitle1 = $decodeWiki["geonames"][0]["title"];
        $wikiTitle2 = $decodeWiki["geonames"][1]["title"];
        $wikiTitle3 = $decodeWiki["geonames"][2]["title"];
    };
    $output['wikiTitle1'] = $wikiTitle1;
    $output['wikiTitle2'] = $wikiTitle2;
    $output['wikiTitle3'] = $wikiTitle3;

// Wiki Lat
    $wikilatTest = isset($decodeWiki["geonames"][0]['lat']);
    if ($wikilatTest == false) {
        $wikiLat1 = "No Wiki lat 1";
        $wikiLat2 = "No Wiki lat 2";
        $wikiLat3 = "No Wiki lat 3";
    } else {
        $wikiLat1 = $decodeWiki["geonames"][0]['lat'];
        $wikiLat2 = $decodeWiki["geonames"][1]['lat'];
        $wikiLat3 = $decodeWiki["geonames"][2]['lat'];
    };
    $output['wikiLat1'] = $wikiLat1;
    $output['wikiLat2'] = $wikiLat2;
    $output['wikiLat3'] = $wikiLat3;

// Wiki Lng
    $wikilngTest = isset($decodeWiki["geonames"][0]['lng']);
    if ($wikilngTest == false) {
        $wikiLng1 = "No Wiki lng 1";
        $wikiLng2 = "No Wiki lng 2";
        $wikiLng3 = "No Wiki lng 3";
    } else {
        $wikiLng1 = $decodeWiki["geonames"][0]['lng'];
        $wikiLng2 = $decodeWiki["geonames"][1]['lng'];
        $wikiLng3 = $decodeWiki["geonames"][2]['lng'];
    };
    $output['wikiLng1'] = $wikiLng1;
    $output['wikiLng2'] = $wikiLng2;
    $output['wikiLng3'] = $wikiLng3;

// Wiki Summary
    $wikisummaryTest = isset($decodeWiki["geonames"][0]['summary']);
    if ($wikisummaryTest == false) {
        $wikisummary1 = "No Wiki summary 1";
        $wikisummary2 = "No Wiki summary 2";
        $wikisummary3 = "No Wiki summary 3";
    } else {
        $wikisummary1 = $decodeWiki["geonames"][0]['summary'];
        $wikisummary2 = $decodeWiki["geonames"][1]['summary'];
        $wikisummary3 = $decodeWiki["geonames"][2]['summary'];  
    };
    $output['wikisummary1'] = $wikisummary1;
    $output['wikisummary2'] = $wikisummary2;
    $output['wikisummary3'] = $wikisummary3;

//Wiki Image
    $wikithumbnailImgTest = isset($decodeWiki["geonames"][0]['thumbnailImg']);
    if ($wikithumbnailImgTest == false) {
        $wikithumbnailImg1 = 'lib/img/marker.png';
    } else {
        $wikithumbnailImg1 = $decodeWiki["geonames"][0]['thumbnailImg'];
    };
    $output['wikithumbnailImg1'] = $wikithumbnailImg1;
   
    $wikithumbnailImgTest = isset($decodeWiki["geonames"][1]['thumbnailImg']);
    if ($wikithumbnailImgTest == false) {
        $wikithumbnailImg2 = 'lib/img/marker.png';
    } else {
        $wikithumbnailImg2 = $decodeWiki["geonames"][1]['thumbnailImg'];
    };
    $output['wikithumbnailImg2'] = $wikithumbnailImg2;
   
    $wikithumbnailImgTest = isset($decodeWiki["geonames"][2]['thumbnailImg']);
    if ($wikithumbnailImgTest == false) {
        $wikithumbnailImg3 = 'lib/img/marker.png';
    } else {
        $wikithumbnailImg3 = $decodeWiki["geonames"][2]['thumbnailImg'];
    };
    $output['wikithumbnailImg3'] = $wikithumbnailImg3;
   
   //      Open Weather API
   $urlWeather='https://api.openweathermap.org/data/2.5/onecall?lat=' . $lat . '&lon=' . $lng .   '&exclude=minutely,hourly&appid=39fe0901e03040b7e9161436a50ac711&units=metric';
              
        
   $curl = curl_init();
   curl_setopt($curl, CURLOPT_URL,$urlWeather);
   curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
   $result=curl_exec($curl);
   curl_close($curl);
   $decodeWeather = json_decode($result,true);
   $output['weather'] = $decodeWeather;

// Weather Icon
   $weatherIconTest = isset($decodeWeather["current"]['weather'][0]['icon']);
   if ($weatherIconTest == false) {
       $weatherIconToday = "error";
       $weatherIconTomorrow = "error";
       $weatherIconNext = "error";
   } else {
       $weatherIconToday = $decodeWeather["current"]['weather'][0]['icon'];
       $weatherIconTomorrow = $decodeWeather["daily"][1]['weather'][0]['icon'];
       $weatherIconNext = $decodeWeather["daily"][2]['weather'][0]['icon'];
   };
   $output['weather']['icon']['today'] = $weatherIconToday;
   $output['weather']['icon']['tomorrow'] = $weatherIconTomorrow;
   $output['weather']['icon']['next'] = $weatherIconNext;

// Weather Description
    $weatherDescriptionTest = isset($decodeWeather["current"]['weather'][0]['description']);
    if ($weatherDescriptionTest == false) {
        $weatherDescriptionToday = "   ";
        $weatherDescriptionTomorrow = "   ";
        $weatherDescriptionNext = "   ";
    } else {
        $weatherDescriptionToday = $decodeWeather["current"]['weather'][0]['description'];
        $weatherDescriptionTomorrow = $decodeWeather["daily"][1]['weather'][0]['description'];
        $weatherDescriptionNext = $decodeWeather["daily"][2]['weather'][0]['description'];
    };
    $output['weather']['description']['today'] = $weatherDescriptionToday;
    $output['weather']['description']['tomorrow'] = $weatherDescriptionTomorrow;
    $output['weather']['description']['next'] = $weatherDescriptionNext;

// Weather Temp
    $weathertempTest = isset($decodeWeather["current"]['temp']);
    if ($weathertempTest == false) {
        $weathertempToday = "   ";
        $weathertempTomorrow = "   ";
        $weathertempNext = "   ";
    } else {
        $weathertempToday = floor($decodeWeather["current"]['temp']);
        $weathertempTomorrow = floor($decodeWeather["daily"][1]['temp']['day']);
        $weathertempNext = floor($decodeWeather["daily"][2]['temp']['day']);
    };
    $output['weather']['temp']['today'] = $weathertempToday;
    $output['weather']['temp']['tomorrow'] = $weathertempTomorrow;
    $output['weather']['temp']['next'] = $weathertempNext;

// Weather Feels Like
    $weatherfeelsTest = isset($decodeWeather["current"]['feels_like']);
    if ($weatherfeelsTest == false) {
        $weatherfeelsToday = "   ";
        $weatherfeelsTomorrow = "   ";
        $weatherfeelsNext = "   ";
    } else {
        $weatherfeelsToday = floor($decodeWeather["current"]['feels_like']);
        $weatherfeelsTomorrow = floor($decodeWeather["daily"][1]['feels_like']['day']);
        $weatherfeelsNext = floor($decodeWeather["daily"][2]['feels_like']['day']);
    };
    $output['weather']['feels']['today'] = $weatherfeelsToday;
    $output['weather']['feels']['tomorrow'] = $weatherfeelsTomorrow;
    $output['weather']['feels']['next'] = $weatherfeelsNext;

// Weather Sun Rise
    $weatherriseTest = isset($decodeWeather["current"]['sunrise']);
    if ($weatherriseTest == false) {
        $weatherriseToday = "   ";
        $weatherriseTomorrow = "   ";
        $weatherriseNext = "   ";
    } else {
        $weatherriseToday = $decodeWeather["current"]['sunrise'];
        $weatherriseTomorrow = $decodeWeather["daily"][1]['sunrise'];
        $weatherriseNext = $decodeWeather["daily"][2]['sunrise'];
    };
    $output['weather']['rise']['today'] = $weatherriseToday;
    $output['weather']['rise']['tomorrow'] = $weatherriseTomorrow;
    $output['weather']['rise']['next'] = $weatherriseNext;

// Weather Sun Set
    $weathersetTest = isset($decodeWeather["current"]['sunset']);
    if ($weathersetTest == false) {
        $weathersetToday = "   ";
        $weathersetTomorrow = "   ";
        $weathersetNext = "   ";
    } else {
        $weathersetToday = $decodeWeather["current"]['sunset'];
        $weathersetTomorrow = $decodeWeather["daily"][1]['sunset'];
        $weathersetNext = $decodeWeather["daily"][2]['sunset'];
    };
    $output['weather']['set']['today'] = $weathersetToday;
    $output['weather']['set']['tomorrow'] = $weathersetTomorrow;
    $output['weather']['set']['next'] = $weathersetNext;



    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success - borders.php";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
?>