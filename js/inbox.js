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
let tableBody = document.querySelector("#contactUs tbody");

const inboxRef = firebase.database().ref('ContactMessage');

//Read Data
inboxRef.on('value', (snapshot) => {
    const inboxes = snapshot.val();

    tableBody.innerHTML = "";

    let i = 1;

    for (inbox in inboxes) {
        let tr = `
        <tr data-id = ${inbox}>
            <td>${i}.</td>
            <td>${inbox}</td>
            <td>${inboxes[inbox].name}</td>
            <td>${inboxes[inbox].companyName}</td>
            <td>${inboxes[inbox].phone}</td>
            <td>${inboxes[inbox].email}</td>
            <td>${inboxes[inbox].service}</td>
            <td>
                <span class="d-inline-block text-truncate" style="max-width: 100px;">
                    ${inboxes[inbox].message}
                </span>
            </td>
            <td>${inboxes[inbox].status}</td>
            <td>01-01-2023</td>
            <td>
                <button class="btn btn-info text-white" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                <button class="btn btn-outline-danger">Delete</button>
            </td>
        </tr>
        `
        tableBody.innerHTML += tr;
        i++;
    }

    //Edit Function Goes Here

    //Delete Function Goes Here

});