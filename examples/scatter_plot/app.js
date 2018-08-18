var WIDTH = 800;
var HEIGHT = 600;

var runs = [
    {
        id: 1,
        date: 'October 1, 2017 at 4:00PM',
        distance: 5.2
    },
    {
        id: 2,
        date: 'October 2, 2017 at 5:00PM',
        distance: 7.0725
    },
    {
        id: 3,
        date: 'October 3, 2017 at 6:00PM',
        distance: 8.7
    }
];


d3.select('svg')
    .style('width', WIDTH)
    .style('height', HEIGHT);

var yScale = d3.scaleLinear(); //create the scale
yScale.range([HEIGHT, 0]); //set the visual range (e.g. 600 to 0)
var yDomain = d3.extent(runs, function(datum, index){
    return datum.distance; //compare distance properties of each item in the data array
})
yScale.domain(yDomain);

d3.select('svg').selectAll('circle') //since no circles exist, we need to select('svg') so that d3 knows where to append the new circles
    .data(runs) //attach the data as before
    .enter() //find the data objects that have not yet been attached to visual elements
    .append('circle'); //for each data object that hasn't been attached, append a <circle> to the <svg>

d3.selectAll('circle')
    .attr('cy', function(datum, index){
        return yScale(datum.distance);
    });

var parseTime = d3.timeParse("%B%e, %Y at %-I:%M%p");
var formatTime = d3.timeFormat("%B%e, %Y at %-I:%M%p");
var xScale = d3.scaleTime();
xScale.range([0,WIDTH]);
var xDomain = d3.extent(runs, function(datum, index){
    return parseTime(datum.date);
});
xScale.domain(xDomain);

d3.selectAll('circle')
    .attr('cx', function(datum, index){
        return xScale(parseTime(datum.date)); //use parseTime to convert the date string property on the datum object to a Date object, which xScale then converts to a visual value
    });

var bottomAxis = d3.axisBottom(xScale); //pass the appropriate scale in as a parameter
d3.select('svg')
	.append('g') //put everything inside a group
	.call(bottomAxis) //generate the axis within the group
    .attr('transform', 'translate(0,'+HEIGHT+')');

var leftAxis = d3.axisLeft(yScale);
d3.select('svg')
	.append('g')
	.call(leftAxis); //no need to transform, since it's placed correctly initially

var createTable = function(){
    for (var i = 0; i < runs.length; i++) {
        var row = d3.select('tbody').append('tr');
        row.append('td').html(runs[i].id);
        row.append('td').html(runs[i].date);
        row.append('td').html(runs[i].distance);
    }
}

createTable();
