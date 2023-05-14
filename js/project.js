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
 
const database = firebase.database();

const projectsDiv = document.getElementById('projects');

database.ref('Project').limitToFirst(4).once('value')
  .then((snapshot) => {
    // Process the data here

    const projectsDiv = document.getElementById('projects');

    snapshot.forEach((projectSnapshot, index) => {
      const project = projectSnapshot.val();

      const row = Math.floor(index / 2) + 1;
      const col = (index % 2) + 1;

      const projectDiv = document.createElement('div');
      projectDiv.classList.add('col-lg-5', 'col-xs-12', 'col-sm-12', 'col-md-5');
      projectDiv.innerHTML = `
        <a href="/html/projectDetails.html">
          <div class="row${row}-col${col} h-100 p-0" style="background-image: url(${project.imageUrls[0]});">
            <div class="hovtxt h-100 d-inline-block text-white text-justify p-5">
              <div class="fs-5 fw-bold">${project.companyName}.</div>
              <div class="fs-6">${project.description}</div>
            </div>
          </div>
        </a>
      `;

      projectsDiv.appendChild(projectDiv);
    });

  })
  .catch((error) => {
    console.log(error);
  });

