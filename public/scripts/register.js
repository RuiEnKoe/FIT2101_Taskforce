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
console.log(firebaseApp);
let usersRef;
// function register(){
//     usersRef = db.collection('users');
//     const emailInput = document.getElementById('email');
//     const userCredentialInput = document.getElementById('username');
//     const passwordInput = document.getElementById('password');
//     const errorMessageDiv = document.getElementById('error-message');

//     if(!validateFields(emailInput.value)){
//         errorMessageDiv.textContent = "Please enter an email";
//         return;
//     } 
//     if(!validateFields(userCredentialInput.value)){
//         errorMessageDiv.textContent = "Please enter a username";
//         return;
//     }
//     if(!validateFields(passwordInput.value)){
//         errorMessageDiv.textContent = "Please enter a password";
//         return;
//     }
//     if(!validateEmail(emailInput.value)){
//         errorMessageDiv.textContent = "Please enter a valid email";
//         return;
//     }
//     if(!validatePassword(passwordInput.value)){
//         errorMessageDiv.textContent = "Password must be at least 6 characters long";
//         return;
//     }
    
//     firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
//     .then((userCredential) => {
//         // Signed in
//         const user = userCredential.user;
//         console.log('New user created:', user);
//         // add this user to firebase database
//         usersRef.doc(emailInput.value).set({
//             email: emailInput.value,
//             username: userCredentialInput.value,
//             createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//             lastLoginAt: firebase.firestore.FieldValue.serverTimestamp(),
//             admin: false,
//         })
//         .then(() => {
//             console.log("User data successfully written to Firestore");
//             localStorage.setItem('email', emailInput.value);
//             window.location.href = "adminView.html";
//         })
//         .catch((error) => {
//             console.log("Failed to write user data to Firestore: ", error);
//         });

//     })
//     .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         errorMessageDiv.textContent = errorMessage;
//         console.log('Error:', errorCode, errorMessage);
//     });
// }

function createNewUserWithoutSigningIn() {
    usersRef = db.collection('users');
    const emailInput = document.getElementById('email');
    const userCredentialInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessageDiv = document.getElementById('error-message');

    if (!validateFields(emailInput.value)) {
        errorMessageDiv.textContent = "Please enter an email";
        return;
    } 
    if (!validateFields(userCredentialInput.value)) {
        errorMessageDiv.textContent = "Please enter a username";
        return;
    }
    if (!validateFields(passwordInput.value)) {
        errorMessageDiv.textContent = "Please enter a password";
        return;
    }
    if (!validateEmail(emailInput.value)) {
        errorMessageDiv.textContent = "Please enter a valid email";
        return;
    }
    if (!validatePassword(passwordInput.value)) {
        errorMessageDiv.textContent = "Password must be at least 6 characters long";
        return;
    }

    // Remember the current admin credentials
    const currentAdminEmail = "admin@gmail.com";
    const currentAdminPassword = "123456";

    firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('New user created:', user);

            // Add this user to firebase database
            return usersRef.doc(emailInput.value).set({
                email: emailInput.value,
                username: userCredentialInput.value,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLoginAt: firebase.firestore.FieldValue.serverTimestamp(),
                admin: false,
            });
        })
        .then(() => {
            console.log("User data successfully written to Firestore");
            // Now, sign back in as the admin
            window.location.href = "AdminView.html";
            return firebase.auth().signInWithEmailAndPassword(currentAdminEmail, currentAdminPassword);
        })
        .then(() => {
            console.log('Admin signed back in');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            errorMessageDiv.textContent = errorMessage;
            console.log('Error:', errorCode, errorMessage);
        });
}


function validateEmail(email){
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password){
  if (password.length < 6) {
    return false;
  }
  return true;
}

function validateFields(field){
    if (field == null){
        return false;
    }
    if (field.length == 0){
        return false;
    }
    return true;
}

function goBack(){
    window.location.href = "AdminView.html";
}