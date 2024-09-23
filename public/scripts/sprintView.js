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
const cardContainer = document.getElementById('cardContainer');

// Priority mapping for sorting
const statusMapping = {
    "Not Started": 1,
    "In Progress": 2,
    "Completed": 3
    };  

function createDate(date){
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return day + "/" + month + "/" + year;
}

// Function to render tasks
function renderTasks(tags = []) {
    // Clear existing tasks
    cardContainer.innerHTML = '';

    // Build the query
    let query = collectionRef.where('parentid', '==', 'sprints');
    
   // Execute the query
   query.get().then((snapshot) => {
    // Convert snapshot to array and sort based on priority
    const tasks = snapshot.docs.sort((a, b) => statusMapping[a.data().status] - statusMapping[b.data().status]);
    
    tasks.forEach((doc) =>  {   
        // Get data from Firestore
        const data = doc.data();
        // Create card element
        const card = document.createElement('div');
        card.className = 'card';
        let status;
        if (data.status == "Not Started") {
            status = "notStarted";
        } else if (data.status == "In Progress") {
            status = "inProgress";
        } else {
            status = "completed";
        }

        // Populate card with data
        const start_date = createDate(data.start_date.toDate());
        const end_date = createDate(data.end_date.toDate());

        const buttonPlaceholderHTML = '<div class="completeButtonPlaceholder"></div>';
        const buttonHTML = (data.status === "In Progress") ? '<button class="completeButton">Complete</button>' : buttonPlaceholderHTML;

        card.innerHTML = `
        <a href="SprintBoard.html?id=${doc.id}">
            <div class="SprintTitle">${data.title}</div>
            <div class="start_date">${start_date}</div>
            <div class="end_date">${end_date}</div>
            <div class="${status}">  ${data.status}</div>
            ${buttonHTML}
        </a>
        `;

        if (data.status === "In Progress") {
          const btn = card.querySelector('.completeButton');
          btn.addEventListener('click', function(event) {
              event.stopPropagation();  // Prevent event from bubbling up to the card
              event.preventDefault();  // Prevent the default action
              completeTask(doc.id);  // Call the function to update the task in Firestore
          });
        }
      
        // Attach click event to the card to handle the link navigation
        card.addEventListener('click', function() {
            window.location.href = `SprintBoard.html?id=${doc.id}`;
        });
        // Append card to container
        cardContainer.appendChild(card);
    });
  });
}

// Initial rendering
renderTasks();

window.onload = function() {
    // Check for the 'reload' flag
    if (sessionStorage.getItem('reload') === 'true') {
      sessionStorage.removeItem('reload');  // Remove the flag so we don't keep reloading
      window.location.reload();  // Reload the page
    }
  }

function completeTask(taskId) {
  // Get the current date
  const currentDate = new Date();

  // Update the Firestore document
  collectionRef.doc(taskId).update({
      end_date: currentDate,
      status: "Completed"
  })
  .then(() => {
      // Once the update is successful, re-render the tasks
      renderTasks();
  })
  .catch((error) => {
      console.error("Error updating the task: ", error);
      alert("Error updating task");
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