Author: Emily Savarese [ejsavarese@email.arizona.edu](mailto: ejsavarese@email.arizona.edu)  
Date: 3/22/2021


## Notes

This program will utilize the iris.js file to draw every datapoint in that file as an svg line on the div provided in index.html. It also provides an
axis for every datapoint (besides type) in the dataset, while each line 
is colored based on what type it is. You can press on the text labels to
swap the labels and the axises to the one directly to the right of it
and you can brush over the axises to select specific lines.

WARNING: It does not quite work when you have a brush on an axis as you switch it. You have to remove the brush and then swap it!


## Included files

* README.md- A general description of the program!
* d3.js - a javascript library that helps with interaction and visualizations!
* iris.js - a dataset with five items: a flower's sepalWidth, sepalLength, petalWidth, and petalLength, and the type of flower.
* index.html - a skeleton html file that just creates a div for the chart.
* a08.js - Javascript file that creates the line graph, draws all the data points as lines, and allows interaction with the swapping of axises and the ability to brush select certain lines


## References
https://github.com/UA-CSC444-Spring2021/l17_examples/blob/master/l17.js
https://www.d3-graph-gallery.com/graph/parallel_basic.html
https://bl.ocks.org/jasondavies/1341281
