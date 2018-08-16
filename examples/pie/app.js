var WIDTH = 360;
var HEIGHT = 360;
var radius = Math.min(WIDTH, HEIGHT) / 2;

var dataset = [
    { label: 'Bob', count: 10 },
    { label: 'Sally', count: 20 },
    { label: 'Matt', count: 30 },
    { label: 'Jane', count: 40 }
];
var mapper = d3.scaleOrdinal();
mapper.range([45, 63, 400]); //list each value for ordinal scales, not just min/max
mapper.domain(['Bob', 'Sally', 'Zagthor']); //list each value for ordinal scales, not just min/max

var colorScale = d3.scaleOrdinal();
colorScale.range(d3.schemeCategory10);

d3.select('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);

var path = d3.select('g').selectAll('path')
    .data(dataset)
    .enter()
    .append('path')
    .attr('fill', function(d) {
        return colorScale(d.label);
    });
