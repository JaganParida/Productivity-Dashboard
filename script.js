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
  let currentTask = [];

  if (localStorage.getItem("currentTask")) {
    currentTask = JSON.parse(localStorage.getItem("currentTask"));
  } else {
    console.log("Task List is empty");
  }

  function renderTask() {
    let allTask = document.querySelector(".allTask");
    let sum = "";

    currentTask.forEach(function (elem, idx) {
      // We use a ternary operator to add a 'completed' class if elem.completed is true
      sum += `
        <div class="task ${elem.completed ? "is-done" : ""}">
            <h5 id="task-${idx}">${elem.task} <span class="${
        elem.imp
      }">imp</span></h5>
            <details>
                <summary><i class="ri-arrow-down-s-line"></i></summary> 
                <p class="task-details-text">${elem.details}</p>
            </details>
            <div class='btns'>
                <button class='delete' data-index="${idx}">Delete</button>
                <button class='mark-complete' data-index="${idx}">Complete</button>
            </div>
        </div>`;
    });

    allTask.innerHTML = sum;
    localStorage.setItem("currentTask", JSON.stringify(currentTask));

    // Handle button clicks
    document.querySelectorAll(".btns button").forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        const index = event.target.dataset.index;

        if (event.target.classList.contains("delete")) {
          currentTask.splice(index, 1);
        } else if (event.target.classList.contains("mark-complete")) {
          // Update the DATA, not the UI directly
          currentTask[index].completed = true;
        }

        renderTask(); // This will now redraw the task with the 'is-done' class
      });
    });
  }

  renderTask();

  let form = document.querySelector(".addTask form");
  let taskInput = document.querySelector(".addTask form input");
  let taskDetailsInput = document.querySelector(".addTask form textarea");
  let taskCheckbox = document.querySelector(".addTask form #check");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    currentTask.push({
      task: taskInput.value,
      details: taskDetailsInput.value,
      imp: taskCheckbox.checked,
    });
    renderTask();
    taskInput.value = "";
    taskDetailsInput.value = "";
    taskCheckbox.checked = false;
  });
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
    let response = await fetch("https://api.quotable.io/random");
    let data = await response.json();

    motivationQuoteContent.innerHTML = data.content;
    motivationQuoteAuthor.innerHTML = `- ${data.author}`;
  }
  fetchQoute();
}
motivationalQuote();

