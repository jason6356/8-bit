const form = document.querySelector('.sign-in');
console.log(form)
form.addEventListener('submit', async event => {

    event.preventDefault();

    const username = document.getElementById('uname').value;
    const password = document.getElementById('psw').value;

    const email = `${username}@firebase.app`;

    try {

        await firebase.auth().signInWithEmailAndPassword(email, password);

    } catch (error) {

        console.error(error);
    }
});

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log('User is signed in: ', user)
        window.location.href = "../company_index.html"
    }
})







