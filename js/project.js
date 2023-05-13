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
  
  // Get a reference to the root of the database
  const dbRef = firebase.database().ref();
  
  // Get a reference to the "Project" node in the database
  const projectRef = dbRef.child('Project');
  
  // Get a reference to the storage bucket
  const storageRef = firebase.storage().ref();
  
  // Get a reference to the div elements for each project
  const projectDivs = document.querySelectorAll('#Project div');
  
  // Read the data from the database when it changes
  projectRef.on('value', (snapshot) => {
    // Get the projects data from the snapshot
    const projects = snapshot.val();
  
    // Iterate over each project
    let index = 0;
    for (const projectId in projects) {
      // Get a reference to the project data
      const projectData = projects[projectId];
  
      // Get a reference to the div element for this project
      const projectDiv = projectDivs[index];
  
      // Set the background image of the div element
      storageRef.child(projectData.imageUrls[0]).getDownloadURL()
        .then(url => projectDiv.style.backgroundImage = `url(${url})`);
  
      // Set the company name and description of the div element
      const companyNameEl = projectDiv.querySelector('.fw-bold');
      const companyDescriptionEl = projectDiv.querySelector('.fs-6');
      companyNameEl.value = projectData.companyName;
      companyDescriptionEl.value = projectData.description;
  
      // Move to the next div element
      index++;
    }
  });