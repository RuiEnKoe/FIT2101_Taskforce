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

// Reference to Firestore collection
const collectionRef = db.collection('tasks');

// Reference to Firestore collection
const usersCollection = firebase.firestore().collection('users');

// Reference to sidebar div in HTML
const sidebarDiv = document.querySelector('.sidebar');

function roundToTwoDecimalPlaces(num) {
  return Math.round(num * 100) / 100;
}

// Render User Information
usersCollection.get().then(async (snapshot) => {
  for (const doc of snapshot.docs) {
      const userData = doc.data();

      // Fetch tasks for the user and get their hours
      const [, taskHours] = await getTasks(userData.username);
      const totalHoursRaw = taskHours.reduce((acc, hours) => acc + hours, 0);  // Sum up the hours
      userData.contributionTime = roundToTwoDecimalPlaces(totalHoursRaw);


      const userDiv = document.createElement('div');
      userDiv.className = 'user';

      userDiv.innerHTML = `
          <p class="user-name-style">${userData.username}</p>
          <p class="email-style">${userData.email}</p>
          <p class="contribution-style">${userData.contributionTime}</p>
          <button onclick="editUsername('${userData.email}', '${userData.username}')" class="custom-button">Edit Username</button>
          <button onclick="generateGraph('${userData.username}')" class="custom-button2">Generate Graph</button>
          <button onclick="removeUser('${userData.email}', '${userData.username}')" class="custom-button3">Remove</button>
      `;

      sidebarDiv.appendChild(userDiv);

      // Set up a real-time listener for username changes
      const userDocRef = usersCollection.doc(doc.id);
      userDocRef.onSnapshot((snapshot) => {
          const updatedUsername = snapshot.data().username;
          const usernameElement = userDiv.querySelector('.user-name-style');
          usernameElement.textContent = updatedUsername;
      });
  }
}).catch((error) => {
  console.log("Error fetching user data:", error);
});


async function getTasks(username) {
const returnTaskTitle = [];
const returnTaskHours = [];

try {
  const taskQuerySnapshot = await db.collection('tasks').where('member', '==', username).get();
  taskQuerySnapshot.forEach((taskDoc) => {
    const taskData = taskDoc.data();
    if (taskData.status == "Completed") {
      returnTaskTitle.push(taskData.title);
      returnTaskHours.push(taskData.hours_spent);
    }
  });
} catch (error) {
  console.log("Error getting tasks: ", error);
}
return [returnTaskTitle, returnTaskHours];
}


let myChart;
async function generateGraph(username) {
document.getElementById('closeButton').style.display = 'block';

  // Destroy the old charts if they exist
if (myChart) {
  myChart.destroy();
}
const [taskTitles, taskHours] = await getTasks(username);

const ctx = document.getElementById('myChart').getContext('2d');
myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: taskTitles,
    datasets: [{
      label: 'Task Hours',
      data: taskHours,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      title: {
        display: true,
        text: 'Total Contribution for ' + username,
        fontSize: 16,
      }
    },
    scales: {
      x:{
        title: {
          display: true,
          text: 'Task Title'
        }
      },
      y:{
        title: {
          display: true,
          text: 'Hours Spent'
        },
        beginAtZero: true
      }
    }
  }
});
}

function closeTheChart() {
  document.getElementById('closeButton').style.display = 'none';
  myChart.destroy();
}

function editUsername(email, currentUsername) {
  const newUsername = prompt("Enter the new username:", currentUsername);

  if (newUsername !== null) {
    // Update the username in Firestore
    usersCollection.doc(email).update({
      username: newUsername
    }).then(() => {
      console.log("Username updated");
      
      // Update the username directly in the DOM
      const userDiv = document.querySelector(`.user[data-email="${email}"]`);
      const usernameElement = userDiv.querySelector('.user-name-style');
      usernameElement.textContent = newUsername;
      
    }).catch((error) => {
      console.error("Error updating username: ", error);
    });
  }
}

function updateAdminStatus(email, isAdmin) {
  usersRef.doc(email).update({
    admin: isAdmin
  }).then(() => {
    console.log("Admin status updated");
    // Refresh the user cards to reflect the change
    viewUsers();
  }).catch((error) => {
    console.error("Error updating admin status: ", error);
  });
}

function goBack() {
  window.location.href = "user.html";
}

async function removeUser(email, username) {

  const isConfirmed = window.confirm(`Are you sure you want to delete the account with email: ${email}? This action is irreversible and the email cannot be used again.`);

    if (!isConfirmed) {
        console.log("User chose not to delete the account.");
        return;  // Exit the function if user cancels
    }
  try {
      // 1. Remove all the documents inside the 'tasks' collection where the 'member' field is the given username
      const tasksQuerySnapshot = await collectionRef.where('member', '==', username).get();
      const batch = db.batch();
      tasksQuerySnapshot.forEach(doc => {
          batch.delete(doc.ref);
      });
      await batch.commit();

      // 2. Remove the user from the 'users' collection using the email as the document ID
      await usersCollection.doc(email).delete();

      console.log(`User with email ${email} and all their tasks have been removed.`);
      window.location.reload()
  } catch (error) {
      console.error("Error removing user and their tasks:", error);
  }
}