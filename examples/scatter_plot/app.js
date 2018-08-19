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

var parseTime = d3.timeParse("%B%e, %Y at %-I:%M%p");
var formatTime = d3.timeFormat("%B%e, %Y at %-I:%M%p");
var xScale = d3.scaleTime();
xScale.range([0,WIDTH]);
var xDomain = d3.extent(runs, function(datum, index){
    return parseTime(datum.date);
});
xScale.domain(xDomain);

var yScale = d3.scaleLinear(); //create the scale
yScale.range([HEIGHT, 0]); //set the visual range (e.g. 600 to 0)
var yDomain = d3.extent(runs, function(datum, index){
    return datum.distance; //compare distance properties of each item in the data array
})
yScale.domain(yDomain);
var render = function(){

    //adjust the code at the top of your render function
    d3.select('#points').html(''); //clear out all circles when rendering
    d3.select('#points').selectAll('circle') //add circles to #points group, not svg
        .data(runs)
        .enter()
        .append('circle');

    d3.selectAll('circle')
        .attr('cy', function(datum, index){
            return yScale(datum.distance);
        });

    d3.selectAll('circle')
        .attr('cx', function(datum, index){
            return xScale(parseTime(datum.date)); //use parseTime to convert the date string property on the datum object to a Date object, which xScale then converts to a visual value
        });

    //put this at the bottom of the render function, so that click handlers are attached when the circle is created
    d3.selectAll('circle').on('click', function(datum, index){
        d3.event.stopPropagation(); //stop click event from propagating to the SVG element and creating a run
        runs = runs.filter(function(run, index){ //create a new array that has removed the run with the correct id.  Set it to the runs var
            return run.id != datum.id;
        });
        render(); //re-render dots
        createTable(); //re-render table
    });
}
render();

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
    d3.select('tbody').html(''); //clear out all rows from the table
    for (var i = 0; i < runs.length; i++) {
        var row = d3.select('tbody').append('tr');
        row.append('td').html(runs[i].id);
        row.append('td').html(runs[i].date);
        row.append('td').html(runs[i].distance);
    }
}

createTable();

d3.select('svg').on('click', function(){
    var x = d3.event.offsetX; //gets the x position of the mouse relative to the svg element
    var y = d3.event.offsetY; //gets the y position of the mouse relative to the svg element

    var date = xScale.invert(x) //get a date value from the visual point that we clicked on
    var distance = yScale.invert(y); //get a numeric distance value from the visual point that we clicked on

    var newRun = { //create a new "run" object
        id: ( runs.length > 0 ) ? runs[runs.length-1].id+1 : 1, //generate a new id by adding 1 to the last run's id
        date: formatTime(date), //format the date object created above to a string
        distance: distance //add the distance
    }
    runs.push(newRun); //push the new run onto the runs array
    createTable(); //render the table
    render(); //add this line
});
