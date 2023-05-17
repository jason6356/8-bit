firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log('User is signed in: ', user);

        // The user object has basic properties such as display name, email, etc.
        const displayName = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;
        const emailVerified = user.emailVerified;
        const uid = user.uid;

        const profileImg = document.getElementById("profileImg");
        const iconImg = document.getElementById("iconImg");
        const username = document.getElementById("username");
        const iconName = document.getElementById("iconName") ;

        if(profileImg)
            profileImg.setAttribute('src', photoURL)
        if(iconImg)
            iconImg.setAttribute('src', photoURL)
        if(username) 
            username.innerText = `Hello, ${displayName}`;
        if(iconName)
            iconName.innerText = `${displayName}`;
    }
    else {
        console.log('User is logged out')
        window.location.href = '../html/sign_in.html'
    }
})

const signOut = document.getElementById('signout');

signOut.addEventListener('click', async () => {
    console.log('hi')
    await firebase.auth().signOut();
})



