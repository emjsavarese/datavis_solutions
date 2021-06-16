/**
 * Emily Savarese
 * Joshua Levine
 * DUE: 3/22/2021
 * 
 * This program creates an svg line for every data point in iris.js, scaling the lines so each point in the 
 * svg line coordinates with the value of the axis that its on. Labels have an onClick function that makes it
 * swap that label and that axis (as well as the brushes) with the one to its immediate right. If its the last
 * axis, it swaps with the one to its immediate left. There are also brushes for each axis, and depending
 * on which axises you draw your brushes on, it filters which items get selected and the opacity changes
 * depending on whether or not the line is selected.
 * 
 * I totally didn't see that axises and labels were arrays within this file,
 * I ended up mostly ignoring them and creating my own.
 */



////////////////////////////////////////////////////////////////////////
// Global variables for the dataset 

let data = iris;

// dims will store the four axes in left-to-right display order
let dims = [
  "sepalLength",
  "sepalWidth",
  "petalLength",
  "petalWidth"
];

// mapping from dimension id to dimension name used for text labels
let dimNames = {
  "sepalLength": "Sepal Length",
  "sepalWidth": "Sepal Width",
  "petalLength": "Petal Length",
  "petalWidth": "Petal Width",
};




////////////////////////////////////////////////////////////////////////
// Global variables for the svg

let width = dims.length*125;
let height = 500;
let padding = 50;

let svg = d3.select("#pcplot")
  .append("svg")
  .attr("width", width).attr("height", height);




////////////////////////////////////////////////////////////////////////
// Initialize the x and y scales, axes, and brushes.  
//  - xScale stores a mapping from dimension id to x position
//  - yScales[] stores each y scale, one per dimension id
//  - axes[] stores each axis, one per id
//  - brushes[] stores each brush, one per id
//  - brushRanges[] stores each brush's event.selection, one per id

let xScale = d3.scalePoint()
  .domain(dims)
  .range([padding, width-padding]);

let yScales = {};
let axes = {};
let brushes = {};
let brushRanges = {};

// For each dimension, we will initialize a yScale, axis, brush, and
// brushRange
dims.forEach(function(dim) {
  //create a scale for each dimension
  yScales[dim] = d3.scaleLinear()
    .domain( d3.extent(data, function(datum) { return datum[dim]; }) )
    .range( [height-padding, padding] );

  //set up a vertical axis for each dimensions
  axes[dim] = d3.axisLeft()
    .scale(yScales[dim])
    .ticks(10);
  
  //set up brushes as a 20 pixel width band
  //we will use transforms to place them in the right location
  brushes[dim] = d3.brushY()
    .extent([[-10, padding], [+10, height-padding]]);
  
  //brushes will be hooked up to their respective updateBrush functions
  brushes[dim]
    .on("brush", updateBrush(dim))
    .on("end", updateBrush(dim))

  //initial brush ranges to null
  brushRanges[dim] = null;
});




////////////////////////////////////////////////////////////////////////
// Make the parallel coordinates plots 
let colorScale = d3.scaleOrdinal().domain(data.map(a => a.species)).range(["#B7C3F3", "#DD7596", "#33cc33"]);
// add the actual polylines for data elements, each with class "datapath"
svg.append("g")
  .selectAll(".datapath")
  .data(data)
  .enter()
  .append("path")
  .attr("class", "datapath")
  .attr("d", function(d){ return d3.line()(dims.map(function(p){ return [xScale(p), yScales[p](d[p])]; })); })
  .style("fill", "none")
  .style("stroke", function(row){return colorScale(row.species);})
  .style("opacity", 0.75);

// add the axis groups, each with class "axis". Each transforms appropriately
// to exist on the svg
svg.selectAll(".axis")
   .data(dims)
   .enter()
   .append("g")
   .attr("info", function(d){return d;})
   .attr("class", "axis")
   .attr("transform", function(d){ return "translate(" + xScale(d) + ")";})
   .each(function(d){ d3.select(this).call(d3.axisLeft().scale(yScales[d])); });


// add the axes labels, each with class "label"
svg.selectAll(".label")
   .data(dims).enter()
   .append("text")
   .attr("info", function(d){return d;})
   .attr("class", "label")
   .attr("transform", function(d){ return "translate(" + xScale(d) + ")";})
   .style("text-anchor", "middle")
   .attr("y", padding/2)
   .text(function(d) { return dimNames[d]; })
   .style("fill", "black")
   .on("click", function(event,d) {onClick(event, d);});

// add the brush groups, each with class ".brush" 
svg.selectAll(".brush")
    .data(dims)
    .enter()
    .append("g")
    .attr("class", "brush")
    .attr("transform", function(d){ return "translate(" + xScale(d) + ")";})
    .each(function(d){ d3.select(this).call(brushes[d]);});




/**
 * On click, the text label will reach into the dims array and swap the one with the 
 * current text label with the one next to it. the xScale is then adjusted with this new
 * dimensions and the svglines, the axes, and the labels are all redrawn!
 * 
 * @param {*} event - the event going on!
 * @param {*} d  - the current datum we're looking at!
 */
function onClick(event,d) {

  newIndex = 0;
  for(i = 0; i <dims.length; i++){
      if (d === dims[i]){
        newIndex = i;
        break;
      }
  }

  swapIndex = newIndex+1;
  if (newIndex+1 === dims.length){
      swapIndex = newIndex-1;
  }

  temp = dims[newIndex];
  dims[newIndex] = dims[swapIndex];
  dims[swapIndex]= temp;

  
  xScale.domain(dims);

  xScale = d3.scalePoint().domain(dims).range([padding, width-padding]);


 svg.selectAll(".axis")
   .data(dims).transition().duration(1000)
   .attr("info", function(d){return d;})
   .attr("transform", function(d){ return "translate(" + xScale(d) + ")";})
   .each(function(d){ d3.select(this).call(d3.axisLeft().scale(yScales[d])); });


   svg.selectAll(".label")
   .data(dims).transition().duration(1000)
   .attr("info", function(d){return d;})
   .text(function(d) { return dimNames[d]; });


   svg.selectAll(".datapath")
    .data(data).transition().duration(1000)
    .attr("d", function(d){ return d3.line()(dims.map(function(p){ return [xScale(p), yScales[p](d[p])]; })); });


  svg.selectAll(".brush").data(dims).transition().duration(1000).attr("transform", function(d){ return "translate(" + xScale(d) + ")";})
  .each(function(d){ d3.select(this).call(brushes[d]);});

}

// Returns a callback function that calls onBrush() for the brush
// associated with each dimension
function updateBrush(dim) {
  return function(event) {
    brushRanges[dim] = event.selection;
    onBrush();
  };
}

/**
 * On brush, it calls isSelected, which loops through every dimension in
 * dims and checks to see if hte range is null. If the range is not null,
 * then it grabs the minimum and maximum y values for that brush as well as 
 * whatever the respective value is from the data and compares them to see if 
 * that item exists in that range. If there are multiple brushes: it will
 * && that to a boolean value to make sure isSelected only returns true if the 
 * line is in EVERY brush.
 * 
 * Selected values have their opacity the same, deselected values have a smaller opacity.
 * 
 */
function onBrush() {
  let allLines = d3.selectAll(".datapath");
  allLines.style("opacity", 0.75);
  
  function isSelected(d) {
    selectBool = true;
    for(i =0; i < dims.length; i++){
        currDim = dims[i];
        if(brushRanges[currDim] != null){   

          miny = brushRanges[currDim][0];
          maxy = brushRanges[currDim][1];

          scaledY = 0;
          if(currDim === "sepalWidth"){
            scaledY = yScales[currDim](d.sepalWidth);
          }
          if (currDim === "sepalLength"){
            scaledY = yScales[currDim](d.sepalLength);
          }
          if (currDim === "petalLength"){
            scaledY = yScales[currDim](d.petalLength);
          }
          if (currDim === "petalWidth"){
            scaledY = yScales[currDim](d.petalWidth);
          }
          selectBool = selectBool && (miny <= scaledY) && (scaledY<= maxy);
        }

    }

    return selectBool;
    
  }

  let selected = allLines
    .filter(isSelected);
  let notSelected = allLines
    .filter(function(d) { return !isSelected(d); });

  // Update the style of the selected and not selected data
  selected.style("opacity", 0.75);
  notSelected.style("opacity", 0.1);
}

