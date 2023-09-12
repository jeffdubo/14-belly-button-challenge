let colors = ['#ffffff', '#F7F3EA', '#F2ECE1', '#EDEAD5', '#E4E9AE','#D1E7A0', '#BAD088', '#8DBC70', '#7AA967', '#71A45D'];

function createGauge(metadata) {

    let data = [{
        domain: {x: [0, 1], y: [0, 1]},
        value: metadata.wfreq,
        title: {text: 'Belly Button Washing Frequency'},
        type: 'indicator',
        mode: 'gauge',
        gauge: {
            shape: 'angular',
            thickness: 1,
            borderwidth: 0,
            bar: {
                thickness: .75
            },
            axis: {
                range: [null, 9],
                tickmode: 'array',
                tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                ticktext: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
                ticklabelposition: "inside",
                ticks: '',

            },
            steps: [
                {range: [0, 1], color: colors[0]},
                {range: [1, 2], color: colors[1]},
                {range: [2, 3], color: colors[2]},
                {range: [3, 4], color: colors[3]},
                {range: [4, 5], color: colors[4]},
                {range: [5, 6], color: colors[5]},
                {range: [6, 7], color: colors[6]},
                {range: [7, 8], color: colors[7]},
                {range: [8, 9], color: colors[8]},
            ]
        }
    }];

    let layout = {
        width: 600,
        height: 300
    };

    Plotly.newPlot('gauge', data, layout);
}

function updateGauge(metadata) {

    let update = [{
        domain: {x: [0, 1], y: [0, 1]},
        value: metadata.wfreq,
    }]

    let layout = {
        width: 600,
        height: 300
    };

    Plotly.restyle('gauge', 'value', metadata.wfreq);

}

// https://community.plotly.com/t/plotly-js-gauge-pie-chart-data-order/8686
function testGauge(metadata) {
    // Trig to calc meter point
    wfreq = metadata.wfreq;
    var degrees = 180-(20*wfreq);
    var radians = degrees * Math.PI / 180;
    var x = .5 * Math.cos(radians);
    var y = .5 * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{
        type: 'category',
        x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'speed',
        text: wfreq,
        hoverinfo: 'text+name',
        values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6','4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition:'inside',
        marker: { 
            colors: colors.reverse()
        },
        labels: ['8-9', '7-8', '6-7', '5-6','4-5', '3-4', '2-3', '1-2', '0-1', ''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
    }];

    var layout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
                color: '850000'
            }
        }],
        title: 'Maturity Total Score 1-5',
        height: 500,
        width: 600,
        xaxis: {
            type:'category', zeroline: false, showticklabels: false,
            showgrid: false, range: [-1, 1]
        },
        yaxis: {
            type:'category',zeroline:false, showticklabels:false,
            showgrid: false, range: [-1, 1]
        }
    };

    Plotly.newPlot('gauge', data, layout);
}