(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()

// Your web app's Firebase configuration
var firebaseConfig = {
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

// Get a reference to the database service
var database = firebase.database();

const form = document.querySelector('form');

let inboxCount = 0;

form.addEventListener('submit', (event) => {
  // prevent the default form submission behavior
  event.preventDefault();

  // get form input values
  const nameInput = document.getElementById("name").value;
  const companyName = document.getElementById("companyName").value;
  const serviceInput = document.getElementById("service").value;
  const phoneInput = document.getElementById("phone").value;
  const emailInput = document.getElementById("email").value;
  const messageInput = document.getElementById("message").value;
  const statusInput = "Pending";

  if (nameInput == "" || companyName == "" || serviceInput == "" || phoneInput == "" || emailInput == "" || messageInput == "") {
    alert('Please fill in all the details!');
    return
  }


  // Create a new Date object
  const currentDate = new Date();

  // Get the current date components
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
  const day = currentDate.getDate();

  // Format the date as desired (e.g., YYYY-MM-DD)
  const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

  // create a new "Reservation" object with the input values
  var newContact = {
    name: nameInput,
    companyName: companyName,
    service: serviceInput,
    phone: phoneInput,
    email: emailInput,
    message: messageInput,
    status: statusInput,
    dateSubmitted: formattedDate,
  };

  // Add the user's information to the Realtime Database
  generateId().then(function (inboxId) {
    console.log("Generated new inbox ID:", inboxId);

    // add the reservation data to the "Reservation" collection in the database
    database.ref('ContactMessage/' + inboxId).set(newContact)
      .then(() => {

        // Initialize service id and template id from EmailJS
        const serviceID = "service_hq3f5m4";

        const templateID = "template_49a106z";

        // Declare template input id
        var params = {
          nameInput: document.getElementById("name").value,
          companyNameInput: document.getElementById("companyName").value,
          emailInput: document.getElementById("email").value,
          phoneInput: document.getElementById("phone").value,
          serviceInput: document.getElementById("service").value,
          messageInput: document.getElementById("message").value,
        };

        // Send message
        emailjs.send(serviceID, templateID, params)
          .then(function (response) {
            console.log('SUCCESS!', response.status, response.text);
            // alert("Confirmation email sent! Check your email.");
          }, function (error) {
            console.log('FAILED...', error);
            alert("Failed to send confirmation email....");
          });

        // reset the form
        form.reset();
        console.log('Message send successfully!');
        alert('Message Sent!');
        location.reload();
      })
      .catch((error) => {
        console.error('Error adding message: ', error);
      });


  }).catch(function (error) {
    console.log("Error generating new inbox ID:", error);
  });

});

function generateId() {
  return new Promise(function (resolve, reject) {
    var ref = firebase.database().ref("ContactMessage");

    ref.once("value")
      .then(function (dataSnapshot) {
        var lastSequenceNumber = 0;
        dataSnapshot.forEach(function (transactionSnapshot) {
          var projectID = transactionSnapshot.key;
          if (projectID != null && projectID.startsWith("A")) {
            var sequenceNumber = parseInt(projectID.substring(1));
            if (!isNaN(sequenceNumber) && sequenceNumber > lastSequenceNumber) {
              lastSequenceNumber = sequenceNumber;
            }
          }
        });
        var nextSequenceNumber = lastSequenceNumber + 1;
        var paddedSequenceNumber = String(nextSequenceNumber).padStart(5, "0");
        let newProjectId = "M" + paddedSequenceNumber;
        resolve(newProjectId);
      })
      .catch(function (error) {
        // Handle error
        console.log(error);
        reject(error);
      });
  });
}