/*  Emily Savarese
    Levine
    CSC 444
    ASSIGNMENT 3: Javascript

    This js file will access the charts in the index file and create an svg graph for each chart.
    It reads in the information from scores.js and displays the dots based on that info through
    normalization, where were we take the upper and lower limit of scores as well as the upper
    and lower limits of the dataset we want to transfer it to (5 to 495 in this case so we can see the 
    circles) and perform some math to that way any x,y, radius, or color data points change with the
    data.
    The first graph has SATV values as the x coordinates and SATM values as the y coordinates.
    The second graph has the GPA as the x coordinate, the ACT as the y coordinate, the radius
    of the circles representing the SATV, and the color representing SATM (higher scores are more
    yellow, lower scores are more red).
    The third graph has the SATV + SATM value as the x coordinate, GPA scores as the y coordinate,
    and the color representing ACT (higher scores are more blue, lower scores are more green).
*/




/** 
 * PURPOSE: Given a key, the function loops through all the scores and finds each 
            respective value for the key and find the minimum and maximum.
 * @param key: a string of the key we want to gather the minimums and maximums for
 * @returns an object with values containing the minimum and maximum of that dataset
 */
function findMinAndMax(key){
    var values = scores.map( value => value[key] );
    return { 
        min: Math.min.apply(null, values), 
        max: Math.max.apply(null, values)
      };
  }

//Generate objects for each respective key!
var SATMMinMax = findMinAndMax("SATM");
var SATVMinMax = findMinAndMax("SATV");
var ACTMinMax = findMinAndMax("ACT");
var GPAMinMax = findMinAndMax("GPA");


/**
 * PURPOSE: This function will normalize a passed in value to match the coordinates in the 
 *          svg graph, so we don't get super condensed graphs or points that don't exist on the
 *          graph. so it works similarly to the d3.range function where if our domain is like
 *          [0, 100] and our target range is [60, 500], if we pass in 0, we'll get a return of 
 *          60.
 * @param minMaxObj The object containing .min and .max for the respective key we're looking at!
 * @param currCoord the current value from scores from the key we're looking at
 * @param targMax The target maximum value we want for our chart
 * @param targMin the target minimum value we want for our chart
 * @returns an integer value 
 */
function normalize(minMaxObj, currCoord, targMax, targMin){
    return ((currCoord - minMaxObj.min) / (minMaxObj.max - minMaxObj.min))* (targMax-targMin) + targMin; 
}


//Generate the first chart! Notice how we reverse the parameters for the normalization for the y axis?
//This is so the values are reversed and the higher grades will go to lower y values, so it looks like
//a regular chart!
var chart1 = make("svg", { width: 500, height: 500});
document.getElementById("chart_1").appendChild(chart1);
plotAll(chart1, scores, "circle",{
     cx: function(row) {return normalize(SATVMinMax,row.SATV, 495,5 );},
     cy: function(row) {return normalize(SATMMinMax, row.SATM, 5, 495);},
     r: function(){return 5;},
     fill: function() { return "blue"; },
     stroke: function() {return "green";}
});


//Generate the second chart! The radius is also normalized but the highest
//value it can be is 7, so you can still hopefully see some of the smaller values.
//The color is also set to be a value between 0 and 1 so I could use the rbg function.
//I picked the color pretty randomly, but the more yellow the datapoint is, the 
//higher the SATM score was!
var chart2 = make("svg", {width: 500, height: 500});
document.getElementById("chart_2").appendChild(chart2);
plotAll(chart2, scores, "circle",{
    cx: function(row){return normalize(GPAMinMax,row.GPA, 495,5 );},
    cy: function(row){return normalize(ACTMinMax, row.ACT, 5,495 );},
    r: function(row) {return normalize(SATVMinMax, row.SATV, 7,3 );},
    fill: function(row) {
        var newColor = normalize(SATMMinMax, row.SATM, 1, 0);
        return rgb(.898, newColor, .333);}, 
    stroke: function(){return "black";}
});



//Generate the third chart! For the x value, I had to create a new min and 
//max object by adding the minimums and maximums for the SATM and SATV objects
//before passing that new object to the normalize function. The color makes it so
//lower ACT scores are more green, and higher scores are more blue!
var chart3 = make("svg", {width: 500, height: 500});
document.getElementById("chart_3").appendChild(chart3);
plotAll(chart3,scores, "circle", {
    cx: function(row){
        var total = row.SATV + row.SATM;
        var newMinmax= {min: SATVMinMax.min + SATMMinMax.min, 
            max: SATMMinMax.max + SATVMinMax.max };
        return normalize(newMinmax,total,495,5);},
    cy: function(row){return normalize(GPAMinMax, row.GPA, 5,495);},
    r: function(row){return 5;},
    fill: function(row){
        var newBlue = normalize(ACTMinMax, row.ACT, 1, 0);
        return rgb(.200, .434, newBlue);},
        stroke: function(){ return "black";} 
});