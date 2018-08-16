# Creating a Pie Chart

In this section we'll be using animations to make our graphs move.  This can give your visualizations a more polished and professional feel.  By the end of this section, you'll be able to:

1. Create an ordinal scale
1. Create a color scale
1. Add paths for each pie segment
1. Generate an arc creating function
1. Format the data for the arc
1. Adjust the position of the pie
1. Make a donut graph
1. Remove parts of the pie

## Set Up

As always, we'll need an `index.html` file:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
        <script src="https://d3js.org/d3.v5.min.js"></script>
    </head>
    <body>
        <svg>
            <g></g>
        </svg>
        <script src="app.js" charset="utf-8"></script>
    </body>
</html>
```

## Set Config Vars

At the bottom of the `<body>` tag, we're referencing an `app.js` file.  Let's create that file, and add the following to it:

```javascript
var WIDTH = 360;
var HEIGHT = 360;
var radius = Math.min(WIDTH, HEIGHT) / 2;

var dataset = [
    { label: 'Bob', count: 10 },
    { label: 'Sally', count: 20 },
    { label: 'Matt', count: 30 },
    { label: 'Jane', count: 40 }
];
console.log(dataset);
```

To be sure it's working and linked up properly, we've added the `console.log(dataset)` at the bottom.  Let's open up `index.html` and view the developer console to make sure everything is hooked up the way it should be:

![](https://i.imgur.com/Oy0fiTl.png)

Once we're sure, it's working, remove the `console.log(dataset);`:

```javascript
var WIDTH = 360;
var HEIGHT = 360;
var radius = Math.min(WIDTH, HEIGHT) / 2;

var dataset = [
    { label: 'Bob', count: 10 },
    { label: 'Sally', count: 20 },
    { label: 'Matt', count: 30 },
    { label: 'Jane', count: 40 }
];
```

## Create an Ordinal Scale

An ordinal scale maps a discrete value to some other value.  A discrete value is something can't be divided.  In the past, we've used values like numbers that can be divided up and interpolated.  Interpolated just means that for any two numbers, we can find other numbers in between them.  For instance, given 10 and 5, we can find values between them (e.g. 6, 8.2, 7, 9.9, etc).  Now we want to map values that can't be interpolated, the `label` properties in our dataset (`Bob`, `Sally`, `Matt`, `Jane`).  What values lie between `Bob` and `Sally`?  How about between `Bob` and `Matt`?  There are none.  These are just strings, not numerical values that can be divided up and interpolated.

What we want to do, is map these discrete values to other values.  Here's an example of how to do this with an ordinal scale.  Add the following at the bottom of `app.js`:

```javascript
var mapper = d3.scaleOrdinal();
mapper.range([45, 63, 400]); //list each value for ordinal scales, not just min/max
mapper.domain(['Bob', 'Sally', 'Zagthor']); //list each value for ordinal scales, not just min/max

console.log(mapper('Bob'));
console.log(mapper('Sally'));
console.log(mapper('Zagthor'));
```

The previous code should produce the following:

![](https://i.imgur.com/0WHlYsx.png)

**NOTE** When working with ordinal scales, you'll need to list all values for both domain and range.  Even if one set is numerical (in the previous case, the range), you'll still need to list each value.  If we had just listed the min/max for the range, omitting `63`, D3 would have no idea what value to map `Sally` to.  After all, how close is `Sally` to `Bob` as a value?  How close is `Sally` to `Zagthor` as a value?  There's no way to calculate that distance, since they're all strings of text, not numbers.

One thing that's surprising, is that you can't invert ordinal scales.  Remove the previous three  `console.log()` statements and temporarily add the following to the bottom of app.js:

```javascript
console.log(mapper.invert(45));
```

![](https://i.imgur.com/Bvugomc.png)

D3 can only go in one direction: from domain to range.  You can now remove that `console.log()` statement.

## Create the color scale to map labels to colors

Now we want to map the `label` properties of our data set to colors, instead of random numbers like in the previous section.  We can come up with our own color scheme, or choose one of D3's sets of colors:

- https://github.com/d3/d3-scale-chromatic#categorical

If we want to, we can see that these color schemes are just arrays:

```javascript
console.log(d3.schemeCategory10)
```

![](https://i.imgur.com/SstV7Wl.png)

Consequently, we can use them when setting a range.  Replace the previous `console.log()` statement with the following:

```javascript
var colorScale = d3.scaleOrdinal();
colorScale.range(d3.schemeCategory10);
```

We can generate an array of labels for the domain using JavaScript's native map function.  Add the following to the bottom of `app.js`:

```javascript
colorScale.domain(dataset.map(function(element){
    return element.label;
}));
```

Here's our code so far:

```javascript
var WIDTH = 360;
var HEIGHT = 360;
var radius = Math.min(WIDTH, HEIGHT) / 2;

var dataset = [
    { label: 'Bob', count: 10 },
    { label: 'Sally', count: 20 },
    { label: 'Matt', count: 30 },
    { label: 'Jane', count: 40 }
];

var colorScale = d3.scaleOrdinal();
colorScale.range(d3.schemeCategory10);
colorScale.domain(dataset.map(function(element){
    return element.label;
}));
```

## Set up the SVG

This is pretty standard.  Add it to the bottom of `app.js`:

```javascript
d3.select('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);
```

## Add paths for each pie segment

Let's add `path` elements for each element in our dataset.  Add the following to the bottom of `app.js`:

```javascript
var path = d3.select('g').selectAll('path')
    .data(dataset)
    .enter()
    .append('path')
    .attr('fill', function(d) {
        return colorScale(d.label);
    });
```

If we examine our elements in the developer tools, we'll see the paths were added, and each path has a fill value, as determined by `colorScale(d.label)`, which is mapping the label of each data object to a color:

![](https://i.imgur.com/K9SSrf5.png)

## Generate an arc creating function

The paths have fill colors, but no shape.  If you'll recall, `<path>` elements take a `d=` attribute which determines how they're drawn.  We want to set something up like this which will somehow map datum to a `d=` string:

```javascript
.attr('d', function(datum){
    //return path string here
})
```

Fortunately, D3 can generate something like this for us:

```javascript
var arc = d3.arc()
    .innerRadius(0) //to make this a donut graph, adjust this value
    .outerRadius(radius);
```

We could plug this function into it's right place, but it won't work yet:

```javascript
var path = d3.select('g').selectAll('path')
    .data(dataset)
    .enter()
    .append('path')
    .attr('d', arc) //add this
    .attr('fill', function(d) {
        return colorScale(d.label);
    });
```

## Format the data for the arc

- The reason that our `arc()` function won't work is that the data isn't formatted properly for the function
- The arc function we generated expects the data object to have things like start angle, end angle, etc
- D3 can reformat our data so that it will work with our generated `arc()` function

```javascript
var pie = d3.pie()
    .value(function(d) { return d.count; }) //use the 'count' property each value in the original array to determine how big the piece of pie should be
    .sort(null); //don't sort the values
```

our `pie` variable is a function that takes an array of values as a param and returns an array of objects that are formatted for our `arc` function

```javascript
console.log(pie(dataset));
```

![](https://i.imgur.com/eLkzxCA.png)

We can use this when attaching data to our paths:

```javascript
var path = d3.select('g').selectAll('path')
    .data(pie(dataset)) //reformat data for arc
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d) {
        return colorScale(d.label);
    });
```

- Unfortunately, now each object from the data array that's been attached to our `path` elements doesn't have a `.label` property
- Fortunately, it does have a `.data` attribute that mirrors what the data looked like before we passed it to the `pie()` function

```javascript
var path = d3.select('g').selectAll('path')
    .data(pie(dataset))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d) {
        return colorScale(d.data.label); //use .data property to access original data
    });
```

Our code so far:

```javascript
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
var colorScale = d3.scaleOrdinal();
colorScale.range(d3.schemeCategory10);
colorScale.domain(dataset.map(function(element){
    return element.label;
}));

d3.select('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);

var arc = d3.arc()
    .innerRadius(0) //to make this a donut graph, adjust this value
    .outerRadius(radius);

var pie = d3.pie()
    .value(function(d) { return d.count; }) //use the 'count' property each value in the original array to determine how big the piece of pie should be
    .sort(null); //don't sort the values

var path = d3.select('g').selectAll('path')
    .data(pie(dataset))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d) {
        return colorScale(d.data.label); //use .data property to access original data
    });
```

Produces this:

![](https://i.imgur.com/lNGj6Hg.png)

## Adjust the position of the pie

Currently, we only see the lower right quarter of the pie graph.  This is because the pie starts at (0,0), but we can move the group containing the pie like so:

```javascript
d3.select('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);
var container = d3.select('g') //add this line and the next:
    .attr('transform', 'translate(' + (WIDTH / 2) + ',' + (HEIGHT / 2) + ')'); //pie center is at 0,0
```

Now it looks like this:

![](https://i.imgur.com/kxm6VRA.png)

## Make a donut graph

If you want the pie to have a hole at the center, just adjust the inner radius of the `arc()` function:

```javascript
var arc = d3.arc()
    .innerRadius(100) //to make this a donut graph, adjust this value
    .outerRadius(radius);
```

Now we get this:

![](https://i.imgur.com/f5eIwY0.png)

## Remove parts of the pie

We want to make it possible to click on a section of the pie, and it will be removed.  First let's add ids to our data to make removing easier:

```javascript
var dataset = [
    { id: 1, label: 'Bob', count: 10 },
    { id: 2, label: 'Sally', count: 20 },
    { id: 3, label: 'Matt', count: 30 },
    { id: 4, label: 'Jane', count: 40 }
];
```

Now let's use those ids when we map data to paths:

```javascript
var path = d3.select('g').selectAll('path')
    .data(pie(dataset), function(datum){ //attach datum.data.id to each element
        return datum.data.id
    })
```

Let's save a record of what the data is currently set to (we'll use this later):

```javascript
var path = d3.select('g').selectAll('path')
    .data(pie(dataset), function(datum){
        return datum.data.id
    })
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d) {
        return colorScale(d.data.label);
    })//watch out!  remove the semicolon here
    .each(function(d) { this._current = d; }); //add this
```

Create the click handler:

```javascript
path.on('click', function(clickedDatum, clickedIndex){
});
```

Remove the selected data from the dataset array, using JavaScript's native filter function:

```javascript
path.on('click', function(clickedDatum, clickedIndex){
    dataset = dataset.filter(function(currentDatum, currentIndex){ //new
        return clickedDatum.data.id !== currentDatum.id //new
    }); //new
});
```

Remove the `path` elements from the `svg`:

```javascript
path.on('click', function(clickedDatum, clickedIndex){
    dataset = dataset.filter(function(currentDatum, currentIndex){
        return clickedDatum.data.id !== currentDatum.id
    });
    path //new
        .data(pie(dataset), function(datum){ //new
            return datum.data.id //new
        }) //new
        .exit().remove(); //new
});
```

Now, if we click on the orange segment, we should get this:

![](https://i.imgur.com/iuLEraU.png)

Let's close the donut and add a transition:

```javascript
path.on('click', function(clickedDatum, clickedIndex){
    dataset = dataset.filter(function(currentDatum, currentIndex){
        return clickedDatum.data.id !== currentDatum.id
    });
    path
        .data(pie(dataset), function(datum){
            return datum.data.id
        })
        .exit().remove();

    path.transition() //create the transition
        .duration(750) //add how long the transition takes
        .attrTween('d', function(d) { //tween the d attribute
            var interpolate = d3.interpolate(this._current, d); //interpolate from what the d attribute was and what it is now
            this._current = interpolate(0); //save new value of data
            return function(t) { //re-run the arc function:
                return arc(interpolate(t));
            };
        });
});
```

Now, when we click the orange segment, the donut closes smoothly:

![](https://i.imgur.com/gh8lnEN.png)

## Conclusion

In this chapter we created a pie chart that animates when you remove sections from it. We've learned how to generate paths from data so that we get different parts of the pie without having to specify the drawing commands directly in the path elements.  In the next chapter we will use D3 to create a graph that visualizes relationships between various nodes of data.
