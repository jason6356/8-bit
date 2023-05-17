
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
  
  