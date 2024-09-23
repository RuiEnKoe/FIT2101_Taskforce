// Initialize Firebase
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
  const db = firebaseApp.firestore();
  const auth = firebase.auth();

  // Retrieve stored dates from localStorage and convert them back to Date objects
  const storedStartDateStr = localStorage.getItem('startDate');
  const storedEndDateStr = localStorage.getItem('endDate');
  const storedStartDate = new Date(storedStartDateStr);
  const storedEndDate = new Date(storedEndDateStr);
  
  // Calculate the number of days between the start and end dates
  // const diffTime = Math.abs(storedEndDate - storedStartDate);
  // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert from milliseconds to days
  
  // Function to accumulate completion time in minutes
  function accumulateCompletionTime(str, totalMinutes) {
    str = str.replace('Completion Duration: ', '');
  
    const parts = str.split(', ');
  
    for (const part of parts) {
      const [value, unit] = part.split(' ');
  
      if (unit === 'days' || unit === 'day') {
        totalMinutes += parseInt(value, 10) * 24 * 60;
      } else if (unit === 'hours' || unit === 'hour') {
        totalMinutes += parseInt(value, 10) * 60;
      } else if (unit === 'minutes' || unit === 'minute') {
        totalMinutes += parseInt(value, 10);
      }
    }
  
    return totalMinutes;
  }
  let diffDays;

  function compareDates(firebaseStartDate, firebaseEndDate, storedStartDate, storedEndDate) {
    const fbStartDate = new Date(firebaseStartDate.substring(12));
    const fbEndDate = new Date(firebaseEndDate.substring(12));
  
    const earliestStartDate = fbStartDate < storedStartDate ? fbStartDate : storedStartDate;
    const earliestEndDate = fbEndDate < storedEndDate ? fbEndDate : storedEndDate;
  
    const diffTime = Math.abs(earliestEndDate - earliestStartDate);
    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert from milliseconds to days
  }
  // Fetch all documents from the 'users' collection
  db.collection("users").get().then((querySnapshot) => {
    userNamesList.innerHTML = ""; // Clear existing list
  
    querySnapshot.forEach((userDoc) => {
      const userName = userDoc.data().username; // Assuming 'username' field exists
  
      // Fetch all tasks for this user
      db.collection('tasks').where('member', '==', userName).get().then((taskQuerySnapshot) => {
        let totalMinutes = 0;
  
        taskQuerySnapshot.forEach((taskDoc) => {
          const taskData = taskDoc.data();
          if (taskData.completionDuration) {
            totalMinutes = accumulateCompletionTime(taskData.completionDuration, totalMinutes);
            compareDates(taskData.startTime, taskData.endTime, storedStartDate, storedEndDate); 
            console.log(diffDays);
          }
        });
  
        // Calculate the average time per day
        let averageMinutesPerDay = (diffDays === 0) ? 0 : totalMinutes / diffDays;
        let averageHoursPerDay = averageMinutesPerDay / 60;
        if (averageHoursPerDay === 0 || isNaN(averageHoursPerDay)){
          averageHoursPerDay = 0;
        }
  
        // Create a div element to display this information
        const userDiv = document.createElement("div");
        userDiv.innerHTML = `
          <p class="user-name-style">${userName}</p>
          <p class="average-hours-style">${averageHoursPerDay.toFixed(2)}</p>
        `;

        userNamesList.appendChild(userDiv);
  
      }).catch((error) => {
        console.log("Error getting tasks: ", error);
      });
    });
  }).catch((error) => {
    console.log("Error getting users: ", error);
  });

  function goBack() {
    window.location.href = "adminDateSelection.html";
  }
// Helper function to format the date without the day of the week
function formatDateWithFullMonth(date) {
  return `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
}

const startDateStr = localStorage.getItem('startDate');
const endDateStr = localStorage.getItem('endDate');

// Convert the string back to a JavaScript Date object
const startDate = new Date(startDateStr);
const endDate = new Date(endDateStr);

// Get the HTML elements
const startDateElement = document.getElementById('startDateElement');
const endDateElement = document.getElementById('endDateElement');

console.log(startDate);
console.log(endDate); 

// Display the formatted dates in the elements
startDateElement.innerHTML = '<strong>Start Date:</strong> ' + formatDateWithFullMonth(startDate);
endDateElement.innerHTML = '<strong>End Date:</strong> ' + formatDateWithFullMonth(endDate);