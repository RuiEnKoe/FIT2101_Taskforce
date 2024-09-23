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
const rightCardContainer = document.getElementById('rightCardContainer');
const middleCardContainer = document.getElementById('middleCardContainer');

const urlParams = new URLSearchParams(window.location.search);
const entryId = urlParams.get('id');

// Find the anchor tag by its ID and update its href attribute
const sprintChartLink = document.getElementById('sprintChartLink');
sprintChartLink.href = `sprintChart.html?id=${entryId}`;

if (entryId) {
  db.collection("tasks").doc(entryId).get().then((doc) => {
    if (doc.exists) {
      
    } else {
      console.log("No such document!");
    }
  });
}

const priorityMapping = {
  "Urgent": 1,
  "Important": 2,
  "Medium": 3,
  "Low": 4
  };

function renderTasksLeft() {
  // Clear existing tasks
  leftCardContainer.innerHTML = '';

  // Build the query
  let query = collectionRef.where('parentid', '==', entryId.toString()).where('status', '==', 'Not Started');

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
      card.addEventListener('dragstart', (e) => {
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

      if (data.story_points == 1) {
        storyPlaceholder = "Story Point: ";
      } else {
        storyPlaceholder = "Story Points: ";
      }

      // Populate card with data
      card.innerHTML = `
      <a href="details.html?id=${doc.id}">
          <div class="${priorityClass}">  ${data.priority}</div> 
          <div class="TaskTitle">${data.title}</div>
          <div class="TaskStoryPoints">${storyPlaceholder}${data.story_points}</div>
          <div class="TaskTags">${data.tags}</div>
      </a>
      `;
      // Append card to container
      leftCardContainer.appendChild(card);
    });
  });
}

function renderTasksMiddle() {
  // Clear existing tasks
  middleCardContainer.innerHTML = '';

  // Build the query
  let query = collectionRef.where('parentid', '==',  entryId.toString()).where('status', '==', 'In Progress');

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
      
      card.addEventListener('dragstart', (e) => {
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

      if (data.story_points == 1) {
        storyPlaceholder = "Story Point: ";
      } else {
        storyPlaceholder = "Story Points: ";
      }

      // Populate card with data
      card.innerHTML = `
      <a href="details.html?id=${doc.id}">
          <div class="${priorityClass}">  ${data.priority}</div> 
          <div class="TaskTitle">${data.title}</div>
          <div class="TaskStoryPoints">${storyPlaceholder}${data.story_points}</div>
          <div class="TaskTags">${data.tags}</div>
      </a>
      `;
      // Append card to container
      middleCardContainer.appendChild(card);
    });
  });
}

function renderTasksRight() {
  // Clear existing tasks
  rightCardContainer.innerHTML = '';

  // Build the query
  let query = collectionRef.where('parentid', '==',  entryId.toString()).where('status', '==', 'Completed');

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

      card.addEventListener('dragstart', (e) => {
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

      if (data.story_points == 1) {
        storyPlaceholder = "Story Point: ";
      } else {
        storyPlaceholder = "Story Points: ";
      }

      // Populate card with data
      card.innerHTML = `
      <a href="details.html?id=${doc.id}">
          <div class="${priorityClass}">  ${data.priority}</div> 
          <div class="TaskTitle">${data.title}</div>
          <div class="TaskStoryPoints">${storyPlaceholder}${data.story_points}</div>
          <div class="TaskTags">${data.tags}</div>
      </a>
      `;
      // Append card to container
      rightCardContainer.appendChild(card);
    });
  });
}

renderTasksLeft();
renderTasksMiddle();
renderTasksRight();
renderStatus();

// Helper function to determine status based on container
function getStatusFromContainer(container) {
  if (container === leftCardContainer) {
      return 'Not Started';
  } else if (container === middleCardContainer) {
      return 'In Progress';
  } else if (container === rightCardContainer) {
      return 'Completed';
  }
}

[leftCardContainer, middleCardContainer, rightCardContainer].forEach((container) => {
  // Add a drag over event listener to the container to allow dropping
  container.addEventListener('dragover', (e) => {
      e.preventDefault();
  });

  // Add a drop event listener to the container to handle the drop action
  container.addEventListener('drop', (e) => {
      e.preventDefault();

      const taskId = e.dataTransfer.getData('text/plain');

      // Determine status based on container
      const status = getStatusFromContainer(container);

      // Update the status of the task
      const taskRef = db.collection('tasks').doc(taskId);
      taskRef.update({
          status: status
      })
      .then(() => {
          renderTasksLeft();
          renderTasksMiddle();
          renderTasksRight();
      })
      .catch((error) => {
          alert("Error updating the status of the task!");
          console.error("Error updating task status: ", error);
      });
  });
});

window.onload = function() {
  // Check for the 'reload' flag
  if (sessionStorage.getItem('reload') === 'true') {
    sessionStorage.removeItem('reload');  // Remove the flag so we don't keep reloading
    window.location.reload();  // Reload the page
  }
}

function goBack() {
  sessionStorage.setItem('reload', 'true');
  window.history.back();
}

function startSprint() {
  const collectionRef = db.collection('tasks');
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
    const taskRef = db.collection('tasks').doc(entryId);
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

function endSprint() {
  const taskRef = db.collection('tasks').doc(entryId);
  
  taskRef.get().then((doc) => {
    if (!doc.exists) {
      alert("Error: Task not found!");
      return;
    }

    const data = doc.data();

    if (data.status !== 'In Progress') {
      alert("The sprint has not started, hence it can't be ended!");
      return;
    }

    const currentTime = new Date();
    taskRef.update({
        end_date: currentTime,
        status: 'Completed'
    })
    .then(() => {
        renderStatus();
        alert("Sprint ended successfully")
        console.log("Sprint ended successfully!");
    })
    .catch((error) => {
        alert("Error ending sprint!")
        console.error("Error updating end date: ", error);
    });
  })
  .catch((error) => {
      alert("Error fetching task status!");
      console.error("Error fetching task status: ", error);
  });
}

function deleteSprint() {
  const batch = db.batch();

  // Delete the main entry
  const docRef = db.collection('tasks').doc(entryId);
  batch.delete(docRef);

  // Query and delete all entries with a parentid of entryId
  db.collection('tasks').where('parentid', '==', entryId.toString()).get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Commit the batch
      return batch.commit();
    })
    .then(() => {
      console.log("Documents successfully deleted!");
      alert("Data deleted successfully");
      sessionStorage.setItem('reload', 'true');
      window.history.back();
    })
    .catch(error => {
      console.error("Error removing documents: ", error);
      alert("Error deleting data");
    });
}

function renderStatus() {
  const statusContainer = document.getElementById('statusContainer');
    // Fetch the specific sprint document by its entryId
    collectionRef.doc(entryId).get().then((doc) => {
      if (doc.exists) {
          const data = doc.data();
          const sprintStatus = data.status;

          // Update the status container with the sprint's status
          statusContainer.innerHTML = `Sprint Status: ${sprintStatus}`;
      } else {
          statusContainer.innerHTML = 'Sprint Status: not found.';
      }
  }).catch((error) => {
      console.error("Error fetching sprint: ", error);
      statusContainer.innerHTML = 'Error fetching sprint status.';
  });
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
