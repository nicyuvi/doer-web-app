'use strict';
/*========
VARIABLES
==========*/
//BUTTONS
//nav buttons
const navBtn = document.querySelector('#nav-btn');
const hamMenu = document.querySelector('.ham-menu');

//widget buttons
const todoBtn = document.querySelector('.todo-btn');
const noteBtn = document.querySelector('.notes-btn');
const timerBtn = document.querySelector('.timer-btn');

//todo functionality buttons
const addTodoBtn = document.querySelector('.fa-plus-square');

//timer functionality buttons
const timerBtns = document.querySelector('#timer-btns');
const timerStartBtn = document.querySelector('#timer-start');
const timerResetBtn = document.querySelector('#timer-reset');

//Note buttons
const submitNoteBtn = document.querySelector('#submit-note');

//END BUTTONS

//DOM ELEMENTS
//widget elements
const widgetWrapper = document.querySelector('.main-content-wrapper');

//todo widget
const todoWidget = document.querySelector('#todo');
const todoInput = document.querySelector('.todo-input');
const todoContainer = document.querySelector('.todo-container');

//timer widget
const timerWidget = document.querySelector('#timer');
const timerMinute = document.querySelector('#minute');
const timerSeconds = document.querySelector('#seconds');
const timerStar = document.querySelectorAll('.fa-star');
const timerStarContainer = document.querySelector('.timer-checks');

//notes widget
const notesWidget = document.querySelector('#notes');
const noteTitle = document.querySelector('#note-title');
const noteBody = document.querySelector('#note-body');
const notesCardContainer = document.querySelector('#notes-card-container');

//header widget
const nameInput = document.querySelector('.name-input');
const quotesWidget = document.querySelector('#quotes-widget');

//weather API widget
const temperatureDescription = document.querySelector('#weather-description');
const temperatureDegree = document.querySelector('#temperature-degree');
const locationTimezone = document.querySelector('#weather-location');
const temperatureSection = document.querySelector('#temperature-section');
const temperatureSpan = document.querySelector('#temperature-section span');
const weatherIcon = document.querySelector('#weather-icon');
const weatherContainer = document.querySelector('.weather-wrapper');
//END DOM ELEMENTS
/*===========
END VARIABLES
=============*/

/*=============
EVENT LISTENERS
===============*/
//Toggle Widget Card View
navBtn.addEventListener('click', () => {
  hamMenu.classList.toggle('active');
});
todoBtn.addEventListener('click', () => {
  hamMenu.classList.remove('active');
  removeActiveClass();
  todoWidget.classList.add('active');
});
noteBtn.addEventListener('click', () => {
  hamMenu.classList.remove('active');
  removeActiveClass();
  notesWidget.classList.add('active');
});
timerBtn.addEventListener('click', () => {
  hamMenu.classList.remove('active');
  removeActiveClass();
  timerWidget.classList.add('active');
});
//End Widget Card View

//Store name in Local Storage
nameInput.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    localStorage.setItem('name input', nameInput.value);
    swal('Name Saved Successfully', '', 'success');
  }
});
//End Store name in Local Storage

//Alert Once
nameInput.addEventListener('click', (event) => {
  if (event.target.dataset.triggered) return;
  event.target.dataset.triggered = true;
  swal('Please enter your name and press enter to save', '', 'info');
});
//End Alert Once

//Todo widget
addTodoBtn.addEventListener('click', addTodo);

//DOM event delegation to select all remove buttons added dynamically
todoContainer.addEventListener('click', removeCheckTodo);

//End todo widget

//Timer widget
timerStartBtn.addEventListener('click', timerStart);
timerResetBtn.addEventListener('click', resetTimer);
//End Timer widget

//Notes Widget
submitNoteBtn.addEventListener('click', submitNote);
//DOM event delegation to expand specific note card
notesCardContainer.addEventListener('click', expandNote);
//End Notes Widget
/*=================
END EVENT LISTENERS
===================*/

/*==========================
Events on DOM Content Loaded
============================*/
window.addEventListener('DOMContentLoaded', () => {
  //Start Clock
  initClock();

  //fetch quotes API
  fetch('https://type.fit/api/quotes')
    .then(function (response) {
      return response.json();
    })
    .then(quotesGenerator);

  //fetch open weather API
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let long = position.coords.longitude;
      let lat = position.coords.latitude;

      const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=imperial&exclude=minutely,hourly,daily&appid=953e636423fad016ad314b33fc254fd6`;

      fetch(api)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          weatherData(data);
        });
    });
  } else {
    weatherContainer.innerHTML = `<p>Please Enable Location</p>`;
  }
  //fetch weather API
  //Retrieve name from Local Storage
  var savedInput = localStorage.getItem('name input');
  nameInput.value = savedInput;

  //Retrieve todo list items from local storage
  var savedTodoListItem = localStorage.getItem('todo items');
  todoContainer.innerHTML = savedTodoListItem;

  //Retrieve notes from local storage
  var savedNotesItems = localStorage.getItem('notes');
  notesCardContainer.innerHTML = savedNotesItems;

  //Retrieve timer stars from local storage
  var timerStars = localStorage.getItem('timer stars');
  timerStarContainer.innerHTML = timerStars;
});

/*==========================
End Events on DOM Content Loaded
============================*/

/*========
FUNCTIONS
==========*/
//Removes existing active class from children of widgetWrapper DOM element
function removeActiveClass() {
  if (widgetWrapper.getElementsByClassName('active').length > 0) {
    widgetWrapper
      .getElementsByClassName('active')[0]
      .classList.remove('active');
  }
}

//Todo Widget
function addTodo() {
  let input = todoInput.value;
  if (input == '') {
    swal('Please Enter an Item', '', 'warning');
  } else {
    const todoItem = `<div class="input-group mb-3">
                        <div id="todo-list-item" class="todo-list-item text-left form-control"><span id="list-item-text">${input}</span></div>
                        <i id="btnPrepend" class="fas fa-minus-square h1"></i>
                      </div> `;
    todoContainer.insertAdjacentHTML('beforeend', todoItem);
    //store todo item in local storage
    localStorage.setItem('todo items', todoContainer.innerHTML);
  }
  todoInput.value = '';
}

function removeCheckTodo(event) {
  if (event.target.id == 'btnPrepend') {
    //remove targeted todo item
    let target = event.target.parentNode;
    todoContainer.removeChild(target);
    localStorage.setItem('todo items', todoContainer.innerHTML);
  } else if (event.target.id == 'todo-list-item') {
    //toggle cross out list item
    let listItem = event.target.firstElementChild;
    listItem.classList.toggle('strike');
    event.target.classList.toggle('background-color');
    //Store list items with strike class in local storage
    localStorage.setItem('todo items', todoContainer.innerHTML);
  } else if (event.target.id == 'list-item-text') {
    let target = event.target;

    target.classList.toggle('strike');
    target.parentElement.classList.toggle('background-color');
    localStorage.setItem('todo items', todoContainer.innerHTML);
  }
}
//End Todo Widget

//Notes Widget
function submitNote(event) {
  //Assign note title and body value to variables
  var noteTitleValue = noteTitle.value;
  var noteBodyValue = noteBody.value;
  const noteCard = `<div class="card text-left w-100 mb-3">
                       <div class="card-body">
                          <p id="note-title" class="card-title h4">${noteTitleValue}</p>
                          <div class="note-collapse-container">
                            <p id="note-text" class="card-text mb-2">${noteBodyValue}</p>
                          </div>
                          <button id="notes-expand" class="btn btn-sm mr-1">Expand</button>
                          <button id="notes-delete" class="btn btn-danger btn-sm">Delete</button>
                       </div>
                     </div>`;
  if (noteBodyValue == '') {
    swal('Please Enter a Note', '', 'warning');
    event.preventDefault();
  } else {
    //prevent form submit
    event.preventDefault();
    //add new card html to container
    notesCardContainer.insertAdjacentHTML('beforeend', noteCard);
    //Store notes in local storage
    localStorage.setItem('notes', notesCardContainer.innerHTML);
    //Close bootstrap modal on form submit
    closeAllModals();
  }
  noteTitle.value = '';
  noteBody.value = '';
}

//Close bootstrap notes modal
const closeAllModals = () => {
  // get modals
  const modals = document.getElementsByClassName('modal');

  // on every modal change state like in hidden modal
  for (let i = 0; i < modals.length; i++) {
    modals[i].classList.remove('show');
    modals[i].setAttribute('aria-hidden', 'true');
    modals[i].setAttribute('style', 'display: none');
  }
};

//toggle expand note card/delete note card
function expandNote(event) {
  if (event.target && event.target.id == 'notes-expand') {
    var target = event.target.previousElementSibling;
    if (target.classList.contains('active')) {
      //removes active class from card
      target.classList.remove('active');
      event.target.textContent = 'Expand';
    } else {
      //target selects card note text
      target.classList.add('active');
      event.target.textContent = 'Collapse';
    }
  } else if (event.target && event.target.id == 'notes-delete') {
    //target selects parent card element
    let target = event.target.parentElement.parentElement;
    //Delete note from notes card container
    notesCardContainer.removeChild(target);
    //update notes card container in local storage
    localStorage.setItem('notes', notesCardContainer.innerHTML);
  }
}
//End Notes Widget

//Timer Widget
var minutesInterval;
var secondsInterval;
function timerStart() {
  var minutes = 24;
  var seconds = 59;

  //decrease minutes html every minute
  minutesInterval = setInterval(() => {
    minutes -= 1;
    timerMinute.innerHTML = minutes;
  }, 60000);

  //decrease seconds html every second
  secondsInterval = setInterval(() => {
    seconds -= 1;
    timerSeconds.innerHTML = seconds < 10 ? `0${seconds}` : seconds;
    //check if timer reaches 00:00
    if (seconds <= 0) {
      if (minutes <= 0) {
        //stop and reset timer
        resetTimer();
        //return start button functionality
        timerStartBtn.disabled = false;
        //add a star
        const addStar = `<i class="fas fa-star h2 mx-2"></i>`;
        timerStarContainer.insertAdjacentHTML('beforeend', addStar);
        localStorage.setItem('timer stars', timerStarContainer.innerHTML);
        setTimeout(breakAlert, 1000);
      }
      seconds = 60;
    }
  }, 1000);

  startTimer();
  //start timer
  function startTimer() {
    //Change starting time and add them to page
    timerMinute.innerHTML = minutes;
    timerSeconds.innerHTML = seconds;

    //disable start button
    timerStartBtn.disabled = true;

    //start countdown
    minutesInterval;
    secondsInterval;
  }
  //Alert for breaks
  function breakAlert() {
    //5 minute break audio
    var shortBreak = new Audio('./audio/5-minute-break.wav');
    // 15 - 30 minute break audio
    var longBreak = new Audio('./audio/15-minute-break.wav');

    //If 4 star divs are added dynamically
    if (timerStarContainer.childElementCount >= 4) {
      swal(
        'Great Job! You Did It!',
        'Go ahead and take a 15-30 minute break!',
        'success'
      );
      //Play long break audio
      longBreak.play();
      //remove all stars from DOM
      timerStarContainer.innerHTML = '';
      localStorage.setItem('timer stars', timerStarContainer.innerHTML);
    } else {
      swal('Awesome!', 'Please take a 5 minute break!', 'success');
      //Play short break audio
      shortBreak.play();
    }
  }
}
//Reset timer
function resetTimer() {
  //Reset to starting template
  timerMinute.innerHTML = 25;
  timerSeconds.innerHTML = '00';
  //Clear minute/second timeout function
  clearInterval(minutesInterval);
  clearInterval(secondsInterval);
  //re-enable start button
  timerStartBtn.disabled = false;
}
//End Timer Widget

//Quotes API Widget
//Passing in array of quotes and authors
const quotesGenerator = (quotesAndAuthors) => {
  //Assigns random quote object to randomQuote variable
  const randomQuote =
    quotesAndAuthors[Math.floor(Math.random() * quotesAndAuthors.length)];
  const { text, author } = randomQuote;
  quotesWidget.innerHTML = `<i>"${text}"</i> 
  -${author}`;
};
//End Quotes API Widget

//Weather API Widget
const weatherData = (data) => {
  const { temp } = data.current;
  const { description, icon } = data.current.weather[0];
  const { timezone } = data;

  //Set DOM Elementsfrom the API
  temperatureDegree.textContent = temp;
  temperatureDescription.textContent = description;
  locationTimezone.textContent = timezone;

  //Formula for Celsius
  let celsius = (temp - 32) * (5 / 9);

  //Set icon url
  let weatherIconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  weatherIcon.src = weatherIconURL;

  //Toggle Celsius Farenheit
  temperatureSection.addEventListener('click', () => {
    if (temperatureSpan.textContent === 'F') {
      temperatureSpan.textContent = 'C';
      temperatureDegree.textContent = Math.floor(celsius);
    } else {
      temperatureSpan.textContent = 'F';
      temperatureDegree.textContent = temp;
    }
  });
};
//End Weather API Widget

//Start Clock
Number.prototype.pad = function (n) {
  for (var r = this.toString(); r.length < n; r = 0 + r);
  return r;
};

function updateClock() {
  const amPm = document.getElementById('ampm');
  var now = new Date();
  var milli = now.getMilliseconds(),
    sec = now.getSeconds(),
    min = now.getMinutes(),
    hou = now.getHours(),
    mo = now.getMonth(),
    dy = now.getDate(),
    yr = now.getFullYear();
  var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  var tags = ['mon', 'd', 'y', 'h', 'm', 's'],
    corr = [months[mo], dy, yr, hou.pad(2), min.pad(2), sec.pad(2)];
  for (var i = 0; i < tags.length; i++) {
    document.getElementById(tags[i]).innerHTML = corr[i];
  }

  //Display AM - PM format
  var newFormat =
    corr[3] >= 12 ? (amPm.innerHTML = 'pm') : (amPm.innerHTML = 'am');

  //Display 12 hour format
  var hours = corr[3];
  hours = hours % '12';
  //Display "0" as "12"
  //If hours is "falsy" or "0" then we display "12"
  hours = hours ? hours : '12';
  document.getElementById('h').innerHTML = hours;
}

//Call clock function
function initClock() {
  updateClock();
  window.setInterval('updateClock()', 1); //Calls updateClock() every milisecond
}

// End Clock

/*===========
END FUNCTIONS
=============*/

//Stop Animations on window resize
let resizeTimer;
window.addEventListener('resize', () => {
  document.body.classList.add('resize-animation-stopper');
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove('resize-animation-stopper');
  }, 400);
});
