var width = 960;
var height = 490;

//set the height/width of the svg
d3.select('svg')
    .attr('width', width)
    .attr('height', height);

//choose a project that works with our data
var worldProjection = d3.geoEquirectangular();

d3.select('svg').selectAll('path') //select all path elements within the svg, even if none exist
    .data(map_json.features) //link the features array of our data to that selection
    .enter() //find the data elements not associated with paths
    .append('path') //append a path for each unmatch data element
    .attr('fill', '#099'); //set the fill for all paths

var dAttributeFunction = d3.geoPath() //create a path drawing function that will use our worldProjection
    .projection(worldProjection);

d3.selectAll('path').attr('d', dAttributeFunction); //use that function to modify the d attribute of all path elements
