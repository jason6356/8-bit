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

let projectContent = document.querySelector("#Project div");

const projectRef = firebase.database().ref('Project');
var storageRef = firebase.storage().ref();

//Read Data
projectRef.on('value', (snapshot) => {
    const projects = snapshot.val();
    


    

});

/*
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
    */