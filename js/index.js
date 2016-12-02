$(document).ready(function() 
{
	// Update the time every second

	updateTime()

	setInterval(function() 
	{
		updateTime()

	}, 1000)

	// Update the weather every 10 minutes

	navigator.geolocation.getCurrentPosition(function(position) 
	{
		updateWeatherWithPosition(position);

		setInterval(function() 
		{
			updateWeatherWithPosition(position);

		}, 100000)
	});
});

function updateTime()
{
	updateDay();
	updateClock();
	updateCalendar();
}

function updateDay()
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

function updateClock()
{
	var date = new Date();

	var timeComponents = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}).split(" ");

	if (timeComponents.length > 0)
	{
		$("#clock-time").text(timeComponents[0]);
	}

	if (timeComponents.length > 1)
	{
		$("#clock-period").text(timeComponents[1]);
	}
}

function updateCalendar()
{
	resetCalendar()

	var date = new Date();

	var monthIndex = date.getMonth()

	var monthDiv = $("#months-container").children().eq(monthIndex);

	monthDiv.addClass("month-highlighted")

	monthDiv.find(".month-number").text(date.getDate())
}

function updateWeatherWithPosition(position)
{
	var latitude = position.coords.latitude

	var darkSkyKey = parameterWithName("dark_sky_key")

	if (darkSkyKey)
	{
		$.ajax({
			url: "https://api.darksky.net/forecast/" + darkSkyKey + "/" + position.coords.latitude + "," + position.coords.longitude,
			dataType: "jsonp",
			success: function (data) 
			{
				// Update the temperature

				var temperature = data["currently"]["apparentTemperature"]

				if (temperature)
				{
					var roundedTemperature = Math.round(temperature)

					$("#temperature").text(roundedTemperature + "°")
				}

				// Update the icon

				var descriptionKey = data["currently"]["icon"]

				if (descriptionKey)
				{
					populateWeatherIconWithDescriptionKey(descriptionKey)
				}
			}
		})
	}
}

// Helpers

function resetCalendar()
{
	$(".month-highlighted").removeClass("month-highlighted")

	$(".month-number").empty()
}

function populateWeatherIconWithDescriptionKey(descriptionKey)
{
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
		$("#weather-icon").attr("src", src) 
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
