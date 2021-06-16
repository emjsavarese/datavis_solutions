// 
// buttons.js
// Buttons Example for CSC444 Assignment 05
// Joshua A. Levine <josh@email.arizona.edu
//
// This file provides a simple example of using d3 to create buttons in
// an html webpage.  The buttons are created from a list of buttons
// (called buttonList) that specifies the id, display text, and
// event-handler function that should be called for each button click.
//
// All buttons are inserted by d3 within a div whose id is main
//

// Here is a list with objects that specify some buttons.
//
//Co-Author: Emily Savarese
//
//Hi. I modified this file slightly to add an additional button, change the names 
//of the id and text so they indicate that they are specifically colormap buttons
//and onClick, they select all the values within the scatterplot and transition
//to the new color map specified over 1.5 seconds. The specific color maps are 
//defined in a05.js! 


var buttonList = [
    //This is the first color button that transitions the circles back to the default
    //color map of blue-red
    {
        id: "colormap-button-1",
        text: "Colormap Button 1",
        click: function() { 
            scatterplot1svg.selectAll("circle").data(scores).transition().duration(1500)
            .attr("fill", function(row){ 
                return colorScale(row.GPA);}).transition();
        }
    },
    {
        //This is the button that transitions to have yellow within that blue - red
        //color map!
        id: "colormap-button-2",
        text: "Colormap Button 2",
        click: function() { 
            scatterplot1svg.selectAll("circle").data(scores).transition().duration(1500)
            .attr("fill", function(row){ 
                return colorScaleGreen(row.GPA);}).transition();
        }
    },
    {
        //This is the button that transitions to have 5 different values, dark blue, light blue
        //yellow, orange, and red to represent the highest gpa value!
        id: "colormap-button-3",
        text: "Colormap Button 3",
        click: function(){ 
            scatterplot1svg.selectAll("circle").data(scores).transition().duration(1500)
            .attr("fill", function(row){ 
                return colorScaleOrange(row.GPA);});
        }
    }


];

// In the same way that we have been using d3 to create SVG elements,
// we can use d3 to create buttons and give them attributes.
//
// The only new feature in the code below is the use of the on()
// method, which defines *event handlers*.  In this case, we are
// telling d3 to call a function in the event that a button is
// clicked.

d3.select("#controls")
    .selectAll("button")
    .data(buttonList)
    .enter()
    .append("button")
    .attr("id", function(d) { return d.id; })
    .text(function(d) { return d.text; })
    .on("click", function(event, d) {
        // Since the button is bound to the objects from buttonList,
        // the expression below calls the click function from either
        // of the two button specifications in the list.
        return d.click();
    });
