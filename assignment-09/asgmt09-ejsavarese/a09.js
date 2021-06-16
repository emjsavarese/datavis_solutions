/**
 * Emily Savarese
 * Joshua Levine
 * CSc 444
 * 
 * This program will take any dataset and transform it into a TreeMap! Based on what button is clicked,
 * it will split the content on the screen to display the information. It first creates the tree by 
 * providing each tree with size (the size of the data), count (how many nodes there are per subtree), and 
 * the depth (how far a node is from the root). Then, on a button click, it splits the space on the screen
 * to display all the information:
 * size - rectangles are proportional to their size stat. Cuts horizontal/vertical determined by depth.
 * best size - same as size, but cuts horizontally/vertically depending on the height/width of the rectangle (depth if even.)
 * count - rectangles are equal in size to other rectangles in their subtree. Cuts horizontal/vertical determined by depth. 
 * best count - same as count, but cuts horizontally/vertically depending on the height/width of the rectangle (depth if even.)
 * It retransitions to redraw the squares! The colors also indicate how deep a node is in a particular subtree. The lighter it is,
 * the lower it is on the tree!
 * 
 */
////////////////////////////////////////////////////////////////////////
// Global variables for the dataset 

//let data = test_1;
//let data = test_2;
let data = flare;

let best = false;

////////////////////////////////////////////////////////////////////////
// Tree related helper functions
// Gives every treenode a size variable (based on dataset)
function setTreeSize(tree)
{
  if (tree.children !== undefined) {
    let size = 0;
    for (let i=0; i<tree.children.length; ++i) {
      size += setTreeSize(tree.children[i]);
    }
    tree.size = size;
  }
  if (tree.children === undefined) {
    // do nothing, tree.size is already defined for leaves
  }
  return tree.size;
};
//gives every treenode a count variable (based on other elements in subtree)
function setTreeCount(tree)
{
  if (tree.children !== undefined) {
    let count = 0;
    for (let i=0; i<tree.children.length; ++i) {
      count += setTreeCount(tree.children[i]);
    }
    tree.count = count;
  }
  if (tree.children === undefined) {
    tree.count = 1;
  }
  return tree.count;
}

let suppDepth = 0;
//gives every treenode a depth (based on distance from root)
function setTreeDepth(tree, depth)
{
  thisDepth = depth;
  if (tree.children !== undefined){
    tree.depth = depth;
    depth+=1;
    for (let i=0; i<tree.children.length; ++i) {
      suppDepth = setTreeDepth(tree.children[i], depth);
    }
  }

  if(tree.children === undefined){
    tree.depth = thisDepth;
  }

  if(tree.depth > suppDepth){
    suppDepth = tree.depth;
  }

  return suppDepth;
};


// Initialize the size, count, and depth variables within the tree
setTreeSize(data);
setTreeCount(data);
let maxDepth = setTreeDepth(data, 0);



////////////////////////////////////////////////////////////////////////
// Main Code for the Treemapping Technique

function setRectangles(rect, tree, attrFun)
{

  tree.rect = rect;
  if (tree.children !== undefined) {
    let cumulativeSizes = [0];
    for (let i=0; i<tree.children.length; ++i) {
      cumulativeSizes.push(cumulativeSizes[i] + attrFun(tree.children[i]));
    }
    

    let rectWidth = rect.x2 - rect.x1;
    let rectHeight = rect.y2 - rect.y1; 
    let border = (5 - tree.depth)/2;

    let scale = d3.scaleLinear()
                  .domain([0, cumulativeSizes[cumulativeSizes.length-1]]);
    


    //cuts vertically if the depth is even without being best count/size (or it is best but rect height and width are even)
    //or it is best count/size and the rect height is smaller than the width
    if ((tree.depth % 2 === 0 && ((!best)|| (best && rectHeight === rectWidth))) || (best && rectHeight <= rectWidth)){
      scale.range([rect.x1, rect.x2]);
        for (let i=0; i<tree.children.length; ++i) {
          let newRect = { x1: scale(cumulativeSizes[i])+border, x2: scale(cumulativeSizes[i+1])-border, y1: rect.y1+border, y2: rect.y2-border };
          setRectangles(newRect, tree.children[i], attrFun);    
        }

    } 
    //cuts horizontally if the depth is odd without being best count/size (or it is best but rect height and width are even)
    //or it is best count/size and the rect width is smaller than the height
    else if((tree.depth % 2 !== 0 && ((!best)|| (best && rectHeight === rectWidth))) || (best && rectHeight >= rectWidth)){
      scale.range([rect.y1, rect.y2]);
        for (let i=0; i<tree.children.length; ++i) {
          let newRect = { x1: rect.x1+border, x2: rect.x2-border, y1: scale(cumulativeSizes[i])+border, y2: scale(cumulativeSizes[i+1])-border };
          setRectangles(newRect, tree.children[i], attrFun);
    
        }

    }

  }
}

// initialize the tree map
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;

// compute the rectangles for each tree node
setRectangles(
  {x1: 0, y1: 0, x2: winWidth, y2: winHeight}, data,
  function(t) { return t.size; }
);

// make a list of all tree nodes;
function makeTreeNodeList(tree, lst)
{
  lst.push(tree);
  if (tree.children !== undefined) {
    for (let i=0; i<tree.children.length; ++i) {
      makeTreeNodeList(tree.children[i], lst);
    }
  }
}

let treeNodeList = [];
makeTreeNodeList(data, treeNodeList);



////////////////////////////////////////////////////////////////////////
// Visual Encoding portion

// d3 selection to draw the tree map 
let gs = d3.select("#svg")
           .attr("width", winWidth)
           .attr("height", winHeight)
           .selectAll("g")
           .data(treeNodeList)
           .enter()
           .append("g");

function setAttrs(sel) {
  var colorScale = d3.scaleLinear().domain([0, maxDepth]).range(["#74C67A", "#DEEDCF"]);
  sel.attr("width", function(treeNode) {return Math.abs(treeNode.rect.x2 - treeNode.rect.x1); })
     .attr("height", function(treeNode) { return Math.abs(treeNode.rect.y2 - treeNode.rect.y1);})
     .attr("x", function(treeNode) { return treeNode.rect.x1;})
     .attr("y", function(treeNode) { return treeNode.rect.y1;})
     .attr("fill", function(treeNode) { return colorScale(treeNode.depth);})
     .attr("stroke", function(treeNode) {return "black"; })
     .attr("title", function(treeNode) { 
        return treeNode.name;
     });
}

gs.append("rect").call(setAttrs);


////////////////////////////////////////////////////////////////////////
// Callbacks for buttons

d3.select("#size").on("click", function() {
  best = false;
  setRectangles(
    {x1: 0, x2: winWidth, y1: 0, y2: winHeight}, data, 
    function(t) { return t.size; }
  );
  d3.selectAll("rect").transition().duration(1000).call(setAttrs);
});

d3.select("#count").on("click", function() {
  best = false;
  setRectangles(
    {x1: 0, x2: winWidth, y1: 0, y2: winHeight}, data,
    function(t) { return t.count; }
  );
  d3.selectAll("rect").transition().duration(1000).call(setAttrs);
});

d3.select("#best-count").on("click", function() {
  best = true;
  setRectangles(
    {x1: 0, x2: winWidth, y1: 0, y2: winHeight}, data,
    function(t) { return t.count; }
  );
  d3.selectAll("rect").transition().duration(1000).call(setAttrs);
});

d3.select("#best-size").on("click", function() {
  best = true;
  setRectangles(
    {x1: 0, x2: winWidth, y1: 0, y2: winHeight}, data,
    function(t) { return t.size; }
  );
  d3.selectAll("rect").transition().duration(1000).call(setAttrs);
});