var WIDTH = 360;
var HEIGHT = 360;
var radius = Math.min(WIDTH, HEIGHT) / 2; //set the radius of the pie chart

//create some fake data
var dataset = [
    { id: 1, label: 'Bob', count: 10 },
    { id: 2, label: 'Sally', count: 20 },
    { id: 3, label: 'Matt', count: 30 },
    { id: 4, label: 'Jane', count: 40 }
];

//create an ordinal scale which maps each label property of the elements in the dataset array to a color
var colorScale = d3.scaleOrdinal();
colorScale.range(d3.schemeCategory10); //the range is an array of color strings
colorScale.domain(dataset.map(function(element){ //use .map to generate an array of strings -- ['Bob', 'Sally', 'Matt', 'Jane']
    //by examining the label property of each data element
    return element.label;
}));

//set the svg width/height
d3.select('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);

var container = d3.select('g') //adjust the position of the <g> so it's in the center of the SVG
    .attr('transform', 'translate(' + (WIDTH / 2) + ',' + (HEIGHT / 2) + ')');

var arc = d3.arc() //create an arc generating function
    .innerRadius(100) //to make this a donut graph, adjust this value
    .outerRadius(radius); //set the outer radius of the pie

var pie = d3.pie() //create a pie generator which will adjust the data so that it can be used with arc
    .value(function(d) { return d.count; }) //use the 'count' property of each value in the original dataset array to determine how big the piece of pie should be
    .sort(null); //don't sort the values

var path = d3.select('g').selectAll('path') //select all path elements in the <g> whether or not they exist
    .data(pie(dataset), function(datum){ //attach datum.data.id, which was created by pie(dataset), to each element
        return datum.data.id
    })
    .enter() //find all unmatched data elements
    .append('path') //append a path for each unmatched data element
    .attr('d', arc) //use arc to generate the d attribute of each path, now the pie(dataset) as adjusted the data to work with it
    .attr('fill', function(d) { //set the color based on converting the d.data.label string to a color
        return colorScale(d.data.label);
    })
    .each(function(d) { this._current = d; }); //save the data object attached to each path for later when animating

path.on('click', function(clickedDatum, clickedIndex){ //set up the click handler
    dataset = dataset.filter(function(currentDatum, currentIndex){ //loop through all elements in dataset and remove the appropriate one
        return clickedDatum.data.id !== currentDatum.id //determine the appropriate one by looking at the .data.id property of the element clicked
    });
    path
        .data(pie(dataset), function(datum){ //now reassign the data elements to the paths, since one data element was removed
            return datum.data.id
        })
        .exit() //find the path elements not assigned to data
        .remove(); //and remove them
    path.transition() //create the transition
        .duration(750) //add how long the transition takes
        .attrTween('d', function(d) { //tween the d attribute
            var interpolate = d3.interpolate(this._current, d); //create an interpolater function from what the d attribute was (this._current) and what it is now
            this._current = interpolate(0); //save new value of data
            return function(t) { //re-run the arc function to redraw the path
                return arc(interpolate(t));
            };
        });
});
