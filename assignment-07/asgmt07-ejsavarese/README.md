Template for A07
------------

Author: Emily Savarese [ejsavarese@email.arizona.edu](mailto:ejsavarese@email.arizona.edu)  
Date: 3/15/2021


## Notes
This program will create a couple of svg scatterplots: the first one based on the sepalLength and sepalWidth and the 
second based on petalLength and petalWidth. Data from iris.js is populated into each scatterplot, also species is connected 
to what color the datapoints are. You should be able to click on a dot and it should double its size and display what 
values the dot has in the table. Additionally! You should be able to click and drag your mouse on either scatterplot
to create a brush; a single brush on either canvas highlights the respective data points on both canvases; a brush
on both canvases only highlights the values that exist in BOTH brushes.



## Included files

* README.md - This is the file ! 
* index.html - Base html file that contains 2 divs for the scatterplots and the table containing labels for each category in iris.
* d3.js - a js library that helps with the building of visualizations.
* style.css - a simple style sheet just containing the style for selected values in the svgs!
* iris.js - Just contains an array of objects containing sepalLength, sepalWidth, petalLength, petalWidth, and species.
* a07.js - Creates two svgs and scatterplots based on the data in iris with brush capabilities to select data.

## References


