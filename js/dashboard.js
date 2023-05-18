var xValues = ["Jan", "Feb", "Mar", "Apr", "May"];
var yValues = [55, 49, 44, 24, 15];
var barColors = "#AEC2B6";
// chart colors
var colors = ['#007bff', '#28a745', '#333333', '#c3e6cb', '#dc3545', '#6c757d'];

new Chart("bar", {
    type: "bar",
    data: {
        labels: xValues,
        datasets: [{
            data: [589, 445, 483, 503, 689, 692, 634],
            backgroundColor: colors[0]
        },
        {
            data: [639, 465, 493, 478, 589, 632, 674],
            backgroundColor: colors[1]
        }]
    },
    options: {
        legend: { display: false },
        title: {
            display: true,
            text: "Sunergy Bar Chart"
        },
        scales: {
            xAxes: [{
                barPercentage: 0.4,
                categoryPercentage: 0.5
            }]
        }
    }
});


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