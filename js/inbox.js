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

            // Display a confirmation message
            const confirmation = confirm("Are you sure you want to delete this inbox?");

            if (confirmation) {
                // Delete the inbox
                inboxRef.child(inboxId).remove().then(() => {
                    console.log('Inbox Deleted');
                    alert('Inbox Deleted');
                    location.reload();
                }).catch((error) => {
                    console.log('Error deleting inbox:', error);
                });
            }
        });
    });
});