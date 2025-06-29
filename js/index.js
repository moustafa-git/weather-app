"use-strict";

// example
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

// KEY
const key = "5b8a3da67664f60d68384eca902ab338";

let city = "";

// DOM ELEMENTS
const findButton = document.querySelector(".find");
const inputSearch = document.querySelector(".input-search");
const cityPlaceholder = document.querySelector(".city");
const tempPlaceholder = document.querySelector(".temp");
const weatherPlaceholder = document.querySelector(".weather");
const rainPercentage = document.querySelector(".umbrella");
const windSpeed = document.querySelector(".wind");
const direction = document.querySelector(".compass");
const emoji = document.querySelector(".emoji");
const dayPlaceholder = document.querySelector(".day");
const datePlaceholder = document.querySelector(".date");
// SECOND CARD
const day1Placeholder = document.querySelector(".day1");
const emoji1 = document.querySelector(".emoji1");
const temp1Placeholder = document.querySelector(".temp1");
const temp2Placeholder = document.querySelector(".temp2");
const weather1Placeholder = document.querySelector(".weather1");
// THIRD CARD
const day3Placeholder = document.querySelector(".day3");
const emoji3 = document.querySelector(".emoji3");
const temp3Placeholder = document.querySelector(".temp3");
const temp4Placeholder = document.querySelector(".temp4");
const weather3Placeholder = document.querySelector(".weather3");
// ALERT
const alert = document.querySelector(".alert");

findButton.addEventListener("click", handleSubmit);

inputSearch.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    handleSubmit();
  }
});

fetch("https://ipapi.co/json/")
  .then((res) => res.json())
  .then((data) => {
    city = data.city;
    fetchWeather();
  });

function handleSubmit() {
  city = inputSearch.value;
  if (city) {
    fetchWeather();
    inputSearch.value = "";
  } else {
    console.log("no city");
  }
}

function kelvinToCelsius(kelvin) {
  return kelvin - 273.15;
}

function mainCard(data) {
  const temp = kelvinToCelsius(data.list[0].main.temp).toFixed(2);
  tempPlaceholder.innerHTML = `${temp}&deg;C`;
  cityPlaceholder.innerHTML = `${data.city.name}, ${data.city.country}`;
  weatherPlaceholder.innerHTML = data.list[0].weather[0].main;
  windSpeed.innerHTML = `${data.list[0].wind.speed}km/h`;
  emoji.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png" alt="Clear sky">`;
  const date = new Date(data.list[0].dt_txt);
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  const shortMonth = date.toLocaleDateString("en-US", { month: "short" });
  const dayOfMonth = date.getDate();
  dayPlaceholder.innerHTML = dayName;
  datePlaceholder.innerHTML = `${dayOfMonth}${shortMonth}`;
}

function secondCard(days, dates) {
  const date = new Date(dates[1]);
  day1Placeholder.innerHTML = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  emoji1.innerHTML = `<img src="https://openweathermap.org/img/wn/${days[1].weather[0].icon}@2x.png" alt="Clear sky">`;
  const temp1 = kelvinToCelsius(days[1].main.temp_max).toFixed(2);
  temp1Placeholder.innerHTML = `${temp1}&deg;C`;
  const temp2 = kelvinToCelsius(days[1].main.temp_min).toFixed(2);
  temp2Placeholder.innerHTML = `${temp2}&deg;C`;
  weather1Placeholder.innerHTML = days[1].weather[0].main;
}

function thirdCard(days, dates) {
  const date = new Date(dates[2]);
  day3Placeholder.innerHTML = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  emoji3.innerHTML = `<img src="https://openweathermap.org/img/wn/${days[2].weather[0].icon}@2x.png" alt="Clear sky">`;
  const temp3 = kelvinToCelsius(days[2].main.temp_max).toFixed(2);
  temp3Placeholder.innerHTML = `${temp3}&deg;C`;
  const temp4 = kelvinToCelsius(days[2].main.temp_min).toFixed(2);
  temp4Placeholder.innerHTML = `${temp4}&deg;C`;
  weather3Placeholder.innerHTML = days[2].weather[0].main;
}

async function fetchWeather() {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}`
    );

    if (!res.ok) {
      throw new Error(res.statusText);
    }
    alert.classList.add("d-none");
    const data = await res.json();
    mainCard(data);

    const threeDays = data.list
      .filter((el, i) => {
        return el.dt_txt.includes("00:00:00");
      })
      .slice(0, 3);

    const threeDates = threeDays.map((el) => el.dt_txt);

    secondCard(threeDays, threeDates);
    thirdCard(threeDays, threeDates);
  } catch (err) {
    alert.classList.remove("d-none");

    setTimeout(function () {
      alert.classList.add("d-none");
    }, 1500);
    console.error(err);
  }
}
