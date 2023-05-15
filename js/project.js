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

const projectRef = firebase.database().ref('Project');

// Display first 4 project to project.html
database.ref('Project').orderByKey().limitToFirst(4).once('value')
  .then((snapshot) => {
    // Process the data here

    const projectsDetails = document.getElementById('projectsDetails');

    snapshot.forEach((projectSnapshot) => {
      const project = projectSnapshot.val();
      //const projectId = projectSnapshot.key; // Retrieve the project ID

      const projectDetail = document.createElement('div');
      projectDetail.classList.add('col-12');
      projectDetail.innerHTML = `
      <div class="card m-2" id="${projectSnapshot.key}">
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

    // Code here for each project is clicked, direct to projectDetails.html and display project details respectively
    let projectButton = document.querySelectorAll(".stretched-link");
    projectButton.forEach(pojectBtn => {
      pojectBtn.addEventListener("click", () => {
        let projectId = pojectBtn.parentElement.parentElement.parentElement.parentElement.dataset.id;

        window.location.assign("/html/projectDetails.html");

        projectRef.child(projectId).get().then((snapshot => {
          //console.log(snapshot.val());

          let companyName = snapshot.val().companyName;
          let companyCaption = snapshot.val().companyCaption;
          let generation = snapshot.val().generation;
          let treesPlanted = snapshot.val().treesPlanted;
          let CO2Offset = snapshot.val().CO2Offset;
          let description = snapshot.val().description;
          let imgUrls = snapshot.val().snapshot.val().imageUrls;
  
          document.getElementById("companyName").innerHTML = companyName;
          document.getElementById("companyCaption").innerHTML = companyCaption;
          document.getElementById("generation").innerHTML = generation;
          document.getElementById("tressPlanted").innerHTML = treesPlanted;
          document.getElementById("CO2Offset").innerHTML = CO2Offset;
          document.getElementById("description").innerHTML = description;
          
        }))
      });
    });

  })
  .catch((error) => {
    console.log(error);
  });

