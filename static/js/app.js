// Belly Button Challenge

// Get endpoint for Belly Button Biodiversity dataset
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Promise Pending
const dataPromise = d3.json(url);

// Fetch the JSON data and log it for review
d3.json(url).then(function(jsonData) {
    // Display JSON data for review
    console.log('JSON Data: ', jsonData);

    // Store JSON data in variables
    metadata = jsonData.metadata;
    names = jsonData.names;
    samples = jsonData.samples;

    // Log first row of data in variables for review/testing
    console.log('First metadata:', metadata[0]);
    console.log('First name:', names[0]);
    console.log('First sample:', samples[0]);

    // Call functions to create and initiatize dashboard items
    createSubjectDropDown(names);
    createDemoInfo(metadata[0]);
    plotBar(samples[0]);
    plotBubble(samples[0]);
    createGauge(metadata[0]);
    testGauge(metadata[0]);

    // Function used to determine the largest OTU ID to create formula to calculate the color of a bubble
    // getMaxID(samples)
});

// Event handler for subject ID dropdown menu
function optionChanged(newSubject) {
    
    // Create variables to store data on new subject
    let new_metadata = metadata.filter(function(metadata) { return metadata.id === parseInt(newSubject); });
    let new_samples = samples.filter(function(samples) { return samples.id === newSubject; });
    
    // Log new data for review/testing
    console.log('New metadata: ', new_metadata[0]);
    console.log('New samples: ', new_samples[0]);

    // Update all charts and information for the new subject
    updateDemoInfo(new_metadata[0]);
    updateBar(new_samples[0]);
    updateBubble(new_samples[0]);
    updateGauge(new_metadata[0]);
}

// Functiion to determine the largest OTU ID
function getMaxID(samples) {

    // Create variable to store the largest OTU ID
    let maxID = 0;
    
    // Loop through every set of samples to determine the largest OTU ID
    for(let i=0; i<samples.length; i++) {
        let ids = samples[0].otu_ids;
        // Sort IDs in descending order
        ids.sort((firstNum, secondNum) => secondNum - firstNum);

        //  Reset the maxID if the largest ID in the sample is greater than the current max 
        if (ids[0] > maxID) {
            maxID = ids[0];
        };
    }
    console.log('Max OTU ID:', maxID);
}

// Function to add items to the test subject ID dropdown menu.
function createSubjectDropDown(names) {
    
    // Loop through all names/IDs and add drop down menu for selecting a test subject
    for(let i=0; i<names.length; i++) {
        option = names[i]; 
        // Add option element with ID#s as displayed text and value for updating charts/info 
        d3.select('select').append('option').text(option).attr('value', option);
    };
}

// Function to initially display demographic information
function createDemoInfo(metadata) {

    // Find div element for demographic information and get keys and values from metadata
    let demoDiv = d3.select('#sample-metadata');
    keys = Object.keys(metadata);
    values = Object.values(metadata);

    // Loop through all of the keys
    for (let i=0; i<keys.length; i++) {
        // Add an element with a unique ID to display each key and value
        demoDiv.append('p').text(keys[i] + ': ' + values[i]).attr('id', 'meta-'+ keys[i]);
    };
}

// Function to update demographic info when the test subject ID is changed
function updateDemoInfo(metadata) {

    // Find div element for demographic information and get keys and values from metadata
    let demoDiv = d3.select('#sample-metadata');
    keys = Object.keys(metadata);
    values = Object.values(metadata);
    
    // Loop through all of the keys
    for (let i=0; i<keys.length; i++) {
        // Find and update each element to display new values for each key
        demoDiv.select('#meta-' + keys[i]).text(keys[i] + ': ' + values[i]);
    };
}

// Function to get information for the data variable for the horizontal bar and bubble charts
function getChartInfo(subjectSamples, type) {
    
    let otu_ids = subjectSamples.otu_ids;
    let otu_labels =  subjectSamples.otu_labels;
    let sample_values = subjectSamples.sample_values;
    let labels_otu_ids = []; // used for y axis labels for horizontal bar chart

    if (type === 'bar') {
        
        // Slice and reverse arrays to get the top 10 otu_ids
        otu_ids = otu_ids.slice(0, 10).reverse();
        otu_labels = otu_labels.slice(0, 10).reverse();
        sample_values = sample_values.slice(0, 10).reverse();
        
        // Create labels for horizontal chart
        for(let i=0; i<10; i++) {
            labels_otu_ids.push('OTU ' + otu_ids[i]);
        };
    };

    temp_otu_labels = []
    for (i=0; i<otu_labels.length; i++) {
        temp_otu_labels.push(String(otu_labels[i]).replaceAll(';','</br>'));
    }

    otu_labels = temp_otu_labels;

    // Code reference: https://www.javascripttutorial.net/javascript-return-multiple-values/
    return {otu_ids, otu_labels, sample_values, labels_otu_ids};
};

// Array of colors for bubble chart
// Code reference: https://htmlcolorcodes.com
colorArray = [
    '#532D9C', '#382D9C', '#2D3A9C', '#2D489C', '#2D5F9C', '#2D709C', '#2D7F9C', '#2D959C', '#2D9C90', '#2D9C7E',
    '#2D9C6B', '#2D9C57', '#2D9C41', '#2D9C30', '#459C2D', '#579C2D', '#6B9C2D', '#779C2D', '#8B9C2D', '#9C992D',
    '#9C8D2D', '#9C812D', '#9C742D', '#9C742D', '#9C572D', '#9C4D2D', '#9C412D', '#9C342D', '#9C2D3C', '#9C2D4B',
    '#9C2D5C', '#9C2D65', '#9C2D72', '#9C2D81', '#9C2D8D', '#9C2D9A', '#8D2D9C', '#7F2D9C', '#772D9C', '#612D9C'
];

// Function to get the colors of all bubble based on the otu_ids
function getBubbleColors(otu_ids) {
    
    // Create an array to hold colors of all otu_id
    otu_colors = [];

    // Loop through ids and each hex code to the array
    for (i=0; i<otu_ids.length; i++) {
        // The max ID is 3450 and there are 40 colors available. Dividing by 88 ensures the largest index is 39
        otu_colors.push(colorArray[Math.round(otu_ids[i] / 88)]); // 
    };

    return otu_colors;
}

// Function to initially plot the horizontal bar chart
function plotBar(samples) {

    // Get information needed to create chart
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

    // Plot chart
    Plotly.newPlot('bar', data, layout);
}

// Function to initially plot the bubble chart
function plotBubble(samples) {

    // Get information needed to create chart
    let info = getChartInfo(samples, 'bubble');
    // let text = String(info.otu_labels).replaceAll(';', '</br>');

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
        height: 900,
        width: 1200,
        showlegend: false,
    };

    // Plot chart
    Plotly.newPlot('bubble', data, layout);
}

// Function to update horizontal bar chart when test subject is changed
function updateBar(new_samples) {
    
    let info = getChartInfo(new_samples, 'bar');
    
    let update = [{
        x: info.sample_values,
        y: info.labels_otu_ids,
        text: info.otu_labels,
        type: 'bar',
        orientation: 'h'
    }];
    
    // Update chart
    Plotly.react('bar', update);
}

// Function to update bubble chart when test subject is changed
function updateBubble(new_samples) {

    // Get information needed to create chart
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

    // Update chart
    Plotly.react('bubble', update);
}