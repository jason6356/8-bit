const DEFAULT_PROFILE_IMG = 'https://firebasestorage.googleapis.com/v0/b/sunergy-4b6d0.appspot.com/o/user%2Fdefault-img.jpg?alt=media&token=9c6a18ac-d64a-43d3-bdc6-415a8e3192e8';
window.addEventListener("load", event => {

    const cacheString = localStorage.getItem('userData');

    //Check for cache to run, if cache exist then we can skip the rendering from firebase
    if (cacheString) {
        const cache = JSON.parse(cacheString);
        renderPage(cache);
        console.log('Using Cache')
    }

})

function renderPage({ displayName, email, photoURL, emailVerified, uid }) {

    const profileImg = document.getElementById("profileImg");
    const iconImg = document.getElementById("iconImg");
    const username = document.getElementById("username");
    const iconName = document.getElementById("iconName");

    if (profileImg)
        profileImg.setAttribute('src', photoURL)
    if (iconImg)
        iconImg.setAttribute('src', photoURL)
    if (username)
        username.innerText = `Hello, ${displayName}`;
    if (iconName)
        iconName.innerText = `${displayName}`;

}

firebase.auth().onAuthStateChanged(user => {
    if (user) {

        const cacheString = localStorage.getItem('userData');
        let displayName;
        let email;
        let photoURL;
        let emailVerified;
        let uid;

        if (cacheString) {
            return; //we already render the page
        }
        else {

            console.log('User is signed in: ', user);
            displayName = user.displayName;
            email = user.email;
            photoURL = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid;

            displayName = displayName === null ? 'User' : displayName;
            photoURL = photoURL === null ? DEFAULT_PROFILE_IMG : photoURL;

            const obj = {
                "displayName": displayName,
                "email": email,
                "photoURL": photoURL,
                "emailVerified": emailVerified,
                "uid": uid
            };
            localStorage.setItem('userData', JSON.stringify(obj));
            renderPage(obj);
        }

    }
    else {
        console.log('User is logged out')
        window.location.href = '../html/sign_in.html'
    }
})

const signOut = document.getElementById('signout');

signOut.addEventListener('click', async () => {

    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    await firebase.auth().signOut();
})



