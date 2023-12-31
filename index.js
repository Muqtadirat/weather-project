//Get the current date and time
const now = new Date();

//Get the weekday
function getWeekDay() {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][now.getDay()];

  return weekday;
}

//Get the time
function getTime() {
  const hour = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0"); //Ensures minutes starts with a leading zero i.e 12:01 not 12:1

  return `${hour}:${minutes}`;
}

//Insert the current weekday into the HTML class
function currDay() {
  const day = document.querySelector(".day");
  day.innerHTML = getWeekDay();
}

//Insert the current time into the HTML class
function currTime() {
  const time = document.querySelector(".time");
  time.innerHTML = getTime();
}

//Call the functions
currDay();
currTime();

function formatDate(timeStamp) {
  const date = new Date(timeStamp * 1000); //Converts unix timestamp (milliseconds) to seconds
  const day = date.getDay();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  return days[day]; //Returns the day of the week as a three-letter abbreviation based on the day value
}

//Runs weather forecast code block
function displayForecast(response) {
  let forecast = response.data.daily;
  console.log(forecast);

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = ` <div class="row row-cols-6 weekdays">`; //Opens the code block via concantenation

  forecast.forEach(function (forecastDay, index) {
    //Takes an HTML code block and runs in js
    if (
      index < 6 //Specifies the number of forecasts
    ) {
      forecastHTML =
        forecastHTML +
        `  <div class="col">
            <p class = "forecast-day">${formatDate(forecastDay.time)}</p>
            <br /><img src="${
              forecastDay.condition.icon_url
            }" alt="" id="icon" /><br />
            <p><span class="max-temp">${Math.round(
              forecastDay.temperature.maximum
            )}°</span> <span class = "temp-border">| </span> <span class="min-temp">${Math.round(
          forecastDay.temperature.minimum
        )}°</span></p>
          </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`; //Closes the code block via concantenation
  forecastElement.innerHTML = forecastHTML;
}

//Retrieves forecast coordinates
function getForecast(coordinates) {
  const apiKey = "ae5350b6a304ff06o3a36487d5be8a4t";
  const apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

// Takes user city from search and displays in HTML class
function findCity(event) {
  event.preventDefault(); // Prevents form submission

  const cityInput = document.querySelector("#city-input");
  const cityResult = document.querySelector(".city");

  // Set the result element's text content to the entered city name
  const cityName =
    cityInput.value.charAt(0).toUpperCase() + cityInput.value.slice(1);
  cityResult.textContent = cityName;

  // Gets city temperature via API
  const apiKey = "ae5350b6a304ff06o3a36487d5be8a4t";
  const weatherApi = `https://api.shecodes.io/weather/v1/current?query=${cityInput.value}&key=${apiKey}&units=metric`;

  axios.get(weatherApi).then(displayWeatherCondition);
}

// Displays weather conditions in the HTML elements
function displayWeatherCondition(response) {
  const cityName = document.querySelector(".city");
  const country = document.querySelector(".country");
  const temperatureValue = document.querySelector("#temperature-value");
  const atmosphere = document.querySelector("#atmosphere");
  const humidity = document.querySelector(".humidity-value");
  const wind = document.querySelector(".wind-speed");
  const icon = document.querySelector("#icon");

  cityName.innerHTML = `${response.data.city},`;
  country.innerHTML = response.data.country;
  temperatureValue.innerHTML = Math.round(response.data.temperature.current);
  atmosphere.innerHTML =
    response.data.condition.description.charAt(0).toUpperCase() +
    response.data.condition.description.slice(1);
  humidity.innerHTML = response.data.temperature.humidity;
  wind.innerHTML = response.data.wind.speed;
  icon.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );

  getForecast(response.data.coordinates);
}

// Gets weather conditions for current location
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(gpsLocation);
}

// Retrieves weather conditions based on geolocation coordinates
function gpsLocation(position) {
  const apiKey = "ae5350b6a304ff06o3a36487d5be8a4t";
  const apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${position.coords.longitude}&lat=${position.coords.latitude}&key=${apiKey}`;

  axios.get(apiUrl).then(displayWeatherCondition);
}

// Event listeners
const cityForm = document.querySelector("#search-form");
cityForm.addEventListener("submit", findCity);

const currentLocationButton = document.querySelector("#gps-location");
currentLocationButton.addEventListener("click", getCurrentLocation);

// Initialize with weather conditions for current location
navigator.geolocation.getCurrentPosition(gpsLocation);

//Converts celsius to fahrenheit and vice versa

const temperatureValue = document.querySelector("#temperature-value");
const celsiusBtn = document.querySelector(".celsius");
const fahrenheitBtn = document.querySelector(".fahrenheit");

//Button to convert celsius to fahrenheit
function celsiusToFahrenheit() {
  const celsiusTemp = parseFloat(temperatureValue.textContent);

  //Calculates the fahrenheit temperature
  const fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;

  // Updates the temperature value with the Fahrenheit temperature
  temperatureValue.textContent = Math.round(fahrenheitTemp);
}

//Button to convert fahrenheit to celsius
function fahrenheitToCelsius() {
  const fahrenheitTemp = parseFloat(temperatureValue.textContent);

  //Calculates the celsius temperature
  const celsiusTemp = ((fahrenheitTemp - 32) * 5) / 9;

  // Updates the temperature value with the Celsius temperature
  temperatureValue.textContent = Math.round(celsiusTemp);
}

// Event listeners for the conversion buttons
celsiusBtn.addEventListener("click", fahrenheitToCelsius);
fahrenheitBtn.addEventListener("click", celsiusToFahrenheit);
