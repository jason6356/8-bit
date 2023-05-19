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

const projectRef = firebase.database().ref('News');

// Array to store all project data
const newsData = [];

// Function to display projects based on the current page
function displayProjects(pageNumber) {
  // Clear the projectsDetails container
  const newsDetails = document.getElementById('newsDetails');
  newsDetails.innerHTML = '';

  // Calculate the start and end indices for the current page
  const itemsPerPage = 6;
  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Loop through the project data for the current page and create project cards
  for (let i = startIndex; i < endIndex; i++) {
    if (i >= newsData.length) {
      break; // Break if the end of the project data array is reached
    }

    const news = newsData[i];
    const newsDetail = document.createElement('div');
    newsDetail.classList.add('col-10', 'col-md-5', 'col-lg-5');
    newsDetail.innerHTML = `
        <div class="card mb-3" style="max-width: 540px;" data-id = "${news.key}">
            <div class="row g-0">
                <div class="col-md-5 col-lg-5">
                    <img src="${news.newsImageUrls[0]}" class="img-fluid rounded-start" alt="..." style="height: 200px; width: 100%;">
                </div>
                <div class="col-md-7 col-lg-7">
                    <div class="card-body">
                        <p class="card-text"><small class="text-muted">${news.newsDate}</small></p>
                        <h5 class="card-title fw-bold">${news.newsTitle}</h5>
                        <p class="card-text text-truncate">${news.newsArticle}</p>
                        <div class="btn btn-outline-primary mt-3"><a href="#" class=" nav-link stretched-link">Read More</a></div>
                    </div>
                </div>
            </div>
        </div>
      `;
    newsDetails.appendChild(newsDetail);
  }

  // Add event listeners to project links
  const newsButton = document.querySelectorAll(".stretched-link");
  newsButton.forEach(newsBtn => {
    newsBtn.addEventListener("click", () => {
      const newsId = newsBtn.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.id;

      window.location.href = 'newsDetails.html?newsId=' + newsId;
    });
  });
}

// Load all project data from Firebase
database.ref('News').orderByKey().once('value')
  .then((snapshot) => {
    snapshot.forEach((newsSnapshot) => {
      const news = newsSnapshot.val();
      news.key = newsSnapshot.key; // Store the project key in the project object
      newsData.push(news);
    });

    // Set the initial page to 1 and display projects
    let currentPage = 1;
    displayProjects(currentPage);

    // Calculate the number of pages based on the number of projects and items per page
    const numPages = Math.ceil(newsData.length / 6);

    // Generate pagination numbers dynamically
    const paginationContainer = document.getElementById('paginationContainer');
    const paginationList = paginationContainer.querySelector('.pagination');
    paginationList.innerHTML = ''; // Clear existing pagination numbers

    for (let i = 1; i <= numPages; i++) {
      const pageLink = document.createElement('li');
      pageLink.classList.add('page-item');
      if (i === currentPage) {
        pageLink.classList.add('active');
      }
      pageLink.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      paginationList.appendChild(pageLink);
    }

    // Event listener for pagination links
    const paginationLinks = document.querySelectorAll(".page-link");
    paginationLinks.forEach(link => {
      link.addEventListener("click", () => {
        currentPage = parseInt(link.innerText); // Get the page number from the link
        // Update active class for pagination links
        paginationLinks.forEach(link => {
          link.parentElement.classList.remove('active');
        });
        link.parentElement.classList.add('active');
        displayProjects(currentPage);
      });
    });
  })
  .catch((error) => {
    console.log(error);
  });