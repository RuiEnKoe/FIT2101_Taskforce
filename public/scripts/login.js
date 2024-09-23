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
const provider = new firebase.auth.GoogleAuthProvider();
console.log(firebaseApp);

const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessageDiv = document.getElementById('error-message');

// Listen for form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Clear any existing error messages
    errorMessageDiv.textContent = '';

    const email = emailInput.value;
    const password = passwordInput.value;

    // Firebase authentication
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('User signed in:', user);
        // You can redirect the user to another page here, if needed
        // Redirect the user to another page (e.g., "dashboard.html")
        localStorage.setItem('email', email);
        window.location.href = "index.html";
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Error:', errorCode, errorMessage);

        // Display the error message in the login container
        errorMessageDiv.textContent = errorMessage;
    });
});

// document.addEventListener("DOMContentLoaded", function() {
//     // Your existing JavaScript code (if any)
  
//     // Add a click event listener to the "Register" button
//     const registerButton = document.getElementById("register-button");
//     if (registerButton) {
//       registerButton.addEventListener("click", function() {
//         window.location.href = "register.html";
//       });
//     }
//   });

function forgotPassword(){
  const emailInput = document.getElementById('email');
  const email = emailInput.value;
  firebase.auth().sendPasswordResetEmail(email)
  .then(function() {
    // Password reset email sent.
    const errorMessage = "Password reset email sent. Please check your inbox.";
    console.log('Success');

    // Display the error message in the login container
    errorMessageDiv.textContent = errorMessage;
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

const googleButton = document.getElementById('googleLogin');

googleButton.addEventListener('click', () => {
  auth.signInWithPopup(provider);
});

auth.onAuthStateChanged(user => {
  if (user) {
    console.log('User logged in: ', user);
    window.location.href = "index.html";
  } else {
    console.log('User logged out');
  }
});