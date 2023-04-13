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

let projectCount  = 0;

function createProject(companyName, companyCaption, generation, treesPlanted, CO2offset, description, images) {

  let Generation = parseInt(generation);
  let TreesPlanted = parseInt(treesPlanted);
  let CO2Offset = parseInt(CO2offset);

  // Add the user's information to the Realtime Database
  generateId().then(function(projectId) {
    console.log("Generated new project ID:", projectId);

    // Upload images to Firebase Storage
    var promises = [];
    images.forEach(function(image) {
      var storageRef = firebase.storage().ref('project-images/' + projectId + '/' + image.name);
      var uploadTask = storageRef.put(image);
      promises.push(uploadTask);
    });

    Promise.all(promises).then(function() {
      console.log("All images uploaded successfully");

      // Get the download URLs of the uploaded images
      var imageUrls = [];
      promises.forEach(function(uploadTask) {
        uploadTask.snapshot.ref.getDownloadURL().then(function(url) {
          imageUrls.push(url);

          // Save the project data to the Realtime Database
          if (imageUrls.length == images.length) {
            database.ref('Project/' + projectId).set({
              companyName: companyName,
              companyCaption: companyCaption,
              generation: Generation,
              treesPlanted: TreesPlanted,
              CO2offset: CO2Offset,
              description: description,
              imageUrls: imageUrls
            }).then(function() {
              alert("Project Created!");
              console.log("Project Created!");
              location.reload();
            }).catch(function(error) {
              console.log("Error saving project data:", error);
            });
          }
        }).catch(function(error) {
          console.log("Error getting download URL:", error);
        });
      });
    }).catch(function(error) {
      console.log("Error uploading images:", error);
    });

  }).catch(function(error) {
    console.log("Error generating new project ID:", error);
  });
}

//Read Data
projectRef.on('value', (snapshot) => {
    const projects = snapshot.val();
    
    tableBody.innerHTML = "";

    let i = 1;

    for(project in projects){
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
        }))
        updateform.addEventListener("submit", ()=>{
          //e.preventDefault();
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
        })
  
      })
    })

    // Delete
    let deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach(deleteBtn=>{
      deleteBtn.addEventListener("click", ()=>{
        let projectId = deleteBtn.parentElement.parentElement.dataset.id;
        projectRef.child(projectId).remove().then(()=>{
          alert("Deleted");
          console.log('Deleted');
        })
      })
    })

});

addUser.addEventListener("click", ()=>{
  document.querySelector(".add").classList.add("active")

  addform.addEventListener("submit", (e)=>{
    e.preventDefault();

    const images = [];
    document.querySelectorAll("#projectImage").forEach(function(input) {
      for (let i = 0; i < input.files.length; i++) {
        images.push(input.files[i]);
      }

      createProject(addform.companyName.value, addform.companyCaption.value, addform.generation.value, addform.tressPlanted.value, addform.CO2Offset.value, addform.description.value, images);
      //addform.reset();
      //popup.classList.remove("active");
      
    });
    
  });
});

  function generateId() {
    return new Promise(function(resolve, reject) {
      var ref = firebase.database().ref("Project");
  
      ref.once("value")
        .then(function(dataSnapshot) {
          var lastSequenceNumber = 0;
          dataSnapshot.forEach(function(transactionSnapshot) {
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
        .catch(function(error) {
          // Handle error
          console.log(error);
          reject(error);
        });
    });
  }

//Close Popup
window.addEventListener("click", (e)=>{
    if(e.target == popup){
      popup.classList.remove("active");
      //document.querySelector(".update").classList.remove("active");
      addform.reset();
      updateform.reset();
    }
})
