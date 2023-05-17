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

const projectsPerPage = 4; // Number of projects to display per page
let currentPage = 1; // Current page number

// Function to display projects for a specific page
function displayProjects(pageNumber, snapshot) {
    const projectsDetails = document.getElementById('projectsDetails');
    projectsDetails.innerHTML = ''; // Clear the projects container before adding new projects

    const startIndex = (pageNumber - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;

    snapshot.forEach((projectSnapshot, index) => {
        if (index >= startIndex && index < endIndex) {
            const project = projectSnapshot.val();

            let projectDetail = document.createElement('div');
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
        }
    });
}

// Retrieve the total number of projects
projectRef.once('value')
    .then((snapshot) => {
        const totalProjects = snapshot.numChildren();
        const totalPages = Math.ceil(totalProjects / projectsPerPage);

        // Function to handle pagination buttons
        function handlePaginationClick(pageNumber) {
            currentPage = pageNumber;
            displayProjects(currentPage, snapshot);
        }

        // Render pagination buttons
        const paginationContainer = document.getElementById('paginationContainer');
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const paginationButton = document.createElement('button');
            paginationButton.classList.add('page-button');
            paginationButton.textContent = i;

            if (i === currentPage) {
                paginationButton.classList.add('active');
            }

            paginationButton.addEventListener('click', () => {
                handlePaginationClick(i);
            });

            paginationContainer.appendChild(paginationButton);
        }

        // Initially display projects for the first page
        displayProjects(currentPage, snapshot);
    })
    .catch((error) => {
        console.log(error);
    });

// Code here for each project is clicked, direct to projectDetails.html and display project details respectively
document.addEventListener('click', (event) => {
    if (event.target.matches('.stretched-link')) {
        event.preventDefault();
        const projectId = event.target.closest('.card').getAttribute('id');
        window.location.href = '/html/projectDetails.html?id=' + projectId;
    }
});

// const projectsPerPage = 4; // Number of projects to display per page
// let currentPage = 1; // Current page number

// // Function to display projects for a specific page
// function displayProjects(pageNumber, snapshot) {
//     const projectsDetails = document.getElementById('projectsDetails');
//     projectsDetails.innerHTML = ''; // Clear the projects container before adding new projects

//     const startIndex = (pageNumber - 1) * projectsPerPage;
//     const endIndex = startIndex + projectsPerPage;

//     snapshot.forEach((projectSnapshot, index) => {
//         if (index >= startIndex && index < endIndex) {
//             const project = projectSnapshot.val();
//             // Remaining code for creating and appending project details remains the same
//             const projectDetail = document.createElement('div');
//             projectDetail.classList.add('col-12');
//             projectDetail.innerHTML = `
//                 <div class="card m-2" id="${projectSnapshot.key}">
//                     <div class="row align-items-center">
//                     <div class="image-parent col-12 col-lg-4">
//                         <img src="${project.imageUrls[0]}" class="img-fluid" alt="" style="height: 200px;width: 100%;">
//                     </div>
//                     <div class="card-body col-10 col-lg-8">
//                         <div class="row justify-content-center">
//                         <h5 class="card-title col-8 col-lg-12 col-md-12">
//                             ${project.companyName}
//                         </h5>
//                         <div class="d-block d-lg-none col-2 text-end">
//                             <a href="/html/projectDetails.html" class="stretched-link"><i class="arrow fa-solid fa-angle-right"></i></a>
//                         </div>
//                         </div>
//                         <div class="row justify-content-center">
//                         <div class="col-10 col-lg-11">
//                             <p class="card-text">
//                             ${project.description}
//                             </p>
//                         </div>
//                         <div class="d-none d-lg-block col-lg-1 ">
//                             <a href="/html/projectDetails.html" class="stretched-link"><i class="arrow fa-solid fa-angle-right"></i></a>
//                         </div>
//                         </div>
//                     </div>
//                     </div>
//                 </div>
//             `;
//             // Append projectDetail to projectsDetails container
//             projectsDetails.appendChild(projectDetail);
//         }
//     });
// }

// // Retrieve the total number of projects
// database.ref('Project').once('value')
//     .then((snapshot) => {
//         const totalProjects = snapshot.numChildren();
//         const totalPages = Math.ceil(totalProjects / projectsPerPage);

//         // Function to handle pagination buttons
//         function handlePaginationClick(pageNumber) {
//             currentPage = pageNumber;
//             displayProjects(currentPage, snapshot);
//         }

//         // Render pagination buttons
//         const paginationContainer = document.getElementById('paginationContainer');
//         paginationContainer.innerHTML = '';

//         for (let i = 1; i <= totalPages; i++) {
//             const paginationButton = document.createElement('button');
//             paginationButton.classList.add('page-button');
//             paginationButton.textContent = i;

//             if (i === currentPage) {
//                 paginationButton.classList.add('active');
//             }

//             paginationButton.addEventListener('click', () => {
//                 handlePaginationClick(i);
//             });

//             paginationContainer.appendChild(paginationButton);
//         }

//         // Initially display projects for the first page
//         displayProjects(currentPage, snapshot);
//     });

// Display first 4 project to project.html
// database.ref('Project').orderByKey().limitToFirst(4).once('value')
//     .then((snapshot) => {
//         // Process the data here

//         const projectsDetails = document.getElementById('projectsDetails');

//         snapshot.forEach((projectSnapshot) => {
//             const project = projectSnapshot.val();
//             //const projectId = projectSnapshot.key; // Retrieve the project ID

//             const projectDetail = document.createElement('div');
//             projectDetail.classList.add('col-12');
//             projectDetail.innerHTML = `
//         <div class="card m-2" id="${projectSnapshot.key}">
//           <div class="row align-items-center">
//             <div class="image-parent col-12 col-lg-4">
//               <img src="${project.imageUrls[0]}" class="img-fluid" alt="" style="height: 200px;width: 100%;">
//             </div>
//             <div class="card-body col-10 col-lg-8">
//               <div class="row justify-content-center">
//                 <h5 class="card-title col-8 col-lg-12 col-md-12">
//                   ${project.companyName}
//                 </h5>
//                 <div class="d-block d-lg-none col-2 text-end">
//                   <a href="/html/projectDetails.html" class="stretched-link"><i class="arrow fa-solid fa-angle-right"></i></a>
//                 </div>
//               </div>
//               <div class="row justify-content-center">
//                 <div class="col-10 col-lg-11">
//                   <p class="card-text">
//                     ${project.description}
//                   </p>
//                 </div>
//                 <div class="d-none d-lg-block col-lg-1 ">
//                   <a href="/html/projectDetails.html" class="stretched-link"><i class="arrow fa-solid fa-angle-right"></i></a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         `;

//             projectsDetails.appendChild(projectDetail);
//         });

//         // Code here for each project is clicked, direct to projectDetails.html and display project details respectively
//         let projectButton = document.querySelectorAll(".stretched-link");
//         projectButton.forEach(pojectBtn => {
//             pojectBtn.addEventListener("click", () => {
//                 let projectId = pojectBtn.parentElement.parentElement.parentElement.parentElement.dataset.id;

//                 window.location.assign("/html/projectDetails.html");

//                 projectRef.child(projectId).get().then((snapshot => {
//                     //console.log(snapshot.val());

//                     let companyName = snapshot.val().companyName;
//                     let companyCaption = snapshot.val().companyCaption;
//                     let generation = snapshot.val().generation;
//                     let treesPlanted = snapshot.val().treesPlanted;
//                     let CO2Offset = snapshot.val().CO2Offset;
//                     let description = snapshot.val().description;
//                     let imgUrls = snapshot.val().snapshot.val().imageUrls;

//                     document.getElementById("companyName").innerHTML = companyName;
//                     document.getElementById("companyCaption").innerHTML = companyCaption;
//                     document.getElementById("generation").innerHTML = generation;
//                     document.getElementById("tressPlanted").innerHTML = treesPlanted;
//                     document.getElementById("CO2Offset").innerHTML = CO2Offset;
//                     document.getElementById("description").innerHTML = description;

//                 }))
//             });
//         });

//     })
//     .catch((error) => {
//         console.log(error);
//     });

