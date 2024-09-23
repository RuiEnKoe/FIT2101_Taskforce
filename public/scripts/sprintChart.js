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
const tasksRef = db.collection('tasks');
const sprintsRef = db.collection('sprints');

const urlParams = new URLSearchParams(window.location.search);
const entryId = urlParams.get('id');

async function getSprintDates(){
  let returnDates = [];
  let sprintStartDate;
  let sprintEndDate;

  try {
    const doc = await tasksRef.doc(entryId).get();
    if (doc.exists) {
      sprintStartDate = doc.data().start_date;    
      sprintEndDate = doc.data().end_date;

      sprintStartDate = sprintStartDate.toDate();
      sprintEndDate = sprintEndDate.toDate();

      returnDates.push(sprintStartDate);
      returnDates.push(sprintEndDate);
    } else {
      console.log("No such document!");  // Document not found
    }
  } catch (error) {
    console.log("Error getting document:", error);  // Handle any errors
  }

  console.log(returnDates);
  return returnDates;
}


async function getAllTasks() {
  const returnTasks = [];

  try {
    const querySnapshot = await tasksRef.where('parentid', '==', entryId).get();
    querySnapshot.forEach((documentSnapshot) => {
      const data = documentSnapshot.data();
      console.log(data);

      let taskStartDate = data.startTime;
      let taskEndDate = data.endTime;

      try{
        taskStartDate = taskStartDate.slice(12, 22);
        taskEndDate = taskEndDate.slice(10, 20);
      }catch(error){
        return;
      }

      taskStartDate = new Date(taskStartDate);
      taskEndDate = new Date(taskEndDate);

      const task = {
        story_points: data.story_points,
        taskStartDate: taskStartDate,
        taskEndDate: taskEndDate
      }
      returnTasks.push(task);
    });
  } catch (error) {
    console.error("Error retrieving tasks: ", error);
  }

  return returnTasks;
}

function goBack() {
  sessionStorage.setItem('reload', 'true');
  window.history.back();
}

function calculateDayDifference(taskStartDate, taskEndDate){
  const timeDifference = taskEndDate - taskStartDate;
  const daysDifference = timeDifference / (24 * 60 * 60 * 1000);
  return daysDifference;

}

function findIndexInDateLabels(givenDate, startDate) {
  return calculateDayDifference(new Date(givenDate), startDate);
}

let myLineChart1;
let myLineChart2;
let sprintStartDate;
let sprintEndDate;

async function generateGraph(sprintId) {
  // Destroy the old charts if they exist
  if (myLineChart1) {
    myLineChart1.destroy();
  }
  if (myLineChart2) {
    myLineChart2.destroy();
  }

  const tasksData = await getAllTasks(sprintId);
  let sprintDates = await getSprintDates();
  sprintStartDate = sprintDates[0];
  sprintEndDate = sprintDates[1];

  const totalDays = Math.ceil((sprintEndDate - sprintStartDate) / (24 * 60 * 60 * 1000));

  let totalStoryPoints = 0;

  // Calculate total story points
  tasksData.forEach((task) => {
    totalStoryPoints += parseInt(task.story_points); // Convert to integer
  });

  // Initialize remaining story points to total
  let remainingStoryPoints = new Array(totalDays + 1).fill(totalStoryPoints);

  // Update remaining story points based on task data
  tasksData.forEach((task) => {
    const taskStart = new Date(task.taskStartDate);
    const taskEnd = new Date(task.taskEndDate);
    const startIndex = Math.floor((taskStart - sprintStartDate) / (24 * 60 * 60 * 1000));
    const endIndex = Math.floor((taskEnd - sprintStartDate) / (24 * 60 * 60 * 1000));

    for (let i = endIndex + 1; i <= totalDays; i++) {
      remainingStoryPoints[i] -= parseInt(task.story_points); // Convert to integer
    }
  });

  // Generate ideal line
  const idealLine = [];
  for (let i = 0; i <= totalDays; i++) {
    idealLine.push((totalStoryPoints / totalDays) * (totalDays - i));
  }

  // Plotting the burndown chart (using Chart.js)
  const ctx1 = document.getElementById('myLineChart1').getContext('2d');
  myLineChart1 = new Chart(ctx1, {
    type: 'line',
    data: {
      labels: Array.from({ length: totalDays + 1 }, (_, i) => i),
      datasets: [
        {
          label: 'Remaining Story Points',
          data: remainingStoryPoints,
          borderColor: 'blue',
          fill: false,
        },
        {
          label: 'GuideLine',
          data: idealLine,
          borderColor: 'red',
          fill: false,
          borderDash: [5, 5],  // Makes the line dashed
          pointRadius: 0  // Removes points
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Burndown Chart',
          font: {
            size: 16,
          }
        },
        legend: {
          display: true,
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Days'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Remaining Story Points'
          }
        }
      }
    }
  });
  
  

  // Plotting the burn-up chart (using Chart.js)
  const ctx2 = document.getElementById('myLineChart2').getContext('2d');
  myLineChart2 = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: Array.from({ length: totalDays + 1 }, (_, i) => i),
      datasets: [
        {
          label: 'Completed Story Points',
          data: idealLine.map((value, index) => totalStoryPoints - remainingStoryPoints[index]),
          borderColor: 'green',
          fill: false,
        },
        {
          label: 'Total Story Points',
          data: Array.from({ length: totalDays + 1 }, () => totalStoryPoints),
          borderColor: 'orange',
          fill: false,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Burnup Chart',
          font: {
            size: 16,
          }
        },
        legend: {
          display: true,
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Days'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Completed Story Points'
          }
        }
      }
    }
  });
}

window.onload = function() {
  generateGraph();
};
  
// Check if user is logged in
auth.onAuthStateChanged(user => {
  if (!user) {
    alert('Please login or register an account. You will be redirected to the login page.');
    window.location.href = "login.html";
  } else {
    console.log('User logged in: ', user);
  }
});