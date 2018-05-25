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
    <script src="https://d3js.org/d3.v5.min.js"></script>
</body>
```

Now create `app.js`, which will store all of our code:

```javascript
console.log('this works');
console.log(d3);
```

and link to it in `index.html` at the bottom of the `<body>` tag:

```html
<body>
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="app.js" charset="utf-8"></script>
</body>
```

Load `index.html` in a browser and check your dev tools.  To see if your javascript files are linked correctly:

![](https://i.imgur.com/NOOdIyf.png)

## Add an `<svg>` tag and size it with D3

At the top of the `<body>` tag in `index.html`, add an `<svg>` tag:

```html
<body>
    <svg></svg>
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="app.js" charset="utf-8"></script>
</body>
```

If we examine the `elements` tab of our dev tools, we'll see the element has been placed.  In chrome, it has a default width/height of 300px/150px

![](https://i.imgur.com/pREbm8a.png)

In `app.js`, remove your previous `console.log` statements and create variables to hold the width and height of the `<svg>` tag:

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

The return value of `d3.select('svg')` is a d3 version of the `svg` element (just like jQuery), so we "chain" commands onto this.  Let's add some styling to adjust the height/width of the element:

```javascript
d3.select('svg')
    .style('width', WIDTH)
    .style('height', HEIGHT);
```

Now when we check the dev tools, we'll see the `<svg>` element has been resized:

![](https://i.imgur.com/qsrPJkf.png)

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

d3.select('svg')
    .style('width', WIDTH)
    .style('height', HEIGHT);
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

Our page should now look like this:

![](https://i.imgur.com/CIjpYWs.png)

Note that all three circles are in the upper left corder of the screen.  This is because all three are positioned at (0,0) so they overlap each other.  It appears as if there is just one circle, but in reality all three are present

## Create a linear scale

- Let's position the circles vertically, based on the distance run in our `runs` dataset
- One of the most important things that D3 does is provide the ability to map points in the "domain" of data (values in our `runs` array) to points in the visual "range" (positions in the `<svg>` element) using what's called a `scale`.
- There are lots of different kinds of scales, but for now we're just going to use a `linear` scale which will map numeric data values to numeric visual values.

In `app.js`:

```javascript
d3.select('svg')
    .style('width', WIDTH)
    .style('height', HEIGHT);

var yScale = d3.scaleLinear(); //create the scale
yScale.range([HEIGHT, 0]); //set the visual range (e.g. 600 to 0)
yScale.domain([0, 10]); //set the data domain (e.g. 0 to 10)
```

- Here we're saying that a domain data point (distance run) of 0 should map to a visual height value of `HEIGHT` (600) in the range

    ![](https://i.imgur.com/VispBfN.png)

    - This is because the lower the distance run (data value), the more we want to move the visual point down the Y axis
        - remember that the Y axis starts with 0 at the top and increases in value as we move down vertically on the screen
- We also say that a domain data point (distance run) of 10 should map to a visual height of 0 in the range

    ![](https://i.imgur.com/DsqDCzD.png)

    - Again, this is because as the distance run increases, we want to get back a visual value that is lower and lower so that our circles are closer to the top of the screen

If you ever need to remind yourself what the domain/range are, you can do so like this:

```javascript
console.log(yScale.domain()); //you can get the domain whenever you want like this
console.log(yScale.range()); //you can get the range whenever you want like this
```

![](https://i.imgur.com/H6l8HkQ.png)

When declaring range/domain of a linear scale, we only need to specify starting/ending values for each.  Values in between the starting/ending will be calculated by D3.  For instance, if we want to find out what visual value in the range corresponds to the distance value of `5` in the domain of data points, we just call:

```javascript
console.log(yScale(5)); //get a visual point from a data value
```

![](https://i.imgur.com/ggSwAv2.png)

It makes sense that this logs `300` because the data value of `5` is half way between the starting data (domain) value of `0` and the ending data (domain) value of `10`

If we want to go the other way and find out what data point in the domain corresponds to a visual value of 450 in the range, we just call:

```javascript
console.log(yScale.invert(450)); //get a data values from a visual point
```

![](https://i.imgur.com/7BdxFkm.png)

It makes sense that this logs `2.5` because the visual value of 450 is 25% of the way from the starting visual (range) value of `600` to the ending visual (range) value of `0`

## Attach data to visual elements

We can attach each of the javascript objects in our "runs" array to one of our circles, so that each circle can access that data:

```javascript
yScale.range([HEIGHT, 0]);
yScale.domain([0, 10]);

d3.selectAll('circle').data(runs); //selectAll is like select, but selects all elements that match the query string
```

If there were more objects in our "runs" array than there are circles, the extra objects are ignored.  If there are more circles than objects, then javascript objects are attached to circles in the order in which they appear in the DOM until there are no more objects to attach.

## Use data attached to a visual element to affect its appearance

Normally, we can change attributes for a selection of DOM elements like so:

```javascript
d3.selectAll('circle').attr('cy', 300);
```

![](https://i.imgur.com/Nn6CrEX.png)

But now that each circle has one of our "runs" javascript data objects attached to it, we can set attributes on each circle using that data.  We do that by passing the `.attr()` method a callback function instead of a static value for its second parameter.

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

![](https://i.imgur.com/qAcjQyt.png)

## Create a time scale

- Let's position the circles horizontally, based on the date that they happened
- First create a time scale.  This is like a linear scale, but instead of mapping numeric values to visual points, it maps times to visual points:

```javascript
var xScale = d3.scaleTime(); //scaleTime maps date values with numeric visual points
xScale.range([0,WIDTH]);
xScale.domain([new Date('2017-10-1'), new Date('2017-10-31')]);

console.log(xScale(new Date('2017-10-28')));
console.log(xScale.invert(400));
```

![](https://i.imgur.com/zL7WQ3P.png)

## Parse and format times

- Note that our `date` data isn't in the format expected by the xScale domain (a Date object)
- D3 provides us an easy way to convert strings to dates and vice versa using [these values](https://github.com/d3/d3-time-format#locale_format)

```javascript
var parseTime = d3.timeParse("%B%e, %Y at %-I:%M%p"); //this format matches our data in the runs array
console.log(parseTime('October 3, 2017 at 6:00PM'));

var formatTime = d3.timeFormat("%B%e, %Y at %-I:%M%p"); //this format matches our data in the runs array
console.log(formatTime(new Date()));
```

![](https://i.imgur.com/vGH75ve.png)

Let's use this when calculating `cx` attributes for our circles:

```javascript
var parseTime = d3.timeParse("%B%e, %Y at %-I:%M%p"); //this format matches our data in the runs array
var formatTime = d3.timeFormat("%B%e, %Y at %-I:%M%p"); //this format matches our data in the runs array
d3.selectAll('circle')
    .attr('cx', function(datum, index){
        return xScale(parseTime(datum.date)); //use parseTime to convert the date string property on the datum object to a Date object, which xScale then converts to a visual value
    });
```

![](https://i.imgur.com/nD9CW7V.png)

## Set dynamic domains

- At the moment, we're setting arbitrary min/max values for the domains of both distance and date
- D3 can find the min/max of a data set, so that our graph displays just the data ranges we need:
- we pass the min/max methods a callback which gets called for each item of data in the array
    - d3 uses the callback to determine which properties of the datum object to compare for min/max

Go to this part of the code:

```javascript
var yScale = d3.scaleLinear(); //create the scale
yScale.range([HEIGHT, 0]); //set the visual range (e.g. 600 to 0)
yScale.domain([0, 10]); //set the data domain (e.g. 0 to 10)
```

and change it to this:

```javascript
var yScale = d3.scaleLinear(); //create the scale
yScale.range([HEIGHT, 0]); //set the visual range (e.g. 600 to 0)
var yMin = d3.min(runs, function(datum, index){
    return datum.distance; //compare distance properties of each item in the data array
})
var yMax = d3.max(runs, function(datum, index){
    return datum.distance; //compare distance properties of each item in the data array
})
yScale.domain([yMin, yMax]); //now that we have the min/max of the data set for distance, we can use those values for the yScale domain
console.log(yScale.domain());
```

![](https://i.imgur.com/7JDfzD9.png)

We can combine both the min/max functions into one "extent" function that returns an array that has the exact same structure as `[yMin, yMax]`:

```javascript
var yScale = d3.scaleLinear(); //create the scale
yScale.range([HEIGHT, 0]); //set the visual range (e.g. 600 to 0)
var yDomain = d3.extent(runs, function(datum, index){
    return datum.distance; //compare distance properties of each item in the data array
})
yScale.domain(yDomain);
```

Let's do the same for the xScale's domain.  Go to this part of the code:

```javascript
var xScale = d3.scaleTime(); //scaleTime maps date values with numeric visual points
xScale.range([0,WIDTH]);
xScale.domain([new Date('2017-10-1'), new Date('2017-10-31')]);

var parseTime = d3.timeParse("%B%e, %Y at %-I:%M%p"); //this format matches our data in the runs array
var formatTime = d3.timeFormat("%B%e, %Y at %-I:%M%p"); //this format matches our data in the runs array

d3.selectAll('circle')
    .attr('cx', function(datum, index){
        return xScale(parseTime(datum.date)); //use parseTime to convert the date string property on the datum object to a Date object, which xScale then converts to a visual value
    });
```

and change it to:

```javascript
var parseTime = d3.timeParse("%B%e, %Y at %-I:%M%p");
var formatTime = d3.timeFormat("%B%e, %Y at %-I:%M%p");
var xScale = d3.scaleTime();
xScale.range([0,WIDTH]);
var xDomain = d3.extent(runs, function(datum, index){
    return parseTime(datum.date);
});
xScale.domain(xDomain);
```

Notice we moved `parseTime` and `formatTime` up so they could be used within the `.extent()`

![](https://i.imgur.com/gSA05gP.png)

## Dynamically generate svg elements

- Currently, we have just enough `<circle>` elements to fit our data.  What if we don't want to count how many elements are in the array?
- D3 Can create elements as needed
- First, remove all `<circle>` elements from `index.html`

```html
<svg></svg>
```

In `app.js`, go to this part of the code:

```javascript
d3.selectAll('circle').data(runs)
    .attr('cy', function(datum, index){
        return yScale(datum.distance);
    });
```

modify the code to create the circles:

```javascript
d3.select('svg').selectAll('circle') //since no circles exist, we need to select('svg') so that d3 knows where to append the new circles
    .data(runs) //attach the data as before
    .enter() //find the data objects that have not yet been attached to visual elements
    .append('circle'); //for each data object that hasn't been attached, append a <circle> to the <svg>

d3.selectAll('circle')
    .attr('cy', function(datum, index){
        return yScale(datum.distance);
    });
```

It should look exactly the same as before, but now circles are being created for each object in the "runs" array

![](https://i.imgur.com/r59oUuJ.png)

## Create axes

D3 can automatically generate axes for you:

```javascript
var bottomAxis = d3.axisBottom(xScale); //pass the appropriate scale in as a parameter
d3.select('svg')
	.append('g') //put everything inside a group
	.call(bottomAxis); //generate the axis within the group
```

![](https://i.imgur.com/nLwIVBI.png)

We want the axis to be at the bottom of the SVG, though:

```javascript
var bottomAxis = d3.axisBottom(xScale); //pass the appropriate scale in as a parameter
d3.select('svg')
	.append('g') //put everything inside a group
	.call(bottomAxis) //generate the axis within the group
    .attr('transform', 'translate(0,'+HEIGHT+')'); //move it to the bottom
```

Currently, our SVG clips the axis:

[](https://i.imgur.com/byJXkLO.png)

Let's change some CSS so it doesn't:

```css
svg {
    overflow: visible;    
}
```

![](https://i.imgur.com/kd0AiMt.png)

The left axis is pretty similar:

```javascript
var leftAxis = d3.axisLeft(yScale);
d3.select('svg')
	.append('g')
	.call(leftAxis); //no need to transform, since it's placed correctly initially
```

![](https://i.imgur.com/aP4hTVq.png)

It's a little tough to see, so let's adding some margin to the body:

```css
body {
    margin: 20px 40px;
}
```

![](https://i.imgur.com/FFgC68e.png)

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
<script src="d3.v5.min.js"></script>
<script src="app.js" charset="utf-8"></script>
```

D3 can also be used to manipulate the DOM, just like jQuery.  Let's populate the `<tbody>` in that style:

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

![]()

## Create click handler

Let's say that we want it so that when the user clicks on the `<svg>` element, it creates a new run.

```javascript
d3.select('svg').on('click', function(){
    var x = d3.event.offsetX; //gets the x position of the mouse relative to the svg element
    var y = d3.event.offsetY; //gets the y position of the mouse relative to the svg element

    var date = xScale.invert(x) //get a date value from the visual point that we clicked on
    var distance = yScale.invert(y); //get a numeric distance value from the visual point that we clicked on

    var newRun = { //create a new "run" object
        id: runs[runs.length-1].id+1, //generate a new id by adding 1 to the last run's id
        date: formatTime(date), //format the date object created above to a string
        distance: distance //add the distance
    }
    runs.push(newRun); //push the new run onto the runs array
    createTable(); //render the table
});
```

You might notice that `createTable()` just adds on all the run rows again

![]()

Let's clear out the rows previous created and re-render everything:

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

![]()

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
    var formatTime = d3.timeFormat("%B%e, %Y at %-I:%M%p");
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
var parseTime = d3.timeParse("%B%e, %Y at %-I:%M%p");
var formatTime = d3.timeFormat("%B%e, %Y at %-I:%M%p");
var xScale = d3.scaleTime();
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

    d3.select('svg').selectAll('circle') //since no circles exist, we need to select('svg') so that d3 knows where to append the new circles
        .data(runs) //attach the data as before
        .enter() //find the data objects that have not yet been attached to visual elements
        .append('circle'); //for each data object that hasn't been attached, append a <circle> to the <svg>

    d3.selectAll('circle')
        .attr('cy', function(datum, index){
            return yScale(datum.distance);
        });

    d3.selectAll('circle')
        .attr('cx', function(datum, index){
            return xScale(parseTime(datum.date)); //use parseTime to convert the date string property on the datum object to a Date object, which xScale then converts to a visual value
        });

}
render();
```

Let's call `render()` inside our `<svg>` click handler:

```javascript
runs.push(newRun);
createTable();
render(); //add this line
```

![]()

## Remove data

- Let's set up a click handler on a `<circle>` to remove that circle and its associated data element from the array
- We'll need to do this inside the `render()` declaration so that the click handlers are attached **after** the circles are created

```javascript
//put this at the bottom of the render function, so that click handlers are attached when the circle is created
d3.selectAll('circle').on('click', function(datum, index){
    d3.event.stopPropagation(); //stop click event from propagating to the SVG element and creating a run
    runs = runs.filter(function(run, index){ //create a new array that has removed the run with the correct id.  Set it to the runs var
        return run.id != datum.id;
    });
    render(); //re-render dots
    createTable(); //re-render table
});
```

The `<circle>` elements aren't be removed though:

![]()

In the image above, it appears as though, there are only two circles, but really, the middle one has had its `cx` set to 800 and its `cy` set to 0.  It's overlapping the other circle in the same position.

Let's put the circles in a `<g>` so that it's easy to clear out:

```html
<svg>
    <g id="points"></g>
</svg>
```

Now we can clear out the `<circle>` elements each time `render()` is called.  This is a little crude, but it'll work for now.  Later on, we'll do things in a more elegant fashion.

```javascript
//adjust the code at the top of your render function
d3.select('#points').html(''); //clear out all circles when rendering
d3.select('#points').selectAll('circle') //add circles to #points group, not svg
    .data(runs)
    .enter()
    .append('circle');    
```

![]()

If you try to delete all the circles and then add a new one, you'll get an error:

![]()

Inside the `<svg>` click handler, let's put in a little code to handle when the user has deleted all runs and tries to add a new one:

```javascript
//inside svg click handler
var newRun = {
    id: ( runs.length > 0 ) ? runs[runs.length-1].id+1 : 1, //add this line
    date: formatTime(date),
    distance: distance
}
```

![]()

Lastly, let's put in some css, so we know we're clicking on a circle:

```css
circle {
    r: 5;
    fill: black;
    transition: r 0.5s linear, fill 0.5s linear; /* add this transition to original code */
}
/* add this css for the hover state */
circle:hover {
    r:10;
    fill: blue;
}
```

![]()

## Drag an element

We want to be able to update the data for a run by dragging the associated circle

- D3 allows us to create complex interactions called "behaviors" which have multiple callbacks
- there are two steps:
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
    // .on('end', dragEnd) //dragEnd is a reference to a function we haven't created yet
d3.selectAll('circle').call(dragBehavior); //attach the dragBehavior behavior to all <circle> elements
```

You can now drag the circles around, but the data doesn't update:

![]()

## Update data after a drag

- Uncomment the `.on('end', dragEnd)` code
- Create the callback function

```javascript
var dragEnd = function(datum){
    var x = d3.event.x; //get current x position of the cursor
    var y = d3.event.y; //get current y position of the cursor

    var date = xScale.invert(x); //get the date by using the xScale to invert the x position of the mouse
    var distance = yScale.invert(y); //get the distance by using the yScale to invert the y position of the mouse

    //since datum is an object, which is passed by reference, we can update a property on the object, and the original variable will update
    datum.date = formatTime(date); //use formatTime() to convert the date variable, which is a Date object, into the appropriate string
    datum.distance = distance; //change the distance
    createTable(); //redraw the table
}
var dragBehavior = d3.drag()
    // .on('start', dragStart)
    .on('drag', drag)
    .on('end', dragEnd);
```

![]()

Let's change the color of a circle while it's being dragged too:

```css
circle:active {
    fill: red;
}
```

When you drag the circle, it should turn red

## Create a zoom behavior that scales elements

- Another behavior we can create is the zooming/panning ability.  To do this you can do any of the following:
    - zoom:
        - two finger drag on a trackpad
        - rotate your mouse wheel
        - pinch/spread on a trackpad
    - pan:
        - click/drag the svg element

```javascript
//put this at the end of app.js
var zoomCallback = function(){ //the callback function
	d3.select('#points').attr("transform", d3.event.transform); //transform the #points <g> element based on the zoom transform created
}
var zoom = d3.zoom() //create the zoom behavior
    .on('zoom', zoomCallback); //tell it which callback function to use when zooming
d3.select('svg').call(zoom); //attach the behavior to the svg element
```

![]()

## Update axes when zooming/panning

Now when we zoom, the points move in/out.  When we pan, they move vertically/horizontally.  Unfortunately, the axes don't update accordingly.  Let's first add ids to the `<g>` elements that contain them

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
    d3.select('#x-axis').call(bottomAxis.scale(d3.event.transform.rescaleX(xScale))); //tell the bottom axis to adjust its values based on how much we zoomed
	d3.select('#y-axis').call(leftAxis.scale(d3.event.transform.rescaleY(yScale))); //tell the left axis to adjust its values based on how much we zoomed
}
```

- `bottomAxis.scale()` tells the axis to redraw itself
- `d3.event.transform.rescaleX(xScale)` returns a value indicating how the bottom axis should rescale

![]()

## Update click points after a transform

- If we zoom/pan and then click on the svg to create new runs, the circles/data created are incorrect
- When we zoom, we need to save the transformation information to a variable so that we can use it later to figure out how to properly create circles and runs

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

![]()

```javascript
//at top of click handler, adjust the code:
//set x/y like normal
var x = d3.event.offsetX;
var y = d3.event.offsetY;

//if lastTransform has been updated, overwrite these values
if(lastTransform !== null){
    x = lastTransform.invertX(d3.event.offsetX);
    y = lastTransform.invertY(d3.event.offsetY);
}

var date = xScale.invert(x);
var distance = yScale.invert(y);
```

add a new run initially:

![]()

now pan right and add a new point:

![]()

## Avoid redrawing entire screen during render

At the top of the `render()` function, assign the `d3.select('#points').selectAll('circle').data(runs)` to a variable, so we can use it later.  This helps preserve how DOM elements are assigned to data elements in the next sections

```javascript
//top of render function
d3.select('#points').html('');
var circles = d3.select('#points').selectAll('circle').data(runs); //alter this
circles.enter().append('circle'); //alter this
```

- At the moment, we wipe all `<circle>` elements in the `<svg>` each time we call `render()`
    - This is inefficient.  Let's just remove the ones we don't want
- We'll use `.exit()` to find the selection of circles that haven't been matched with data
    - then we'll use `.remove()` to remove those circles

```javascript
//top of render function
var circles = d3.select('#points').selectAll('circle').data(runs);
circles.enter().append('circle');
circles.exit().remove(); //remove all circles not associated with data
```

- This can cause weird side effects, because some circles are being reassigned to a different set of data
    - e.g. reload the page, click on the center circle.  You'll notice the circle disappears and the one in the upper right gains a hover state
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

Now clicking on the middle circle should work correctly

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
