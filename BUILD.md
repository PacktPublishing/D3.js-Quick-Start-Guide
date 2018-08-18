# Creating a Scatter Plot

Let's pretend we've started jogging, and we want to visualize the data regarding our progress as a runner with a scatter plot. We're going to have an array of objects each with date and distance properties. For each object in the array, we're going to create a circle in our SVG. If the `distance` property of an object is relatively high, its associated circle will be higher up on the graph.  If the `date` property of an object is relatively high (a later date), its associated circle be farther right.

By the end of this lesson, you should be able to:

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

The first thing we want to do is create basic `index.html` file:

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

Now add a link to D3 at the bottom of your `<body>` tag in `index.html`.  We'll put it at the bottom so that the script loads after all your other HTML elements have loaded into the browser:

```html
<body>    
    <script src="https://d3js.org/d3.v5.min.js"></script>
</body>
```

Now create `app.js` in the same folder as your `index.html`.  In it, we will store all of our JS code.  For now just put this code in it to see if it works:

```javascript
console.log('this works');
console.log(d3);
```

and link to it in `index.html` at the bottom of the `<body>` tag.  Make sure it comes after the D3 script tag so that D3 loads before your `app.js` script:

```html
<body>
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="app.js" charset="utf-8"></script>
</body>
```

Open `index.html` in Chrome just like we did in the SVG chapter (File->Open File) and check your dev tools (View->Developer->Developer Tools) to see if your javascript files are linked correctly:

![](https://i.imgur.com/NOOdIyf.png)

## Add an `<svg>` tag and size it with D3

In `index.html`, at the top of the `<body>`, before your `script` tags, add an `<svg>` tag:

```html
<body>
    <svg></svg>
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="app.js" charset="utf-8"></script>
</body>
```

If we examine the Elements tab of our dev tools, we'll see the `svg` element has been placed. In Chrome, it has a default width/height of 300px/150px

![](https://i.imgur.com/pREbm8a.png)

In `app.js`, remove your previous `console.log` statements and create variables to hold the width and height of the `<svg>` tag:

```javascript
var WIDTH = 800;
var HEIGHT = 600;
```

Next, we can use `d3.select()` to select a single element, in this case the `<svg>` element:

```javascript
var WIDTH = 800;
var HEIGHT = 600;

d3.select('svg');
```

The return value of `d3.select('svg')` is a D3 version of the `svg` element (just like in jQuery), so we can "chain" commands onto this.  Let's add some styling to adjust the height/width of the element:

```javascript
d3.select('svg')
    .style('width', WIDTH)
    .style('height', HEIGHT);
```

Now when we check the dev tools, we'll see the `<svg>` element has been resized:

![](https://i.imgur.com/qsrPJkf.png)

## Create some fake data for our app

In `app.js` let's create an array of "run" objects (**NOTE:** I'm storing the date as a string on purpose.  Also, it's important that this be an array of objects, in order to work with D3).  Here's what your `app.js` code should look like so far:

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

In `index.html`, add three circles to your `<svg>` element (each one will represent a run):

```html
<svg>
    <circle/>
    <circle/>
    <circle/>
</svg>
```

Create `app.css` in the same folder as `index.html` with some styling for the circles and our `svg` element:

```css
circle {
    r:5;
    fill: black;
}
svg {
    border: 1px solid black;
}
```

and link to it in the head of `index.html`:

```html
<head>
    <meta charset="utf-8">
    <title></title>
    <link rel="stylesheet" href="app.css">
</head>
```

Our page should now look like this:

![](https://i.imgur.com/CIjpYWs.png)

Note that all three circles are in the upper left corder of the screen.  This is because all three are positioned at `(0,0)` so they overlap each other.  It appears as if there is just one circle, but in reality all three are present

## Create a linear scale

We currently have three circles in our SVG and three objects in our `runs` array.  One of the best things D3 does is provide the ability to link SVG elements with data so that as the data changes, so do the SVG elements.  In this chapter, we're going to link each circle to an object in the `runs` array.  If the `distance` property of an object is relatively high, its associated circle will be higher up on the graph.  If the `date` property of an object is relatively high (a later date), its associated circle be farther right.

First, let's position the circles vertically, based on the `distance` property of the objects in our `runs` array.  One of the most important things that D3 does is provide the ability to convert (or "map") data values to visual points and vice versa.  It does so using a `scale`.  There are lots of different kinds of scales that handle lots of different data types, but for now we're just going to use a `linear scale` which will map numeric data values to numeric visual points and vice versa.

At the bottom of `app.js`, add the following:

```javascript
var yScale = d3.scaleLinear(); //create the scale
```

Whenever we create a scale, we need to tell it what are the minimum and maximum possible values that can exist in our data (this is called the "domain").  To do so for our `yScale`, add the following to the bottom of `app.js`:

```javascript
yScale.domain([0, 10]); //minimum data value is 0, max is 10
```

We also need to tell the scale what visual values correspond to those min/max values in the data (this is called the "range"). To do so, add the following to the bottom of `app.js`:

```javascript
//HEIGHT corresponds to min data value
//0 corresponds to max data value
yScale.range([HEIGHT, 0]);
```

Your last three lines of code in app.js should look like this now:

```javascript
var yScale = d3.scaleLinear(); //create the scale
yScale.domain([0, 10]); //minimum data value is 0, max is 10
//HEIGHT corresponds to min data value
//0 corresponds to max data value
yScale.range([HEIGHT, 0]);
```

In the previous snippet, the first (starting) value for the range is `HEIGHT` (600) and the second (ending) value is 0.  The minimum for the data values is 0 and the max is 10.  By doing this, we're saying that a data point (distance run) of 0 should map to a visual height value of `HEIGHT` (600):

![](https://i.imgur.com/VispBfN.png)

This is because the lower the distance run (data value), the more we want to move the visual point down the Y axis.  Remember that the Y axis starts with 0 at the top and increases in value as we move down vertically on the screen.

We also say that a data point (distance run) of 10 should map to a visual height of 0:

![](https://i.imgur.com/DsqDCzD.png)

Again, this is because as the distance run increases, we want to get back a visual value that is lower and lower so that our circles are closer to the top of the screen.

If you ever need to remind yourself what the domain/range are, you can do so by logging `yScale.domain()` or `yScale.range()`.  Temporarily add the following at the bottom `app.js`:

```javascript
console.log(yScale.domain()); //you can get the domain whenever you want like this
console.log(yScale.range()); //you can get the range whenever you want like this
```

Our Chrome console should look like this:

![](https://i.imgur.com/H6l8HkQ.png)

When declaring range/domain of a linear scale, we only need to specify start/end values for each.  Values in between the start/end will be calculated by D3.  For instance, to find out what visual value corresponds to the distance value of 5, use `yScale()`.  Remove the previous two `console.log()` statements and add the following to the bottom of `app.js`:

```javascript
console.log(yScale(5)); //get a visual point from a data value
```

Here's what our dev console should look like in Chrome:

![](https://i.imgur.com/ggSwAv2.png)

It makes sense that this logs `300` because the data value of `5` is half way between the minimum data value of `0` and the maximum data value of `10`.  The range starts at `HEIGHT` (600) and goes to `0`, so half way between those values is 300.

So whenever you want to convert a data point to a visual point, call `yScale()`.  We can go the other way and convert a visual point to a data value by calling `yScale.invert()`.  To find out what data point corresponds to a visual value of 450, remove the previous `console.log()` statement and add the following to the bottom of `app.js`:

```javascript
console.log(yScale.invert(450)); //get a data values from a visual point
```

Here's what Chrome's console looks like:

![](https://i.imgur.com/7BdxFkm.png)

It makes sense that this logs 2.5 because the visual value of 450 is 25% of the way from the starting visual value of 600 (`HEIGHT`) to the ending visual value of 0.  You can now delete that last `console.log()` line.

## Attach data to visual elements

Now let's attach each of the javascript objects in our "runs" array to a circle in our SVG.  Once we do this, each circle can access the data of its associated "run" object in order to determine its position.  Add the following to the bottom of `app.js`:

```javascript
d3.selectAll('circle').data(runs); //selectAll is like select, but selects all elements that match the query string
```

If there were more objects in our "runs" array than there are circles, the extra objects are ignored.  If there are more circles than objects, then javascript objects are attached to circles in the order in which they appear in the DOM until there are no more objects to attach.

## Use data attached to a visual element to affect its appearance

We can change attributes for a selection of DOM elements by passing static values, and all selected elements will have that attribute set to that one specific value.  Add the following temporarily to the end of `app.js`:

```javascript
d3.selectAll('circle').attr('cy', 300);
```

![](https://i.imgur.com/Nn6CrEX.png)

But now that each circle has one of our "runs" javascript data objects attached to it, we can set attributes on each circle using that data.  We do that by passing the `.attr()` method a callback function instead of a static value for its second parameter.  Remove `d3.selectAll('circle').attr('cy', 300);` and adjust the last line of `app.js` from `d3.selectAll('circle').data(runs);` to the following:

```javascript
d3.selectAll('circle').data(runs)
    .attr('cy', function(datum, index){
        return yScale(datum.distance);
    });
```

If we refresh the browser, this is what we should see:

![](https://i.imgur.com/qAcjQyt.png)

Let's examine what we just wrote.  The callback function passed as the second parameter to `.attr()` runs on each of the visual elements selected (each of the `circle` elements in this case).  During each execution of the callback, the return value of that callback function is then assigned to whatever aspect of the current element is being set (in this case the `cy` attribute).  

The callback function takes two params:

- the individual `datum` object from the `runs` array that was attached to that particular visual element when we called `.data(runs)`
- the `index` of that `datum` in the `runs` array

In summary what this does is loop through each `circle` in the SVG.  For each `circle`, it looks at the "run" object attached to that `circle` and finds its `distance` property.  It then feeds that data value into `yScale()` which then converts it into its corresponding visual point.  That visual point is then assigned to that circle's `cy` attribute.  Since each data object has a different `distance` value, each `circle` is placed differently, vertically.

## Create a time scale

Let's position the circles horizontally, based on the date that their associated run happened.  First, create a time scale.  This is like a linear scale, but instead of mapping numeric values to visual points, it maps Dates to visual points. Add the following to the bottom of `app.js`:

```javascript
var xScale = d3.scaleTime(); //scaleTime maps date values with numeric visual points
xScale.range([0,WIDTH]);
xScale.domain([new Date('2017-10-1'), new Date('2017-10-31')]);

console.log(xScale(new Date('2017-10-28')));
console.log(xScale.invert(400));
```

Here's what our console should look like:

![](https://i.imgur.com/zL7WQ3P.png)

You can now remove the two `console.log()` statements.

## Parse and format times

Note that the `date` properties of the objects in our `runs` array are strings and not Date objects.  This is a problem because `xScale`, as with all time scales, expects its data values to be Date objects.  Fortunately, D3 provides us an easy way to convert strings to dates and vice versa. We'll use a specially formatted string, based on the documentation (https://github.com/d3/d3-time-format#locale_format), to tell D3 how to parse the `date` String properties of the objects in our `runs` array into actual JavaScript Date objects.  Add the following at the end of `app.js`:

```javascript
var parseTime = d3.timeParse("%B%e, %Y at %-I:%M%p"); //this format matches our data in the runs array
console.log(parseTime('October 3, 2017 at 6:00PM'));

var formatTime = d3.timeFormat("%B%e, %Y at %-I:%M%p"); //this format matches our data in the runs array
console.log(formatTime(new Date()));
```

![](https://i.imgur.com/vGH75ve.png)

Let's use this when calculating `cx` attributes for our circles.  Remove the last two `console.log()` statements and add the following at the bottom of `app.js`:

```javascript
d3.selectAll('circle')
    .attr('cx', function(datum, index){
        return xScale(parseTime(datum.date)); //use parseTime to convert the date string property on the datum object to a Date object, which xScale then converts to a visual value
    });
```

Here's what Chrome should look like:

![](https://i.imgur.com/nD9CW7V.png)

In summary, this selects all of the `circle` elements.  It then sets the `cx` attribute of each `circle` to the result of a callback function.  That callback function runs for each `circle` and takes the "run" data object associated with that `circle` and finds its `date` property (remember it's a string, e.g. `'October 3, 2017 at 6:00PM'`).  It passes that string value to `parseTime()` which then turns the string into an actual JavaScript Date object.  That Date object is then passed to `xScale()` which converts the date into a visual value.  That visual value is then used for the `cx` attribute of whichever `circle` the callback function has just run on.  Since each `date` property of the objects in the `runs` array is different, the `circles` have different horizontal locations.

## Set dynamic domains

At the moment, we're setting arbitrary min/max values for the domains of both distance and date.  D3 can find the min/max of a data set, so that our graph displays just the data ranges we need.  All we need to do is pass the min/max methods a callback which gets called for each item of data in the `runs` array.  D3 uses the callback to determine which properties of the datum object to compare for min/max

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

Chrome should look like this:

![](https://i.imgur.com/7JDfzD9.png)

Let's examine what we just wrote.  The following code finds the minimum distance:

```javascript
var yMin = d3.min(runs, function(datum, index){
    return datum.distance; //compare distance properties of each item in the data array
})
```

D3 loops through the `runs` array (the first parameter) and calls the callback function (the second parameter) on each element of the array.  The return value of that function is compared the return values of the callback function as it runs on the other elements.  The lowest value is assigned to `yMin`.  The same thing happens for `d3.max()` but with the highest value.

We can combine both the min/max functions into one `extent` function that returns an array that has the exact same structure as `[yMin, yMax]`.  Change the code we just wrote:

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
```

to this:

```javascript
var yScale = d3.scaleLinear(); //create the scale
yScale.range([HEIGHT, 0]); //set the visual range (e.g. 600 to 0)
var yDomain = d3.extent(runs, function(datum, index){
    return datum.distance; //compare distance properties of each item in the data array
})
yScale.domain(yDomain);
```

Much shorter, right?  Let's do the same for the xScale's domain.  Go to this part of the code:

```javascript
var xScale = d3.scaleTime(); //scaleTime maps date values with numeric visual points
xScale.range([0,WIDTH]);
xScale.domain([new Date('2017-10-1'), new Date('2017-10-31')]);

var parseTime = d3.timeParse("%B%e, %Y at %-I:%M%p"); //this format matches our data in the runs array
var formatTime = d3.timeFormat("%B%e, %Y at %-I:%M%p"); //this format matches our data in the runs array
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

Notice we moved `parseTime` and `formatTime` up so they could be used within the `.extent()`.  Here's what Chrome should look like:

![](https://i.imgur.com/gSA05gP.png)

## Dynamically generate SVG elements

Currently, we have just enough `<circle>` elements to fit our data.  What if we don't want to count how many elements are in the array?  D3 can create elements as needed.  First, remove all `<circle>` elements from `index.html`.  Your `<body>` tag should look like this now:

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

It should look exactly the same as before, but now circles are being created for each object in the `runs` array:

![](https://i.imgur.com/r59oUuJ.png)

Here's a more in depth explanation of what we just wrote.  Take a look at the first line of new code from above:

```javascript
d3.select('svg').selectAll('circle')
```

This might seem unnecessary.  Why not just do `d3.selectAll('circle')`?  Well, at the moment, there are no `circle` elements.  We're going to be appending `circle` elements dynamically, so `d3.select('svg')` tells D3 where to append them.  We still need `.selectAll('circle')` though, so that when we call `.data(runs)` on the next line, D3 knows what elements to bind the various objects in the `runs` array to.  But there aren't any `circle` elements to bind data to.  That's okay: `.enter()` finds the "run" objects that haven't been bound to any `circle` elements yet (in this case all of them).  We then use `.append('circle')` to append a circle for each unbound "run" object that `.enter()` found.

## Create axes

D3 can automatically generate axes for you.  Add the following to the bottom of `app.js`:

```javascript
var bottomAxis = d3.axisBottom(xScale); //pass the appropriate scale in as a parameter
```

This creates a bottom axis generator that can be used to insert an axis into any element you choose.  Add the following code at the bottom of `app.js` to append a `<g>` element inside our SVG element and then insert a bottom axis inside of it:

```javascript
d3.select('svg')
	.append('g') //put everything inside a group
	.call(bottomAxis); //generate the axis within the group
```

Here's what Chrome should look like:

![](https://i.imgur.com/nLwIVBI.png)

We want the axis to be at the bottom of the SVG, though.  Modify the code we just wrote so it looks like this (**NOTE:** we removed a `;` after `.call(bottomAxis)` and added `.attr('transform', 'translate(0,'+HEIGHT+')');`):

```javascript
var bottomAxis = d3.axisBottom(xScale); //pass the appropriate scale in as a parameter
d3.select('svg')
	.append('g') //put everything inside a group
	.call(bottomAxis) //generate the axis within the group
    .attr('transform', 'translate(0,'+HEIGHT+')'); //move it to the bottom
```

Currently, our SVG clips the axis:

[](https://i.imgur.com/byJXkLO.png)

Let's alter our `svg` CSS so it doesn't clip any elements that extend beyond its bounds:

```css
svg {
    overflow: visible;    
}
```

Now it looks good:

![](https://i.imgur.com/kd0AiMt.png)

The left axis is pretty similar.  Add the following to the bottom of `app.js`:

```javascript
var leftAxis = d3.axisLeft(yScale);
d3.select('svg')
	.append('g')
	.call(leftAxis); //no need to transform, since it's placed correctly initially
```

Note we don't need to set a `transform` attribute since it starts out in the correct place initially:

![](https://i.imgur.com/aP4hTVq.png)

It's a little tough to see, so let's add the following at the bottom of `app.css`:

```css
body {
    margin: 20px 40px;
}
```

Now our axes are complete:

![](https://i.imgur.com/FFgC68e.png)

## Display data in a table

Just for debugging purposes, let's create a table which will show all of our data.  Make your `<body>` tag in `index.html` look like this:

```html
<body>
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
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="app.js" charset="utf-8"></script>
</body>
```

D3 can also be used to manipulate the DOM, just like jQuery.  Let's populate the `<tbody>` in that style.  Add the following to the bottom of `app.js`:

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

Add some styling for the table at the bottom of `app.css`:

```css
table, th, td {
   border: 1px solid black;
}
th, td {
    padding:10px;
    text-align: center;
}
```

Adjust the CSS for `svg` to add a bottom margin.  This will create some space between the graph and the table:

```css
svg {
    overflow: visible;
    margin-bottom: 50px;
}
```

Now the browser should look like this:

![](https://i.imgur.com/luGiAys.png)

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

![](https://i.imgur.com/Vu2CwCI.png)

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

![](https://i.imgur.com/YcoPxK7.png)

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

![](https://i.imgur.com/5KjqmNp.png)

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

![](https://i.imgur.com/JoZyC1j.png)

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

![](https://i.imgur.com/h8TFFdN.png)

If you try to delete all the circles and then add a new one, you'll get an error:

![](https://i.imgur.com/FprJXNN.png)

This is because, our code for creating a `newRun` in the click handler needs some work:

```javascript
var newRun = { //create a new "run" object
    id: runs[runs.length-1].id+1, //generate a new id by adding 1 to the last run's id
    date: formatTime(date), //format the date object created above to a string
    distance: distance //add the distance
}
```

`runs[runs.length-1]` tries to access an element at index -1 in the array.  Inside the `<svg>` click handler, let's put in a little code to handle when the user has deleted all runs and tries to add a new one:

```javascript
//inside svg click handler
var newRun = {
    id: ( runs.length > 0 ) ? runs[runs.length-1].id+1 : 1, //add this line
    date: formatTime(date),
    distance: distance
}
```

![](https://i.imgur.com/N1taq91.png)

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

![](https://i.imgur.com/umPJiTD.png)

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

![](https://i.imgur.com/4pLzqt7.png)

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

![](https://i.imgur.com/pdgApyh.png)

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

![](https://i.imgur.com/Qvnu7yZ.png)

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

![](https://i.imgur.com/AI3KoG9.png)

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

![](https://i.imgur.com/2ozj3Nf.png)

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

![](https://i.imgur.com/5DjmFlg.png)

now pan right and add a new point:

![](https://i.imgur.com/3gZAtmZ.png)

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

Check out our graph when you pan:

![](https://i.imgur.com/s2oXYxS.png)

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
/* replace the rule for svg */
#container {
     overflow: visible;
     margin-bottom: 50px;
 }
```

![](https://i.imgur.com/t6BKuiz.png)


## Conclusion

In this chapter we've learned the basics of D3 and created a fully interactive scatter plot.  In the next chapter we'll learn how to use AJAX to make an asynchronous request that will populate a bar graph.
