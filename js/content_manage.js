// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAkj0H1ecGm41CEiyyWDxkC-WZ0B20ZADY",
    authDomain: "sunergy-4b6d0.firebaseapp.com",
    databaseURL: "https://sunergy-4b6d0-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sunergy-4b6d0",
    storageBucket: "sunergy-4b6d0.appspot.com",
    messagingSenderId: "724597515303",
    appId: "1:724597515303:web:6bddc00b7e17d7d3ee1a02",
    measurementId: "G-KY5QTKQZPD"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize variables
let tableBody = document.querySelector("#Project tbody");
let addUser = document.querySelector(".add-user"),
  popup = document.querySelector(".popup"),
  addform = document.querySelector(".add form"),
  updateform = document.querySelector(".update form");

const database = firebase.database();
const projectRef = firebase.database().ref('Project');

// Write data to Authentication, Realtime and firestore
function createProject(ProjectId, email, password, name, phone, dob, position) {
    // Add the user's information to the Realtime Database
    database.ref('staffs/' + ProjectId).set({
        name: name,
        phone: phone,
        email: email,
        password: password,
        dob: dob,
        position: position,
    }).then((onFullFiled)=>{
        console.log("Writed");
    }, (onRejected)=>{
        console.log(onRejected);
    });
   
}

//createProject(123, 123, 123, 123, 123, 123, 123);
