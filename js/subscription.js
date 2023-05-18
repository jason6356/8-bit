// Get a reference to the database service
var database = firebase.database();

const form = document.querySelector('#subscriptionForm form');

form.addEventListener('submit', (event) => {
    // prevent the default form submission behavior
    event.preventDefault();
  
    // get form input values
    const subscriptionTitle = document.getElementById("subscriptionTitle").value;
    const subscriptionMessage = document.getElementById("subscriptionMessage").value;
    const subscriptionFiles = document.getElementById("subscriptionFiles").files;
  
    if (subscriptionTitle == "" || subscriptionMessage == "") {
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
    var subscriptionMessageHistory = {
      subscriptionTitle: subscriptionTitle,
      subscriptionMessage: subscriptionMessage,
      BroadcastDate: formattedDate,
    };

      // Add the user's information to the Realtime Database
  generateId().then(function (subscriptionId) {
    console.log("Generated new subscription ID:", subscriptionId);

    // add the reservation data to the "Reservation" collection in the database
    database.ref('SubscriptionHistory/' + subscriptionId).set(subscriptionMessageHistory)
      .then(() => {

        // Initialize service id and template id from EmailJS
        const serviceID = "service_y94bped";

        const templateID = "template_kv67ffd";

        // Declare template input id
        var params = {
          subscriptionTitle: document.getElementById("subscriptionTitle").value,
          subscriptionMessage: document.getElementById("subscriptionMessage").value,
        };

        //Create Array to store all email address 

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
    var ref = firebase.database().ref("SubscriptionHistory");

    ref.once("value")
      .then(function (dataSnapshot) {
        var lastSequenceNumber = 0;
        dataSnapshot.forEach(function (transactionSnapshot) {
          var projectID = transactionSnapshot.key;
          if (projectID != null && projectID.startsWith("S")) {
            var sequenceNumber = parseInt(projectID.substring(1));
            if (!isNaN(sequenceNumber) && sequenceNumber > lastSequenceNumber) {
              lastSequenceNumber = sequenceNumber;
            }
          }
        });
        var nextSequenceNumber = lastSequenceNumber + 1;
        var paddedSequenceNumber = String(nextSequenceNumber).padStart(5, "0");
        let newProjectId = "S" + paddedSequenceNumber;
        resolve(newProjectId);
      })
      .catch(function (error) {
        // Handle error
        console.log(error);
        reject(error);
      });
  });
}