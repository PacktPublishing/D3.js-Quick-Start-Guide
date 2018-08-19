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
    var dragEnd = function(datum){
        var x = d3.event.x;
        var y = d3.event.y;

        var date = xScale.invert(x);
        var distance = yScale.invert(y);

        datum.date = formatTime(date);
        datum.distance = distance;
        createTable();
    }
    var drag = function(datum){
        var x = d3.event.x; //get current x position of the cursor
        var y = d3.event.y; //get current y position of the cursor
        d3.select(this).attr('cx', x); //change the dragged element's cx attribute to whatever the x position of the cursor is
        d3.select(this).attr('cy', y); //change the dragged element's cy attribute to whatever the y position of the cursor is
    }
    var dragBehavior = d3.drag() //create a drag behavior
        .on('drag', drag) //call the "drag" function (the 2nd param) each time the user moves the cursor before releasing the mouse button.  The "drag" function is defined above
        .on('end', dragEnd); //dragEnd is a reference to a function we haven't created yet
    d3.selectAll('circle').call(dragBehavior); //attach the dragBehavior behavior to all <circle> elements
}
render();

var bottomAxis = d3.axisBottom(xScale);
d3.select('svg')
	.append('g')
    .attr('id', 'x-axis') //add an id
	.call(bottomAxis)
    .attr('transform', 'translate(0,'+HEIGHT+')');

var leftAxis = d3.axisLeft(yScale);
d3.select('svg')
	.append('g')
    .attr('id', 'y-axis') //add an id
	.call(leftAxis);

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
    var x = lastTransform.invertX(d3.event.offsetX);
    var y = lastTransform.invertY(d3.event.offsetY);

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

var lastTransform = null;
var zoomCallback = function(){
    lastTransform = d3.event.transform; //add this
	d3.select('#points').attr("transform", d3.event.transform);
    d3.select('#x-axis')
        .call(bottomAxis.scale(d3.event.transform.rescaleX(xScale)));
    d3.select('#y-axis')
        .call(leftAxis.scale(d3.event.transform.rescaleY(yScale)));
}

var zoom = d3.zoom()
    .on('zoom', zoomCallback);
d3.select('svg').call(zoom);
