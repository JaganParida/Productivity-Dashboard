function openFeatures() {
  let allElems = document.querySelectorAll(".elem");
  let fullElemPage = document.querySelectorAll(".fullElem");
  let fullElemPageBackBtn = document.querySelectorAll(".fullElem .back");

  allElems.forEach(function (elem) {
    elem.addEventListener("click", function () {
      fullElemPage[elem.id].style.display = "block";
    });
  });

  fullElemPageBackBtn.forEach(function (back) {
    back.addEventListener("click", function () {
      fullElemPage[back.id].style.display = "none";
    });
  });
}
openFeatures();

//Task List
function todoList() {
  let currentTask = JSON.parse(localStorage.getItem("currentTask")) || [];

  function renderTask() {
    let allTask = document.querySelector(".allTask");
    let sum = "";

    currentTask.forEach(function (elem, idx) {
      sum += `
        <div class="task">
            <h5 id="task-${idx}" class="${elem.completed ? "is-done" : ""}">
                ${elem.task} <span class="${elem.imp}">imp</span>
            </h5>
            <details class="${elem.completed ? "is-done" : ""}">
                <summary><i class="ri-arrow-down-s-line"></i></summary> 
                <p class="task-details-text">${elem.details}</p>
            </details>
            <div class='btns'>
                <button class='delete' data-index="${idx}">Delete</button>
                <button class='mark-complete' data-index="${idx}" ${
        elem.completed ? "disabled" : ""
      }>
                    ${elem.completed ? "Completed" : "Complete"}
                </button>
            </div>
        </div>`;
    });

    allTask.innerHTML = sum;
    localStorage.setItem("currentTask", JSON.stringify(currentTask));

    document.querySelectorAll(".btns button").forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        const index = event.target.dataset.index;

        if (event.target.classList.contains("delete")) {
          currentTask.splice(index, 1);
        } else if (event.target.classList.contains("mark-complete")) {
          currentTask[index].completed = true;
        }

        renderTask();
      });
    });
  }

  let form = document.querySelector(".addTask form");
  let taskInput = document.querySelector(".addTask form input");
  let taskDetailsInput = document.querySelector(".addTask form textarea");
  let taskCheckbox = document.querySelector(".addTask form #check");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!taskInput.value.trim()) return;

    currentTask.push({
      task: taskInput.value,
      details: taskDetailsInput.value,
      imp: taskCheckbox.checked,
      completed: false,
    });

    renderTask();
    form.reset();
  });

  renderTask();
}
todoList();

//Daily Planner
function dailyPlanner() {
  let dayPlanner = document.querySelector(".day-planner");
  let dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {};
  let hours = Array.from(
    { length: 18 },
    (_, idx) => `${6 + idx} : 00 - ${7 + idx} : 00`
  );

  let wholeDaySum = "";
  hours.forEach(function (elem, idx) {
    let savedData = dayPlanData[idx] || " ";

    wholeDaySum += `<div class="day-planner-time">
  <p>${elem}</p>
  <input id=${idx} type="text" placeholder="..." value = ${savedData}>
  </div>`;
  });
  dayPlanner.innerHTML = wholeDaySum;

  let dayPlannerInput = document.querySelectorAll(".day-planner input");

  dayPlannerInput.forEach(function (elem) {
    elem.addEventListener("input", function () {
      dayPlanData[elem.id] = elem.value;

      localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
    });
  });
}
dailyPlanner();

//motivational Qoute
function motivationalQuote() {
  let motivationQuoteContent = document.querySelector(".motivation-2 h2");
  let motivationQuoteAuthor = document.querySelector(".motivation-3 h2");

  async function fetchQoute() {
    let response = await fetch("https://dummyjson.com/quotes/random");
    let data = await response.json();

    motivationQuoteContent.innerHTML = data.quote;
    motivationQuoteAuthor.innerHTML = `- ${data.author}`;
  }
  fetchQoute();
}
motivationalQuote();

//Pomodomo-Timer
function pomodomoTimer() {
  let timer = document.querySelector(".pomo-timer h1");
  let startBtn = document.querySelector(".pomo-timer .start");
  let pauseBtn = document.querySelector(".pomo-timer .pause");
  let resetBtn = document.querySelector(".pomo-timer .reset");
  let enterTime = document.querySelector(".pomo-timer .enterTime");

  let timerInterval = null;
  let totalSeconds = 0;

  enterTime.addEventListener("click", () => {
    let userInput = +prompt("Enter Your Time in Seconds");
    if (!isNaN(userInput)) {
      totalSeconds = userInput;
      updateTimer();
    }
  });

  function updateTimer() {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    timer.innerHTML = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds--;
        updateTimer();
      } else {
        clearInterval(timerInterval);
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timerInterval);
  }

  function resetTimer() {
    clearInterval(timerInterval);
    totalSeconds = 0;
    updateTimer();
  }

  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);
}
pomodomoTimer();

//Header - weather forcast
function weatherFunctionality() {
  let temp = document.querySelector(".header2 h2");
  let wind = document.querySelector(".header2 .wind");
  let humidity = document.querySelector(".header2 .humidity");
  let precipitation = document.querySelector(".header2 .precipitation");
  let condition = document.querySelector(".header2 h4");
  let properLocation = document.querySelector(".header1 h4");

  async function weatherAPICall(query) {
    let apikey = "ccb1dab677f948cf9d8123236252212";
    let location = query || "Bhubaneswar";

    try {
      let response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${location}`
      );

      let data = await response.json();

      temp.innerHTML = `${data.current.temp_c}°C`;
      wind.innerHTML = `Wind : ${data.current.wind_kph}km/h`;
      humidity.innerHTML = `Humidity : ${data.current.humidity}%`;
      condition.innerHTML = `${data.current.condition.text}`;
      precipitation.innerHTML = `Precipitation : ${data.current.precip_mm}mm`;

      if (properLocation) {
        properLocation.innerHTML = `${data.location.name}, ${data.location.region}`;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          weatherAPICall(`${lat},${lon}`);
        },
        () => {
          weatherAPICall();
        }
      );
    } else {
      weatherAPICall();
    }
  }

  getLocation();

  let time = document.querySelector(".header1 h1");
  let header1dDate = document.querySelector(".header1 h2");

  function timeDate() {
    let date = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const dayName = days[date.getDay()];
    const rawHours = date.getHours();
    const dayHours = rawHours % 12 || 12;
    const seconds = date.getSeconds();
    const properDate = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const ampm = rawHours >= 12 ? "PM" : "AM";
    const dayMins = date.getMinutes().toString().padStart(2, "0");

    time.innerHTML = `${dayName}, ${String(dayHours).padStart(2, "0")}:${String(
      dayMins
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")} ${ampm}`;
    header1dDate.innerHTML = `${properDate} ${month}, ${year}`;
  }

  setInterval(timeDate, 1000);
}
weatherFunctionality();

//theme-changer
function themeChanger() {
  let themeChanger = document.querySelector("nav .theme");
  let rootElement = document.documentElement;

  var flag = 0;
  themeChanger.addEventListener("click", function () {
    if (flag == 0) {
      rootElement.style.setProperty("--pri", "#DDE6ED");
      rootElement.style.setProperty("--sec", "#526D82");
      rootElement.style.setProperty("--tri1", "#DDE6ED");
      rootElement.style.setProperty("--tri2", "#27374D");
      flag = 1;
    } else if (flag == 1) {
      rootElement.style.setProperty("--pri", "#F4EEE0");
      rootElement.style.setProperty("--sec", "#144272");
      rootElement.style.setProperty("--tri1", "#EEEEEE");
      rootElement.style.setProperty("--tri2", "#0A2647");

      flag = 2;
    } else if (flag == 2) {
      rootElement.style.setProperty("--pri", "#f8f4e1");
      rootElement.style.setProperty("--sec", "#371a08");
      rootElement.style.setProperty("--tri1", "#f1b126");
      rootElement.style.setProperty("--tri2", "#6d4b18");
      flag = 0;
    }
  });
}
themeChanger();
