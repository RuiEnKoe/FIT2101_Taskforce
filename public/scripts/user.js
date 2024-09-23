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
const username = localStorage.getItem('email');
const provider = new firebase.auth.GoogleAuthProvider();
const usersRef = db.collection('users');

console.log(username)

if (username) {
  usersRef.doc(username).get().then((doc) => {
  if (doc.exists) {
    const data = doc.data();
    renderUserInfo(data.username, data.email, data.admin);
  } else {
    console.log("No such document!");
  }
}).catch((error) => {
  console.log("Error getting document:", error);
});
}


function goBackToUserInformation() {
  window.location.href = 'user.html';
}


// Function to render the user information on the page
function renderUserInfo(username, email, admin) {  
  const usernameElement = document.getElementById('username');
  const emailElement = document.getElementById('email');
  const roleElement = document.getElementById('role');
  const adminButton = document.querySelector('.button4');
  
  usernameElement.textContent = `${username}`;
  emailElement.textContent = `${email}`;
  if (admin === false) {
    roleElement.textContent = `User`;
  } else if(admin === true) {
    roleElement.textContent = `Admin`;
    adminButton.style.display = "inline-block";  // Display the button for admin users
  } else{
    roleElement.textContent = `User`;
  }
}


function editUsername(email, currentUsername) {
  const newUsername = prompt("Enter the new username:", currentUsername);

  if (newUsername !== null) {
    // Update the username in Firestore
    usersRef.doc(email).update({
      username: newUsername
    }).then(() => {
      console.log("Username updated");
      // Refresh the user cards to reflect the change
      viewUsers();
    }).catch((error) => {
      console.error("Error updating username: ", error);
    });
  }
}


function goBack() {
  window.location.href = "index.html";
}


function changePassword(){
  const emailElement = document.getElementById('email');
  const email = emailElement.textContent;
  console.log(email);
  firebase.auth().sendPasswordResetEmail(email)
      .then(function() {
        // Password reset email sent.
        const errorMessage = "Password reset email sent. Please check your inbox.";
        console.log('Success');
        alert(errorMessage);
        signOut();
      })
      .catch(function(error) {
        // An error happened.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Error:', errorCode, errorMessage);

        // Display the error message in the login container
        errorMessageDiv.textContent = errorMessage;
      });
}


function signOut(){
  auth.signOut().then(() => {
    alert('You have been signed out.');
    console.log('User signed out');
    window.location.href = "login.html";
  }).catch((error) => {
    console.error("Error signing out: ", error);
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

function goToAdminView() {
  window.location.href = "AdminView.html";
}