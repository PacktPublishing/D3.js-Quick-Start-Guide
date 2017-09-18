# D3 Build

## Lesson Objectives

1. Add link to d3 library
1. Add an `<svg>` tag and size it with D3
1. Create some fake data for our app
1. Add SVG circles and style them
1. Create a linear scale
1. Attach data to visual elements
1. Use data attached to a visual element to affect its appearance

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

In `app.js` let's create an array of "run" objects (**NOTE I'm storing the date as a string on purpose**):

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
    - the individual `datum` attached to that particular visual element
    - the `index` of that `datum` in the original data array (in this case `runs`)
