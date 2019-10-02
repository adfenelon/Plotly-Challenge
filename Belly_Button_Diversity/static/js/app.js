function BuildBellyButtonMetaData(sample) {
  //Use d3 to select the panel with id of '$sample-metadata'
  d3.json(`/metadata/${sample}`).then((data) => {
    var PANEL = d3.select("#sample-metadata");
    
    // Use '.html("") to clear any existing metadata
    PANEL.html("");
    
    //Use 'Object.entries' to add each key value pair to the panel
    //Hint: Inside the loop, you will need to use d3 to append new
    //tags for each key value
    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`); 
    });

    //BONUS: Build the Gauge Chart
    // buildGauuge(data.WFREQ) {
    

    
  });
} 

function buildCharts(sample) {
  //Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {
    const otu_ids = data.otu_ids;
    const otu_labels = data.otu_labels;
    const sample_values = data.sample_values;
    const WFREQ = data.WFREQ;

    //Build a Bubble Chart using the sample data
    var bubbleChartLayout = {
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" }
    };

    var bubbleChartData = [
      {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
        }
      }
    ];
     
    Plotly.newPlot("bubble", bubbleChartData, bubbleChartLayout);

    //Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    
     var pieChartData = [{
      values: sample_values.slice(0, 10),
      labels: otu_ids.slice(0, 10),
      hovertext: otu_labels.slice(0, 10),
      hoverinfo: "hovertext",
      type: 'pie'
    }];
    
    var pieChartlayout = {
      margin: {t: 0, l: 0},
      showlegend: true,
      legend: {
        x:1,
        y:0.2
      }    
    };
    
    Plotly.newPlot("pie", pieChartData, pieChartlayout);

    //bonus: build gauge chart
    // buildGuage(data.WFREQ);

    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number+delta",
        value: WFREQ,
        title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
        delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
          bar: { color: "darkblue" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 5], color: "cyan" },
            { range: [5, 10], color: "royalblue" }
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: 10
          }
        }
      }
    ];
    
    var layout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: { color: "darkblue", family: "Arial" }
    };
    
    
    Plotly.newPlot("gauge", gaugeData, layout);
  })
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    BuildBellyButtonMetaData(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  BuildBellyButtonMetaData(newSample);
}

// Initialize the dashboard
init();
