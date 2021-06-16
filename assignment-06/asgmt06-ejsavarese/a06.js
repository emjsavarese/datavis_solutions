// 
// a06.js
// Skeleton for CSC444 Assignment 06
// Joshua A. Levine <josh@email.arizona.edu>
//
// This file provides the skeleton code for you to write for A06.  It
// generates (using index.html and data.js) grids of 50x50 rectangles 
// to visualize the Hurricane Isabel dataset.
//
// Your main task is to complete the four color functions.
// Additionally, you may want to add additional logic to insert color
// legends for each of the four plots.  These can be inserted as new svg
// elements in the spans colorlegend-X for X=1..4 
//



//////////////////////////////////////////////////////////////////////////////
// Global variables, preliminaries to draw the grid of rectangles

var svgSize = 500;
var bands = 50;

var xScale = d3.scaleLinear().domain([0, bands]).  range([0, svgSize]);
var yScale = d3.scaleLinear().domain([-1,bands-1]).range([svgSize, 0]);

function createSvg(sel)
{
    return sel
        .append("svg")
        .attr("width", svgSize)
        .attr("height", svgSize);
}

function createRects(sel)
{
    return sel
        .append("g")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return xScale(d.Col); })
        .attr("y", function(d) { return yScale(d.Row); })
        .attr("width", 10)
        .attr("height", 10)
}

d3.selection.prototype.callAndReturn = function(callable)
{
    return callable(this);
};

//////////////////////////////////////////////////////////////////////////////
// Color functions -- Implement these!

/**
 * Creates a temperature color map that changes luminence along the scale + avoids red green color blindness.
 * @param d representing the current object in the string data array
 */
function colorT1(d) {
    minColor = d3.lab(0, -20, -60);
    maxColor = d3.lab(150,-20, -60 );

    func = d3.scaleLinear().domain([d3.min(data, function(d){ return d.T;}), d3.max(data, function(d){return d.T;})]).range([minColor, maxColor]);
    
    return func(d.T);

}


/**
 * Creates a temperature color map that changes luminence along the scale + avoids red green color blindness, and is 
 * Perceptually uniform using interpolation. I think.
 * @param d representing the current object in the string data array
 */
function colorT2(d) {

    minColor = d3.lab(0, -20, -60);
    maxColor = d3.lab(150,-20, -60 );

    func = d3.scaleLinear().domain([d3.min(data, function(d){ return d.T;}), d3.max(data, function(d){return d.T;})]).range([minColor, maxColor]).interpolate(d3.interpolateLab);
    
    return func(d.T);
}


/**
 * Creates a pressure map that maps zero to a neutral color, maps non-zero values such that values of the same magnitude but different sign 
 * they are opponent to each other in Lab space (I tried to do that by setting the scales to be the same via absolute value),
 * maps values such that pressures moving away from zero change at the same rate.
 * @param d representing the current object in the string data array
 */
function colorP3(d) {
    minColor = d3.lab(60, 60, -60);
    midColor = d3.lab(80,0,0);
    maxColor = d3.lab(60, -60, 60 );
    relativeMax = Math.max (Math.abs(d3.min(data,function(d){return d.P;})),Math.abs(d3.max(data,function(d){return d.P;})));

    func = d3.scaleLinear().domain([d3.min(data, function(d){ return d.P;}), 0, relativeMax]).range([minColor,midColor, maxColor]);

    return func(d.P);
}

/**
 * Creates a pressure map + temp map that mapes the a and b values to pressure values, while the temperature maps 
 * to the luminence. 
 * @param d representing the current object in the string data array
 */
function colorPT4(d) {

    relativeMax = Math.max (Math.abs(d3.min(data,function(d){return d.P;})),Math.abs(d3.max(data,function(d){return d.P;})));
    pressureFunc = d3.scaleLinear().domain([d3.min(data, function(d){ return d.P;}), 0, relativeMax]).range([-60,0, 60]);
    tempFunc = d3.scaleLinear().domain([d3.min(data, function(d){ return d.T;}), d3.max(data, function(d){return d.T;})]).range([0, 150]);
    return d3.lab(tempFunc(d.T),pressureFunc(d.P),-pressureFunc(d.P));
}


//////////////////////////////////////////////////////////////////////////////
// Hook up the color functions with the fill attributes for the rects


d3.select("#plot1-temperature")
    .callAndReturn(createSvg)
    .callAndReturn(createRects)
    .attr("fill", colorT1);

d3.select("#plot2-temperature")
    .callAndReturn(createSvg)
    .callAndReturn(createRects)
    .attr("fill", colorT2);

d3.select("#plot3-pressure")
    .callAndReturn(createSvg)
    .callAndReturn(createRects)
    .attr("fill", colorP3);

d3.select("#plot4-bivariate")
    .callAndReturn(createSvg)
    .callAndReturn(createRects)
    .attr("fill", colorPT4);



