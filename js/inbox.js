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
let saveChanges = document.querySelector("#edit form");

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
                <button class="edit btn btn-info text-white" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                <button class="delete btn btn-outline-danger">Delete</button>
            </td>
        </tr>
        `
        tableBody.innerHTML += tr;
        i++;
    }

    // Edit
    let editButtons = document.querySelectorAll(".edit");
    editButtons.forEach(edit => {
        edit.addEventListener("click", () => {
            let inboxId = edit.parentElement.parentElement.dataset.id;
            inboxRef.child(inboxId).get().then((snapshot => {
                //console.log(snapshot.val());

                document.getElementById("customerName").value = snapshot.val().name;
                document.getElementById("companyName").value = snapshot.val().companyName;
                document.getElementById("email").value = snapshot.val().email;
                document.getElementById("phone").value = snapshot.val().phone;
                document.getElementById("message").value = snapshot.val().message;
                document.getElementById("service").value = snapshot.val().service;
                document.getElementById("status").value = snapshot.val().status;
                document.getElementById("date").value = snapshot.val().dateSubmitted;
            }))

            saveChanges.addEventListener("submit", (event) => {
                event.preventDefault();

                console.log('Update Button Clicked');

                // Update form without uploading new photos
                inboxRef.child(inboxId).update({
                    status: document.getElementById("status").value,
                }).then((onFullFilled) => {
                    alert("Status Updated");
                    console.log('Status Updated');
                    location.reload();
                }, (onRejected) => {
                    console.log(onRejected);
                });
                
            })


        })
    })

    //Delete Function Goes Here
    let deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach(deleteBtn => {
        deleteBtn.addEventListener("click", () => {
            let inboxId = deleteBtn.parentElement.parentElement.dataset.id;

            inboxRef.child(inboxId).remove().then(() => {
                // alert("Deleted");
                console.log('Inbox Deleted');
                alert('Inbox Deleted');
                location.reload();
            });
        });
    });
});