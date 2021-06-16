/**
 * Author: Emily Savarese
 * Instructor: Levine
 * Class: CSc444
 * Assignment 04: D3
 * 
 * This program will generate 4 charts by first grabbing every div value within the html file and inserting an svg to that div. Using the d3 library,
 * it uses .selectAll (shape).data(dataSet).enter().append(shape) to produce different shapes with data values tied to each individual shapes, where 
 * shape is either circ or rect, and dataSet is either scores (from calvinScores.js) or ukDriverFatalities (from ukDriverFatalities.js). The first three
 * charts are based on the same charts from Carlos Scheidegger's interation_8.js, each using the ukDriverFatalities to produce different data sets.
 * The last chart is based on the last assignment, using the scores to display points that use all of the various fields.
 */


 /**
  * Taken from Carlos Scheidegger's interation_8.js. This should first check to see if v or 
  * or 255 is a smaller number, and then checks to see if 0 or that value is larger, and then rounds down.
  * This is to make sure no value is out of range.
  * @param v - integer value
  * @returns an integer value that's been clamped
  */
function clamp(v) {
    return Math.floor(Math.max(0, Math.min(255, v)));
}

/**
 * Modified from Carlos Scheidegger's interation_8.js. This will generate an rgb value
 * based on the passed in count. It's basically just so it will increase the darkenness
 * of the blue depending on how high the count is.
 * @param  count - integer value
 * @returns an rgb value
 */
function color(count){
    var amount = (2500 - count) / 2500 * 255;
    var s = clamp(amount), s2 = clamp(amount / 2 + 127), s3 = clamp(amount / 2 + 127);
  
    return ["rgb(",s,",",s2,",",s3,")"].join("");
}



//Creates the first chart. It bases its x value around the year, the y value around the month,
//and the intensity of the blue is based around the count of fatalities. The darker it is, the more
//fatalities occurred
var chart1svg = d3.select("#vis1").append("svg").attr("width",600).attr("height",300).attr("id","chart_1").attr("class", "my-chart");
chart1svg.selectAll("rect")
         .data(ukDriverFatalities).enter().append("rect")
         .attr("width", function(){return Math.ceil(600/(1984-1969+1)); })
         .attr("height", function(){return Math.ceil(300/12);})
         .attr("x", function(row){return Math.ceil(600/(1984-1969 +1)) * (row.year - 1969);})
         .attr("y", function(row){return Math.ceil(300/12) * (11 - row.month);})
         .attr("fill", function(row){return color(row.count);} );


//The second chart. It bases the circles x values around the year, the y values around hte month, the radius's
//around the count, with the fills as solid blue.
var chart2svg = d3.select("#vis2").append("svg").attr("width",600).attr("height",300).attr("id","chart_2").attr("class", "my-chart");
chart2svg.selectAll("circle")
         .data(ukDriverFatalities).enter().append("circle")
         .attr("cx", function(row){ return Math.ceil(600/(1984-1969+1))* (row.year - 1969 + 0.5); })
         .attr("cy", function(row){ return Math.ceil(300/12) * (11- row.month + 0.5);})
         .attr("r", function(row){ return row.count/ 500 *3;})
         .attr("stroke", function(){return "white";})
         .attr("fill", function(){return "blue";});



//Creates the third chart. This height of the rectangles is based on the number of fatalities. The height
//of the rectangles is based on the count of fatalities as well as the y value. Every other value
//is based on the size of the array, so we can see all the bars!
var chart3svg = d3.select("#vis3").append("svg").attr("width",600).attr("height",300).attr("id","chart_3").attr("class", "my-chart");
chart3svg.selectAll("rect")
         .data(ukDriverFatalities).enter().append("rect")
         .attr("width", function(row){ return Math.ceil(600/ukDriverFatalities.length);})
         .attr("height", function(row){ return row.count/2500 * 300;})
         .attr("x", function(row, index){return index * 600 / ukDriverFatalities.length;})
         .attr("y", function(row, index){return 300 - (row.count/2500 * 300);});



//A variable padding of 10 so we can hopefully see all points!
var padding = 10;

//4 linearScales just for this graph. the x scale returns a value based on the highest and lowest gpa to the max and min values for the svg
var xScale = d3.scaleLinear().domain([d3.min(scores, function(row){ return row.GPA;}), d3.max(scores, function(row){return row.GPA;})]).range([padding, 500-padding]);

//the y scale returns a value based on the highest and lowest act to the max and min values for the svg. Notice how the min and max are inversed!
var yScale = d3.scaleLinear().domain([d3.min(scores, function(row){ return row.ACT;}), d3.max(scores, function(row){return row.ACT;})]).range([500 - padding, padding]);

// the r scale returns a value based on the highest and lowest satv to 3, 7, leaving the largest radius for a circle to be 4.
var rScale = d3.scaleLinear().domain([d3.min(scores, function(row){ return row.SATV;}), d3.max(scores, function(row){return row.SATV;})]).range([3, 7]);

//the color scale returns a value based on the highest and lowest SATM to the max and min values for any rgb value, so 0 to 255
var colorScale = d3.scaleLinear().domain([d3.min(scores, function(row){ return row.SATM;}), d3.max(scores, function(row){return row.SATM;})]).range([0, 255]);


//The fourth chart. This one produces a scatterplot with circles x based on GPA, y based on ACT, radius based on SATV, and color based on SATM. The dots get more 
//cyan if their score is higher!
var scatterplot2svg = d3.select("#vis4").append("svg").attr("width",500).attr("height",500).attr("id","scatterplot_2");
scatterplot2svg.selectAll("circle")
                .data(scores).enter().append("circle")
                .attr("cx", function(row){ return xScale(row.GPA);})
                .attr("cy", function(row){return yScale(row.ACT);})
                .attr("r", function(row){return rScale(row.SATV);})
                .attr("fill", function(row){ 
                    var newColor = colorScale(row.SATM);
                    return ["rgb(",62,",",newColor,",",191,")"].join("");
                })
                .attr("stroke", function(){
                    return "black";
                });

