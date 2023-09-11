// Belly Button Challenge

// Get endpoint for Belly Button Biodiversity dataset
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

colorArray = [
    '#532D9C', '#382D9C', '#2D3A9C', '#2D489C', '#2D5F9C', '#2D709C', '#2D7F9C', '#2D959C', '#2D9C90', '#2D9C7E',
    '#2D9C6B', '#2D9C57', '#2D9C41', '#2D9C30', '#459C2D', '#579C2D', '#6B9C2D', '#779C2D', '#8B9C2D', '#9C992D',
    '#9C8D2D', '#9C812D', '#9C742D', '#9C742D', '#9C572D', '#9C4D2D', '#9C412D', '#9C342D', '#9C2D3C', '#9C2D4B',
    '#9C2D5C', '#9C2D65', '#9C2D72', '#9C2D81', '#9C2D8D', '#9C2D9A', '#8D2D9C', '#7F2D9C', '#772D9C', '#612D9C'
];

// Fetch the JSON data and console log it
d3.json(url).then(function(jsonData) {
    // Display JSON data for review
    console.log('JSON Data: ', jsonData);

    // Store JSON data in variables
    metadata = jsonData.metadata;
    names = jsonData.names;
    samples = jsonData.samples;

    // Display first row of data in variables
    console.log('First metadata:', metadata[0]);
    console.log('First name:', names[0]);
    console.log('First sample:', samples[0]);

    // Call functions to create and initiatize dashboard items
    createSubjectDropDown(names);
    createDemoInfo(metadata[0]);
    plotBar(samples[0]);
    plotBubble(samples[0]);

    getMaxID(samples)
});

// Event handler for subject ID dropdown menu
function optionChanged(newSubject) {
    let new_metadata = metadata.filter(function(metadata) { return metadata.id === parseInt(newSubject); });
    let new_samples = samples.filter(function(samples) { return samples.id === newSubject; });
    console.log('New metadata: ', new_metadata[0]);
    console.log('New samples: ', new_samples[0]);
    updateDemoInfo(new_metadata[0]);
    updateBar(new_samples[0]);
    updateBubble(new_samples[0]);
}

function getMaxID(samples) {
    maxID = 0;
    for(let i=0; i<samples.length; i++) {
        let ids = samples[0].otu_ids;
        ids.sort((firstNum, secondNum) => secondNum - firstNum);
        if (ids[0] > maxID) {
            maxID = ids[0];
        };
    }
    console.log(maxID);
}

// Function to add items to the test subject ID dropdown menu.
function createSubjectDropDown(names) {
    for(let i=0; i<names.length; i++) {
        option = names[i];
        // Add option element with ID#s as displayed text and value for updating charts/info 
        d3.select('select').append('option').text(option).attr('value', option);
    };
}

function createDemoInfo(metadata) {
    let demoDiv = d3.select('#sample-metadata');
    keys = Object.keys(metadata);
    values = Object.values(metadata);
    for (let i=0; i<keys.length; i++) {
        demoDiv.append('p').text(keys[i] + ': ' + values[i]).attr('id', 'meta-'+ keys[i]);
    };
}

function updateDemoInfo(metadata) {
    let demoDiv = d3.select('#sample-metadata');
    keys = Object.keys(metadata);
    values = Object.values(metadata);
    for (let i=0; i<keys.length; i++) {
        demoDiv.select('#meta-' + keys[i]).text(keys[i] + ': ' + values[i]);
    };
}

function getChartInfo(subjectSamples, type) {
    // Store information in variables for both charts
    let otu_ids = subjectSamples.otu_ids.slice(0, 10).reverse();
    let otu_labels =  subjectSamples.otu_labels.slice(0, 10).reverse();
    let sample_values = subjectSamples.sample_values.slice(0, 10).reverse();
    let labels_otu_ids = []; // Only used for horizontal chart

    if (type === 'bar') {
        // Slice and reverse arrays to get the top 10 otu_ids
        otu_ids.slice(0, 10).reverse();
        otu_labels.slice(0, 10).reverse();
        sample_values.slice(0, 10).reverse();
        
        // Create labels for horizontal chart
        for(let i=0; i<10; i++) {
            labels_otu_ids.push('OTU ' + otu_ids[i]);
        };
    } else {
        
    }
    
    // Code reference: https://www.javascripttutorial.net/javascript-return-multiple-values/
    return {otu_ids, otu_labels, sample_values, labels_otu_ids};
};

function getBubbleColors(otu_ids) {
    // Create an array of colors (hex codes) based on the otu_id
    // The Dividing max ID (3450) by 86 ensures value won't exceed size of array (40 colors)
    otu_colors = [];
    for (i=0; i<otu_ids.length; i++) {
        // The max ID is 3450 and there are 40 colors available. Dividing by 88 ensures the largest index is 39
        otu_colors.push(colorArray[Math.round(otu_ids[i] / 88)]); // 
    };
    return otu_colors;
}

function plotBar(samples) {

    // Configure and create horizontal bar chart
    let info = getChartInfo(samples, 'bar');

    let data = [{
        x: info.sample_values,
        y: info.labels_otu_ids,
        text: info.otu_labels,
        type: 'bar',
        orientation: 'h'
    }];

    console.log('Bar Chart Data:', data)
     
    let layout = {
        height: 600,
        width: 400
    };

    
    Plotly.newPlot('bar', data, layout);
}

function plotBubble(samples) {

    let info = getChartInfo(samples, 'bubble');

    let data = [{
        x: info.otu_ids,
        y: info.sample_values,
        text: info.otu_labels,
        mode: 'markers',
        marker: {
            color: getBubbleColors(info.otu_ids),
            opacity: .75,
            size: info.sample_values 
        }
    }];

    console.log('Bubble Chart Data:', data)

    let layout = {
        height: 800,
        width: 1200,
        showlegend: false
    };

    Plotly.newPlot('bubble', data, layout);
}


function updateBar(new_samples) {
    
    let info = getChartInfo(new_samples, 'bar');
    
    let update = [{
        x: info.sample_values,
        y: info.labels_otu_ids,
        text: info.otu_labels,
        type: 'bar',
        orientation: 'h'
    }];
    
    Plotly.react('bar', update);
}

function updateBubble(new_samples) {

    info = getChartInfo(new_samples, 'bubble');

    let update = [{
        x: info.otu_ids,
        y: info.sample_values,
        text: info.otu_labels,
        mode: 'markers',
        marker: {
            color: getBubbleColors(info.otu_ids),
            size: info.sample_values 
        }
    }];

    Plotly.react('bubble', update);

}

