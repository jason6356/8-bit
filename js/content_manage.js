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

let projectCount  = 0;

// Write data to Realtime database
function createProject(companyName, companyCaption, generation, tressPlanted, CO2offset, description) {
    // Add the user's information to the Realtime Database

    generateId().then(function(projectId) {
      console.log("Generated new project ID:", projectId);

      database.ref('Project/' + projectId).set({
        companyName: companyName,
        companyCaption: companyCaption,
        generation: generation,
        tressPlanted: tressPlanted,
        CO2offset: CO2offset,
        description: description,
    }).then((onFullFiled)=>{
        alert("Project Created!");
        console.log("Project Created!");
    }, (onRejected)=>{
        console.log(onRejected);
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
          <td>${projects[project].tressPlanted}</td>
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
          updateform.tressPlanted.value = snapshot.val().tressPlanted;
          updateform.CO2Offset.value = snapshot.val().CO2offset;
          updateform.description.value = snapshot.val().description;
        }))
        updateform.addEventListener("submit", ()=>{
          //e.preventDefault();
          projectRef.child(projectId).update({
            companyName: updateform.companyName.value,
            companyCaption: updateform.companyCaption.value,
            generation: updateform.generation.value,
            tressPlanted: updateform.tressPlanted.value,
            CO2offset: updateform.CO2Offset.value,
            description: updateform.description.value,
          }).then((onFullFilled)=>{
            alert("Updated");
            console.log('Updated');
            document.querySelector(".update").classList.remove("active");
            updateform.reset();
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

// Write Dynamic Data
addUser.addEventListener("click", ()=>{
    document.querySelector(".add").classList.add("active")
  
    addform.addEventListener("submit", (e)=>{
      e.preventDefault();
      createProject(addform.companyName.value, addform.companyCaption.value, addform.generation.value, addform.tressPlanted.value, addform.CO2Offset.value, addform.description.value);
      addform.reset();
      popup.classList.remove("active");
      location.reload();
    })
  })

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
      addform.reset();
      updateform.reset();
    }
})

//createProject(456, "test2", "hello", 123456, 1234, 123456, "desblablabla");
