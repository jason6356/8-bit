// Visitor Counter Section
// const database = firebase.database();

// Increment and update the visitor count
// function updateVisitorCount() {
//     var counterRef = database.ref('visitors');
//     counterRef.transaction(function (currentCount) {
//         // Increment the counter by 1 if it exists, or initialize it to 1 otherwise
//         return (currentCount || 0) + 1;
//     });
// }

function updateVisitorCount() {
    // Check if the visitor has already been counted
    if (!localStorage.getItem('visitorCounted')) {
        var counterRef = database.ref('visitors');
        counterRef.transaction(function (currentCount) {
            return (currentCount || 0) + 1;
        });
        // Mark the visitor as counted in local storage
        localStorage.setItem('visitorCounted', 'true');
    }
}

// Call the function to update the visitor count
updateVisitorCount();