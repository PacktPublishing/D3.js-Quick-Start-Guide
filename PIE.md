# Creating a Pie Chart

## Set Up

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
        <script src="https://d3js.org/d3.v4.min.js"></script>
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

An ordinal scale maps discrete values (can't be interpolated) to discrete values.

```javascript
var mapper = d3.scaleOrdinal();
mapper.range([45, 63, 400]); //list each value for ordinal scales, not min/max
mapper.domain(['Bob', 'Sally', 'Zagthor']); //list each value for ordinal scales, not min/max

console.log(mapper('Bob'));
console.log(mapper('Sally'));
console.log(mapper('Zagthor'));
```

You cannot invert ordinal scales:

```javascript
console.log(mapper.invert(45));
```

## Create the color scale to map labels to colors

D3 comes with lots of pre-made color schemes:

- https://github.com/d3/d3-scale/blob/master/README.md#category-scales
- https://github.com/d3/d3-scale-chromatic#categorical

They're just arrays:

```javascript
console.log(d3.schemeCategory10)
```

Consequently, we can use them when setting a range:

```javascript
var colorScale = d3.scaleOrdinal();
colorScale.range(d3.schemeCategory10);
```

We can generate an array of labels for the domain using JavaScript's map function:

```javascript
colorScale.domain(dataset.map(function(element){
    return element.label;
}));
```

## Set up the svg

Standard:

```javascript
d3.select('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);
```

## Add paths for each pie segment

```javascript
var path = d3.select('g').selectAll('path')
    .data(dataset)
    .enter()
    .append('path')
    .attr('fill', function(d) {
        return colorScale(d.label);
    });
```

## Generate an arc creating function

Next we want to do something like this:

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

`pie` is a function that takes an array of values as a param and returns an array of objects that are formatted for our `arc` function

```javascript
console.log(pie(dataset));
```

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

## Adjust the position of the pie

The pie starts at (0,0), so we can move the group containing the pie:

```javascript
var container = d3.select('g')
    .attr('transform', 'translate(' + (WIDTH / 2) + ',' + (HEIGHT / 2) + ')'); //pie center is at 0,0
```

## Make a donut graph

If you want the pie to have a hole at the center, just adjust the inner radius of the `arc()` function:

```javascript
var arc = d3.arc()
    .innerRadius(100) //to make this a donut graph, adjust this value
    .outerRadius(radius);
```

## Remove parts of the pie

First let's add ids to our data to make removing easier:

```javascript
var dataset = [
    { id: 1, label: 'Abulia', count: 10 },
    { id: 2, label: 'Betelgeuse', count: 20 },
    { id: 3, label: 'Cantaloupe', count: 30 },
    { id: 4, label: 'Dijkstra', count: 40 }
];
```

Now let's use those ids when we map data to paths:

```javascript
var path = container.selectAll('path')
    .data(pie(dataset), function(datum){
        return datum.data.id
    })
```

Let's save a record of what the data is currently set to (we'll use this later):

```javascript
var path = container.selectAll('path')
    .data(pie(dataset), function(datum){
        return datum.data.id
    })
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d) {
        return colorScale(d.data.label);
    })
    .each(function(d) { this._current = d; }); //add this
```

Create the click handler:

```javascript
path.on('click', function(clickedDatum, clickedIndex){
});
```

Remove the selected data from the dataset array:

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

Add the transition:

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
            return function(t) {
                return arc(interpolate(t));
            };
        });
});
```
