// Define URL for the JSON data
const jsonURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch
function fetchData() {
  d3.json(jsonURL)
    .then(data => {
      // Test data
      console.log(data);

      // Create dropdown with sample IDs
      const dropdown = d3.select("#selDataset");
      data.names.forEach(sample => {
        dropdown.append("option").text(sample).property("value", sample);
      });

      // Frist sample as default
      const defaultSample = data.names[0];
      updatePage(defaultSample);
    });
}

// Chart 
function updatePage(selectedSample) {
  d3.json(jsonURL)
    .then(data => {
      const sampleData = data.samples.find(sample => sample.id === selectedSample);
      const metadata = data.metadata.find(item => item.id == selectedSample);

      // Top 10 OTUs data
      const top10SampleValues = sampleData.sample_values.slice(0, 10).reverse();
      const top10OTUIds = sampleData.otu_ids.slice(0, 10).reverse();
      const top10OTULabels = sampleData.otu_labels.slice(0, 10).reverse();

      // Create bar chart
      const traceBar = {
        x: top10SampleValues,
        y: top10OTUIds.map(id => `OTU ${id}`),
        text: top10OTULabels,
        type: "bar",
        orientation: "h"
      };

      // Create a data array
      const barData = [traceBar];

      // Layout for the bar chart
      const layoutBar = {
        title: `Top 10 OTUs for Sample ${selectedSample}`,
        xaxis: { title: "Values" },
        yaxis: { title: "OTU ID" }
      };

      // Horizontal bar chart
      Plotly.newPlot("bar", barData, layoutBar);

      // Create a trace for the bubble chart
      const traceBubble = {
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        text: sampleData.otu_labels,
        mode: "markers",
        marker: {
          size: sampleData.sample_values,
          color: sampleData.otu_ids
        }
      };

      // Create a data array for the bubble chart
      const bubbleData = [traceBubble];

      // Define the layout for the bubble chart
      const layoutBubble = {
        title: `Bubble Chart for Sample ${selectedSample}`,
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Values" }
      };

      // Create the bubble chart
      Plotly.newPlot("bubble", bubbleData, layoutBubble);

      // Display the sample metadata in the panel
      const metadataPanel = d3.select("#sample-metadata");
      metadataPanel.html(""); // Clear previous content
      Object.entries(metadata).forEach(([key, value]) => {
        metadataPanel.append("p").text(`${key}: ${value}`);
      });
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}

function optionChanged(selectedSample) {
  updatePage(selectedSample);
}

fetchData();
