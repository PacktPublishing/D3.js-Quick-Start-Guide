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
- D3 provides us an easy way to convert strings to dates and vice versa

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
var parseTime = d3.timeParse("%B%e, %Y");
var xScale = d3.scaleTime();
xScale.range([0,WIDTH]);
xDomain = d3.extent(runs, function(datum, index){
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

It's a little tough, so let's adding some margin to the body:

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
