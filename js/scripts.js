var apiKey = '7496eb8b9ef9616cf145982ce0a992fe';
var apiKeyParam = '&APPID=' + apiKey;
var unitsParam =  '&units=imperial';
var searchParam = '?q=';
var weatherURL = 'http://api.openweathermap.org/data/2.5/weather';
var iconURL = 'http://openweathermap.org/img/w/';

$(document).ready(function() {
    $('#date').html(getCurrentDate());

    $('#search-form').submit(function() {
       event.preventDefault(); //don't let the form submit
      console.log(event);
      var inputCity = $('#search-val').val();
      if (inputCity.length === 0) {
        return;
      }
      search(inputCity);
      
    });
    

});

function search(inputCity) {
  var URL = weatherURL + searchParam + inputCity + unitsParam + apiKeyParam;
  //todo:  lookup jQuery ajaxComplete
    $.getJSON(URL, function(weatherData) {
        console.log(weatherData);

        var currTemp = weatherData.main.temp;
        var maxTemp = weatherData.main.temp_max;
        var minTemp = weatherData.main.temp_min;
        var humidity = weatherData.main.humidity;
        var latitude = weatherData.coord.lat;
        var longitude = weatherData.coord.lon;
        var weatherDescription = weatherData.weather[0].description;
        var weatherMain = weatherData.weather[0].main;
        var weatherIconURL = iconURL + weatherData.weather[0].icon + '.png';
        var sunrise = weatherData.sys.sunrise; //seconds
        var sunset = weatherData.sys.sunset; //seconds
        var country = weatherData.sys.country;
        // console.log(currTemp);s

        $('#weather-icon').attr('src', weatherIconURL);
        $('#weather-desc').html(weatherDescription);
       
        $('#country-city').html(country + '-' + inputCity);

        var canvas = $('#current-temp');
        var context = canvas[0].getContext('2d');

        //Set up our circle and styling
        //Set up our color based on temp (colder = bluer, hotter = redder)
        var currPerc = 0;

        var shadeColor;
        if (currTemp < 32) {
            shadeColor = '#D4F0FF';
        } else if ((currTemp >= 32) && (currTemp < 59)) {
            shadeColor = "#129793";
        } else if ((currTemp >= 59) && (currTemp < 75)) {
            shadeColor = "#7cfc00";
        } else if ((currTemp >= 75) && (currTemp < 90)) {
            shadeColor = "#FF6600";
        } else {
            shadeColor = '#E3170D';
        }

        //set up an animate function.
        //update the appropriate variables.

        function animate(current) {
            //Draw the inner circle
            context.fillStyle = "#ccc";
            context.beginPath();
            context.arc(155, 75, 65, 0, 2 * Math.PI);
            context.closePath();
            context.fill();

            //Draw the outter arc/line
            //Set the linewidth
            context.lineWidth = 10;
            //Set the line color
            context.strokeStyle = shadeColor;
            //Tell JS we are ready to draw
            context.beginPath();
            //Center of the circle at 155, 75
            //Radius of the circle is 70px
            //Start the draw at -Math.PI/2
            //Draw to the full circle * % we are at, and add 1.5PI, so that we start at 12:00
            context.arc(155, 75, 70, Math.PI * 1.5, (Math.PI * 2 * current) + Math.PI * 1.5);
            //Draw! 
            context.stroke();

            //Set the font of our temperature
            context.font = "48px Myriad Pro";
            //Set the font color of our temp to blue
            context.fillStyle = "#0000ff";
            context.textBaseLine = "bottom";
            context.fillText(currTemp, 175 - 70, (85 - 70) * 6);
            //Increase from 0 to 1% the first time
            currPerc++;
            if (currPerc < currTemp) {
                requestAnimationFrame(function() {
                    animate(currPerc / 100);
                });
            }
        }
        animate();
    });
}
function convertUTCEpochToDate(epoch) {
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(epoch);
    return d;
}

function getCurrentDate() {
    var m_names = ["Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec"
    ];

    var weekday = [
        "Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday"
    ];

    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    var curr_wkday = d.getDay();
    return weekday[curr_wkday] + ' ' + m_names[curr_month] + ' ' + curr_date + ", " + curr_year;
}
