$(document).ready(function() 
{
	// TODO: Live Updates

	populateDay();
	populateTime();
	populateMonths();

	navigator.geolocation.getCurrentPosition(populateWeather);
});

function populateDay()
{
	var date = new Date();

	var weekdays = new Array(7);

	weekdays[0] = "Sunday";
	weekdays[1] = "Monday";
	weekdays[2] = "Tuesday";
	weekdays[3] = "Wednesday";
	weekdays[4] = "Thursday";
	weekdays[5] = "Friday";
	weekdays[6] = "Saturday";

	var weekday = weekdays[date.getDay()];

	$("#day").text(weekday);
}

function populateTime()
{
	var date = new Date();

	var timeComponents = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}).split(" ");

	if (timeComponents.length > 0)
	{
		$("#clock > #time").text(timeComponents[0]);
	}

	if (timeComponents.length > 1)
	{
		$("#clock > #period").text(timeComponents[1]);
	}
}

function populateMonths()
{
	var date = new Date();

	var monthIndex = date.getMonth()

	var monthDiv = $("#months-container").children().eq(monthIndex);

	monthDiv.addClass("highlighted")

	monthDiv.find(".number").text(date.getDate())
}

function populateWeather(position)
{
	var forecastKey = parameterWithName("forecast_key")

	if (forecastKey)
	{
		$.ajax({
			url: "https://api.darksky.net/forecast/" + forecastKey + "/" + position.coords.latitude + "," + position.coords.longitude,
			dataType: "jsonp",
			success: function (data) {

				// TODO: Populate Temperature

				var descriptionKey = data["currently"]["icon"]

				if (descriptionKey)
				{
					populateWeatherWithDescriptionKey(descriptionKey)
				}
			}
		})
	}
}

// Helpers

function populateWeatherWithDescriptionKey(descriptionKey)
{
	alert(descriptionKey)

	var iconMap = {

		"clear-day": "assets/sunny.svg", 
		"clear-night": "assets/moony.svg",  
		"rain": "assets/rainy.svg", 
		"snow": "assets/snowy.svg", 
		"sleet": "assets/rainy.svg", 
		"wind": "assets/windy.svg", 
		"fog": "assets/cloudy.svg", 
		"cloudy": "assets/cloudy.svg", 
		"partly-cloudy-day": "assets/partly_cloudy.svg", 
		"partly-cloudy-night": "assets/moony.svg"
	}

	var src = iconMap[descriptionKey]

	if (src)
	{
		$("#weather").attr("src", src) 
	}
}

function parameterWithName(name) 
{
    var url = window.location.href;

    name = name.replace(/[\[\]]/g, "\\$&");

    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);

    if (!results)
    {
    	return null;
    }

    if (!results[2])
    {
  		return '';
    }

    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
