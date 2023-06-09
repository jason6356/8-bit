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
            <a href="#" class="projectDiv" data-id = "${projectSnapshot.key}">
              <div class="row1-col1 p-0"  style="background-image: url(${project.imageUrls[0]});">
                <div class="hovtxt text-white text-justify p-5">
                  <div class="fs-5 d-inline-block fw-bold">${project.companyName}</div>
                  <div class="fs-6" style="text-align: justify;">
                    <span class="d-inline-block text-truncate" ng-show="true" style="width: 100%;">
                      ${project.description}
                    </span>
                  </div>
                </div>
              </div>
            </a>
        `;

      projectsDiv.appendChild(projectDiv);
    });

    // Add event listeners to project links
    const projectButton = document.querySelectorAll(".projectDiv");
    projectButton.forEach(projectBtn => {
      projectBtn.addEventListener("click", () => {
        const projectId = projectBtn.dataset.id;
        window.location.href = 'html/projectDetails.html?projectId=' + projectId;
      });
    });

  })
  .catch((error) => {
    console.log(error);
  });

