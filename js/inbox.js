// Initialize variables
let tableBody = document.querySelector("#contactUs tbody");
let saveChanges = document.querySelector("#edit form");

const inboxRef = firebase.database().ref('ContactMessage');

let inboxCount = 0;
let itemsPerPage = 10;
let currentPage = 1;

let totalInboxs = 0;


// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(totalInboxs / itemsPerPage);
    const paginationList = document.getElementById("paginationList");
    paginationList.innerHTML = ""; // Clear previous pagination links

    for (let page = 1; page <= totalPages; page++) {
        const li = document.createElement("li");
        li.classList.add("page-item");
        if (page === currentPage) {
            li.classList.add("active");
        }

        const a = document.createElement("a");
        a.classList.add("page-link");
        a.href = "#";
        a.textContent = page;
        a.addEventListener("click", () => {
            currentPage = page;
            retrieveDataForPage(currentPage);
            updatePagination();
        });

        li.appendChild(a);
        paginationList.appendChild(li);
    }
}

// Retrieve data and populate table based on pagination
function retrieveDataForPage(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    tableBody.innerHTML = "";

    let i = startIndex + 1;

    for (let j = startIndex; j < endIndex && j < inboxsArray.length; j++) {
        const [inbox, inboxData] = inboxsArray[j];

        let tr = `
        <tr data-id = ${inbox}>
            <td>${i}.</td>
            <td>${inbox}</td>
            <td>${inboxData.name}</td>
            <td>${inboxData.phone}</td>
            <td>${inboxData.email}</td>
            <td>${inboxData.service}</td>
            <td>${inboxData.dateSubmitted}</td>
            <td>
                <button class="edit btn btn-info text-white mb-2 mb-lg-0" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <span class="d-none d-lg-block">View</span>    
                    <i class="fa-solid fa-expand d-block d-lg-none"></i>
                </button>
                <button class="delete btn btn-outline-danger">
                    <span class="d-none d-lg-block">Delete</span>
                    <i class="fa-solid fa-trash d-block d-lg-none"></i>
                </button>
            </td>
        </tr>
      `;

        tableBody.innerHTML += tr;
        i++;
    }
    updateEditAndDeleteButtonListeners();
}

// Retrieve data and populate array
function retrieveData() {
    inboxRef.on("value", (snapshot) => {
        const inboxs = snapshot.val();
        inboxsArray = Object.entries(inboxs);
        totalInboxs = inboxsArray.length;
        currentPage = 1; // Reset to the first page
        retrieveDataForPage(currentPage);
        updatePagination();
    });
}

retrieveData();

function updateEditAndDeleteButtonListeners() {
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
    });

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
}

// Call the function to update the event listeners
updateEditAndDeleteButtonListeners();

let searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
    filterTable(searchInput.value);
});

function filterTable(searchQuery) {
    let table = document.getElementById("inboxTable"); // Replace "yourTableId" with the actual ID of your table
    let rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        let row = rows[i];
        let rowData = row.textContent || row.innerText;

        if (rowData.toLowerCase().includes(searchQuery.toLowerCase())) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    }
}

const entriesPerPageSelect = document.getElementById("entriesPerPage");
entriesPerPageSelect.addEventListener("change", () => {
    itemsPerPage = parseInt(entriesPerPageSelect.value);
    currentPage = 1; // Reset to the first page
    retrieveDataForPage(currentPage);
    updatePagination();
});