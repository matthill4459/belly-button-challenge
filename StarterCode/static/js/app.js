console.log("script loaded successfully")

// Read in URL
let URL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// fetch json data using D#
d3.json(URL).then(function(loadedData){
    // log data to make sure it works
    console.log(loadedData)
    // Once data is loaded, assign it to the 'data' variable to be used later
        let data = loadedData;
    

    // select the dropdown element
    let dropdown = d3.select("#selDataset");
    
    data.samples.forEach(sample => {
        sample.id = +sample.id
    });

    // populate the dropdown element with IDs
    data.samples.forEach((sample, index) => {
        dropdown.append("option").text(sample.id).property("value", index);
        // console.log(data)
  });
  
  function updateMetadata(metadata) {
    // Select the HTML element to display the metadata
    let metadataDiv = d3.select("#sample-metadata");
  
    // Clear existing metadata
    metadataDiv.html("");
  
    // Display each key-value pair
    for (let key in metadata) {
      metadataDiv.append("p").text(`${key}: ${metadata[key]}`);
    }
  }

    //Event listener for dropdown change
    dropdown.on("change", function () {
    // Convert the dropdown value to a number
    let selectedSampleId  = +d3.select(this).property("value");

    // Find the selected sample
    let selectedSample = data.samples.find(sample => +sample.id === selectedSampleId );

    if (!selectedSample) {
        console.error(`Sample with ID ${selectedSampleId } not found.`);
        return;
    }

    // Find the metadata for the selected sample
    let selectedMetadata = data.metadata.find(metadata => metadata.id === selectedSampleId );

    if (!selectedMetadata) {
        console.error(`Metadata not found for sample ID: ${selectedSampleId }`);
        return;
    }

    // Call the update functions with the converted ID and metadata
    updateBarChart(selectedSample);
    updateBubbleChart(selectedSample);
    updateMetadata(selectedMetadata);
    optionChanged(selectedSampleId);
    });
 

    function optionChanged(data) {
        // Update the charts based on the selected sample index
        console.log("Option changed. Selected index:", data);
        updateBarChart(data);
        updateBubbleChart(data);
    };

    // Initial rendering with the first sample
    let initialSampleIndex = 0;
    updateBarChart(initialSampleIndex);
    updateBubbleChart(initialSampleIndex);

    // Function to update the bar chart based on the selected sample index
    function updateBarChart(sampleIndex) {
    // Find the selected sample
    let selectedSample = data.samples[sampleIndex];

    if (!selectedSample) {
        console.error(`Sample at index ${sampleIndex} is undefined.`);
        return;
      }
    // Find the metadata for the selected sample
    let selectedMetadata = data.metadata.find(metadata => metadata.id === selectedSample.id);

    if (!selectedMetadata) {
        console.error(`Metadata not found for sample ID: ${selectedSample.id}`);
        return;
    }

    updateMetadata(selectedMetadata);

    // Select the top 10 OTUs
    let topOtuIds = selectedSample.otu_ids.slice(0, 10).map(String);
    let topSampleValues = selectedSample.sample_values.slice(0, 10);
    let topOtuLabels = selectedSample.otu_labels.slice(0, 10);
  
    // Combine otu_ids and otu_labels for better labeling in the chart
    let combinedLabels = topOtuIds.map((id, index) => `${id}: ${topOtuLabels[index]}`);
  
    // Create trace for the horizontal bar chart
    let trace = {
      type: "bar",
      orientation: "h",
      x: topSampleValues,
      y:  topOtuIds,
      text: combinedLabels,
    };
  
    // Create layout for the bar chart
    let layout = {
      title: `Top 10 OTUs for Sample ${selectedSample.id}`,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs", type: "category", autorange: "reversed" },
    };
  
    // Plot the chart
    Plotly.newPlot("bar", [trace], layout);

    
  }

    // new chart
    // Function to update the bubble chart based on the selected sample index
    function updateBubbleChart(sampleIndex) {
    // Find the selected sample
    let selectedSample = data.samples[sampleIndex];
  
    // Ensure that selectedSample is not undefined
    if (!selectedSample) {
      console.error(`Sample at index ${sampleIndex} is undefined.`);
      return;
    }
    // Find the metadata for the selected sample
    let selectedMetadata = data.metadata.find(metadata => metadata.id === selectedSample.id);

    if (!selectedMetadata) {
        console.error(`Metadata not found for sample ID: ${selectedSample.id}`);
        return;
    }

    updateMetadata(selectedMetadata);

    // Create trace for the bubble chart
    let trace = {
      x: selectedSample.otu_ids,
      y: selectedSample.sample_values,
      text: selectedSample.otu_labels,
      mode: 'markers',
      marker: {
        size: selectedSample.sample_values,
        color: selectedSample.otu_ids,
        colorscale: 'Earth',  // You can choose a different color scale
      }
    };
  
    // Create layout for the bubble chart
    let layout = {
      title: `Bubble Chart for Sample ${selectedSample.id}`,
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" },
      height: 600,
      width: 1200,
    };
  
    // Plot the chart
    Plotly.newPlot("bubble", [trace], layout);
    }
});
