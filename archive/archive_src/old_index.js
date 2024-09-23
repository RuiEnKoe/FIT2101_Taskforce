const firebaseConfig = {
    apiKey: "AIzaSyB8pAxat88SwLqsNzwzuayU5m5LUFqbt-k",
    authDomain: "fit2101-taskforce.firebaseapp.com",
    projectId: "fit2101-taskforce",
    storageBucket: "fit2101-taskforce.appspot.com",
    messagingSenderId: "294872456587",
    appId: "1:294872456587:web:ea5df93f50010b6699a38e",
    measurementId: "G-PMLN22FYWR"
  };
const firebaseApp = firebase.initializeApp(firebaseConfig);
console.log(firebaseApp);
// JavaScript function to handle placeholder visibility
  function checkPlaceholder(input) {
    input.classList.toggle("filled", input.value !== "");
  }

  var startTimeDisplay = document.getElementById("StartTime");
  var endTimeDisplay = document.getElementById("EndTime");
  var completionDurationDisplay = document.getElementById("CompletionDuration");

  document.addEventListener('DOMContentLoaded', function() {
  var startTime, endTime;

  ['1', '2'].forEach(function(num) {
    var selectDiv = document.getElementById('selectDiv' + num);
    var timePicker = document.getElementById('timePicker' + num);
    var datePicker = document.getElementById('datePicker' + num);

    var dateSelected = false;
    var timeSelected = false;
    var pickersVisible = false;

    selectDiv.addEventListener('click', function() {
      if (pickersVisible) {
        hidePickers();
      } else {
        showPickers();
      }
    });

    timePicker.addEventListener('change', function() {
      timeSelected = true;
      updateDateTime(num, datePicker.value, timePicker.value);

      if(dateSelected && timeSelected) {
        hidePickers();
      }
    });

    datePicker.addEventListener('change', function() {
      dateSelected = true;
      updateDateTime(num, datePicker.value, timePicker.value);

      if(dateSelected && timeSelected) {
        hidePickers();
      }
    });

    function hidePickers() {
      timePicker.style.display = 'none';
      datePicker.style.display = 'none';
      dateSelected = false;
      timeSelected = false;
      pickersVisible = false;
    }

    function showPickers() {
      timePicker.style.display = 'block';
      datePicker.style.display = 'block';
      timePicker.focus();
      pickersVisible = true;
    }

    function updateDateTime(num, dateValue, timeValue) {
      var selectedDate = new Date(dateValue + 'T' + timeValue);
      if(num === '1') {
        startTime = selectedDate;
        startTimeDisplay.textContent = "Start time: " + dateValue + ' ' + timeValue;
      } else {
        endTime = selectedDate;
        endTimeDisplay.textContent = "End time: " + dateValue + ' ' + timeValue;
      }
      calculateDuration();
    }
  });

  function calculateDuration() {
    if (startTime && endTime) {
      var durationInMinutes = (endTime - startTime) / 60000; 
      if (isNaN(durationInMinutes)) {
        completionDurationDisplay.textContent = "Completion Duration: Invalid Time";
        return;
      }

      var days = Math.floor(durationInMinutes / (24 * 60));
      var hours = Math.floor((durationInMinutes % (24 * 60)) / 60);
      var minutes = Math.floor(durationInMinutes % 60);

      var durationString = "Completion Duration: ";
      if (days > 0) {
        durationString += `${days} days, ${hours} hours, ${minutes} minutes`;
      } else if (hours > 0) {
        durationString += `${hours} hours, ${minutes} minutes`;
      } else {
        durationString += `${minutes} minutes`;
      }

      completionDurationDisplay.textContent = durationString;
    }
  }
});

function generateID() {
    return new Date().getTime().toString();
  }

function saveData() {
    // Create a JavaScript object to hold the data
    let data = {
      id: generateID(),
      title: document.querySelector('.EnterATitleTextbox').value,
      description: document.querySelector('.DetailedDescriptionTextbox').value,
      priority: document.getElementById('priority').value,
      //status: document.getElementById('status').value,
      startTime: document.getElementById('StartTime').textContent,
      endTime: document.getElementById('EndTime').textContent,
      completionDuration: document.getElementById('CompletionDuration').textContent
        
    };
    console.log(data);
    // Convert the object to a JSON string
    let jsonStr = JSON.stringify(data);
  
    // Create a Blob object from the JSON string
    let blob = new Blob([jsonStr], { type: 'application/json' });
  
    // Create a link element
    let a = document.createElement('a');
  
    // Set link attributes
    // a.href = URL.createObjectURL(blob);
    // a.download = 'data.json';
  
    // Append the link to the DOM and simulate a click to start the download
    document.body.appendChild(a);
    a.click();
  
    // Remove the link from the DOM
    document.body.removeChild(a);
  }
  