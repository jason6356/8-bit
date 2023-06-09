// Function to update the bar chart
function updateBarChart(serviceCounts) {
    var barData = Object.values(serviceCounts);

    var ctx = document.getElementById('barChart');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(serviceCounts),
            datasets: [{
                label: 'Service Types',
                data: barData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
            }]
        },
        options: {
            title: {
                display: true,
                text: "Inbox Service Types Bar Chart"
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}


//-------------------------------------------------------------------------------------------------------------------------------------

//Service Types Doughnut chart

// Function to count the service types
function countServiceTypes() {
    var messagesRef = database.ref('ContactMessage');
    messagesRef.once('value', function (snapshot) {
        var serviceCounts = {
            Feedback: 0,
            Investor: 0,
            Supplier: 0,
            Partnership: 0,
            Others: 0
        };

        snapshot.forEach(function (childSnapshot) {
            var message = childSnapshot.val();
            var service = message.service;
            if (serviceCounts.hasOwnProperty(service)) {
                serviceCounts[service]++;
            }
        });
        console.log(serviceCounts);
        updateBarChart(serviceCounts);
        updateDoughnutChart(serviceCounts);
    });
}

// Function to update the doughnut chart
function updateDoughnutChart(serviceCounts) {
    var doughnutData = Object.values(serviceCounts);

    var ctx = document.getElementById('doughnutChart');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(serviceCounts),
            datasets: [{
                data: doughnutData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
            }]
        },
        options: {
            title: {
                display: true,
                text: "Inbox Service Types Doughnut chart"
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Call the function to count the service types
window.onload = function () {
    countServiceTypes();
};