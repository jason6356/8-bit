firebase.auth().onAuthStateChanged(user => {
    if(user){
        console.log('User is signed in: ', user);
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

