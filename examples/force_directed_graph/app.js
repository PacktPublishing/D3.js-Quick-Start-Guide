var WIDTH = 300;
var HEIGHT = 200;

d3.select("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

var nodesData =  [
    {"name": "Charlie", "age": 12},
    {"name": "Mac", "age": 32},
    {"name": "Dennis", "age": 71},
    {"name": "Dee", "age": 26},
    {"name": "Frank", "age": 48},
    {"name": "Cricket", "age": 95}
];

var linksData = [
    {"source": "Charlie", "target": "Mac"},
    {"source": "Dennis", "target": "Mac"},
    {"source": "Dennis", "target": "Dee"},
    {"source": "Dee", "target": "Mac"},
    {"source": "Dee", "target": "Frank"},
    {"source": "Cricket", "target": "Dee"}
];

var nodes = d3.select("#nodes")
    .selectAll("circle")
    .data(nodesData)
    .enter()
    .append("circle");

var links = d3.select("#links")
    .selectAll("line")
    .data(linksData)
    .enter()
    .append("line");

d3.forceSimulation()
    .nodes(nodesData) // add this line

d3.forceSimulation()
    .nodes(nodesData)
    .force("center_force", d3.forceCenter(WIDTH / 2, HEIGHT / 2)) // add this line
    .force("charge_force", d3.forceManyBody()) //add this line
    .force("links", d3.forceLink(linksData).id(function(datum){ //add this
        return datum.name //add this
    }).distance(160)) //add this
    .on("tick", function(){
        nodes.attr("cx", function(datum) { return datum.x; })
            .attr("cy", function(datum) { return datum.y; });

        links.attr("x1", function(datum) { return datum.source.x; })
            .attr("y1", function(datum) { return datum.source.y; })
            .attr("x2", function(datum) { return datum.target.x; })
            .attr("y2", function(datum) { return datum.target.y; });
    });
