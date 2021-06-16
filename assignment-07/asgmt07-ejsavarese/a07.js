/*
* Emily Savarese
* Joshua Levine
*
* This program will create a couple of svg scatterplots: the first one based on the sepalLength as the xAxis and sepalWidth 
* as the y Axis and the second based on petalLength as the x axis and petalWidth as the y axis. 
* Data from iris.js is populated into each scatterplot, also species is connected to what color the datapoints are. 
* You should be able to click on a dot and it should double its size and display what 
* values the dot has in the table. Additionally! You should be able to click and drag your mouse on either scatterplot
* to create a brush; a single brush on either canvas highlights the respective data points on both canvases; a brush
* on both canvases only highlights the values that exist in BOTH brushes.
*/

////////////////////////////////////////////////////////////////////////
// Global variables for the dataset and brushes 
// Also one for radius

let data = iris;
let radius = 5;

// brush1 and brush2 will store the extents of the brushes,
// if brushes exist respectively on scatterplot 1 and 2.
//
// if either brush does not exist, brush1 and brush2 will
// hold the null value.

let brush1 = null;
let brush2 = null;


/**
 * This method makes generic scatterplots! It creates 3 scales: one to scale the x value based on
 * the passed in xAccessor, one to scale the y value based on the yAccessor, and a final one 
 * to scale the colors based on the name. It creates the circles based on the scales as well as
 * attaches the indexes to each value.  On click, the program searches to find other circles
 * with the same index as this one to enlargen (by multiplying the radius by 2). It sets all
 * others to be the radius constant. It also generates axises and provides labels for those axises
 * based on the passed in xName and yNames.
 * 
 * @param {*} sel - d3 selection of a div
 * @param {*} xAccessor - function grabbing the x value we want to base our values on
 * @param {*} yAccessor - function grabbing the y value we want to base our values on
 * @param {*} xName - string of the x axis label
 * @param {*} yName - string of the y axis label
 * @returns a plot object!
 */

function makeScatterplot(sel, xAccessor, yAccessor, xName, yName)
{
  //make these public for everyone to see
  width = 500;
  height = 500;
  padding = 50;

  let svg = sel
    .append("svg")
    .attr("width", width).attr("height", height);

  //scales for x coords, y coords, and the colorscale
  xScale = d3.scaleLinear().domain([d3.min(data, function(row){return xAccessor(row);}), d3.max(data, function(row){return xAccessor(row);})]).range([padding, width-padding]); 
  yScale = d3.scaleLinear().domain([d3.min(data, function(row){return yAccessor(row);}), d3.max(data, function(row){return yAccessor(row);})]).range([height-padding, padding]); 
  let colorScale = d3.scaleOrdinal().domain(data.map(a => a.species)).range(["#B7C3F3", "#DD7596", "#33cc33"]);
   
  let brush = d3.brush();
  
  svg.append("g")
    .attr("class", "brush")
    .call(brush);
  
  //creates all the circles
  let circles = svg.append("g")
    .selectAll("circle")
    .data(iris)
    .enter()
    .append("circle")
    .attr("cx", function(row){ return xScale(xAccessor(row));})
    .attr("cy", function(row){ return yScale(yAccessor(row));})
    .attr("r", function(){return radius;})
    .attr("fill", function(row){return colorScale(row.species);})
    .attr("index", function(row){return iris.indexOf(row);})
    .on("click", function(event,d){ 
        let currIndex = d3.select(this).attr("index");
        
        d3.selectAll("circle").each(function(curr){
            let currCirc = d3.select(this);
            if (currCirc.attr("index") == currIndex){
                currCirc.attr("r", function(){return radius * 2;})

            }else{
                currCirc.attr("r", function(){return radius;})
            }
            });
        //adds the current values data to the table
        d3.select("#table").select("#table-sepalLength").text(d.sepalLength);
        d3.select("#table").select("#table-sepalWidth").text(d.sepalWidth);
        d3.select("#table").select("#table-petalLength").text(d.petalLength);
        d3.select("#table").select("#table-petalWidth").text(d.petalWidth);
        d3.select("#table").select("#table-species").text(d.species);
       });

  let xAxis = d3.axisBottom(xScale); // create an axis object for the x axis
  let yAxis = d3.axisLeft(yScale); // create an axis object for the y axis

  //adds the axises
  svg.append("g").attr("transform", "translate(0," + (height - padding + radius) + ")").call(xAxis);
  svg.append("g").attr("transform", "translate(" + (padding - radius) + ",0)").call(yAxis); 

  //appends text for labels
  svg.append("text")     
        .attr("x", 250)
        .attr("y", 490 )
        .style("text-anchor", "middle")
        .text(xName); 
        

  svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", -220)
        .attr("y", 7)
        .attr("dy", ".50em")
        .attr("transform", "rotate(-90)")
        .text(yName);

  // finally, return a plot object for global use in the brushes,
  // feel free to change this interface
  return {
    svg: svg,
    brush: brush,
    xScale: xScale,
    yScale: yScale
  };
}


////////////////////////////////////////////////////////////////////////
// Setup plots

plot1 = makeScatterplot(d3.select("#scatterplot_1"),
                        function(d) { return d.sepalLength; },
                        function(d) { return d.sepalWidth; } , "Sepal Length", "Sepal Width");
plot2 = makeScatterplot(d3.select("#scatterplot_2"),
                        function(d) { return d.petalLength; },
                        function(d) { return d.petalWidth; }, "Petal Length", "Petal Width");



/**
 * Highlights the circles based on brush selection; If only one brush is active,
 * it finds all the dots that're highlighted by that brush in that scatterplot and also 
 * highlights them in the other scatterplot by applying a style to those values. If both 
 * brushes are active, it finds the intersection between the two brushes to find 
 * if a dot is selected in brush1 and brush2.
 * 
 * @returns 
 */
function onBrush() {
  let allCircles = d3.select("body").selectAll("circle");
  let selectedBrush = 0;
  if (brush1 === null && brush2 === null) {
    allCircles.attr("class",null);
    return;
  } else if (brush1!= null && brush2 ===null){
      selectedBrush = 1;
  } else if (brush1 === null && brush2 != null){
      selectedBrush = 2;
  }

  // Selection filter function
  // Depending on what the selected brush is, chooses the functions 
  // returns true or false depending on whether or not the data exists in the selection.
  function isSelected(d) {
    if (selectedBrush === 1){
      return calcBrush( function(d) { return d.sepalLength; }, function(d) { return d.sepalWidth; }, brush1, d );

    } else if (selectedBrush === 2){
      return calcBrush( function(d) { return d.petalLength; }, function(d) { return d.petalWidth; }, brush2, d );

    } else{
      val1 =  calcBrush( function(d) { return d.sepalLength; }, function(d) { return d.sepalWidth; }, brush1, d );
      val2 = calcBrush( function(d) { return d.petalLength; }, function(d) { return d.petalWidth; }, brush2, d );
      return val1 && val2;

    }
  }
  
  let selected = allCircles
    .filter(isSelected);
  let notSelected = allCircles
    .filter(function(d) { return !isSelected(d); });

    selected.attr("class", "selected");
    notSelected.attr("class", null);
}

/**
 * Returns true or false depending on the brush's x and y values and the x and y values of 
 * of the current dataset to see if the current data point exists within the brushes 
 * constrains
 * @param {*} xAccessor - function grabbing the x value we want to base our values on
 * @param {*} yAccessor - function grabbing the y value we want to base our values on
 * @param {*} currBrush - brush1 or brush2
 * @param {*} d - the current datum
 * @returns boolean value
 */
function calcBrush(xAccessor, yAccessor, currBrush, d){
  xScale = d3.scaleLinear().domain([d3.min(data, function(row){return xAccessor(row);}), d3.max(data, function(row){return xAccessor(row);})]).range([padding, width-padding]); 
  yScale = d3.scaleLinear().domain([d3.min(data, function(row){return yAccessor(row);}), d3.max(data, function(row){return yAccessor(row);})]).range([height-padding, padding]); 
  minx = currBrush[0][0];
  maxx = currBrush[1][0];
  miny = currBrush[0][1];
  maxy = currBrush[1][1];
  currX = xScale(xAccessor(d));
  currY = yScale(yAccessor(d));
  return (minx <= currX) && (currX <= maxx) && (miny <= currY) && (currY <= maxy);
}

////////////////////////////////////////////////////////////////////////
//
// d3 brush selection
//
// The "selection" of a brush is the range of values in either of the
// dimensions that an existing brush corresponds to. The brush selection
// is available in the event.selection object.
// 
//   e = event.selection
//   e[0][0] is the minimum value in the x axis of the brush
//   e[1][0] is the maximum value in the x axis of the brush
//   e[0][1] is the minimum value in the y axis of the brush
//   e[1][1] is the maximum value in the y axis of the brush
//
// The most important thing to know about the brush selection is that
// it stores values in *PIXEL UNITS*. Your logic for highlighting
// points, however, is not based on pixel units: it's based on data
// units.
//
// In order to convert between the two of them, remember that you have
// the d3 scales you created with the makeScatterplot function above.
//
// It is not necessary to use, but you might also find it helpful to
// know that d3 scales have a function to *invert* a mapping: if you
// create a scale like this:
//
//  s = d3.scaleLinear().domain([5, 10]).range([0, 100])
//
// then s(7.5) === 50, and s.invert(50) === 7.5. In other words, the
// scale object has a method invert(), which converts a value in the
// range to a value in the domain. This is exactly what you will need
// to use in order to convert pixel units back to data units.
//
//
// NOTE: You should not have to change any of the following:

function updateBrush1(event) {
  brush1 = event.selection;
  onBrush();
}

function updateBrush2(event) {
  brush2 = event.selection;
  onBrush();
}

plot1.brush
  .on("brush", updateBrush1)
  .on("end", updateBrush1);

plot2.brush
  .on("brush", updateBrush2)
  .on("end", updateBrush2);
