const database = firebase.database();

var visitorCountElement = document.getElementById('visitorCount');

// Listen for changes in the visitor count and update the display
database.ref('visitors').on('value', function (snapshot) {
    var visitorCount = snapshot.val();
    visitorCountElement.textContent = visitorCount;
});
//-----------------------------------------------------------------------------------------------------------------------------

//Project counter section
// Function to count the total number of projects
function countProjects() {
    var projectsRef = database.ref('Project');
    projectsRef.once('value', function (snapshot) {
        var projects = snapshot.numChildren();
        updateProjectCount(projects);
    });
}

// Function to update the project count in HTML display
function updateProjectCount(count) {
    var projectCountElement = document.getElementById('projectCount');
    projectCountElement.textContent = count;
}

// Call the function to count the projects
countProjects();
//-----------------------------------------------------------------------------------------------------------------------------

//Feedback Counter Section
// Function to count the number of "Feedback" messages
function countFeedbackMessages() {
    var messagesRef = database.ref('ContactMessage');
    messagesRef.once('value', function (snapshot) {
        var feedbackCount = 0;
        snapshot.forEach(function (childSnapshot) {
            var message = childSnapshot.val();
            if (message.service === 'Feedback') {
                feedbackCount++;
            }
        });
        updateFeedbackCount(feedbackCount);
    });
}

// Function to update the feedback count in HTML display
function updateFeedbackCount(count) {
    var feedbackCountElement = document.getElementById('feedbackCount');
    feedbackCountElement.textContent = count;
}

// Call the function to count the "Feedback" messages
countFeedbackMessages();