console.log("script loaded successfully")

// Read in URL
let URL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"


// build metadata
function buildMetadata(metainfo) {
    d3.json(URL).then((data) => {
        let metadata = data.metadata;
        // filter objects 
        let metaDataArray = metadata.filter(sampleObj => sampleObj.id == metainfo);
        let panel_body = d3.select("#sample-metadata");
        let result = metaDataArray[0];
        // clear meta data
        panel_body.html("");
        // loop and tag for key values
        for (key in result){
            panel_body.append("h4").text(`${key.toUpperCase()}: ${result[key]}`);
        };
      });
    }

// buildcharts
function buildCharts(sampleIndex) {
    d3.json(URL).then((data) => {
        // create an empty array
        let selectedSample = data.samples;
        let chart = selectedSample.filter(sampleObj => sampleObj.id == sampleIndex);
        let resultData = chart[0];

        // object out ids, lables and values.
        let topOtuIds = resultData.otu_ids;
        let topSampleValues = resultData.sample_values;
        let topOtuLabels = resultData.otu_labels;


        // create bargraph.
        let yAxis = topOtuIds.slice(0, 10).map(otuID => `otu_ids ${otuID}`);
        let BarTrace = [{
            type: "bar",
            orientation: "h",
            x: topSampleValues.slice(0, 10),
            y: yAxis,
            text: topOtuLabels.slice(0, 10),
        }];

        let layout = {
            title: `Top 10 OTUs Samples ${sampleIndex}`,
            xaxis: { title: "Sample Values" },
            yaxis: { type: "category", autorange: "reversed" },
            height: 800,
            width: 1000,
        };

        Plotly.newPlot("bar", BarTrace, layout);
    
        // create bubble chart
        let BubbleChartData = [{
            x: topOtuIds,
            y: topSampleValues,
            text: topOtuLabels,
            mode: 'markers',
            marker: {
                size: topSampleValues,
                color: topOtuIds,
                colorscale: "Earth"
            }
        }];

        let bubblechart = {
            title: `Bubble Chart for Sample ${sampleIndex}`,
            hovermode: "closest",
            xaxis: { title: "OTU IDs" },
            yaxis: { title: "Sample Values" },
            height: 600,
            width: 1200,
        };


        Plotly.newPlot("bubble", BubbleChartData, bubblechart);
    });
    
}

function init() {
    let selDataset = d3.select("#selDataset");
    d3.json(URL).then((data) => {
        let sampIdNames = data.names;
        // loop through and append 
        for (let i = 0; i < sampIdNames.length; i++) {
            selDataset.append("option").text(sampIdNames[i]).property("value", sampIdNames[i]);
        }
        let TestSubjectIdNo = sampIdNames[0];
        buildMetadata(TestSubjectIdNo);
        buildCharts(TestSubjectIdNo);
        
    });
}
// option changed function code will not work without.
function optionChanged(data) {
    console.log("Option changed. Selected index:", data);
    buildCharts(data);
    buildMetadata(data);
}

init();