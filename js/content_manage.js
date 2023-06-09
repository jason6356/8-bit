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
let addUser = document.querySelector("#addAProject"),
  popup = document.querySelector(".popup"),
  addform = document.querySelector(".add form"),
  updateform = document.querySelector(".update form");

const database = firebase.database();
const projectRef = firebase.database().ref('Project');
var storageRef = firebase.storage().ref();

let projectCount = 0;

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
            database.ref('Project/' + projectId).set({
              companyName: companyName,
              companyCaption: companyCaption,
              generation: parsedGeneration,
              treesPlanted: parsedTreesPlanted,
              CO2offset: parsedCO2Offset,
              description: description,
              imageUrls: imageUrls
            }).then(function () {
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

//Read Data
projectRef.on('value', (snapshot) => {
  const projects = snapshot.val();

  tableBody.innerHTML = "";

  let i = 1;

  for (project in projects) {
    let tr = `
      <tr data-id = ${project} >
          <td>${i}</td>
          <td>${project}</td>
          <td>${projects[project].companyName}</td>
          <td>${projects[project].companyCaption}</td>
          <td>${projects[project].generation}</td>
          <td>${projects[project].treesPlanted}</td>
          <td>${projects[project].CO2offset}</td>
          <td>${projects[project].description}</td>
          <td>
              <button class="edit">Edit</button>
              <button class="delete">Delete</button>
          </td>
      </tr>
      `
    tableBody.innerHTML += tr;
    i++;
  }

  if (i < 10) {
    const paginationSection = document.querySelector('.tb-footer');
    paginationSection.style.display = "none";
  }

  /*
    // Edit
let editButtons = document.querySelectorAll(".edit");
editButtons.forEach(edit=>{
  edit.addEventListener("click", ()=>{
    document.querySelector(".update").classList.add("active");
    let projectId = edit.parentElement.parentElement.dataset.id;
    projectRef.child(projectId).get().then((snapshot =>{
      //console.log(snapshot.val());

      updateform.companyName.value = snapshot.val().companyName;
      updateform.companyCaption.value = snapshot.val().companyCaption;
      updateform.generation.value = snapshot.val().generation;
      updateform.treesPlanted.value = snapshot.val().treesPlanted;
      updateform.CO2Offset.value = snapshot.val().CO2offset;
      updateform.description.value = snapshot.val().description;
      //updateform.projectImage1.value = snapshot.val().photoUrl;
    }))

    updateform.addEventListener("submit", (event)=>{
      event.preventDefault();
      if (validateForm(updateform)) {

        let file = updateform.projectImage1.files[0];
        if (file) {

          // Delete existing photo from Firebase Storage
          let storageRef = firebase.storage().ref(`photos/${projectId}`);
          storageRef.listAll().then((res) => {
            res.items.forEach((itemRef) => {
              itemRef.delete().then(() => {
                console.log('Deleted existing file');

                // Upload new photo to Firebase Storage
                storageRef.child(file.name).put(file).then((snapshot) => {
                  console.log('Uploaded a file');
                  // Update photoUrl in Realtime Database
                  storageRef.child(file.name).getDownloadURL().then((url) => {
                    projectRef.child(projectId).update({
                      companyName: updateform.companyName.value,
                      companyCaption: updateform.companyCaption.value,
                      generation: updateform.generation.value,
                      treesPlanted: updateform.treesPlanted.value,
                      CO2offset: updateform.CO2Offset.value,
                      description: updateform.description.value,
                      imageUrls: url,
                    }).then((onFullFilled)=>{
                      console.log('Updated photoUrl');
                      alert("Updated");
                      location.reload();
                      //updateProject();
                    },(onRejected)=>{
                      console.log(onRejected);
                    });
                  }).catch((error) => {
                    console.log(error);
                  });
                });
              }).catch((error) => {
                console.log(error);
              });
            });
          }).catch((error) => {
            console.log(error);
          });
        } else {
          // Update form without uploading new photo
          projectRef.child(projectId).update({
            companyName: updateform.companyName.value,
            companyCaption: updateform.companyCaption.value,
            generation: updateform.generation.value,
            treesPlanted: updateform.treesPlanted.value,
            CO2offset: updateform.CO2Offset.value,
            description: updateform.description.value,
          }).then((onFullFilled)=>{
            alert("Updated");
            console.log('Updated');
            document.querySelector(".update").classList.remove("active");
            updateform.reset();
            popup.classList.remove("active");
          },(onRejected)=>{
            console.log(onRejected);
          });
        }

      }
    })

  })
})
*/

  // Edit
  let editButtons = document.querySelectorAll(".edit");
  editButtons.forEach(edit => {
    edit.addEventListener("click", () => {
      document.querySelector(".update").classList.add("active");
      let projectId = edit.parentElement.parentElement.dataset.id;
      projectRef.child(projectId).get().then((snapshot => {
        //console.log(snapshot.val());

        updateform.companyName.value = snapshot.val().companyName;
        updateform.companyCaption.value = snapshot.val().companyCaption;
        updateform.generation.value = snapshot.val().generation;
        updateform.treesPlanted.value = snapshot.val().treesPlanted;
        updateform.CO2Offset.value = snapshot.val().CO2offset;
        updateform.description.value = snapshot.val().description;
        //updateform.projectImage1.value = snapshot.val().photoUrl;
      }))

      updateform.addEventListener("submit", (event) => {
        event.preventDefault();
        if (validateForm(updateform)) {

          let files = updateform.projectImage1.files;
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
                      projectRef.child(projectId).update({
                        companyName: updateform.companyName.value,
                        companyCaption: updateform.companyCaption.value,
                        generation: updateform.generation.value,
                        treesPlanted: updateform.treesPlanted.value,
                        CO2offset: updateform.CO2Offset.value,
                        description: updateform.description.value,
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
              companyName: updateform.companyName.value,
              companyCaption: updateform.companyCaption.value,
              generation: updateform.generation.value,
              treesPlanted: updateform.treesPlanted.value,
              CO2offset: updateform.CO2Offset.value,
              description: updateform.description.value,
            }).then((onFullFilled) => {
              alert("Updated");
              console.log('Updated');
              document.querySelector(".update").classList.remove("active");
              updateform.reset();
              popup.classList.remove("active");
            }, (onRejected) => {
              console.log(onRejected);
            });
          }

        }
      })

    })
  })


  let deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach(deleteBtn => {
    deleteBtn.addEventListener("click", () => {
      let projectId = deleteBtn.parentElement.parentElement.dataset.id;

      projectRef.child(projectId).get().then((snapshot => {
        //console.log(snapshot.val());

        let projectPhotoURL = snapshot.val().imageUrls;

        const photoRef = firebase.storage().refFromURL(projectPhotoURL);

        photoRef.delete();
      }))



      projectRef.child(projectId).remove().then(() => {
        // alert("Deleted");
        console.log('Deleted');

      });
    });
  });

});

addUser.addEventListener("click", () => {
  document.querySelector(".add").classList.add("active")

  addform.addEventListener("submit", (e) => {
    e.preventDefault();

    const images = [];
    document.querySelectorAll("#projectImage").forEach(function (input) {
      for (let i = 0; i < input.files.length; i++) {
        images.push(input.files[i]);
      }

      createProject(addform.companyName.value, addform.companyCaption.value, addform.generation.value, addform.tressPlanted.value, addform.CO2Offset.value, addform.description.value, images);

    });

  });
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

