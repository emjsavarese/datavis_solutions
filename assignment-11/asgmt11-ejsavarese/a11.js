/**
 * Emily Savarese
 * Levine
 * CSc 444
 * DUE 4/19/2021
 * 
 * This program generates a scatterplot of points corresponding dataRanges to 
 * opacities. When these points are dragged on the graph, they change the opacity
 * on the visualization. Each button, on press, changes the color map of the visualization.
 * Theres a categorical, sequential, and diverging color map!
 */

////////////////////////////////////////////////////////////////////////
// Global variables and helper functions

// colorTF and opacityTF store a list of transfer function control
// points.  Each element should be [k, val] where k is a the scalar
// position and val is either a d3.rgb or opacity in [0,1] 
let colorTF = [];
let opacityTF = [];

// D3 layout variables
let size = 500;
let svg = null;

// Variables for the scales
let xScale = null;
let yScale = null;
let colorScale = null;


let xAxis = d3.axisBottom(xScale);
let yAxis = d3.axisLeft(yScale);

let line = d3.line()
    .x(function(d) { return xScale(d[0]); })
    .y(function(d) { return yScale(d[1]); });

let padding = 50;

let squareHeight = 30;

////////////////////////////////////////////////////////////////////////
// Visual Encoding portion that handles the d3 aspects

// Function to create the d3 objects
function initializeTFunc() {
  svg = d3.select("#tfunc")
    .append("svg")
    .attr("width", size)
    .attr("height", size);

  xScale = d3.scaleLinear().domain([dataRange[0], dataRange[1]]).range([padding,size-padding]);
  yScale = d3.scaleLinear().domain([0, 1]).range([size - padding, padding]);


  xAxis = d3.axisBottom(xScale); // create an axis object for the x axis
  yAxis = d3.axisLeft(yScale);

  svg.append("g").attr("class", "xaxis").attr("transform", "translate(0," + (size - padding) + ")").call(xAxis);
  svg.append("g").attr("class", "yaxis").attr("transform", "translate(" + padding + ",0)").call(yAxis); 


  /*svg.append("path")
    .datum(dataRange)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", function(d) {console.log(line(d)); line});*/

  //Initialize circles for the opacity TF control points
  let drag = d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);

  svg.append("g")
    .attr("class", "points")
    .selectAll("circle")
    .data(opacityTF)
    .enter()
    .append("circle")
    .attr("index", (d,i) => i)
    .style('cursor', 'pointer')
    .call(drag);

  let cxScale = d3.scaleLinear().domain([dataRange[0],dataRange[1]]).range([0,400]);

  svg.append("g")
  .selectAll("rect")
  .data(colorTF)
  .enter()
  .append("rect")
  .attr("x", d => cxScale(d[0]))
  .attr("y", 470)
  .attr("width", 100)
  .attr("height", squareHeight)
  .attr("fill", function(d) {
    return colorScale(d[0]);
  });

  //After initializing, set up anything that depends on the TF arrays
  updateTFunc();
}

// Call this function whenever a new dataset is loaded or whenever
// colorTF and opacityTF change

function updateTFunc() {
  //update scales
  //range of dataRange values
  xScale = d3.scaleLinear().domain([dataRange[0], dataRange[1]]).range([padding,size-padding]);
  yScale = d3.scaleLinear().domain([0, 1]).range([size - padding, padding]);

  xAxis.scale(xScale);
  yAxis.scale(yScale);
  
  svg.select(".xaxis").call(xAxis);
  svg.select(".yaxis").call(yAxis);

 
 
  //update opacity curves
  d3.select(".points")
    .selectAll("circle")
    .data(opacityTF)
    .attr('r', 5)
    .attr('cx', function(d){return xScale(d[0]);})
    .attr('cy', function(d){return yScale(d[1]);});

    //svg.select("path").attr('d', line);
  

  svg.selectAll("rect")
  .data(colorTF)
  .attr("fill", function(d) {
    return colorScale(d[0]);
  })

}


// To state, let's reset the TFs and then initialize the d3 SVG canvas
// to draw the default transfer function

resetTFs();
initializeTFunc();


////////////////////////////////////////////////////////////////////////
// Interaction callbacks

// Will track which point is selected
let selected = null;

// Called when mouse down
function dragstarted(event,d) {
  selected = parseInt(d3.select(this).attr("index"));
}

// Called when mouse drags
function dragged(event,d) {
  if (selected != null) {
    let pos = [];
    pos[0] = xScale.invert(event.x);
    pos[1] = yScale.invert(event.y);

    //based on pos and selected, update opacityTF
    //TODO: WRITE THIS

    opacityTF[selected] = pos;

    //update TF window
    updateTFunc();
    
    //update volume renderer
    updateVR(colorTF, opacityTF);
  }
}

// Called when mouse up
function dragended() {
  selected = null;
}




////////////////////////////////////////////////////////////////////////
// Function to read data

// Function to process the upload
function upload() {
  if (input.files.length > 0) {
    let file = input.files[0];
    console.log("You chose", file.name);

    let fReader = new FileReader();
    fReader.readAsArrayBuffer(file);

    fReader.onload = function(e) {
      let fileData = fReader.result;

      //load the .vti data and initialize volren
      initializeVR(fileData);

      //upon load, we'll reset the transfer functions completely
      resetTFs();

      //Update the tfunc canvas
      updateTFunc();
      
      //update the TFs with the volren
      updateVR(colorTF, opacityTF, false);
    }
  }
}

// Attach upload process to the loadData button
var input = document.getElementById("loadData");
input.addEventListener("change", upload);



////////////////////////////////////////////////////////////////////////
// Function to respond to buttons that switch color TFs

function resetTFs() {
  makeSequential();
  makeOpacity();
}

/**
 * The default opacity is changed to represent increments of .25!
 */
function makeOpacity() {
  opacityTF = [
    [dataRange[0], 0],
    [dataRange[1]/4, .25],
    [dataRange[1]/2, .5],
    [dataRange[1]*3 /4, .75],
    [dataRange[1], 1]
  ];
}


/**
 * Creates a sequential colormap for the data!
 */
function makeSequential() {
  colorScale = d3.scaleLinear().domain([dataRange[0], dataRange[1]/4, dataRange[1]/2, dataRange[1]*3 /4, dataRange[1]]).range([d3.rgb(202, 242, 249), 
    d3.rgb(180, 226, 234),d3.rgb(138, 195, 207), d3.rgb(90, 162, 177), d3.rgb(51, 140, 157)]);

  colorTF = [
    [dataRange[0], d3.rgb(202, 242, 249)], 
    [dataRange[1]/4, d3.rgb(180, 226, 234)],
    [dataRange[1]/2, d3.rgb(138, 195, 207)],
    [dataRange[1]*3 /4, d3.rgb(90, 162, 177)],
    [dataRange[1], d3.rgb(51, 140, 157)]
  ];
}


/**
 *  Creates a diverging colormap for the data!
 */
function makeDiverging() {
  colorScale = d3.scaleLinear().domain([dataRange[0], dataRange[1]/4, dataRange[1]/2, dataRange[1]*3 /4, dataRange[1]]).range([d3.rgb(0, 66, 157), 
    d3.rgb(115, 162, 198),d3.rgb(255, 255, 224), d3.rgb(244, 119, 127), d3.rgb(147, 0, 58)]);

  colorTF = [
    [dataRange[0], d3.rgb(0, 66, 157)], 
    [dataRange[1]/4, d3.rgb(115, 162, 198)],
    [dataRange[1]/2, d3.rgb(255, 255, 224)],
    [dataRange[1]*3 /4, d3.rgb(244, 119, 127)],
    [dataRange[1], d3.rgb(147, 0, 58)]
  ];
}

/**
 * Creates a categorical colormap for the data!
 */
function makeCategorical() {
  colorScale = d3.scaleLinear().domain([dataRange[0], dataRange[1]/4, dataRange[1]/2, dataRange[1]*3 /4, dataRange[1]]).range([d3.rgb(141,211,199), 
    d3.rgb(255,255,179),d3.rgb(190,186,218), d3.rgb(251,128,114), d3.rgb(128,177,211)]);

  colorTF = [
    [dataRange[0], d3.rgb(141,211,199)], 
    [dataRange[1]/4, d3.rgb(255,255,179)],
    [dataRange[1]/2, d3.rgb(190,186,218)],
    [dataRange[1]*3 /4, d3.rgb(251,128,114)],
    [dataRange[1], d3.rgb(128,177,211)]
  ];
}

// Configure callbacks for each button
d3.select("#sequential").on("click", function() {
  makeSequential();
  updateTFunc();
  updateVR(colorTF, opacityTF, false);
});


d3.select("#diverging").on("click", function() {
  makeDiverging();
  updateTFunc();
  updateVR(colorTF, opacityTF, false);
});

d3.select("#categorical").on("click", function() {
  makeCategorical();
  updateTFunc();
  updateVR(colorTF, opacityTF, true);
});


