/**
 * Author: Emily Savarese
 * Instructor: Levine
 * Class: CSc444
 * Assignment 05: Scales, Axes, Transitions
 * 
 * This program will generate 4 charts by first grabbing every div value within the html file and inserting an svg to that div. Using the d3 library,
 * it uses .selectAll (circle).data().enter().append(circle) to add all these new circles bound to datapoints within calvinScores.js. the cx of each circle is based on the 
 * SATV score of the student, the cy is based on the ACT, the radius is based on the SATM, and the colorScale has three different mappings, but each mapping is based on the gpa.
 * The first colormap presents the default color scheme, where the lowest gpa value is blue and the highest is red, the second colormap has the highest still be red, 
 * but the middle value is yellow, and the lowest is blue. The final colormap has this range of color values, from lowest to highest gpa scores : 
 * "#2c7bb6", "#abd9e9", "#ffffbf", "#fdae61", "#d7191c" . 
 */

//just a padding so all the values don't get cut off!
var padding = 50;

//cx returns a value based on the highest and lowest SATV to the max and min values for the svg. 
var cxScale = d3.scaleLinear().domain([d3.min(scores, function(row){ return row.SATV;}), d3.max(scores, function(row){return row.SATV;})]).range([padding, 500-padding]);

//the y scale returns a value based on the highest and lowest act to the max and min values for the svg. Notice how the min and max are inversed!
var cyScale = d3.scaleLinear().domain([d3.min(scores, function(row){ return row.ACT;}), d3.max(scores, function(row){return row.ACT;})]).range([500 - padding, padding]);

// the r scale returns a value based on the highest and lowest satv to 2, 12. Use a quantized scale!
var rScale = d3.scaleSqrt().domain([d3.min(scores, function(row){ return row.SATM;}), d3.max(scores, function(row){return row.SATM;})]).range([2, 12]);

//the color scale returns a value based on the highest and lowest SATM to the max and min values to a range of blue to red. Weird how this works
var colorScale = d3.scaleLinear().domain([d3.min(scores, function(row){ return row.GPA;}), d3.max(scores, function(row){return row.GPA;})]).range(["blue", "red"]);

//the color scale returns a value based on the highest and lowest SATM to the max and min values to a range of 3 values. I dont know if it NEEDED the mean, but I put it in there anyway
var colorScaleGreen = d3.scaleLinear().domain([d3.min(scores, function(row){ return row.GPA;}), d3.mean(scores, function(row){ return row.GPA;}), d3.max(scores, function(row){return row.GPA;})]).range([ "#2c7bb6", "#ffffbf", "#d7191c"]);

//the color scale returns a value based on the highest and lowest SATM to the max and min values to a range of blue to red. Weird how this works
var colorScaleOrange = d3.scaleQuantize().domain([d3.min(scores, function(row){ return row.GPA;}), d3.max(scores, function(row){return row.GPA;})]).range(["#2c7bb6", "#abd9e9", "#ffffbf", "#fdae61", "#d7191c"]);


//The fourth chart. This one produces a scatterplot with circles x based on GPA, y based on ACT, radius based on SATV, and color based on SATM. 
var scatterplot1svg = d3.select("#vis1").append("svg").attr("width",500).attr("height",500).attr("id","scatterplot_1");
scatterplot1svg.selectAll("circle")
                .data(scores).enter().append("circle")
                .attr("cx", function(row){ return cxScale(row.SATV);})
                .attr("cy", function(row){return cyScale(row.ACT);})
                .attr("r", function(row){return rScale(row.SATM);})
                .attr("fill", function(row){ 
                    return colorScale(row.GPA);});

             


//Creates the xAxis and the yAxis based on the scales. I miiight come back to make different scales for these but right now: no.
var xAxis = d3.axisBottom(cxScale);

var yAxis = d3.axisLeft(cyScale);


//Creates separate groupings for each axis, and transforms them so they can be actually readable on the screen.
scatterplot1svg.append("g").attr("transform", "translate(0, 460)").call(xAxis);
scatterplot1svg.append("g").attr("transform", "translate(40,0)").call(yAxis);


//Adds the SATV text to the bottom of the screen since apparently no label function
scatterplot1svg.append("text")     
        .attr("x", 250)
        .attr("y", 490 )
        .style("text-anchor", "middle")
        .text("SATV"); 
        
//Creates the ACT text label which took forever to get right. Transform needs to go before the actual text input
scatterplot1svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", -220)
        .attr("y", 7)
        .attr("dy", ".50em")
        .attr("transform", "rotate(-90)")
        .text("ACT");