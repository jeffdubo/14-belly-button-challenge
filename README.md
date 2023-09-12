# Belly Button Challenge

The assignment is to build an interactive dashboard to explore the Belly Button Biodiversity dataset, which catalogs the microbes that colonize human navels. The dashboard contains a dropdown menu of all test subjects and the following items for for the selected test subject:
- Horizontal bar chart of sample values for each OTU id (microbial species found in the sample)
- Bubble chart of sample values for each OTU id
- Demographic information (ethnicity, gender, age, location, belly button type, and belly button wash frequency)
- Gauge indicating the belly button wash frequency for the current test subject 

## Repository Contents

This repository contains the following files:

1. README.md - This file
2. index.html - Published HTML file to display the interactive dashboard
3. samples.json - JSON file with dataset to review
4. static\js\app.js - Javascript file to create and update the interactive dashboard (except for the gauge)
5. static\js\bonus.js - Javascript file to create and update the gauge. Note: the gauge functions are called from app.js

## Analysis and Reflections

The dashboard provides interesting information on a single subject and is not designed for detailed analysis of the dataset as a whole. The number of microbial species found in many of the test subjects was concerning but not surprising given our symbiotic relationship with microbes in general. I think it would be interesting to compare the wash frequency with individual OTU sample values (which OTUs are most impacted by wash frequncy?) as well as the total sample values for all subjects.

The most difficult aspect of the challenge was definitely the bonus. I was able to create the basic gauge but did not have time to fully research and execute a gauge with an arrow. I also could not increase the thickness of the gauge itself in order to annotate the text (ex 0-1, 1-2). I look forward to seeing the complete solution with this code.