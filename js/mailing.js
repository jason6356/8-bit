// footer mailing
// 1 - User input email and send.
// 2 - Firebase will store the email into email list and send a confirmation
// 3 - Company can send any subsciption/news/contents thorugh these email

let subscribeButton = document.querySelector("#subscribe form");

subscribeButton.addEventListener("submit", (event) => {
    event.preventDefault();

    console.log('Subscribe Button Clicked');

    let email = document.getElementById("subscribeEmail").value;

    // Get a reference to the "subscription" node
    let subscriptionRef = database.ref('Subscription');
    
    // Generate a new child node ID using push()
    let newSubscriptionRef = subscriptionRef.push();
    
    // Get the generated subscription ID
    let subscriptionId = newSubscriptionRef.key;
    
    // Set the subscription data using the generated ID
    newSubscriptionRef.set({
      subscriptionEmail: email,
    }).then(function() {
      alert("Subscribed!");
      console.log("Subscribed!");
      location.reload();
    }).catch(function(error) {
      console.log("Error Subscribing:", error);
    });
    
})