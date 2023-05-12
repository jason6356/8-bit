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


var xValues = ["1", "2", "3", "4", "5"];
var yValues = [55, 49, 44, 24, 15];
var barColors = "#AEC2B6";

var chDonutData = {
    labels: ['Feedback', 'Complaint', 'Other'],
    datasets: [
        {
            backgroundColor: colors.slice(0, 3),
            borderWidth: 0,
            data: [74, 11, 40]
        }
    ]
};

var donutOptions = {
    cutoutPercentage: 85,
    legend: { position: 'bottom', padding: 5, labels: { pointStyle: 'circle', usePointStyle: true } }
};

new Chart("doughnut", {
    type: "doughnut",
    data: chDonutData,
    options: {
        title: {
            display: true,
            text: "Sunergy Doughnut chart"
        },
        donutOptions
    }
});