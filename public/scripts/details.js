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

const urlParams = new URLSearchParams(window.location.search);
const entryId = urlParams.get('id');
let globalTime;


if (entryId) {
  db.collection("tasks").doc(entryId).get().then((doc) => {
    if (doc.exists) {
      displayEntry(doc.data());
    } else {
      console.log("No such document!");
    }
  });
}
function displayEntry(data) {

  // Fetch all documents from the 'users' collection
  var db = firebase.firestore();
  var selectElement = document.getElementById("member");
  var memberNameToValue = {};

  db.collection("users").get().then((querySnapshot) => {
      // Clear the current options in the dropdown
      selectElement.innerHTML = "";

      // Loop through each document and create an option element
      querySnapshot.forEach((doc) => {
          var option = document.createElement("option");
          option.value = doc.id;  // Use the document's ID as the value
          option.textContent = doc.data().username;  // Get the 'username' field
          selectElement.appendChild(option);

          // Also build the memberNameToValue map
          memberNameToValue[doc.data().username] = doc.id;
      });

      // After populating dropdown, set the selected values based on data received
      updateUIWithData(data, memberNameToValue);

  }).catch((error) => {
      console.log("Error getting documents: ", error);
  });
}

function updateUIWithData(data, memberNameToValue) {
  const priorityToValue = {
      "Low": "1",
      "Medium": "2",
      "Important": "3",
      "Urgent": "4",
  };
  const statusToValue = {
      "Not Started": "1",
      "In Progress": "2",
      "Completed": "3",
  };

  // Set the selected member based on the data from Firebase
  document.getElementById("member").value = memberNameToValue[data.member];
  document.getElementById("priority").value = priorityToValue[data.priority];
  document.getElementById("status").value = statusToValue[data.status];
  document.getElementById("story_points").value = data.story_points;
  document.getElementById("StartTime").textContent = data.startTime || "Start time: --";
  document.getElementById("EndTime").textContent = data.endTime|| "End time: --";
  document.getElementById("CompletionDuration").textContent = data.completionDuration||"Completion Duration: --";
  document.querySelector('.EnterATitleTextbox').value = data.title;
  document.querySelector('.DetailedDescriptionTextbox').value = data.description;

  data.tags.forEach(tag => {
      let checkbox = document.getElementById(tag);
      if (checkbox) {
          checkbox.checked = true;
      } else {
          console.warn(`Checkbox with ID "${tag}" not found.`);
      }
  });

  document.getElementById("detailsForm").style.opacity = "1";
}


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
    globalTime = durationInMinutes / 60; //convert to hours
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

function goBack() {
  sessionStorage.setItem('reload', 'true');
  window.history.back();
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

async function editData() {
  const docRef = db.collection('tasks').doc(entryId);


  let priorityElement = document.getElementById('priority');
  let selectedPriorityText = priorityElement.options[priorityElement.selectedIndex].text;
  let memberElement = document.getElementById('member');
  let selectedMemberText = memberElement.options[memberElement.selectedIndex].text;
  let statusElement = document.getElementById('status');
  let selectedStatusText = statusElement.options[statusElement.selectedIndex].text;


  let tags = [];
  
  let checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(function(checkbox) {
    if (checkbox.checked) {
      tags.push(checkbox.id);
    }
  });

  console.log("it works, hours spent: " + globalTime);
  if (globalTime === undefined) {
    try {
      let doc = await docRef.get();
      if (doc.exists) {
        globalTime = doc.data().hours_spent !== undefined ? doc.data().hours_spent : 0;
      } else {
        console.error("Document does not exist!");
        alert("Error fetching data");
        return;
      }
    } catch (error) {
      console.error("Error getting document: ", error);
      alert("Error fetching data");
      return;
    }
  }
  let updatedData = {
    title: document.querySelector('.EnterATitleTextbox').value,
    description: document.querySelector('.DetailedDescriptionTextbox').value,
    member: selectedMemberText,
    priority: selectedPriorityText,
    story_points : document.getElementById('story_points').value,
    status: selectedStatusText,
    startTime: document.getElementById('StartTime').textContent,
    endTime: document.getElementById('EndTime').textContent,
    completionDuration: document.getElementById('CompletionDuration').textContent,
    hours_spent: globalTime,
    tags: tags
  };
  // Error checking
  if (!updatedData.title || updatedData.title.trim() == ""|| updatedData.title == null) {
    alert("Please enter a title.");
    return;
  }
  else if (updatedData.tags.length == 0) {
    alert("Please select at least one tag.");
    return;
  }
  docRef.update(updatedData)
  .then(() => {
    console.log("Document successfully updated!");
    alert("Data updated successfully");
  })
  .catch((error) => {
    console.error("Error updating document: ", error);
    alert("Error updating data");
  });
}

function deleteData() {
  const docRef = db.collection('tasks').doc(entryId);
  docRef.delete().then(() => {
    console.log("Document successfully deleted!");
    alert("Data deleted successfully");
    sessionStorage.setItem('reload', 'true');
    window.history.back();
    }).catch((error) => {
    console.error("Error removing document: ", error);
    alert("Error deleting data");
  })
}