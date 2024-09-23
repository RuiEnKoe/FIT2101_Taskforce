// hello
const firebaseConfig = {
  apiKey: "AIzaSyC8CHnMDOEQvZJ_hLCRzVLfe56MtGBea5c",
  authDomain: "fit2101-taskforce-app.firebaseapp.com",
  projectId: "fit2101-taskforce-app",
  storageBucket: "fit2101-taskforce-app.appspot.com",
  messagingSenderId: "235153486631",
  appId: "1:235153486631:web:55c7e9dc0730a36040ef02",
  measurementId: "G-LRZX1T9DE1"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
console.log(firebaseApp);
const db = firebaseApp.firestore();
const auth = firebase.auth();

let thingsRef;
let unsubscribe;

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
  
// function to save data to FireStore
function saveData(){
  thingsRef = db.collection('tasks');
  let priorityElement = document.getElementById('priority');
  let selectedPriorityText = priorityElement.options[priorityElement.selectedIndex].text;
  let memberElement = document.getElementById('member');
  let selectedMemberText = memberElement.options[memberElement.selectedIndex].text;
  let statusElement = document.getElementById('status');
  let selectedStatusText = statusElement.options[statusElement.selectedIndex].text;

  // get tag labels
  let tags = [];

  let checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(function(checkbox) {
    if (checkbox.checked) {
      tags.push(checkbox.id);
    }
  });

  const { serverTimestamp } = firebase.firestore.FieldValue;
  let data = {
    id: generateID(),
    createdAt: serverTimestamp(),
    title: document.querySelector('.EnterATitleTextbox').value,
    description: document.querySelector('.DetailedDescriptionTextbox').value,
    member: selectedMemberText,
    priority: selectedPriorityText,
    story_points : document.getElementById('story_points').value,
    status: selectedStatusText,
    startTime: '',
    endTime: '',
    completionDuration: '',
    tags: tags,
    parentid: 'prodBacklog'  // Here's the addition
  };
  // Error checking
  if (!data.title || data.title.trim() == ""|| data.title == null) {
    alert("Please enter a title.");
    return;
  }
  else if (tags.length == 0) {
    alert("Please select at least one tag.");
    return;
  }

  else {
    thingsRef.add(data)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      alert("Data saved successfully");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      alert("Error adding document");
    });
  }
}

function goBack() {
  window.location.href = "index.html";
}

// Check if user is logged in
auth.onAuthStateChanged(user => {
  if (!user) {
    alert('Please login or register an account. You will be redirected to the login page.');
    window.location.href = "login.html";
  } else {
    console.log('User logged in: ', user);
  }
});

// Get a reference to the 'member' dropdown
var selectElement = document.getElementById("member");

// Fetch all documents from the 'users' collection
db.collection("users").get().then((querySnapshot) => {
    // Clear the current options in the dropdown
    selectElement.innerHTML = "";

    // Loop through each document and create an option element
    querySnapshot.forEach((doc) => {
        var option = document.createElement("option");
        option.value = doc.id;  // Using the document's ID as the value
        option.textContent = doc.data().username;  // Get the 'username' field
        selectElement.appendChild(option);
    });
}).catch((error) => {
    console.log("Error getting documents: ", error);
});