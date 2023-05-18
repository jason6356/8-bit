let valueDisplays = document.querySelectorAll(".num");
let duration = 1000; // Animation duration in milliseconds
let animationTriggered = false;

function startAnimation() {
    if (animationTriggered) return;
    valueDisplays.forEach((valueDisplay) => {
        let startValue = 0;
        let endValue = parseInt(valueDisplay.getAttribute("data-val"));
        let startTime = null;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const increment = Math.floor((progress / duration) * (endValue - startValue));

            if (progress < duration) {
                valueDisplay.textContent = (startValue + increment).toLocaleString();
                requestAnimationFrame(animate);
            } else {
                valueDisplay.textContent = endValue.toLocaleString();
            }
        }

        requestAnimationFrame(animate);
    });
    animationTriggered = true;
}

//Scroll on the number start the counter
function checkIfInView() {
    valueDisplays.forEach((valueDisplay) => {
        const rect = valueDisplay.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        if (rect.top >= 0 && rect.bottom <= windowHeight) {
            startAnimation();
        }
    });
}

window.addEventListener("scroll", checkIfInView);

const database = firebase.database();

// Increment and update the visitor count
function updateVisitorCount() {
    var counterRef = database.ref('visitors');
    counterRef.transaction(function (currentCount) {
        // Increment the counter by 1 if it exists, or initialize it to 1 otherwise
        return (currentCount || 0) + 1;
    });
}

// Call the function to update the visitor count
updateVisitorCount();


var visitorCountElement = document.getElementById('visitorCount');

// Listen for changes in the visitor count and update the display
database.ref('visitors').on('value', function (snapshot) {
    var visitorCount = snapshot.val();
    visitorCountElement.textContent = visitorCount;
});