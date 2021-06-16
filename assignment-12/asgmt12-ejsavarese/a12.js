/**
 * Emily Savarese
 * Joshua Levine
 * CSc 444
 * 
 * This program generates 4 data visualizations!
 * The first one focuses assigning the correct magnitudes to each data location.
 * The second one focuses on assigning and showing flow visualization.
 * The third one is Based around showing flow visualization as well as teh direction.
 * The fourth one is supposed to show all three of the previous items (as well as produce some jitter), but its 
 * giving me some trouble. 
 * 
 */

////////////////////////////////////////////////////////////////////////
// Global variables, preliminaries

let svgSize = 510;
let bands = 50;

let xScale = d3.scaleLinear().domain([0,bands]).range([5, svgSize-5]);
let yScale = d3.scaleLinear().domain([0,bands]).range([svgSize-5, 5]);

function createSvg(sel)
{
  return sel
    .append("svg")
    .attr("width", svgSize)
    .attr("height", svgSize);
}

function createGroups(data) {
  return function(sel) {
    return sel
      .append("g")
      .selectAll("*")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function(d) {
        return "translate(" + xScale(d.Col) + "," + yScale(d.Row) + ") scale(1, -1)";
      });
  };
}

d3.selection.prototype.callReturn = function(callable)
{
  return callable(this);
};

////////////////////////////////////////////////////////////////////////
// PART 1

let magColor = d3.select("#plot-color")
        .callReturn(createSvg)
        .callReturn(createGroups(data));


let colorScale = d3.scaleLinear().domain([0,.5,1,1.5,2]).range(d3.schemePuOr[5]);

// WRITE THIS PART
magColor.append("rect")
.attr("height",10)
.attr("width", 10)
.attr("fill", function(d){ magnitude = Math.sqrt(Math.pow(d.vx, 2) + Math.pow(d.vy, 2) );
                          return colorScale(magnitude);});

////////////////////////////////////////////////////////////////////////
// PART 2

let lineGlyph = d3.select("#plot-line")
        .callReturn(createSvg)
        .callReturn(createGroups(data));

// WRITE THIS PART
lineGlyph.append("line")
          .attr("stroke", "black")
          .attr("x1", function (d){return d.vx;})
          .attr("y1", function(d){return d.vy ;})
          .attr("x2", function(d){ angle = Math.atan(d.vy/d.vx); return 5* Math.cos(angle) + d.vx; })
          .attr("y2", function(d){ angle = Math.atan(d.vy/d.vx); return 5* Math.sin(angle) + d.vy;});

////////////////////////////////////////////////////////////////////////
// PART 3

let uniformGlyph = d3.select("#plot-uniform")
        .callReturn(createSvg)
        .callReturn(createGroups(data));

uniformGlyph.append("uniformGlyph:defs")
            .append("uniformGlyph:marker")
            .attr("id","triangle")
            .attr("refX", function(d){return 2.5;})
            .attr("refY", function(d){return 2.5;})
            .attr("markerWidth", 5)
            .attr("markerHeight", 5)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 L 5 3 L 0 5");

  uniformGlyph.append("line").attr("stroke", "black")
  .attr("x1", function (d){return d.vx;})
  .attr("y1", function(d){return d.vy ;})
  .attr("x2", function(d){ angle = Math.atan(d.vy/d.vx); return 7* Math.cos(angle) + d.vx; })
  .attr("y2", function(d){ angle = Math.atan(d.vy/d.vx); return 7* Math.sin(angle) + d.vy;})
  .attr("marker-end", "url(#triangle");

////////////////////////////////////////////////////////////////////////
// PART 4

let randomGlyph = d3.select("#plot-random")
        .callReturn(createSvg)
        .callReturn(createGroups(data));

randomGlyph.append("randomGlyph:defs")
.append("randomGlyphe:marker")
.attr("id","triangle2")
.attr("refX", function(d){return 2.5;})
.attr("refY", function(d){return 2.5;})
.attr("test", function(d){magnitude = Math.sqrt(Math.pow(d.vx, 2) + Math.pow(d.vy, 2) ); return colorScale(magnitude);})
.attr("markerWidth", 10)
.attr("markerHeight", 10)
.attr("orient", "auto")
.append("path")
.attr("d", "M 0 0 L 12 5 L 0 3")
.attr("fill", function(d){magnitude = Math.sqrt(Math.pow(d.vx, 2) + Math.pow(d.vy, 2));
  return colorScale(magnitude);});



randomGlyph.append("line").attr("fill", function(d){magnitude = Math.sqrt(Math.pow(d.vx, 2) + Math.pow(d.vy, 2) );
  return colorScale(magnitude);})
  .attr("x1", function (d){return d.vx+ randomJitter;})
  .attr("y1", function(d){return d.vy +randomJitter;})
  .attr("x2", function(d){ angle = Math.atan(d.vy/d.vx); return 1* Math.cos(angle) + d.vx + randomJitter; })
  .attr("y2", function(d){ angle = Math.atan(d.vy/d.vx); return 1* Math.sin(angle) + d.vy + randomJitter;})
  .attr("marker-end", "url(#triangle2)");



// WRITE THIS PART
