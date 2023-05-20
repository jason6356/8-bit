// Initialize variables
let tableBody = document.querySelector("#News tbody");
let addNews = document.querySelector("#addANews"),
    popup = document.querySelector(".popup"),
    addform = document.querySelector("#add form"),
    saveChanges = document.querySelector("#edit form");

const database = firebase.database();
const NewsRef = firebase.database().ref('News');
var storageRef = firebase.storage().ref();

let projectCount = 0;

function createProject(newsTitle, newsDescription, newsDate, postedDate, postedTime, newsArticle, images) {
    if (typeof newsTitle !== 'string' || newsTitle.trim().length === 0) {
        console.log('Error: newsTitle must be a non-empty string');
        return;
    }

    if (typeof newsDescription !== 'string' || newsDescription.trim().length === 0) {
        console.log('Error: newsDescription must be a non-empty string');
        return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(newsDate)) {
        console.log('Error: News Date must be a formatted date');
        return;
    }


    if (!dateRegex.test(postedDate)) {
        console.log('Error: PostedDate must be a formatted date');
        return;
    }

    const timeRegex = /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!timeRegex.test(postedTime)) {
        console.log('Error: PostedTime must be a formatted time');
        return;
    }

    if (typeof newsArticle !== 'string' || newsArticle.trim().length === 0) {
        console.log('Error: newsArticle must be a non-empty string');
        return;
    }

    if (!Array.isArray(images) || images.length === 0) {
        console.log('Error: images must be a non-empty array');
        return;
    }

    // Add the user's information to the Realtime Database
    generateId().then(function (newsId) {
        console.log("Generated ews ID:", newsId);

        // Upload images to Firebase Storage
        var promises = [];
        images.forEach(function (image) {
            var storageRef = firebase.storage().ref('newsPhotos/' + newsId + '/' + image.name);
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



                        database.ref('News/' + newsId).set({
                            newsTitle: newsTitle,
                            newsDescription: newsDescription,
                            newsDate: newsDate,
                            postedDate: postedDate,
                            postedTime: postedTime,
                            newsArticle: newsArticle,
                            newsImageUrls: imageUrls
                        }).then(function () {
                            alert("News Created!");
                            console.log("News Created!");
                            location.reload();
                        }).catch(function (error) {
                            console.log("Error saving News data:", error);
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
        console.log("Error generating new News ID:", error);
    });
}

function initializeDataTable() {
    $('#newsTable').DataTable();
}

//Read Data
NewsRef.on('value', (snapshot) => {
    const News = snapshot.val();

    tableBody.innerHTML = "";

    let i = 1;

    for (news in News) {
        let tr = `        
        <tr data-id = ${news} >
            <td>${i}</td>
            <td>${news}</td>
            <td>${News[news].newsDate}</td>
            <td>
                <span class="d-inline-block text-truncate" style="max-width: 150px;">
                    ${News[news].newsTitle}
                </span>
            </td>
            <td>
                <span class="d-inline-block text-truncate" style="max-width: 150px;">
                    ${News[news].newsDescription}
                </span>
            </td>
            <td>${News[news].postedDate}</td>
            <td>${News[news].postedTime}</td>
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
        `
        tableBody.innerHTML += tr;
        i++;
    }

    // initializeDataTable();

    /*
    if (i < 10) {
        const paginationSection = document.querySelector('.tb-footer');
        paginationSection.style.display = "none";
    }
    */

    // Edit
    let editButtons = document.querySelectorAll(".edit");
    editButtons.forEach(edit => {
        edit.addEventListener("click", () => {
            let newsId = edit.parentElement.parentElement.dataset.id;
            console.log(newsId);
            NewsRef.child(newsId).get().then((snapshot => {
                //console.log(snapshot.val());

                document.getElementById("newsTitle1").value = snapshot.val().newsTitle;
                document.getElementById("newsDescription1").value = snapshot.val().newsDescription;
                document.getElementById("newsDate1").value = snapshot.val().newsDate;
                document.getElementById("postedDate1").value = snapshot.val().postedDate;
                document.getElementById("postedTime1").value = snapshot.val().postedTime;
                document.getElementById("newsArticle1").value = snapshot.val().newsArticle;
            }))

            saveChanges.addEventListener("submit", (event) => {
                event.preventDefault();

                let files = document.getElementById("newsImage1").files;
                if (files.length > 0) {

                    // Upload new photos to Firebase Storage
                    let promises = [];
                    for (let i = 0; i < files.length; i++) {
                        let file = files[i];
                        let storageRef = firebase.storage().ref(`newsPhotos/${newsId}/${file.name}`);
                        promises.push(storageRef.put(file));
                    }

                    Promise.all(promises).then(() => {
                        console.log('Uploaded all files');

                        // Get download URLs of all uploaded photos
                        let downloadURLs = [];
                        let storageRef = firebase.storage().ref(`newsPhotos/${newsId}`);
                        storageRef.listAll().then((res) => {
                            res.items.forEach((itemRef) => {
                                itemRef.getDownloadURL().then((url) => {
                                    downloadURLs.push(url);

                                    // Update photoUrls in Realtime Database
                                    if (downloadURLs.length === files.length) {
                                        NewsRef.child(newsId).update({
                                            newsTitle: document.getElementById("newsTitle1").value,
                                            newsDescription: document.getElementById("newsDescription1").value,
                                            newsDate: document.getElementById("newsDate1").value,
                                            postedDate: document.getElementById("postedDate1").value,
                                            postedTime: document.getElementById("postedTime1").value,
                                            newsArticle: document.getElementById("newsArticle1").value,
                                            newsImageUrls: downloadURLs,
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
                    NewsRef.child(newsId).update({
                        newsTitle: document.getElementById("newsTitle1").value,
                        newsDescription: document.getElementById("newsDescription1").value,
                        newsDate: document.getElementById("newsDate1").value,
                        postedDate: document.getElementById("postedDate1").value,
                        postedTime: document.getElementById("postedTime1").value,
                        newsArticle: document.getElementById("newsArticle1").value,
                    }).then((onFullFilled) => {
                        alert("Updated");
                        console.log('Updated');
                        location.reload();
                    }, (onRejected) => {
                        console.log(onRejected);
                    });
                }
            })


        })
    })


    let deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach(deleteBtn => {
        deleteBtn.addEventListener("click", () => {
            let newsId = deleteBtn.parentElement.parentElement.dataset.id;

            // Display a confirmation message
            const confirmation = confirm("Are you sure you want to delete this news?");

            if (confirmation) {
                // Delete the news and photo
                NewsRef.child(newsId).get().then((snapshot) => {
                    let newsPhotoURL = snapshot.val().newsImageUrls[0];
                    const photoRef = firebase.storage().refFromURL(newsPhotoURL);
                    photoRef.delete().then(() => {
                        console.log('Photo Deleted');
                    }).catch((error) => {
                        console.log('Error deleting photo:', error);
                    });

                    NewsRef.child(newsId).remove().then(() => {
                        console.log('News Deleted');
                        alert('News Deleted');
                        location.reload();
                    }).catch((error) => {
                        console.log('Error deleting news:', error);
                    });
                });
            }
        });
    });

});

addNews.addEventListener("click", () => {

    addform.addEventListener("submit", (e) => {
        e.preventDefault();

        const images = [];
        document.querySelectorAll("#newsImage").forEach(function (input) {
            for (let i = 0; i < input.files.length; i++) {
                images.push(input.files[i]);
            }

            createProject(document.getElementById("newsTitle").value, document.getElementById("newsDescription").value, document.getElementById("newsDate").value, document.getElementById("postedDate").value, document.getElementById("postedTime").value, document.getElementById("newsArticle").value, images);

        });

    });
});

function generateId() {
    return new Promise(function (resolve, reject) {
        var ref = firebase.database().ref("News");

        ref.once("value")
            .then(function (dataSnapshot) {
                var lastSequenceNumber = 0;
                dataSnapshot.forEach(function (transactionSnapshot) {
                    var projectID = transactionSnapshot.key;
                    if (projectID != null && projectID.startsWith("N")) {
                        var sequenceNumber = parseInt(projectID.substring(1));
                        if (!isNaN(sequenceNumber) && sequenceNumber > lastSequenceNumber) {
                            lastSequenceNumber = sequenceNumber;
                        }
                    }
                });
                var nextSequenceNumber = lastSequenceNumber + 1;
                var paddedSequenceNumber = String(nextSequenceNumber).padStart(5, "0");
                let newProjectId = "N" + paddedSequenceNumber;
                resolve(newProjectId);
            })
            .catch(function (error) {
                // Handle error
                console.log(error);
                reject(error);
            });
    });
}

/*
function validateForm(form) {
    let isValid = true;

    // Validate companyName
    if (form.companyName.value.trim() === "") {
        alert("Please enter a company name");
        isValid = false;
    }

    // Validate companyCaption
    if (form.companyCaption.value.trim() === "") {
        alert("Please enter a company caption");
        isValid = false;
    }

    // Validate generation
    if (form.generation.value.trim() === "" || isNaN(parseInt(form.generation.value))) {
        alert("Please enter a valid generation number");
        isValid = false;
    }

    // Validate treesPlanted
    if (form.treesPlanted.value.trim() === "" || isNaN(parseInt(form.treesPlanted.value))) {
        alert("Please enter a valid number of trees planted");
        isValid = false;
    }

    // Validate CO2Offset
    if (form.CO2Offset.value.trim() === "" || isNaN(parseInt(form.CO2Offset.value))) {
        alert("Please enter a valid CO2 offset number");
        isValid = false;
    }

    // Validate description
    if (form.description.value.trim() === "") {
        alert("Please enter a project description");
        isValid = false;
    }

    return isValid;
}

//Close Popup
window.addEventListener("click", (e) => {
    if (e.target == popup) {
        popup.classList.remove("active");
        addform.reset();
        updateform.reset();
    }
})
*/
