var WIDTH = 300;
var HEIGHT = 200;

//set height/width of the svg
d3.select("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

//data for each person
var nodesData =  [
    {"name": "Charlie", "age": 12},
    {"name": "Mac", "age": 32},
    {"name": "Dennis", "age": 71},
    {"name": "Dee", "age": 26},
    {"name": "Frank", "age": 48},
    {"name": "Cricket", "age": 95}
];

//data showing relationships between people
var linksData = [
    {"source": "Charlie", "target": "Mac"},
    {"source": "Dennis", "target": "Mac"},
    {"source": "Dennis", "target": "Dee"},
    {"source": "Dee", "target": "Mac"},
    {"source": "Dee", "target": "Frank"},
    {"source": "Cricket", "target": "Dee"}
];

var nodes = d3.select("#nodes") //select the #nodes <g>
    .selectAll("circle") //select all circles within it (even if none exist)
    .data(nodesData) //attach data to this selection
    .enter() //find all data elements not matched to circles
    .append("circle"); //append a circle for each unmatched data element

//repeat what you do for nodes, but with lines, the #links <g>, and the linksData array
var links = d3.select("#links")
    .selectAll("line")
    .data(linksData)
    .enter()
    .append("line");

d3.forceSimulation() //create a force simulation
    .nodes(nodesData) //set the nodes for the simulation, based on the nodesData array
    .force("center_force", d3.forceCenter(WIDTH / 2, HEIGHT / 2)) //create a centering force in the middle of the svg
    .force("charge_force", d3.forceManyBody()) //create a charge force, so the nodes repel each other
    .force("links", d3.forceLink(linksData).id(function(datum){ //create a links so the nodes aren't repelled too far from nodes they're linked to in the linkData array
        return datum.name //create the links by associating each link's source/target with a name property from the nodesData array
    }).distance(160)) //set the distance of the link
    .on("tick", function(){ //create a function that will be called with each "tick" of the simulation
        //with each tick...
        //update the circle cx/cy values based on the x/y values d3 added to the nodes data
        nodes.attr("cx", function(datum) { return datum.x; })
            .attr("cy", function(datum) { return datum.y; });

        //update the line x1/y1/x2/y2 values based on the source/target x/y values d3 added to the links data
        links.attr("x1", function(datum) { return datum.source.x; })
            .attr("y1", function(datum) { return datum.source.y; })
            .attr("x2", function(datum) { return datum.target.x; })
            .attr("y2", function(datum) { return datum.target.y; });
    });
