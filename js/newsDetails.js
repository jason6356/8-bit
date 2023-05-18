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

const newsRef = firebase.database().ref('News');

const urlParams = new URLSearchParams(window.location.search);
const newsId = urlParams.get('newsId');
const newsImage = document.getElementById('newsImage[0]');
const loadingSpinner = document.querySelector('.loadingSpinner');

console.log(newsId);

newsRef.child(newsId).get().then((snapshot => {
    loadingSpinner.style.display = 'block';

    document.getElementById("newsTitle").textContent = snapshot.val().newsTitle;
    document.getElementById("newsTitle1").textContent = snapshot.val().newsTitle;
    document.getElementById("newsDescription").textContent = snapshot.val().newsDescription;
    newsImage.onload = () => {
        // Hide the loading spinner
        loadingSpinner.style.display = 'none';
    };
    newsImage.src = snapshot.val().newsImageUrls[0];

    document.getElementById("newsDate").textContent = snapshot.val().newsDate;
    document.getElementById("newsArticle").textContent = snapshot.val().newsArticle;

    newsRef.child(newsId).get().then((snapshot) => {
        const imageUrls = snapshot.val().newsImageUrls;
        const imageUrlsContainer = document.getElementById("newsImageUrls");

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