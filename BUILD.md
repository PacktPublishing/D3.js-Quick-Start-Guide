# D3 Build

## Lesson Objectives

1. Add link to d3 library
1. Add an `<svg>` tag and size it with D3
1. Create some fake data for our app
1. Add SVG circles and style them
1. Create a linear scale
1. Attach data to visual elements
1. Use data attached to a visual element to affect its appearance
1. Create a time scale
1. Parse and format times
1. Set dynamic domains
1. Dynamically generate svg elements
1. Create axes
1. Display data in a table
1. Create click handler
1. Remove data
1. Drag an element
1. Update data after a drag
1. Create a zoom behavior that scales elements
1. Update axes when zooming
1. Update click points after a transform
1. Avoid redrawing entire screen during render
1. Hide elements beyond axis
1. Use AJAX

## Add link to d3 library

First thing we want to do is create basic `index.html` file:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
    </head>
    <body>
    </body>
</html>
```

Now add a link to D3 at the bottom of your `<body>` tag in `index.html`:

```html
<body>    
    <script src="https://d3js.org/d3.v4.min.js"></script>
</body>
```

Now create `app.js`, which will store all of our code:

```javascript
console.log('this works');
```

and link to it in `index.html` at the bottom of the `<body>` tag:

```html
<body>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="app.js" charset="utf-8"></script>
</body>
```

## Add an `<svg>` tag and size it with D3

At the top of the `<body>` tag in `index.html`, add an `<svg>` tag:

```html
<body>
    <svg></svg>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="app.js" charset="utf-8"></script>
</body>
```

In `app.js` create variables to hold the width and height of the `<svg>` tag:

```javascript
var WIDTH = 800;
var HEIGHT = 600;
```

Next, we can use `d3.select()` to select a single element, in this case, the `<svg>` element:

```javascript
var WIDTH = 800;
var HEIGHT = 600;

d3.select('svg');
```

The return value of this is a d3 version of the element (just like jQuery), so we "chain" commands onto this.  Let's add some styling to adjust the height/width of the element:

```javascript
d3.select('svg')
    .style('width', WIDTH)
    .style('height', HEIGHT);
```

## Create some fake data for our app

In `app.js` let's create an array of "run" objects (**NOTE I'm storing the date as a string on purpose.  Also, it's important that this be an array of objects, in order to work with D3**):

```javascript
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
```

## Add SVG circles and style them

Add three circles to your `<svg>` element (each one will represent a run):

```html
<svg>
    <circle/>
    <circle/>
    <circle/>
</svg>
```

Create `app.css` with some styling for the circles and our `svg` element:

```css
circle {
    r:5;
    fill: black;
}
svg {
    border: 1px solid black;
}
```

and link to it in `index.html`

```html
<head>
    <meta charset="utf-8">
    <title></title>
    <link rel="stylesheet" href="app.css">
</head>
```

## Create a linear scale

- Let's position the circles vertically, based on the distance run
- One of the most important things that D3 does is provide the ability to map points in the "domain" of data to points in the visual "range" using what's called a `scale`.
- There are lots of different kinds of scales, but for now we're just going to use a `linear` scale which will map numeric data values to numeric visual values.

In `app.js`:

```javascript
d3.select('svg')
    .style('width', WIDTH)
    .style('height', HEIGHT);

var yScale = d3.scaleLinear(); //create the scale
yScale.range([HEIGHT, 0]); //set the visual range (e.g. 600 to 0)
yScale.domain([0, 10]); //set the data domain (e.g. 0 to 10)

console.log(yScale(5)); //get a visual point from a data value
console.log(yScale.invert(450)); //get a data values from a visual point
```

- Here we're saying that a data point of 0 to map to a visual height value of 600
- This is because the lower the distance run (data value), the more we want to move the visual point down the Y axis
    - remember that the Y axis starts at 0 at the top and increases in value

## Attach data to visual elements

We can attach each of our "run" objects to one of our circles, so that each circle can access that data:

```javascript
yScale.range([HEIGHT, 0]);
yScale.domain([0, 10]);

d3.selectAll('circle').data(runs); //selectAll is like select, but selects all elements that match the query string
```

## Use data attached to a visual element to affect its appearance

When setting a value for an element's style, class, id or any other attribute, we can pass that method a callback instead of a static value.

```javascript
d3.selectAll('circle').data(runs)
    .attr('cy', function(datum, index){
        return yScale(datum.distance);
    });
```

- That callback function runs for each visual element selected
- The result of the function is then assigned to whatever aspect of the element is being set (in this case the `cy` attribute)
- The callback function takes two params
    - the individual `datum` object (from the original `runs` array of objects) attached to that particular visual element
    - the `index` of that `datum` in the original `runs` array

## Create a time scale

- Let's position the circles horizontally, based on the date that they happened
- First create a time scale:

```javascript
var xScale = d3.scaleTime(); //scaleTime maps date values with numeric visual points
xScale.range([0,WIDTH]);
xScale.domain([new Date('2017-10-1'), new Date('2017-10-31')]);

console.log(xScale.domain()); //you can get the domain whenever you want like this
console.log(xScale.range()); //you can get the range whenever you want like this
```

## Parse and format times

- Note that our `date` data isn't in the format expected by the xScale domain
- D3 provides us an easy way to convert strings to dates and vice versa using [these values](https://github.com/d3/d3-time-format#locale_format)

```javascript
var parseTime = d3.timeParse("%B%e, %Y at %-I:%M%p");
console.log(parseTime('October 3, 2017 at 6:00PM'));

var formatTime = d3.timeFormat("%B%e, %Y at %-I:%M%p");
console.log(formatTime(new Date()));
```

Let's use this when calculating `cx` attributes for our circles:

```javascript
var parseTime = d3.timeParse("%B%e, %Y at %-I:%M%p");
d3.selectAll('circle')
    .attr('cx', function(datum, index){
        return xScale(parseTime(datum.date)); //use parseTime to convert the date string property on the datum object to a Date object
    });
```

## Set dynamic domains

- At the moment, we're setting up arbitrary min/max values for both distance/date
- D3 can find the min/max of a data set, so that our graph displays just the data ranges we need:
- we pass the min/max methods a callback which gets called for each item of data in the array
    - d3 uses the callback to determine which values to compare for min/max

```javascript
var yMin = d3.min(runs, function(datum, index){
    return datum.distance; //compare distance properties of each item in the data array
})
var yMax = d3.max(runs, function(datum, index){
    return datum.distance; //compare distance properties of each item in the data array
})
yScale.domain([yMin, yMax]);
```

We can combine both of these functions into one "extent" function that returns both:

```javascript
var yDomain = d3.extent(runs, function(datum, index){
    return datum.distance; //compare distance properties of each item in the data array
})
yScale.domain(yDomain);
```

Let's do the same for the xScale's domain:

```javascript
var parseTime = d3.timeParse("%B%e, %Y at %-I:%M%p");
var xScale = d3.scaleTime();
xScale.range([0,WIDTH]);
var xDomain = d3.extent(runs, function(datum, index){
    return parseTime(datum.date);
});
xScale.domain(xDomain);
```

## Dynamically generate svg elements

- Currently, we have just enough `<circle>` elements to fit our data.  What if we don't want to count how many elements are in the array?
- D3 Can create elements as needed
- First, remove all `<circle>` elements from `index.html`

```html
<svg></svg>
```

In `app.js` add the code to create the circles:

```javascript
d3.select('svg').selectAll('circle') //since no circles exist, we need to select('svg') so that d3 knows where to append the new circles
    .data(runs) //attach the data as before
    .enter() //find the data objects that have not yet been attached to visual elements
    .append('circle'); //for each data object that hasn't been attached, append a <circle> to the <svg>
```

## Create axes

D3 can automatically generate axes for you:

```javascript
var bottomAxis = d3.axisBottom(xScale); //pass the appropriate scale in as a parameter
d3.select('svg')
	.append('g') //put everything inside a group
	.call(bottomAxis) //generate the axis within the group
    .attr('transform', 'translate(0,'+HEIGHT+')'); //move it to the bottom
```

Currently, our SVG clips the axis.  Let's change some CSS so it doesn't:

```css
svg {
    overflow: visible;    
}
```

The left axis is pretty similar:

```javascript
var leftAxis = d3.axisLeft(yScale);
d3.select('svg')
	.append('g')
	.call(leftAxis); //no need to transform, since it's placed correctly initially
```

It's a little tough to see, so let's adding some margin to the body:

```css
body {
    margin: 20px 40px;
}
```

## Display data in a table

Just for debugging purposes, let's create a table which will show all of our data:

```html
<svg></svg>
<table>
    <thead>
        <tr>
            <th>id</th>
            <th>date</th>
            <th>distance</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>
```

Now populate the `<tbody>`:

```javascript
var createTable = function(){
    for (var i = 0; i < runs.length; i++) {
        var row = d3.select('tbody').append('tr');
        row.append('td').html(runs[i].id);
        row.append('td').html(runs[i].date);
        row.append('td').html(runs[i].distance);
    }
}

createTable();
```

And a little styling:

```css
svg {
    overflow: visible;
    margin-bottom: 50px;
}

table, th, td {
   border: 1px solid black;
}
th, td {
    padding:10px;
    text-align: center;
}
```

## Create click handler

Let's say that we want it so that when the user clicks on the `<svg>` element, it creates a new run.

```javascript
var formatTime = d3.timeFormat("%B%e, %Y at %-I:%M%p"); //will take a date object and return a formatted string
d3.select('svg').on('click', function(){
    var x = d3.event.offsetX; //gets the x position of the mouse relative to the svg element
    var y = d3.event.offsetY; //gets the y position of the mouse relative to the svg element

    var date = xScale.invert(x) //get a date value from a visual point
    var distance = yScale.invert(y); //get a numeric distance value from a visual point

    var newRun = { //create a new "run" object
        id: runs[runs.length-1].id+1, //generate a new id by adding 1 to the last run's id
        date: formatTime(date), //format the date object created above
        distance: distance //add the distance
    }
    runs.push(newRun); //push the new run onto the runs array
    createTable(); //render the table
});
```

You might notice that `createTable()` just adds on all the run rows again.  Let's clear out the previous rows:

```javascript
var createTable = function(){
    d3.select('tbody').html(''); //clear out all rows from the table
    for (var i = 0; i < runs.length; i++) {
        var row = d3.select('tbody').append('tr');
        row.append('td').html(runs[i].id);
        row.append('td').html(runs[i].date);
        row.append('td').html(runs[i].distance);
    }
}
```

Now put the code for creating `<circles>` inside a render function:

```javascript
var render = function(){

    var yScale = d3.scaleLinear();
    yScale.range([HEIGHT, 0]);
    yDomain = d3.extent(runs, function(datum, index){
        return datum.distance;
    })
    yScale.domain(yDomain);

    d3.select('svg').selectAll('circle')
        .data(runs)
        .enter()
        .append('circle');

    d3.selectAll('circle')
        .attr('cy', function(datum, index){
            return yScale(datum.distance);
        });

    var parseTime = d3.timeParse("%B%e, %Y at %-I:%M%p");
    var xScale = d3.scaleTime();
    xScale.range([0,WIDTH]);
    xDomain = d3.extent(runs, function(datum, index){
        return parseTime(datum.date);
    });
    xScale.domain(xDomain);

    d3.selectAll('circle')
        .attr('cx', function(datum, index){
            return xScale(parseTime(datum.date));
        });

}
render();
```

For future use, let's move the `xScale` and `yScale` out of the render function along with the code for creating the domains/ranges:

```javascript
var xScale = d3.scaleTime();
var parseTime = d3.timeParse("%B%e, %Y at %-I:%M%p");
xScale.range([0,WIDTH]);
xDomain = d3.extent(runs, function(datum, index){
    return parseTime(datum.date);
});
xScale.domain(xDomain);

var yScale = d3.scaleLinear();
yScale.range([HEIGHT, 0]);
yDomain = d3.extent(runs, function(datum, index){
    return datum.distance;
})
yScale.domain(yDomain);
var render = function(){
    //...rest of render function without xScale and yScale declarations and domain code
}
render();
```

Let's call `render()` inside our `<svg>` click handler:

```javascript
runs.push(newRun);
createTable();
render();
```

## Remove data

- Let's set up a click handler on a `<circle>` to remove that data element from the array
- We'll need to do this inside the `render()` declaration so that the click handlers are attached **after** the circles are created

```javascript
//put this inside the render function, so that click handlers are attached when the circle is created
d3.selectAll('circle').on('click', function(datum, index){
    d3.event.stopPropagation(); //stop click event from propagating to the SVG element and creating a run
    runs = runs.filter(function(run, index){ //create a new array that has removed the run with the correct id.  Set it to the runs var
        return run.id != datum.id;
    });
    render(); //re-render dots
    createTable(); //re-render table
});
```

The `<circle>` elements aren't be removed though.  Let's put them in a `<g>` so that it's easy to clear out:

```html
<svg>
    <g id="points"></g>
</svg>
```

Now we can clear out the `<circle>` elements each time `render()` is called.

```javascript
var render = function(){
    d3.select('#points').html(''); //clear out all circles when rendering
    d3.select('#points').selectAll('circle') //add circles to #points group, not svg
        .data(runs)
        .enter()
        .append('circle');    
}
```

Let's put in a little code to handle when the user has deleted all runs and tries to add a new one:

```javascript
//inside svg click handler
var newRun = {
    id: ( runs.length > 0 ) ? runs[runs.length-1].id+1 : 1,
    date: formatTime(date),
    distance: distance
}
```

Lastly, let's put in some css, so we know we're clicking on a circle:

```css
circle {
    r: 5;
    fill: black;
    transition: r 0.5s linear, fill 0.5s linear; /* transition */
}
circle:hover { /* hover state */
    r:10;
    fill: blue;
}
```

## Drag an element

- D3 allows us to create complex interactions called "behaviors" which have multiple callbacks
- Two steps:
    - create the behavior
    - attach the behavior to one or more elements
- drag behaviors have three callbacks
    - when the user starts to drag
    - each time the user moves the cursor before releasing the "mouse" button
    - when the user releases the "mouse" button

```javascript
//put this code at the end of the render function
var drag = function(datum){
    var x = d3.event.x; //get current x position of the cursor
    var y = d3.event.y; //get current y position of the cursor
    d3.select(this).attr('cx', x); //change the dragged element's cx attribute to whatever the x position of the cursor is
    d3.select(this).attr('cy', y); //change the dragged element's cy attribute to whatever the y position of the cursor is
}
var dragBehavior = d3.drag() //create a drag behavior
    // .on('start', dragStart) //dragStart is a reference to a function we haven't created yet
    .on('drag', drag); //call the "drag" function (the 2nd param) each time the user moves the cursor before releasing the mouse button.  The "drag" function is defined above
    // .on('end', dragEnd); //dragEnd is a reference to a function we haven't created yet
d3.selectAll('circle').call(dragBehavior); //attach the dragBehavior behavior to all <circle> elements
```

## Update data after a drag

- Uncomment the `.on('end', dragEnd)` code
- Create the callback function

```javascript
var dragEnd = function(datum){
    var x = d3.event.x; //get current x position of the cursor
    var y = d3.event.y; //get current y position of the cursor

    var date = xScale.invert(x); //get the date by using the xScale to invert the x position of the mouse
    var distance = yScale.invert(y); //get the distance by using the yScale to invert the y position of the mouse

    //since datum is an object, which is are passed by reference, we can update a property on the object, and the original variable will update
    datum.date = formatTime(date); //use formatTime() to convert the date variable, which is a Date object, into the appropriate string
    datum.distance = distance; //change the distance
    createTable(); //redraw the table
}
var dragBehavior = d3.drag()
    // .on('start', dragStart)
    .on('drag', drag)
    .on('end', dragEnd);
```

Let's change the color of a circle while it's being dragged too:

```css
circle:active {
    fill: red;
}
```

## Create a zoom behavior that scales elements

- Another behavior we can create is the zooming ability
    - two finger drag
    - mouse wheel
    - pinch/spread

```javascript
//put this at the end of app.js
var zoomCallback = function(){ //the callback function
	d3.select('#points').attr("transform", d3.event.transform); //transform the #points <g> element based on the zoom transform created
}
var zoom = d3.zoom() //create the zoom behavior
    .on('zoom', zoomCallback); //tell it which callback function to use when zooming
d3.select('svg').call(zoom); //attach the behavior to the svg element
```

## Update axes when zooming

To update the axes, let's first add ids to the `<g>` elements that contain them

```javascript
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
```

Now let's use those ids when we zoom:

```javascript
var zoomCallback = function(){
	d3.select('#points').attr("transform", d3.event.transform);
    d3.select('#x-axis').call(bottomAxis.scale(d3.event.transform.rescaleX(xScale)));
	d3.select('#y-axis').call(leftAxis.scale(d3.event.transform.rescaleY(yScale)));
}
```

- `bottomAxis.scale()` tells the axis to redraw itself
- `d3.event.transform.rescaleX(xScale)` returns a value indicating how the bottom axis should rescale

## Update click points after a transform

- If we click on the svg to create new runs, they circles/data created are incorrect
- When we zoom, we need to save the transformation to a variable

```javascript
var lastTransform = null; //reference to the last transform that happened
var zoomCallback = function(){
    lastTransform = d3.event.transform; //update the transform reference
	d3.select('#points').attr("transform", d3.event.transform);
    d3.select('#x-axis').call(bottomAxis.scale(d3.event.transform.rescaleX(xScale)));
	d3.select('#y-axis').call(leftAxis.scale(d3.event.transform.rescaleY(yScale)));
}
```

Now use that reference to the last transform when clicking on the svg:

```javascript
d3.select('svg').on('click', function(){
    var x = lastTransform.invertX(d3.event.offsetX); //invert the transformation so we get a proper x value
    var y = lastTransform.invertY(d3.event.offsetY);

    var date = xScale.invert(x)
    var distance = yScale.invert(y);

    var newRun = {
        id: ( runs.length > 0 ) ? runs[runs.length-1].id+1 : 1,
        date: formatTime(date),
        distance: distance
    }
    runs.push(newRun);
    createTable();
    render();
});
```

But now clicking before any zoom is broken, since `lastTransform` will be null:

```javascript
//set x/y like normal
var x = d3.event.offsetX;
var y = d3.event.offsetY;

//if lastTransform has been updated, overwrite these values
if(lastTransform !== null){
    x = lastTransform.invertX(d3.event.offsetX);
    y = lastTransform.invertY(d3.event.offsetY);
}
```

## Avoid redrawing entire screen during render

Assign the `d3.select('#points').selectAll('circle').data(runs)` to a variable, so we can use it later.  This helps preserve how DOM elements are assigned to data elements in the next sections

```javascript
var circles = d3.select('#points').selectAll('circle').data(runs);

circles.enter().append('circle');
```

- At the moment, we wipe all `<circle>` elements in the `<svg>` each time we call `render()`
    - This is inefficient.  Let's just remove the ones we don't want
- We'll use `.exit()` to find the selection of circles that haven't been matched with data
    - then we'll use `.remove()` to remove those circles

```javascript
var circles = d3.select('#points').selectAll('circle').data(runs);

cirlces.enter().append('circle');

circles.exit().remove(); //remove all circles not associated with data

d3.selectAll('circle')
    .attr('cy', function(datum, index){
        return yScale(datum.distance);
    });

d3.selectAll('circle')
    .attr('cx', function(datum, index){
        return xScale(parseTime(datum.date));
    });
```

- This can cause weird side effects, because some circles are being reassigned to a different set of data
    - if we remove a piece of data in the center of the array, the `<circle>` in the the DOM that was assigned to it gets reassigned to the piece of data that used to be assigned to the next sibling `<circle>` in the DOM.  Each `<circle>` gets reassigned over one space from there on out
    - to avoid these affects, we need to make sure that each circle stays with the data it used to be assigned to
        - to do this, we can tell D3 to map `<circles>` to datum by id, rather than index in the array

```javascript
//when redrawing circles, make sure pre-existing circles match with their old data
var circles = d3.select('#points').selectAll('circle').data(runs, function(datum){
      return datum.id
});

circles.enter().append('circle');

circles.exit().remove();
```

## Hide elements beyond axis

To remove elements once they get beyond an axis, we can just add an outer SVG:

```html
<svg id="container">
    <svg>
        <g id="points"></g>
    </svg>
</svg>
```

Now replace all `d3.select('svg')` with `d3.select('#container')`

```javascript
d3.select('#container')
    .style('width', WIDTH)
    .style('height', HEIGHT);
//
// ...
//
d3.select('#container')
	.append('g')
    .attr('id', 'x-axis')
	.call(bottomAxis)
    .attr('transform', 'translate(0,'+HEIGHT+')');

var leftAxis = d3.axisLeft(yScale);
d3.select('#container')
	.append('g')
    .attr('id', 'y-axis')
	.call(leftAxis);
//
// ...
//
d3.select('#container').on('click', function(){
//
// ...
//
});
//
// ...
//
d3.select('#container').call(zoom);    
```

And lastly, adjust css:

```css
#container {
     overflow: visible;
     margin-bottom: 50px;
 }
```

## Use AJAX

We'll have to do some cleanup before we can do AJAX

1. Move all functions to the top of the page
1. Group all variable declarations together below function declarations
1. Move the rest of the initializing code inside an init function an call it
1. Move runs data to external `data.json` file
1. Set `var runs = null` at top of page
1. Set runs and call `init()` after ajax call succeeds:

```javascript
d3.json('data.json', function(error, data){
    runs = data;
    init();
});
```
