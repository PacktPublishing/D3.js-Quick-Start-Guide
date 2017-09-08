# D3.js

## Basics

### Selection

```javascript
d3.select('#some-id') //like document.querySelector()
d3.selectAll('.some-class') //like document.querySelectorAll()
d3.select('main').selectAll('span'); //can chain to select ancestors
```

### .style()

```javascript
d3.select('div').style('color', 'orange'); //sets the style for an element
d3.select('div').style('color', 'orange').style('font-size': '20px'); //will return the selection for chaining
```

### .attr()

```javascript
d3.select('div').attr('anExampleAttribute', 'someValue'); //adds/changes an attribute on an selection
```

### .classed()

```javascript
d3.selectAll('.house').classed('house'); // returns true if all elements in selection contain the chosen class
d3.selectAll('div').classed('frog', true); //adds the class and returns the selection
d3.selectAll('div').classed('frog', false); //removes the class and returns the selection
```

### .append()

```javascript
d3.selectAll('div').append('span'); //append html to a selection and return appended element
```

### .html()

```javascript
d3.selectAll('div').html('<span>hi</span>'); //change the inner html of an element
```

### .text()

```javascript
d3.selectAll('div').text('hi'); //set the content of the selection to the exact text (escapes html)
```

## AJAX

Named based off of what kind of data they accept

```javascript
d3.json('path', function(error, data){});
d3.csv('path', function(error, data){});
d3.tsv('path', function(error, data){});
d3.xml('path', function(error, data){});
d3.html('path', function(error, data){});
d3.text('path', function(error, data){});

//make a post
d3.request('/runs') //make a request to the server
	.header("Content-Type", "application/json") //tell the server we're sending JSON data
	.post(
		//must turn data object into string
		JSON.stringify(runObject),
		function(){ //callback

		}
	);

//send delete
d3.request('/runs/'+d.id)
	.header("Content-Type", "application/json") //we're sending data
	.send('DELETE', function(){}); //send a DELETE request

//send update
d3.request('/runs/'+d.id)
	.header("Content-Type","application/json") //we're sending JSON
	.send('PUT', JSON.stringify(d), function(){});//pass alterted 'd' object to API
```

## Data binding

```javascript
d3.select('svg').selectAll('circle')//make a "ghost call" to all circles, even if there are none already.  Make sure to select the svg, or appended circles will attach to html element
	.data(dataArray) //joins each element in dataArray to an element in the selection
	.enter() //returns the sub section of dataArray that has not been matched with DOM elements
	.append('circle'); //creates a DOM element for each of the remaining dataArray elements
```

once data has been bound to elements, you can call something like:

```javascript
d3.selectAll('circle').attr('r', function(d,i){ //d is data for the current element, i is the index of that element in the array
	//callback will be executed for each DOM element
	//return value is how each value will be set
	return d.value * 2 //takes value property of d (data), multiplies it by two and sets the radius to that
})
```

Can remove elements:

```javascript
d3.selectAll('circle')//make a "ghost call" to all circles, even if there are none already
	.data(dataArray) //joins each element in dataArray to an element in the selection
	.exit() //returns the sub section of DOM elements that has not been matched with dataArray elements
	.remove(); //removes those elements
```

To bind data to elements by something other than index:

```javascript
.data(data, function(d){
		//match data based on d.id, not index
		return d.id
});
```

## Linear Scale

A scale will map a data value to a visual value.

1. Create a scale.  There are many types.  Here we'll use a linear scale

	```javascript
	var yScale = d3.scaleLinear();
	```

1. Set up a visual range

	```javascript
	yScale.range([height,0]);
	```

1. Add the domain

	```javascript
	yScale.domain(yDomain);
	```

1. Can check range and domain after initialization

	```javascript
	yScale.range();
	yScale.domain();
	```

1. Can now pass a data value into the scale to get a visual value

	```javascript
	yScale(361); //returns the visual value that maps to this data value
	```

1. Can go the opposite way

	```javascript
	yScale.invert(800); //returns the data value that maps to this visual value
	```

1. If data min/max of a data set (called the "domain") are not found, you can find them:

	```javascript
	var yMax = d3.max(data, function(element){
		return parseInt(element.TMAX);
	})
	var yMin = d3.min(data, function(element){
		return parseInt(element.TMAX);
	})

	var yDomain = [yMin, yMax];
	```

	- Can combine this into one call if max/min come from same element:

	```javascript
	var yDomain = d3.extent(data, function(element){
		return parseInt(element.TMAX);
	});
	```

## Time Scale

1. Create the scale

	```javascript
	var xScale = d3.scaleTime();
	```

1. Set up the visual range

	```javascript
	xScale.range([0, width]);
	```

1. Set up the time range

	```javascript
	xScale.domain([new Date('2016-1-1'), new Date('2017-1-1')]);
	```

### Dealing with alternate date formats

Date formatting options: https://github.com/d3/d3-time-format#locale_format

To parse an alternate format into a date object

```javascript
var parseTime = d3.timeParse("%Y%m%d");
parseTime('20160101') //returns a date object
```

To create an alternately formated string from a date object

```javascript
var formatTime = d3.timeFormat("%Y%m%d");
formatTime(new Date()); //returns a string in the above format
```

## Axes

```javascript
var leftAxis = d3.axisLeft(yScale); //create a left axis based on the yScale
d3.select('svg')
	.append('g') //append a group element
	.call(leftAxis); //apply the axis to it
```

Different types of axes: https://github.com/d3/d3-axis#axisTop

## Events

```javascript
select.on('mouseenter', function(data, index){
	d3.select(this); //select just element that was hovered
	console.log(d3.event); //the event object
})
```

click, mouseenter and mouseleave are common

use `d3.event.stopPropagation();` when events conflict

## Behaviors

### Dragging

```javascript
//create the behavior
var drag = d3.drag()
	.on('start', dragStart)
	.on('drag', drag)
	.on('end', dragEnd);
//...
//apply it to a selection
d3.selectAll('circle').call(drag);
//....
//define callbacks
function dragStart(d){ //d is the data for the dragged object
	d3.select(this); //the visual object
	d3.event.x; //x position of cursor
	d3.event.y; //y position of cursor
}
```

You can use the xScale.invert and yScale.invert to get data from d3.event.x and d3.event.y

### Zooming

```javascript
//previously defined: var xAxis = d3.axisBottom(xScale);
//previously defined: var yAxis = d3.axisLeft(yScale);
//previously defined: d3.select('svg').append('g').attr('id', 'x-axis').attr('transform', 'translate(0,' + HEIGHT + ')').call(xAxis);
//previously defined: d3.select('svg').append('g').attr('id', 'y-axis').call(yAxis); //y axis is good as it is
var zoomCallback = function(){
	lastTransform = d3.event.transform; //save the transform for later inversion with clicks
	d3.select('#points').attr("transform", d3.event.transform); //apply transform to g element containing circles
	//recalculate the axes
	d3.select('#x-axis').call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
	d3.select('#y-axis').call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
}
var zoom = d3.zoom().on('zoom', zoomCallback);
d3.select('svg').call(zoom);
```

If you need to recalculate new mouse position after transform, use the last saved event transform's invert methods

```javascript
var lastTransform = null;
d3.select('svg').on('click', function(d){

	//d3.event contains data for click event
	var x = d3.event.offsetX; //use offset to get point within svg container
	var y = d3.event.offsetY;

	if(lastTransform !== null){
		x = lastTransform.invertX(d3.event.offsetX); //use offset to get point within svg container
		y = lastTransform.invertY(d3.event.offsetY);
	}
	//...
```

## Basic Layouts
- https://github.com/d3/d3/wiki/Plugins
- http://c3js.org/
