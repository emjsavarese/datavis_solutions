Author: Emily Savarese [ejsavarese@email.arizona.edu](mailto: ejsavarese@email.arizona.edu)  
Date: 2/8/2021


## Notes
The HTML file reads in svg.js and scores.js, generates three divs for the three charts, and then 
runs a03.js. It generates the minimum and maximum values for each key in scores (SATV, SATM, GPA, ACT)
and then generates the values from the charts by normalizing the values from the range of the keys
to the range of the coordinates of the chart. Each div then recieves an svg and each chart is drawn
using the plotAll function from svg.js.  From the a03.js header comment: 
  "The first graph has SATV values as the x coordinates and SATM values as the y coordinates.
    The second graph has the GPA as the x coordinate, the ACT as the y coordinate, the radius
    of the circles representing the SATV, and the color representing SATM (higher scores are more
    yellow, lower scores are more red).
    The third graph has the SATV + SATM value as the x coordinate, GPA scores as the y coordinate,
    and the color representing ACT (higher scores are more blue, lower scores are more green)."

No additional parameters are needed, and this program was run on a Windows machine!


## Included files

* index.html- a bare bones html file. It only contains 3 divs at the start, each with a different id.
* scores.js - an array containing scores objects containing SATV, SATM, ACT, and GPA scores.
* svg.js - a file containing methods to help with the creation of svg elements.
* a03.js - the js file that actually creates all of the svg elements using the data from scores.js.
* README.md - you're looking at it right now!

## References
https://www.codecademy.com/articles/normalization - This helped with understanding the min-max normalization, I managed to fanagle the rest

