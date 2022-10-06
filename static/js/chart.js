function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/js/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

/////////////////////////////////////////
//<------- START DELIVERABLE 1 ------->//
/////////////////////////////////////////

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/js/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesData = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesFiltered = samplesData.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = samplesFiltered[0];


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var resultOtuIds = result.otu_ids;
    var resultOtuLabels = result.otu_labels;
    var resultValues = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.
    
    //var yticks = resultOtuIds.map(id=> `OTU ${id}`).slice(0,10).reverse(); 
    var yticks = resultOtuIds.map((id,index) => {
      return {otuID:`OTU ${id}`, sampleValue:resultValues[index], label:resultOtuLabels[index]};
    })
    .sort((a,b)=>b.sampleValue - a.sampleValue)
    .slice(0,10)
    .reverse();

    var topOtuIds = yticks.map(bacteria=>bacteria.otuID);
    var topOtuLabels = yticks.map(bacteria=>bacteria.label);
    var topValues = yticks.map(bacteria=>bacteria.sampleValue);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: topValues,
      y: topOtuIds,
      hovertext: topOtuLabels,
      type:"bar",
      orientation:"h"
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

///////////////////////////////////////
//<------- END DELIVERABLE 1 ------->//
///////////////////////////////////////

/////////////////////////////////////////
//<------- START DELIVERABLE 2 ------->//
/////////////////////////////////////////

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: resultOtuIds,
      y: resultValues,
      text: resultOtuLabels,
      mode: "markers",
      marker: {
        size: resultValues,
        color: resultOtuIds,
        colorscale: "Earth",
      }
  }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis: {title: "OTU ID"},
      margin: {
        l: 50,
        r: 50,
        t: 50,
        b: 100
      },
      hovermode: "closest",
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

///////////////////////////////////////
//<------- END DELIVERABLE 2 ------->//
///////////////////////////////////////


/////////////////////////////////////////
//<------- START DELIVERABLE 3 ------->//
/////////////////////////////////////////

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var resultArray = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0];

    // 3. Create a variable that holds the washing frequency.
    var wfreq = parseFloat(result.wfreq);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type:"indicator",
      value: wfreq,
      title: {text: "Scrubs per Week"},
      mode: "gauge+number",
      gauge: {
        axis: {range: [null,10], dtick: 2},
        steps:[
          {range: [0,2], color:"red"}, 
          {range: [2,4], color:"orange"}, 
          {range: [4,6], color:"yellow"}, 
          {range: [6,8], color:"yellowgreen"}, 
          {range: [8,10], color:"green"}],
        bar:{color: "black"}
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      title: "<b>Belly Button Washing Frequency</b>",
      width: 400,
      height: 400,
      margin: { t: 100, r: 50, l: 50, b: 50 },
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);


///////////////////////////////////////
//<------- END DELIVERABLE 3 ------->//
///////////////////////////////////////
    
  });
}
