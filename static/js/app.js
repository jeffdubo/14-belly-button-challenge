// Belly Button Challenge

// Get endpoint for Belly Button Biodiversity dataset
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Promise Pending
const dataPromise = d3.json(url);

// Fetch the JSON data and log for review
d3.json(url).then(function(jsonData) {
    // Log JSON data for review
    console.log('JSON Data: ', jsonData);

    // Store JSON data in separate variables
    metadata = jsonData.metadata;
    names = jsonData.names;
    samples = jsonData.samples;

    // Log first row of data in variables for review
    console.log('First metadata:', metadata[0]);
    console.log('First name:', names[0]);
    console.log('First sample:', samples[0]);

    // Call functions to create and initiatize dashboard items
    createSubjectDropDown(names);
    createDemoInfo(metadata[0]);
    createBarChart(samples[0]);
    createBubbleChart(samples[0]);
    createGauge(metadata[0]);
    updateGauge(metadata[0]);

    // Function used to determine the largest OTU ID to create formula to calculate the color of a bubble
    // getMaxID(samples)
});

// Event handler for subject ID dropdown menu
function optionChanged(newSubject) {

    // Create variables to store data on new subject
    let new_metadata = metadata.filter(function(metadata) { return metadata.id === parseInt(newSubject); });
    let new_sample = samples.filter(function(samples) { return samples.id === newSubject; });
    
    // Log new data for review/testing
    console.log('New metadata: ', new_metadata[0]);
    console.log('New samples: ', new_sample[0]);

    // Update all charts and information for the new subject
    // Note: [0] is needed as the filter creates a list for the results 
    updateDemoInfo(new_metadata[0]);
    updateBarChart(new_sample[0]);
    updateBubbleChart(new_sample[0]);
    updateGauge(new_metadata[0]);
}

// Function to determine the largest OTU ID
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
    
    // Loop through all names/IDs and add drop down menu option for each test subject
    for(let i=0; i<names.length; i++) {
        option = names[i]; 
        // Add option element with ID number displayed and set as value to reference for updating charts/info 
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
        // Add an element with a unique element id to display each key and value
        demoDiv.append('p').text(keys[i] + ': ' + values[i]).attr('id', 'meta-'+ keys[i]);
    };
}

// Function to update demographic info when the test subject is changed
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

// Function to get information to set data variable for the horizontal bar and bubble charts
function getChartInfo(sample, type) {
    
    let otu_ids = sample.otu_ids;
    let otu_labels =  sample.otu_labels;
    let sample_values = sample.sample_values;
    let otu_id_labels = []; // used for y axis labels for horizontal bar chart

    if (type === 'bar') {
        
        // Slice and reverse arrays to get the top 10 otu_ids
        otu_ids = otu_ids.slice(0, 10).reverse();
        otu_labels = otu_labels.slice(0, 10).reverse();
        sample_values = sample_values.slice(0, 10).reverse();
        
        // Create labels for horizontal bar chart
        for(let i=0; i<10; i++) {
            // Add label to array. Label formatted as 'OTU {otu_ids}', ex: 'OTU 940'
            otu_id_labels.push('OTU ' + otu_ids[i]);
        };
    };
    
    // Create variable and store label items in a list format instead one line with semicolons 
    otu_labels_formatted = []
    for (i=0; i<otu_labels.length; i++) {
        otu_labels_formatted.push(String(otu_labels[i]).replaceAll(';','</br>'));
    }
    
    // Reset label variable to new temp variable
    otu_labels = otu_labels_formatted;

    // Code reference: https://www.javascripttutorial.net/javascript-return-multiple-values/
    return {otu_ids, otu_labels, sample_values, otu_id_labels};
};

// Array of colors for bubble chart
// Code reference: https://htmlcolorcodes.com
bubbleColors = [
    '#532D9C', '#382D9C', '#2D3A9C', '#2D489C', '#2D5F9C', '#2D709C', '#2D7F9C', '#2D959C', '#2D9C90', '#2D9C7E',
    '#2D9C6B', '#2D9C57', '#2D9C41', '#2D9C30', '#459C2D', '#579C2D', '#6B9C2D', '#779C2D', '#8B9C2D', '#9C992D',
    '#9C8D2D', '#9C812D', '#9C742D', '#9C742D', '#9C572D', '#9C4D2D', '#9C412D', '#9C342D', '#9C2D3C', '#9C2D4B',
    '#9C2D5C', '#9C2D65', '#9C2D72', '#9C2D81', '#9C2D8D', '#9C2D9A', '#8D2D9C', '#7F2D9C', '#772D9C', '#612D9C'
];

// Function to get the colors of all bubble based on the otu_ids
function getBubbleChartColors(otu_ids) {
    
    // Create an array to hold colors of otu_ids
    otu_colors = [];

    // Loop through each id
    for (i=0; i<otu_ids.length; i++) {
        // Calculate color and add to array of colors
        // Note: The otu_id the max ID (3450) divided by the last color array index (39) is 88
        // Dividing by 88 ensures the calculation is a valid array index and sets the color based on the otu_id
        otu_colors.push(bubbleColors[Math.round(otu_ids[i] / 88)]); 
    };

    return otu_colors;
}

// Function to initially plot the horizontal bar chart
function createBarChart(sample) {

    // Get information needed to create chart
    let info = getChartInfo(sample, 'bar');

    // Create data variable for plotting charts
    let data = [{
        x: info.sample_values,
        y: info.otu_id_labels,
        text: info.otu_labels,
        type: 'bar',
        orientation: 'h'
    }];

    // Log data for review
    console.log('Initial Bar Chart Data:', data)
     
    let layout = {
        height: 425,
        width: 500,
        margin: {
            l: 120, // Create gap between demographic info and chart,
            t: 0, // Align chart with top of subject drop down
            b: 25 // Reduce gap with bubble chart
        }
    };

    // Plot chart
    Plotly.newPlot('bar', data, layout);
}

// Function to create the bubble chart
function createBubbleChart(sample) {

    // Get information needed to create chart
    let info = getChartInfo(sample, 'bubble');
   
    let data = [{
        x: info.otu_ids,
        y: info.sample_values,
        text: info.otu_labels,
        mode: 'markers',
        marker: {
            color: getBubbleChartColors(info.otu_ids),
            opacity: .75,
            size: info.sample_values 
        }
    }];

    // Log data for review
    console.log('Initial Bubble Chart Data:', data)

    let layout = {
        height: 625,
        width: 1200,
        margin: {
            t: 25
        },
        showlegend: false,
    };

    // Plot chart
    Plotly.newPlot('bubble', data, layout);
}

// Function to update horizontal bar chart when test subject is changed
function updateBarChart(sample) {
    
    let info = getChartInfo(sample, 'bar');
    
    let update = [{
        x: info.sample_values,
        y: info.otu_id_labels,
        text: info.otu_labels,
        type: 'bar',
        orientation: 'h'
    }];
    
    // Update chart
    // Note: Restyling the chart requir
    Plotly.react('bar', update);
}

// Function to update bubble chart when test subject is changed
function updateBubbleChart(sample) {

    // Get information needed to create chart
    info = getChartInfo(sample, 'bubble');

    let update = [{
        x: info.otu_ids,
        y: info.sample_values,
        text: info.otu_labels,
        mode: 'markers',
        marker: {
            color: getBubbleChartColors(info.otu_ids),
            size: info.sample_values 
        }
    }];

    // Update chart
    Plotly.react('bubble', update);
}