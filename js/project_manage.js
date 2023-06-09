// Initialize variables
let tableBody = document.querySelector("#Project tbody");
let addUser = document.querySelector("#addAProject"),
    popup = document.querySelector(".popup"),
    addform = document.querySelector("#add form"),
    saveChanges = document.querySelector("#edit form");

const database = firebase.database();
const projectRef = firebase.database().ref('Project');
var storageRef = firebase.storage().ref();

let projectCount = 0;
let itemsPerPage = 10;
let currentPage = 1;

let totalProjects = 0;

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(totalProjects / itemsPerPage);
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

    for (let j = startIndex; j < endIndex && j < projectsArray.length; j++) {
        const [project, projectData] = projectsArray[j];

        let tr = `
        <tr data-id=${project}>
          <td>${i}</td>
          <td>${project}</td>
          <td>${projectData.companyName}</td>
          <td>
            <span class="d-inline-block text-truncate" style="max-width: 150px;">
              ${projectData.companyCaption}
            </span>
          </td>
          <td>${projectData.generation}</td>
          <td>${projectData.treesPlanted}</td>
          <td>${projectData.CO2offset}</td>
          <td>
            <button class="edit btn btn-info text-white mb-2 mb-lg-0" data-bs-toggle="modal" data-bs-target="#exampleModal" id="edit">
              <span class="d-none d-lg-block">Edit</span>
              <i class="fa-solid fa-pen-to-square d-block d-lg-none"></i>
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

// function updateEditAndDeleteButtonListeners() {
//     let editButtons = document.querySelectorAll(".edit");
//     editButtons.forEach((edit) => {
//         edit.addEventListener("click", () => {
//             let projectId = edit.parentElement.parentElement.dataset.id;
//             // Rest of the edit functionality
//             // ...
//         });
//     });

//     let deleteButtons = document.querySelectorAll(".delete");
//     deleteButtons.forEach((deleteBtn) => {
//         deleteBtn.addEventListener("click", () => {
//             let projectId = deleteBtn.parentElement.parentElement.dataset.id;
//             // Rest of the delete functionality
//             // ...
//         });
//     });
// }

// Retrieve data and populate array
function retrieveData() {
    projectRef.on("value", (snapshot) => {
        const projects = snapshot.val();
        projectsArray = Object.entries(projects);
        totalProjects = projectsArray.length;
        currentPage = 1; // Reset to the first page
        retrieveDataForPage(currentPage);
        updatePagination();
    });
}

retrieveData();

function createProject(companyName, companyCaption, generation, treesPlanted, CO2offset, description, images) {
    if (typeof companyName !== 'string' || companyName.trim().length === 0) {
        console.log('Error: companyName must be a non-empty string');
        return;
    }

    if (typeof companyCaption !== 'string' || companyCaption.trim().length === 0) {
        console.log('Error: companyCaption must be a non-empty string');
        return;
    }

    const parsedGeneration = parseInt(generation);
    if (isNaN(parsedGeneration) || parsedGeneration <= 0) {
        console.log('Error: generation must be a positive integer');
        return;
    }

    const parsedTreesPlanted = parseInt(treesPlanted);
    if (isNaN(parsedTreesPlanted) || parsedTreesPlanted <= 0) {
        console.log('Error: treesPlanted must be a positive integer');
        return;
    }

    const parsedCO2Offset = parseInt(CO2offset);
    if (isNaN(parsedCO2Offset) || parsedCO2Offset <= 0) {
        console.log('Error: CO2offset must be a positive integer');
        return;
    }

    if (typeof description !== 'string' || description.trim().length === 0) {
        console.log('Error: description must be a non-empty string');
        return;
    }

    if (!Array.isArray(images) || images.length === 0) {
        console.log('Error: images must be a non-empty array');
        return;
    }

    const loadingSpinnerContainer2 = document.querySelector('.loadingSpinner2');

    // Show the loading animation
    loadingSpinnerContainer2.style.display = 'block';

    // Add the user's information to the Realtime Database
    generateId().then(function (projectId) {
        console.log("Generated new project ID:", projectId);

        // Upload images to Firebase Storage
        var promises = [];
        images.forEach(function (image) {
            var storageRef = firebase.storage().ref('photos/' + projectId + '/' + image.name);
            var uploadTask = storageRef.put(image);
            promises.push(uploadTask);
        });

        Promise.all(promises).then(function () {
            console.log("All images uploaded successfully");

            // Get the download URLs of the uploaded images
            var imageUrls = [];
            promises.forEach(function (uploadTask) {
                uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
                    imageUrls.push(url);

                    // Save the project data to the Realtime Database
                    if (imageUrls.length == images.length) {
                        loadingSpinnerContainer2.style.display = 'none';
                        database.ref('Project/' + projectId).set({
                            companyName: companyName,
                            companyCaption: companyCaption,
                            generation: parsedGeneration,
                            treesPlanted: parsedTreesPlanted,
                            CO2offset: parsedCO2Offset,
                            description: description,
                            imageUrls: imageUrls
                        }).then(function () {
                            // loadingSpinnerContainer2.style.display = 'none';
                            alert("Project Created!");
                            console.log("Project Created!");
                            location.reload();
                        }).catch(function (error) {
                            console.log("Error saving project data:", error);
                        });
                    }
                }).catch(function (error) {
                    console.log("Error getting download URL:", error);
                });
            });
        }).catch(function (error) {
            console.log("Error uploading images:", error);
        });

    }).catch(function (error) {
        console.log("Error generating new project ID:", error);
    });
}

// Edit button event listener
tableBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit")) {
        let editButton = event.target;
        let projectId = editButton.parentElement.parentElement.dataset.id;
        // Rest of the edit functionality
        // ...
        let projectData = projectsArray.find(([project, data]) => project === projectId)[1];

        // Populate the edit modal or form fields with the project data
        document.getElementById("companyName1").value = projectData.companyName;
        document.getElementById("companyCaption1").value = projectData.companyCaption;
        document.getElementById("generation1").value = projectData.generation;
        document.getElementById("treesPlanted1").value = projectData.treesPlanted;
        document.getElementById("CO2Offset1").value = projectData.CO2offset;
        document.getElementById("description1").value = projectData.description;

        saveChanges.addEventListener("submit", (event) => {
            event.preventDefault();
            // Update the project in Firebase based on the projectId
            console.log('Update Button Clicked');
            const loadingSpinnerContainer = document.querySelector('.loadingSpinner');

            // Show the loading animation
            loadingSpinnerContainer.style.display = 'block';

            let files = document.getElementById("projectImage1").files;
            if (files.length > 0) {

                // Upload new photos to Firebase Storage
                let promises = [];
                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    let storageRef = firebase.storage().ref(`photos/${projectId}/${file.name}`);
                    promises.push(storageRef.put(file));
                }

                Promise.all(promises).then(() => {
                    console.log('Uploaded all files');

                    // Get download URLs of all uploaded photos
                    let downloadURLs = [];
                    let storageRef = firebase.storage().ref(`photos/${projectId}`);
                    storageRef.listAll().then((res) => {
                        res.items.forEach((itemRef) => {
                            itemRef.getDownloadURL().then((url) => {
                                downloadURLs.push(url);

                                // Update photoUrls in Realtime Database
                                if (downloadURLs.length === files.length) {
                                    loadingSpinnerContainer.style.display = 'none';
                                    projectRef.child(projectId).update({
                                        companyName: document.getElementById("companyName1").value,
                                        companyCaption: document.getElementById("companyCaption1").value,
                                        generation: document.getElementById("generation1").value,
                                        treesPlanted: document.getElementById("treesPlanted1").value,
                                        CO2offset: document.getElementById("CO2Offset1").value,
                                        description: document.getElementById("description1").value,
                                        imageUrls: downloadURLs,
                                    }).then(() => {
                                        console.log('Updated photoUrls');
                                        alert("Updated");
                                        location.reload();
                                        //updateProject();
                                    }).catch((error) => {
                                        console.log(error);
                                    });
                                }
                            }).catch((error) => {
                                console.log(error);
                            });
                        });
                    }).catch((error) => {
                        console.log(error);
                    });
                }).catch((error) => {
                    console.log(error);
                });

            } else {
                // Update form without uploading new photos
                projectRef.child(projectId).update({
                    companyName: document.getElementById("companyName1").value,
                    companyCaption: document.getElementById("companyCaption1").value,
                    generation: document.getElementById("generation1").value,
                    treesPlanted: document.getElementById("treesPlanted1").value,
                    CO2offset: document.getElementById("CO2Offset1").value,
                    description: document.getElementById("description1").value,
                }).then((onFullFilled) => {
                    alert("Updated");
                    console.log('Updated');
                    location.reload();
                }, (onRejected) => {
                    console.log(onRejected);
                });
            }
        });
    }
});

// Delete button event listener
tableBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete")) {
        let deleteButton = event.target;
        let projectId = deleteButton.parentElement.parentElement.dataset.id;

        // Display a confirmation message
        const confirmation = confirm("Are you sure you want to delete this project?");

        if (confirmation) {
            // Delete the project and photo
            projectRef.child(projectId).get().then((snapshot) => {
                let projectPhotoURL = snapshot.val().imageUrls[0];
                const photoRef = firebase.storage().refFromURL(projectPhotoURL);
                photoRef.delete().then(() => {
                    console.log('Photo Deleted');
                }).catch((error) => {
                    console.log('Error deleting photo:', error);
                });

                projectRef.child(projectId).remove().then(() => {
                    console.log('Project Deleted');
                    alert('Project Deleted');
                    location.reload();
                }).catch((error) => {
                    console.log('Error deleting project:', error);
                });
            });
        }
    }
});

function generateId() {
    return new Promise(function (resolve, reject) {
        var ref = firebase.database().ref("Project");

        ref.once("value")
            .then(function (dataSnapshot) {
                var lastSequenceNumber = 0;
                dataSnapshot.forEach(function (transactionSnapshot) {
                    var projectID = transactionSnapshot.key;
                    if (projectID != null && projectID.startsWith("P")) {
                        var sequenceNumber = parseInt(projectID.substring(1));
                        if (!isNaN(sequenceNumber) && sequenceNumber > lastSequenceNumber) {
                            lastSequenceNumber = sequenceNumber;
                        }
                    }
                });
                var nextSequenceNumber = lastSequenceNumber + 1;
                var paddedSequenceNumber = String(nextSequenceNumber).padStart(5, "0");
                let newProjectId = "P" + paddedSequenceNumber;
                resolve(newProjectId);
            })
            .catch(function (error) {
                // Handle error
                console.log(error);
                reject(error);
            });
    });
}

function updateEditAndDeleteButtonListeners() {
    let editButtons = document.querySelectorAll(".edit");
    editButtons.forEach((edit) => {
        edit.addEventListener("click", () => {
            let projectId = edit.parentElement.parentElement.dataset.id;

            // Retrieve existing data for the selected project
            projectRef.child(projectId).get().then((snapshot) => {
                let projectData = snapshot.val();

                // Populate the form fields with the retrieved data
                document.getElementById("companyName1").value = projectData.companyName;
                document.getElementById("companyCaption1").value = projectData.companyCaption;
                document.getElementById("generation1").value = projectData.generation;
                document.getElementById("treesPlanted1").value = projectData.treesPlanted;
                document.getElementById("CO2Offset1").value = projectData.CO2offset;
                document.getElementById("description1").value = projectData.description;

                // Handle the form submission event when the user clicks the update/save button
                saveChanges.addEventListener("submit", (event) => {
                    event.preventDefault();

                    console.log('Update Button Clicked');
                    const loadingSpinnerContainer = document.querySelector('.loadingSpinner');

                    // Show the loading animation
                    loadingSpinnerContainer.style.display = 'block';

                    let files = document.getElementById("projectImage1").files;
                    if (files.length > 0) {
                        // Upload new photos to Firebase Storage
                        let promises = [];
                        for (let i = 0; i < files.length; i++) {
                            let file = files[i];
                            let storageRef = firebase.storage().ref(`photos/${projectId}/${file.name}`);
                            promises.push(storageRef.put(file));
                        }

                        Promise.all(promises).then(() => {
                            console.log('Uploaded all files');

                            // Get download URLs of all uploaded photos
                            let downloadURLs = [];
                            let storageRef = firebase.storage().ref(`photos/${projectId}`);
                            storageRef.listAll().then((res) => {
                                res.items.forEach((itemRef) => {
                                    itemRef.getDownloadURL().then((url) => {
                                        downloadURLs.push(url);

                                        // Update photoUrls in Realtime Database
                                        if (downloadURLs.length === files.length) {
                                            loadingSpinnerContainer.style.display = 'none';
                                            projectRef.child(projectId).update({
                                                companyName: document.getElementById("companyName1").value,
                                                companyCaption: document.getElementById("companyCaption1").value,
                                                generation: document.getElementById("generation1").value,
                                                treesPlanted: document.getElementById("treesPlanted1").value,
                                                CO2offset: document.getElementById("CO2Offset1").value,
                                                description: document.getElementById("description1").value,
                                                imageUrls: downloadURLs,
                                            }).then(() => {
                                                console.log('Updated photoUrls');
                                                alert("Updated");
                                                location.reload();
                                            }).catch((error) => {
                                                console.log(error);
                                            });
                                        }
                                    }).catch((error) => {
                                        console.log(error);
                                    });
                                });
                            }).catch((error) => {
                                console.log(error);
                            });
                        }).catch((error) => {
                            console.log(error);
                        });
                    } else {
                        // Update form without uploading new photos
                        projectRef.child(projectId).update({
                            companyName: document.getElementById("companyName1").value,
                            companyCaption: document.getElementById("companyCaption1").value,
                            generation: document.getElementById("generation1").value,
                            treesPlanted: document.getElementById("treesPlanted1").value,
                            CO2offset: document.getElementById("CO2Offset1").value,
                            description: document.getElementById("description1").value,
                        }).then(() => {
                            alert("Updated");
                            console.log('Updated');
                            location.reload();
                        }).catch((error) => {
                            console.log(error);
                        });
                    }
                });
            });
        });
    });

    let deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", () => {
            let projectId = deleteBtn.parentElement.parentElement.dataset.id;

            // Display a confirmation message
            const confirmation = confirm("Are you sure you want to delete this project?");

            if (confirmation) {
                // Retrieve the project data for deletion
                projectRef.child(projectId).get().then((snapshot) => {
                    let projectData = snapshot.val();

                    // Delete the associated photo from Firebase Storage
                    let projectPhotoURL = projectData.imageUrls[0];
                    const photoRef = firebase.storage().refFromURL(projectPhotoURL);
                    photoRef.delete().then(() => {
                        console.log('Photo Deleted');
                    }).catch((error) => {
                        console.log('Error deleting photo:', error);
                    });

                    // Delete the project from Firebase Realtime Database
                    projectRef.child(projectId).remove().then(() => {
                        console.log('Project Deleted');
                        alert('Project Deleted');
                        location.reload();
                    }).catch((error) => {
                        console.log('Error deleting project:', error);
                    });
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
    let table = document.getElementById("projectTable"); // Replace "yourTableId" with the actual ID of your table
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