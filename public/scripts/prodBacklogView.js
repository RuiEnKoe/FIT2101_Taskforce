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
const priorityMapping = {
  "Urgent": 1,
  "Important": 2,
  "Medium": 3,
  "Low": 4
};


// Function to render tasks
function renderTasks(tags = []) {
    // Clear existing tasks
    cardContainer.innerHTML = '';
    
    // Build the query
    let query = collectionRef.where('parentid', '==', 'prodBacklog');
    if (tags.length) {
        query = query.where('tags', 'array-contains-any', tags);
    }
    
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
            <div class="TaskTitle">${data.title}</div>
            <div class="${priorityClass}">  ${data.priority}</div> 
            <div class="TaskStoryPoints">${data.story_points} / 10</div>
            <div class="TaskTags">${data.tags}</div>
        </a>
        `;
        // Append card to container
        cardContainer.appendChild(card);
    });
  });
}

// Initial rendering
renderTasks();

// Filtering logic
document.getElementById('filterTags').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('#filterTags input[type="checkbox"]:checked');
    const selectedTags = Array.from(checkboxes).map(cb => cb.value);
    renderTasks(selectedTags);
});

window.onload = function() {
    // Check for the 'reload' flag
    if (sessionStorage.getItem('reload') === 'true') {
      sessionStorage.removeItem('reload');  // Remove the flag so we don't keep reloading
      window.location.reload();  // Reload the page
    }
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