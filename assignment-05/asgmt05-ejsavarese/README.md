Template for A05
------------

Author: Emily Savarese[ejsavarese@email.arizona.edu](mailto: ejsavarese@email.arizona.edu)  
Date: 2/24/2021


## Notes

This program will create a graph based on calvinScores.js, with the GPA as the x value, the y value is the ACT score, the radius is based on the SATV, and the color is based on the SATM score. However, the color Scales for the graph can be modified by pressing one of the buttons placed by buttons.js. The first button presents the default color map, where the lowest gpa value is blue and the highest is red, the second button has the highest still be red, but the middle value is yellow, and the lowest is blue. The final button has this range of color values, from lowest to highest gpa scores : "#2c7bb6", "#abd9e9", "#ffffbf", "#fdae61", "#d7191c" . 
This was run on a windows machine!


## Included files

* README.md - It's what you're looking at!
* index.html - html file provided that just has 2 divs in the body. 
* calvinScores.js - a js file containing an array of objects that have four fields: a students GPA, ACT, SATV, and SATM.
* buttons.js - a modified file from Joshua Levine (hi professor unless a TA is grading this!) that initiates the buttons on the screen. On each click, it changes the color mapping for the data circles!
* a05.js - a js file that creates multiple d3 scales to scale all the info within calvinScores.js so they can fit on the screen. It also initializes the scaled radii, and the different colormaps! It also creates some axises (?) and labels them. 
* d3.js - a js library that helps with the building of visualizations.

## References


