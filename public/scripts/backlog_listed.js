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
let thingsRef;
let unsubscribe;

// Reference to Firestore collection
const collectionRef = db.collection('tasks');
// Reference to the card container
const cardContainer = document.getElementById('cardContainer');

// Query Firestore and render cards
collectionRef.get().then((snapshot) => {
    snapshot.forEach((doc) => {
        // Get data from Firestore
        const data = doc.data();

        // Create card element
        const card = document.createElement('div');
        card.className = 'card1';
        card.id = `card-${doc.id}`;

        // Populate card with data
        card.innerHTML = `
        <h3>${data.title}</h3>
        <p>Priority: ${data.priority}</p>
        <p>Story Points: #${data.story_points}</p>
        <p>Tags: ${data.tags}</p>
      `;

        // Append card to container
        cardContainer.appendChild(card);
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
