// Bonus: Create wash frequency gauge

// Array of colors for the gauge
let gaugeColors = ['#F7F3EA', '#F2ECE1', '#EDEAD5', '#E4E9AE','#D1E7A0', '#BAD088', '#8DBC70', '#7AA967', '#71A45D'];

// Function to create gauge
function createGauge(metadata) {

    let data = [{
        domain: {x: [0, 1], y: [0, 1]},
        value: metadata.wfreq,
        type: 'indicator',
        mode: 'gauge+number',
        gauge: {
            shape: 'angular',
            borderwidth: 0,
            bar: {
                thickness: .5
            },
            axis: {
                range: [null, 9],
                tickmode: 'array',
                tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                ticks: '', // Hide tick marks
            },
            steps: [
                {range: [0, 1], color: gaugeColors[0]},
                {range: [1, 2], color: gaugeColors[1]},
                {range: [2, 3], color: gaugeColors[2]},
                {range: [3, 4], color: gaugeColors[3]},
                {range: [4, 5], color: gaugeColors[4]},
                {range: [5, 6], color: gaugeColors[5]},
                {range: [6, 7], color: gaugeColors[6]},
                {range: [7, 8], color: gaugeColors[7]},
                {range: [8, 9], color: gaugeColors[8]},
            ]
        }
    }];

    let layout = {
        title: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week',
        width: 400,
        height: 350,
        // Set margins for display
        margin: {
            l: 15,
            r: 15,
            t: 50,
            b: 50
        }
    };

    // Plot gauge
    Plotly.newPlot('gauge', data, layout);
    // Note:L index.html was updated to right align gauge div
}

// Function to update gauge when test subject is changed
function updateGauge(metadata) {
    
    // Restyle with new wash frequency
    Plotly.restyle('gauge', 'value', metadata.wfreq);
}