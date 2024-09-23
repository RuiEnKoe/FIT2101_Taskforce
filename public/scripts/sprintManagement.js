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

// Reference to the card container
const leftCardContainer = document.getElementById('leftCardContainer');

// Priority mapping for sorting
const priorityMapping = {
"Urgent": 1,
"Important": 2,
"Medium": 3,
"Low": 4
};

const statusMapping = {
  "Not Started": 1,
  "In Progress": 2,
  "Completed": 3
  };


  function renderTasks() {
    // Clear existing tasks
    leftCardContainer.innerHTML = '';
  
    // Build the query
    let query = collectionRef.where('parentid', '==', 'prodBacklog');
  
    // Execute the query
    query.get().then((snapshot) => {
      // Convert snapshot to array and sort based on priority
      const tasks = snapshot.docs.sort((a, b) => priorityMapping[a.data().priority] - priorityMapping[b.data().priority]);
  
      tasks.forEach((doc) =>  {
        // Get data from Firestore
        const data = doc.data();
  
        // Create card element
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true;
  
        // Add a drag start event listener
        card.addEventListener('dragstart', (e) => {
          if (!sprintSelected) {
            e.preventDefault(); // Prevent dragging if sprint is not selected
            return;
          }
          e.dataTransfer.setData('text/plain', doc.id); 
        });
  
        let priorityClass;
        if (data.priority == "Urgent") {
          priorityClass = "urgent";
        } else if (data.priority == "Important") {
          priorityClass = "important";
        } else if (data.priority == "Medium") {
          priorityClass = "medium";
        } else {
          priorityClass = "low";
        }
  
        // Populate card with data
        card.innerHTML = `
        <a href="prodDetails.html?id=${doc.id}">
            <div class="${priorityClass}">  ${data.priority}</div> 
            <div class="TaskTitle">${data.title}</div>
        </a>
        `;
        // Append card to container
        leftCardContainer.appendChild(card);
      });
    });
  }

let sprintSelected = false;

document.getElementById("titlesDropdown").addEventListener("change", handleDropdownChange);

function renderDropdown() {
  // Reference to Firestore collection
  const collectionRef = db.collection('tasks');

  // Build the query to fetch tasks with parentid as 'sprints'
  let query = collectionRef.where('parentid', '==', 'sprints');

  query.get().then((snapshot) => {
    const dropdown = document.getElementById('titlesDropdown');
    snapshot.forEach((doc) => {
      const data = doc.data();
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = data.title;
      dropdown.appendChild(option);
    });
  });
}

// Define a function to handle the dropdown change and the initial load
function handleDropdownChange() {
  const selectedParentId = String(document.getElementById("titlesDropdown").value);
  sprintSelected = selectedParentId !== "";
  renderTasksRight(selectedParentId);
}

// Attach the event listener for changes
document.getElementById("titlesDropdown").addEventListener("change", handleDropdownChange);

// Function to render tasks
function renderTasksRight(parentId) {
  const rightCardContainer = document.getElementById('rightCardContainer');
  // Clear existing tasks
  rightCardContainer.innerHTML = '';

  // Build the query
  let query = collectionRef.where('parentid', '==', parentId);

  // Execute the query
  query.get().then((snapshot) => {
    // Convert snapshot to array and sort based on status
    const tasks = snapshot.docs.sort((a, b) => statusMapping[a.data().status] - statusMapping[b.data().status]);

    tasks.forEach((doc) =>  {
      // Get data from Firestore
      const data = doc.data();

      // Create card element
      const card = document.createElement('div');
      card.className = 'card';
      card.draggable = true; 

      // Populate card with data
      card.innerHTML = `
      <a href="details.html?id=${doc.id}">
          <div class="TaskStatus">  ${data.status}</div> 
          <div class="TaskTitle">${data.title}</div>
      </a>
      `;
      // Append card to container
      rightCardContainer.appendChild(card);
    });
  });
}


function startSprint() {
  const selectedTaskId = document.getElementById("titlesDropdown").value;

  if (!selectedTaskId) {
      alert("Please select a task from the dropdown first.");
      return;
  }

  // Check if there's any task with parentid 'sprints' and status 'In Progress'
  collectionRef.where('parentid', '==', 'sprints').where('status', '==', 'In Progress').get()
  .then(snapshot => {
    if (!snapshot.empty) {
      // There's already a sprint in progress
      alert("There is already a sprint in progress. Please complete the ongoing sprint before starting a new one.");
      return;
    }

    // If no ongoing sprint, then start the sprint
    const currentTime = new Date();
    const taskRef = db.collection('tasks').doc(selectedTaskId);
    taskRef.update({
        start_date: currentTime,
        status: 'In Progress'
    })
    .then(() => {
        alert("Start date updated successfully")
        console.log("Start date updated successfully!");
    })
    .catch((error) => {
        alert("Error updating start date!")
        console.error("Error updating start date: ", error);
    });
  })
  .catch(error => {
    console.error("Error checking ongoing sprints: ", error);
  });
}

// Initial rendering
renderTasks();
renderDropdown();
handleDropdownChange();

window.onload = function() {
  // Check for the 'reload' flag
  if (sessionStorage.getItem('reload') === 'true') {
    sessionStorage.removeItem('reload');  // Remove the flag so we don't keep reloading
    window.location.reload();  // Reload the page
  }
}

// NEW PORTION OF CODE FOR RIGHT CARD DRAG AND DROP
const rightCardContainer = document.getElementById('rightCardContainer');

// Add a drag over event listener to the container to allow dropping
rightCardContainer.addEventListener('dragover', (e) => {
    e.preventDefault(); 
});

// Add a drop event listener to the container to handle the drop action
rightCardContainer.addEventListener('drop', (e) => {
    if (!sprintSelected) {
        e.preventDefault(); // Prevent dropping if sprint is not selected
        return;
    }

    const taskId = e.dataTransfer.getData('text/plain'); 

    // Update the parent ID of the task to move it to the sprint backlog
    const taskRef = db.collection('tasks').doc(taskId);
    taskRef.update({
        parentid: String(document.getElementById("titlesDropdown").value)
    })
    .then(() => {
        renderTasks(); 
        renderTasksRight(String(document.getElementById("titlesDropdown").value)); 
    })
    .catch((error) => {
        alert("Error moving the task to sprint backlog!");
        console.error("Error moving the task: ", error);
    });
});

// Check if user is logged in
auth.onAuthStateChanged(user => {
  if (!user) {
    alert('Please login or register an account. You will be redirected to the login page.');
    window.location.href = "login.html";
  } else {
    console.log('User logged in: ', user);
  }
});
