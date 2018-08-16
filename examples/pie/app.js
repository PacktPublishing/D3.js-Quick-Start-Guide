var WIDTH = 360;
var HEIGHT = 360;
var radius = Math.min(WIDTH, HEIGHT) / 2;

var dataset = [
    { id: 1, label: 'Bob', count: 10 },
    { id: 2, label: 'Sally', count: 20 },
    { id: 3, label: 'Matt', count: 30 },
    { id: 4, label: 'Jane', count: 40 }
];

var mapper = d3.scaleOrdinal();
mapper.range([45, 63, 400]); //list each value for ordinal scales, not just min/max
mapper.domain(['Bob', 'Sally', 'Zagthor']); //list each value for ordinal scales, not just min/max

var colorScale = d3.scaleOrdinal();
colorScale.range(d3.schemeCategory10);

d3.select('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);
var container = d3.select('g') //add this line and the next:
    .attr('transform', 'translate(' + (WIDTH / 2) + ',' + (HEIGHT / 2) + ')'); //add this line

var arc = d3.arc()
    .innerRadius(100) //to make this a donut graph, adjust this value
    .outerRadius(radius);

var pie = d3.pie()
    .value(function(d) { return d.count; }) //use the 'count' property each value in the original array to determine how big the piece of pie should be
    .sort(null); //don't sort the values

var path = d3.select('g').selectAll('path')
    .data(pie(dataset), function(datum){ //attach datum.data.id to each element
        return datum.data.id
    })
    .enter()
    .append('path')
    .attr('d', arc) //add this
    .attr('fill', function(d) {
        return colorScale(d.data.label);
    })
    .each(function(d) { this._current = d; }); //add this

path.on('click', function(clickedDatum, clickedIndex){
    dataset = dataset.filter(function(currentDatum, currentIndex){ //new
        return clickedDatum.data.id !== currentDatum.id //new
    }); //new
    path //new
        .data(pie(dataset), function(datum){ //new
            return datum.data.id //new
        }) //new
        .exit().remove(); //new
    path.transition() //create the transition
            .duration(750) //add how long the transition takes
            .attrTween('d', function(d) { //tween the d attribute
                var interpolate = d3.interpolate(this._current, d); //interpolate from what the d attribute was and what it is now
                this._current = interpolate(0); //save new value of data
                return function(t) { //re-run the arc function:
                    return arc(interpolate(t));
                };
            });
});
