const firebaseConfig = {
    apiKey: "AIzaSyAkj0H1ecGm41CEiyyWDxkC-WZ0B20ZADY",
    authDomain: "sunergy-4b6d0.firebaseapp.com",
    databaseURL: "https://sunergy-4b6d0-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sunergy-4b6d0",
    storageBucket: "sunergy-4b6d0.appspot.com",
    messagingSenderId: "724597515303",
    appId: "1:724597515303:web:6bddc00b7e17d7d3ee1a02",
    measurementId: "G-KY5QTKQZPD"
};

firebase.initializeApp(firebaseConfig);

// Initialize variables
let tableBody = document.querySelector("#appointment tbody");
let saveChanges = document.querySelector("#edit form");
let addAppointment = document.querySelector("#addAAppoinment"),
    addform = document.querySelector("#add form");

const appointmentRef = firebase.database().ref('Appointment');
const database = firebase.database();

// Create a new Date object
const currentDate = new Date();

// Get the current date components
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
const day = currentDate.getDate();

// Format the date as desired (e.g., YYYY-MM-DD)
const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

function createProject(appointmentDate, appointmentTime, custName, custPhone, serviceType) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!dateRegex.test(appointmentDate)) {
        console.log('Error: Appointment Date must be a formatted date');
        return;
    }

    if (!timeRegex.test(appointmentTime)) {
        console.log('Error: Appointment Time must be a formatted time');
        return;
    }

    if (typeof custName !== 'string' || custName.trim().length === 0) {
        console.log('Error: Customer Name must be a non-empty string');
        return;
    }

    if (typeof custPhone !== 'string' || custPhone.trim().length === 0) {
        console.log('Error: Customer Phone must be a non-empty string');
        return;
    }

    // Add the user's information to the Realtime Database
    generateId().then(function (appointmentId) {
        console.log("Generated new appointment ID:", appointmentId);

        database.ref('Appointment/' + appointmentId).set({
            appointmentDate: appointmentDate,
            appointmentTime: appointmentTime,
            custName: custName,
            custPhone: custPhone,
            serviceType: serviceType,
            createdDate: formattedDate,
            appointmentStatus: 'Pending',
        }).then(function () {
            alert("Appointment Created!");
            console.log("Appointment Created!");
            location.reload();
        }).catch(function (error) {
            console.log("Error saving appointment data:", error);
        });


    }).catch(function (error) {
        console.log("Error generating new appointment ID:", error);
    });
}

function initializeDataTable() {
    $('#appointmentTable').DataTable();
}

//Read Data
appointmentRef.on('value', (snapshot) => {
    const appointments = snapshot.val();

    tableBody.innerHTML = "";

    let i = 1;

    for (appointment in appointments) {
        let tr = `
        <tr data-id = ${appointment}>
            <td>${i}.</th>
            <td>${appointment}</td>
            <td>${appointments[appointment].appointmentDate}</td>
            <td>${appointments[appointment].appointmentTime}</td>
            <td>${appointments[appointment].custName}</td>
            <td>${appointments[appointment].custPhone}</td>
            <td>${appointments[appointment].serviceType}</td>
            <td>${appointments[appointment].appointmentStatus}</td>
            <td>${appointments[appointment].createdDate}</td>
            <td>
                <button class="edit btn btn-info text-white mb-2 mb-lg-0" data-bs-toggle="modal" data-bs-target="#editModal">
                    <span class="d-none d-lg-block">Edit</span>
                    <i class="fa-solid fa-pen-to-square d-block d-lg-none"></i>
                </button>
                <button class="delete btn btn-outline-danger">
                    <span class="d-none d-lg-block">Delete</span>
                    <i class="fa-solid fa-trash d-block d-lg-none"></i>
                </button>
            </td>
        </tr>
        `
        tableBody.innerHTML += tr;
        i++;
    }

    initializeDataTable();


    // Edit
    let editButtons = document.querySelectorAll(".edit");
    editButtons.forEach(edit => {
        edit.addEventListener("click", () => {
            let appointmentId = edit.parentElement.parentElement.dataset.id;
            appointmentRef.child(appointmentId).get().then((snapshot => {
                //console.log(snapshot.val());

                document.getElementById("appointmentDate1").value = snapshot.val().appointmentDate;
                document.getElementById("appointmentTime1").value = snapshot.val().appointmentTime;
                document.getElementById("custName1").value = snapshot.val().custName;
                document.getElementById("custPhone1").value = snapshot.val().custPhone;
                document.getElementById("serviceType1").value = snapshot.val().serviceType;
                document.getElementById("status").value = snapshot.val().appointmentStatus;
            }))

            saveChanges.addEventListener("submit", (event) => {
                event.preventDefault();

                console.log('Update Button Clicked');

                // Update form without uploading new photos
                appointmentRef.child(appointmentId).update({
                    appointmentStatus: document.getElementById("status").value,
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
            let appointmentId = deleteBtn.parentElement.parentElement.dataset.id;

            appointmentRef.child(appointmentId).remove().then(() => {
                // alert("Deleted");
                console.log('Appointment Deleted');
                alert('Appointment Deleted');
                location.reload();
            });
        });
    });
});

addAppointment.addEventListener("click", () => {

    addform.addEventListener("submit", (e) => {
        e.preventDefault();

        createProject(document.getElementById("appointmentDate").value, document.getElementById("appointmentTime").value, document.getElementById("custName").value, document.getElementById("custPhone").value, document.getElementById("serviceType").value);

    });
});

function generateId() {
    return new Promise(function (resolve, reject) {
        var ref = firebase.database().ref("Appointment");

        ref.once("value")
            .then(function (dataSnapshot) {
                var lastSequenceNumber = 0;
                dataSnapshot.forEach(function (transactionSnapshot) {
                    var appointmentID = transactionSnapshot.key;
                    if (appointmentID != null && appointmentID.startsWith("A")) {
                        var sequenceNumber = parseInt(appointmentID.substring(1));
                        if (!isNaN(sequenceNumber) && sequenceNumber > lastSequenceNumber) {
                            lastSequenceNumber = sequenceNumber;
                        }
                    }
                });
                var nextSequenceNumber = lastSequenceNumber + 1;
                var paddedSequenceNumber = String(nextSequenceNumber).padStart(5, "0");
                let newAppointmentId = "A" + paddedSequenceNumber;
                resolve(newAppointmentId);
            })
            .catch(function (error) {
                // Handle error
                console.log(error);
                reject(error);
            });
    });
}