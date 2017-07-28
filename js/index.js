$(document).ready(function() {
    $("#gettingdata").append("Getting data...");
 //first get geolocation data as shown in lesson
    if (navigator.geolocation) {navigator.geolocation.getCurrentPosition(function(position) {
        //call get weather from within callback and send lat/long
        getWeather(position.coords.latitude,position.coords.longitude);
        //use this to manually test different locations: getWeather(25.382036, 32.532277);
        });
       }
    else{$("#gettingdata").append("Unable to retrieve Location Data.");}
    });
//function gets weather and city info
function getWeather(lat,longi){
  //a link to city locator api, unfortunately json from darksky does not include city information so had to use
  //google reverse geocode
  var cityApiConnection="https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+longi+"&sensor=true";
  //connection to darksky weather api
  //must append "?callback=?" to avoid cross-origin error, 
  var weatherApiConnection="https://api.darksky.net/forecast/4fa387d4e92d02a607b10c7550524084/"+lat+","+longi+"?callback=?";
  //call function within fucntion since they are call backs can not do separately
    $.getJSON(cityApiConnection, function(cityInfo){
            //use a very small portion of the massive google json rresponse to try and locate city
            var locationDescription = cityInfo.results[0].formatted_address; 
            $.getJSON(weatherApiConnection, function(weatherData){
            //call function to render gathered data on the html page
            processWeather(weatherData,locationDescription);
          });
    });
}

//process and render weather data
function processWeather(weatherData,locationDescription){
  $("#gettingdata").empty();
  //formatted location description from google reverse geocode api can be very long/ too much info
  //tried to trim it here for city/state 
  var loc=(locationDescription).split(',');
  if (loc.length >= 4){
    var cityId= loc.slice(loc.length-3);
  }
  else{var cityId= loc;}
  $("#location").append(cityId.join(',')+"<br>");
  
  //temp data , default @ fahrenheit then round off to 1 decimal place
  var fahrenheit = Math.round(weatherData.currently.temperature*10)/10;
  
  $("#temp").append(fahrenheit+" ℉");
  $("#temp").attr('data-toggle',"tooltip");
  $("#temp").attr('role',"button");
  $("#temp").attr('title',"click here to convert to ℃");
  //weather status (from api)
  $("#status").append(weatherData.currently.summary+"<br>");
  
  $("#info").append("Coded by <a href=\"https://www.freecodecamp.com/dereje1\" target=\"_blank\">DGetahun</a>, Powered by: <a href=\"https://darksky.net/dev/\" target=\"_blank\">Dark Sky API</a>,<a href=\"https://darkskyapp.github.io/skycons/\" target=\"_blank\">Skycons</a>");
  // everything below is for the icon animation with imported js script:https://github.com/darkskyapp
  var skycons = new Skycons({"color": "#42d7f4"});
  //.currently.icon is a method from the json describing the icon state
  skycons.set("icon1",weatherData.currently.icon);
  skycons.play();
}

// converts F<-->C on click below
  $("#temp" ).click(function() {
       //read currently recorded content of temp
       var currentContent = $("#temp" ).html()
       var currentTemp;
       //check current temps unit and if Fahrenheit, convert to celsius, empty div and display
       if (currentContent.indexOf("℉")!==-1){
         currentTemp = currentContent.split("℉")[0].trim();
         var celsius = (currentTemp-32)*(5/9);
         celsius = Math.round(celsius*10)/10; 
         $("#temp").empty();
         $("#temp").append(celsius+" ℃")
         $("#temp").attr('role',"button");
         $("#temp").attr('title',"click here to convert to ℉");
       }
       //if celsius, convert to Fahrenheit, empty div and display
       else{
         currentTemp = currentContent.split("℃")[0].trim();
         var fahrenheit = (currentTemp*(9/5))+32;
         fahrenheit = Math.round(fahrenheit*10)/10; 
         $("#temp").empty();
         $("#temp").append(fahrenheit+" ℉")
         $("#temp").attr('role',"button");
         $("#temp").attr('title',"click here to convert to ℃");
       }
        });