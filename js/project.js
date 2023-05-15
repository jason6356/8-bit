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

// Display First 4 projects to index.html
database.ref('Project').orderByKey().limitToFirst(4).once('value')
  .then((snapshot) => {
    // Process the data here

    const projectsDiv = document.getElementById('projects');

    snapshot.forEach((projectSnapshot) => {
      const project = projectSnapshot.val();

      // const row = Math.floor(index / 2) + 1;
      // const col = (index % 2) + 1;

      const projectDiv = document.createElement('div');
      projectDiv.classList.add('col-lg-5', 'col-xs-12', 'col-sm-12', 'col-md-5', 'mb-3');
      projectDiv.innerHTML = `
          <a href="/html/projectDetails.html">
            <div class="row1-col1 h-100 p-0" style="background-image: url(${project.imageUrls[0]});">
              <div class="hovtxt h-100 d-inline-block text-white text-justify p-5">
                <div class="fs-5 fw-bold">${project.companyName}</div>
                <div class="fs-6" style="text-align: justify;">${project.description}</div>
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






// Display first 4 project to project.html and next 4 when next page is clicked
database.ref('Project').orderByKey().limitToFirst(4).once('value')
  .then((snapshot) => {
    // Process the data here

    const projectsDetails = document.getElementById('projectsDetails');

    snapshot.forEach((projectSnapshot) => {
      const project = projectSnapshot.val();


      const projectDetail = document.createElement('div');
      projectDetail.classList.add('col-12');
      projectDetail.innerHTML = `
      <div class="card m-2">
        <div class="row align-items-center">
          <div class="image-parent col-12 col-lg-4">
            <img src="${project.imageUrls[0]}" class="img-fluid" alt="" style="height: 200px;width: 100%;">
          </div>
          <div class="card-body col-10 col-lg-8">
            <div class="row justify-content-center">
              <h5 class="card-title col-8 col-lg-12 col-md-12">
                ${project.companyName}
              </h5>
              <div class="d-block d-lg-none col-2 text-end">
                <a href="/html/projectDetails.html" class="stretched-link"><i class="arrow fa-solid fa-angle-right"></i></a>
              </div>
            </div>
            <div class="row justify-content-center">
              <div class="col-10 col-lg-11">
                <p class="card-text">
                  ${project.description}
                </p>
              </div>
              <div class="d-none d-lg-block col-lg-1 ">
                <a href="/html/projectDetails.html" class="stretched-link"><i class="arrow fa-solid fa-angle-right"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;

      projectsDetails.appendChild(projectDetail);
    });

  })
  .catch((error) => {
    console.log(error);
  });

