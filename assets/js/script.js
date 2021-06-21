// global variables
var openWeatherKey = "b630f221bd1295ec02183f26749a279c";
var openWeatherURL = "https://api.openweathermap.org/data/2.5/";
var trailURL = "https://trailapi-trailapi.p.rapidapi.com/trails/";

// elements created from html
var searchEl = $("#search");
var previousSearch = $("#previous-search");
var weatherDisplay = $("#weather-display");
var trailsDisplay = $("#trails-display");

// tracking variables
var citySearched;
var successfulSearch = false; //equaling false because we are implying that the user is going to enter an incorrect city, and will become true ONLY IF the user typed a legitmate city. The data is pulled from 'APIurl'
var fiveDays = 5;
var offset = 0; //starting off at 0 because that is the current day.
var previousSearches = JSON.parse(localStorage.getItem("previousSearches")) || [];

// if user types an incorrect city, or a city that does not exist within the API, error will display.
function errorDisplay() {
    weatherDisplay.empty();
    weatherDisplay.append(`
        <div id="error">
        <h2>No Results Found.</h2>
        <h2>Please Enter a Valid City.</h2>
        </div>
    `);
}

// The weather is displayed on the screen in its appropriate format of the current day and city that was typed. It also leads into its forecasted display.
function weatherDisplayed(weatherData) {
    weatherDisplay.empty();
    weatherDisplay.append(`
        <div id="currentWeatherBox">
            <h2>${citySearched} (${moment(weatherData.current.dt, "X").format("MM/DD/YYYY")})</h2>
            <img src="https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png" alt="weather icon" class="icon">
            <p>Temp:<br>${weatherData.current.temp} <span>&#176;</span>F</p>
            <p>Wind:<br>${weatherData.current.wind_speed} MPH</p>
            <p>Humidity:<br>${weatherData.current.humidity} %</p>
            <p>UV Index:<br><span class="uvIndex ${(weatherData.current.uvi)}">${weatherData.current.uvi}</span></p>
        </div>
        <h3>5-Day Forecast:</h3>
        <div id="fiveDays">
            ${forecastDisplayed(weatherData)}
        </div>
    `);
}

// Here is where the next 5 days of forecasted weather will appear starting with tomorrows forecast.
function forecastDisplayed(forecastData) {
    var forecast = [];

    offset = (moment(forecastData.current.dt, "X").format("D") === moment(forecastData.daily[0].dt, "X").format("D") ? 1 : 0);

    for(var i = 0 + offset; i < fiveDays + offset; i++) {
        forecast.push(`
            <div class="forecastBox">
                <div class="iconRow">    
                    <h3>${moment(forecastData.daily[i].dt, "X").format("MM/DD/YYYY")}</h3>
                    <img src="https://openweathermap.org/img/wn/${forecastData.daily[i].weather[0].icon}@2x.png" alt="weather icon" class="icon"> 
                </div>
                <h1>${forecastData.daily[i].temp.day}<span>&#176;</span>F</h1>  
            </div>
        `)
    }
    return forecast.join("");
}

// Here we are calling the api's longitude and latitude for the wind, UV, etc.
function searchWeatherByCoordinates(lat,lon) {
    var locQueryUrl = `${openWeatherURL}onecall?${lat}&${lon}&exclude=minutely,hourly&units=imperial&appid=${openWeatherKey}`;

    fetch(locQueryUrl)
    .then(function (response) {
        if(!response.ok) {
            errorDisplay();
            throw response.json();
        }
        return response.json();
    })
    .then(function (local) {
        weatherDisplayed(local);
        successfulSearch = true;
        displayPreviousSearch();
    })
    .catch(function (error) {
        return error;
    });
}

// Similar to the function above, but this is purely for the city
function searchWeatherByCity() {
    // trailsDisplay.empty();
    var locQueryUrl = `${openWeatherURL}weather?q=${citySearched}&appid=${openWeatherKey}`;

    fetch(locQueryUrl)
    .then(function (response) {
        if(!response.ok) {
            errorDisplay();
            throw response.json();
        }
        return response.json();
    })
    .then(function (local) {
        citySearched = local.name;
        var cityLat = `lat=${local.coord.lat}`;
        var cityLon = `lon=${local.coord.lon}`;
        searchWeatherByCoordinates(cityLat, cityLon);
        searchTrailsByCoordinates(cityLon, cityLat);
    })
    .catch(function (error) {
        return error;
    });
}

// Save correctly input searches locally
function saveSearches() {
    localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
}

// This will clear the searchbox everytime the user presses enter or clicks 'search'
function clearSearchbox() {
    searchEl.empty();
    searchEl.append(`
        <input type="search" placeholder="Search for a city" class="form-control" id="searchInput">
        <button type="submit" class="waves-effect waves-light amber accent-4 btn" id="searchBtn">Search</button>
    `)
}

// Will clear the saved cities
function clearSavedHistory() {
    previousSearch.empty();
    previousSearch.append(`
        <button type="button" class="grey darken-4 btn" id="clearBtn" value="clear">Clear</button>
    `)
}

// This function displays the searches entered thus far
function displayPreviousSearch() {
    if(successfulSearch) {
        var cities = citySearched;

        for(var i = 0; i < previousSearches.length; i++) {
            if(cities === previousSearches[i]) {
                previousSearches.splice(i, 1);
            }
        }
        previousSearches.unshift(cities);
    }

    clearSavedHistory();
    clearSearchbox();

    for(var i = 0; i < previousSearches.length; i++) {
        previousSearch.append(`
            <button type="button" class="waves-effect waves-light green darken-2 btn" value="${previousSearches[i]}">${previousSearches[i]}</button>
        `);
    }

    saveSearches();
}

// Submit the searched city for API to find
function searchSubmit(event) {
    event.preventDefault();

    citySearched = $("#searchInput").val(); //pulled id from function 'clearSearchbox'

    searchWeatherByCity();
}

// Once the search buttion is clicked, display values
function buttonClick(event) {
    event.preventDefault();

    var btnValue = event.target.value;

    if(btnValue === "clear") {
        clearSavedHistory();
        weatherDisplay.empty();
        previousSearches = [];
        saveSearches();
    } else {
        citySearched = btnValue;
        searchWeatherByCity();
    }
}

// calling function
displayPreviousSearch();

// event listeners
searchEl.on("submit", searchSubmit);
previousSearch.on("click", buttonClick);