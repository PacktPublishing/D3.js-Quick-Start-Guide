// dimensions for svg
var WIDTH = 800;
var HEIGHT = 600;

// run data
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

// set dimensions of outer SVG
d3.select('#container')
    .style('width', WIDTH)
    .style('height', HEIGHT);

var parseTime = d3.timeParse("%B%e, %Y at %-I:%M%p"); //use this to convert strings to dates
var formatTime = d3.timeFormat("%B%e, %Y at %-I:%M%p"); //use this to convert dates to strings
var xScale = d3.scaleTime(); //create the scale used to convert dates to x position values
xScale.range([0,WIDTH]); //set visual range of xScale to be 0 -> 800
var xDomain = d3.extent(runs, function(datum, index){ //create array containing min/max date values for run data
    return parseTime(datum.date); //use parseTime to convert string data value to data object
});
xScale.domain(xDomain);//set domain of xScale to min/max values created by d3.extent in last step

var yScale = d3.scaleLinear(); //create the scale used to convert distances run to y position values
// set the visual range to 600 -> 0
// remember 600 will map to a low run distance value and 0 will map to a high run distance value
// we do this because y starts at 0 at the top of the SVG and increases in value as we move down the SVG
yScale.range([HEIGHT, 0]);
 //create array containing min/max distance values for run data
var yDomain = d3.extent(runs, function(datum, index){
    return datum.distance; //compare distance properties of each item in the data array
})
yScale.domain(yDomain); //set domain of yScale to min/max values created by d3.extent in the last step

//render function which creates the circles and attaches event handlers to them
var render = function(){

    //circles var for holding our circle selction
    var circles = d3.select('#points') //first select #points so we have somewhere to append circles later
        .selectAll('circle') //now select all circles even if none exist
        //attach data to the circles and set up each circle's id according to the following function
        .data(runs, function(datum){
            return datum.id //use each datum's id property as the id for the circle it's being attached to
        });
    //find all data elements not attached to circles and create a circle for each one
    circles.enter().append('circle');
    //remove all extra circles that are not attached to data
    circles.exit().remove();

    d3.selectAll('circle') //select all circles
        .attr('cy', function(datum, index){ //loop through each circle and set its cy according to the follwing function
            //find the distance property of the circle's associated datum
            //convert that distance value from a numeric value to a visual point on the SVG using yScale
            return yScale(datum.distance);
        });

    d3.selectAll('circle') //select all circles
        .attr('cx', function(datum, index){ //loop through each circle and set its cx according to the follwing function
            //find the date property of the circle's associated datum
            //convert that date value from a string value to a date using parseTime
            //convert that date object to a visual point on the SVG using xScale
            return xScale(parseTime(datum.date));
        });

    //put this at the bottom of the render function, so that click handlers are attached after the circles is created
    //if you put it outside the render function, there will be no circles to attach click handlers to
    d3.selectAll('circle').on('click', function(datum, index){
        d3.event.stopPropagation(); //stop click event from propagating to the SVG element and creating a run accidentally
        //create a new array that has removed the run with the correct id.  Set it to the runs var
        runs = runs.filter(function(run, index){
            return run.id != datum.id; //keep all elements in the 'runs' array that do not have the id of the cirlce that was clicked
        });
        render(); //re-render dots
        createTable(); //re-render table
    });

    //function to be called once dragging a circle is complette
    var dragEnd = function(datum){
        //find x/y of where the click happened
        var x = d3.event.x;
        var y = d3.event.y;

        //convert those x/y values to date/distance values
        var date = xScale.invert(x); //note date is Date object.  We'll convert it to a properly formatted string later
        var distance = yScale.invert(y);

        //adjust the date/distance values on the datum associated with the circle that was dragged
        datum.date = formatTime(date); //use formatTime to turn the date object into a string
        datum.distance = distance;
        createTable();//re-render the table
    }

    // function to be called while the user drags a circle
    var drag = function(datum){
        var x = d3.event.x; //get current x position of the cursor
        var y = d3.event.y; //get current y position of the cursor
        d3.select(this).attr('cx', x); //change the dragged element's cx attribute to whatever the x position of the cursor is
        d3.select(this).attr('cy', y); //change the dragged element's cy attribute to whatever the y position of the cursor is
    }
    var dragBehavior = d3.drag() //create a drag behavior
        //call the "drag" function (the 2nd param) each time the user moves the cursor before releasing the mouse button.
        //The "drag" function is defined above
        .on('drag', drag)
        //call the "dragEnd" function (the 2nd param) once the user releases the "mouse button"
        .on('end', dragEnd);
    d3.selectAll('circle').call(dragBehavior); //attach the dragBehavior behavior to all <circle> elements
}
//render circles on page load
render();

//create a bottomAxis generator.  Pass the xScale so it knows how to label the axis
var bottomAxis = d3.axisBottom(xScale);
d3.select('#container') //select the outer SVG
	.append('g') //append a <g> to it
    .attr('id', 'x-axis') //add an id
	.call(bottomAxis) //call the axis generator on that <g> so that an axis is generated within it
    .attr('transform', 'translate(0,'+HEIGHT+')'); //move the axis to the bottom of the SVG

//create a leftAxis generator.  Pass the yScale so it knows how to label the axis
var leftAxis = d3.axisLeft(yScale);
d3.select('#container') //select the outer SVG
	.append('g') //append a <g> to it
    .attr('id', 'y-axis') //add an id
	.call(leftAxis); //call the axis generator on that <g> so that an axis is generated within it

//define the createTable function here
var createTable = function(){
    d3.select('tbody').html(''); //clear out all rows from the table
    //loop through each element in the runs array
    for (var i = 0; i < runs.length; i++) {
        var row = d3.select('tbody').append('tr');//append a tr to the tbody element
         //create cells for id, date, and distance and add the values appropriately
        row.append('td').html(runs[i].id);
        row.append('td').html(runs[i].date);
        row.append('td').html(runs[i].distance);
    }
}

//render the table on page load
createTable();

//create a click handler on the main SVG, allowing the user to create new runs by click anywhere in it
d3.select('#container').on('click', function(){

    //create x and y vars to the x/y values of the point that the user clicked
    var x = d3.event.offsetX;
    var y = d3.event.offsetY;

    //if a transform occurred (zoom/pan), adjust the x/y vars to take this into account
    if(lastTransform !== null){
        x = lastTransform.invertX(d3.event.offsetX);
        y = lastTransform.invertY(d3.event.offsetY);
    }

    var date = xScale.invert(x) //get a date value from the visual point that we clicked on
    var distance = yScale.invert(y); //get a numeric distance value from the visual point that we clicked on

    var newRun = { //create a new "run" object
        //generate a new id by adding 1 to the last run's id
        //if no runs exist, set the id to 1
        id: ( runs.length > 0 ) ? runs[runs.length-1].id+1 : 1,
        date: formatTime(date), //format the date object created above to a string
        distance: distance //add the distance
    }
    runs.push(newRun); //push the new run onto the runs array
    createTable(); //render the table
    render(); //add this line
});

//create a var to hold any zoom/pan transformations that occur
var lastTransform = null;

//function to be called each to a user zooms/pans
var zoomCallback = function(){
    lastTransform = d3.event.transform; //save the transformation that just happened
	d3.select('#points').attr("transform", d3.event.transform); //transform the <g id="point"> appropriately
    d3.select('#x-axis') //adjust the values in the x axis
        .call(bottomAxis.scale(d3.event.transform.rescaleX(xScale)));
    d3.select('#y-axis') //adjust the values in the y axis
        .call(leftAxis.scale(d3.event.transform.rescaleY(yScale)));
}

//set up the zoom behavior generator
var zoom = d3.zoom()
    .on('zoom', zoomCallback);
d3.select('#container').call(zoom); //attach the zoom behavior to the #container SVG
