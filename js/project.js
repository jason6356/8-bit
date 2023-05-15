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

database.ref('Project').orderByKey().limitToFirst(4).once('value')
  .then((snapshot) => {
    // Process the data here

    const projectsDiv = document.getElementById('projects');

    snapshot.forEach((projectSnapshot, index) => {
      const project = projectSnapshot.val();

      // const row = Math.floor(index / 2) + 1;
      // const col = (index % 2) + 1;

      const projectDiv = document.createElement('div');
      projectDiv.classList.add('col-lg-5', 'col-xs-12', 'col-sm-12', 'col-md-5', 'mb-3');
      projectDiv.innerHTML = `
          <a href="/html/projectDetails.html">
            <div class="row1-col1 h-100 p-0" style="background-image: url(${project.imageUrls[0]});">
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

// database.ref('Project').orderByKey().limitToFirst(2).once('value')
//   .then((snapshot) => {
//     const projectsDiv = document.getElementById('projects');
//     snapshot.forEach((projectSnapshot, index) => {
//       const project = projectSnapshot.val();
//       const projectDiv = document.createElement('div');
//       projectDiv.classList.add('col-lg-5', 'col-xs-12', 'col-sm-12', 'col-md-5');
//       projectDiv.innerHTML = `
//         <a href="/html/projectDetails.html">
//           <div class="h-100 p-0" style="background-image: url(${project.imageUrls[0]});">
//             <div class="hovtxt h-100 d-inline-block text-white text-justify p-5">
//               <div class="fs-5 fw-bold">${project.companyName}.</div>
//               <div class="fs-6">${project.description}</div>
//             </div>
//           </div>
//         </a>
//       `;
//       projectsDiv.appendChild(projectDiv);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });










//   <div class="row lead my-4 justify-content-center">

//   <div class="col-lg-5 col-xs-12 col-sm-12 col-md-5">
//     <a href="/html/projectDetails.html">
//       <div class="row1-col1 h-100 p-0" style="background-image: url(/image/1.jpg);">
//         <div class="hovtxt h-100 d-inline-block text-white text-justify p-5">
//           <div class="fs-5 fw-bold">Tesco Sdn. Bhd.</div>
//           <div class="fs-6">With our extensive expertise offering bespoke carbon neutral technologies & financing solutions in the region,
//             SUNERGY stands at the forefront in providing green energy solutions to meet your renewable energy goals.
//             We help every client find the best approach to save money and the planet.</div>
//         </div>
//       </div>
//     </a>
//   </div>

//   <div class="col-lg-5 col-xs-12 col-sm-12 col-md-5">
//     <a href="/html/projectDetails.html">
//       <div class="row1-col2 h-100 p-0" style="background-image: url(/image/2.jpg);">
//         <div class="hovtxt h-100 d-inline-block text-white text-justify p-5">
//           <div class="fs-5 fw-bold">Tesco Sdn. Bhd.</div>
//           <div class="fs-6">With our extensive expertise offering bespoke carbon neutral technologies & financing solutions in the region,
//             SUNERGY stands at the forefront in providing green energy solutions to meet your renewable energy goals.
//             We help every client find the best approach to save money and the planet.</div>
//         </div>
//       </div>
//     </a>
//   </div>

// </div>


// <div class="row lead my-4 justify-content-center">

//   <div class="col-lg-5 col-xs-12 col-sm-12 col-md-5">
//     <a href="/html/projectDetails.html">
//       <div class="row2-col1 h-100 p-0" style="background-image: url(/image/3.jpg);">
//         <div class="hovtxt h-100 d-inline-block text-white text-justify p-5">
//           <div class="fs-5 fw-bold">Tesco Sdn. Bhd.</div>
//           <div class="fs-6">With our extensive expertise offering bespoke carbon neutral technologies & financing solutions in the region,
//             SUNERGY stands at the forefront in providing green energy solutions to meet your renewable energy goals.
//             We help every client find the best approach to save money and the planet.</div>
//         </div>
//       </div>
//     </a>
//   </div>

//   <div class="col-lg-5 col-xs-12 col-sm-12 col-md-5">
//     <a href="/html/projectDetails.html">
//       <div class="row2-col2 h-100 p-0" style="background-image: url(/image/4.jpg);">
//         <div class="hovtxt h-100 d-inline-block text-white text-justify p-5">
//           <div class="fs-5 fw-bold">Tesco Sdn. Bhd.</div>
//           <div class="fs-6">With our extensive expertise offering bespoke carbon neutral technologies & financing solutions in the region,
//             SUNERGY stands at the forefront in providing green energy solutions to meet your renewable energy goals.
//             We help every client find the best approach to save money and the planet.</div>
//         </div>
//       </div>
//     </a>
//   </div>

// </div>