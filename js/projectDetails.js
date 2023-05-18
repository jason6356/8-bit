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

const projectRef = firebase.database().ref('Project');

const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('projectId');
const projectImage = document.getElementById('projectImage[0]');
const loadingSpinner = document.querySelector('.loadingSpinner');

console.log(projectId);

projectRef.child(projectId).get().then((snapshot => {
    loadingSpinner.style.display = 'block';

    document.getElementById("companyName").textContent = snapshot.val().companyName;
    document.getElementById("companyCaption").textContent = snapshot.val().companyCaption;
    projectImage.onload = () => {
        // Hide the loading spinner
        loadingSpinner.style.display = 'none';
    };
    projectImage.src = snapshot.val().imageUrls[0];
    document.getElementById("generation").setAttribute("data-val", snapshot.val().generation);
    document.getElementById("treesPlanted").setAttribute("data-val", snapshot.val().treesPlanted);
    document.getElementById("CO2Offset").setAttribute("data-val", snapshot.val().CO2offset);
    document.getElementById("description").textContent = snapshot.val().description;

    projectRef.child(projectId).get().then((snapshot) => {
        const imageUrls = snapshot.val().imageUrls;
        const imageUrlsContainer = document.getElementById("imageUrls");

        imageUrls.forEach((imageUrl) => {
            const swiperSlide = document.createElement("div");
            swiperSlide.className = "swiper-slide img-fluid";
            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = "Image";
            img.style.height = "150px";
            swiperSlide.appendChild(img);
            imageUrlsContainer.appendChild(swiperSlide);
        });
    });
}))