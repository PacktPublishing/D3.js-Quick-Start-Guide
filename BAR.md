# Bar Graph

## Lesson Objectives

1. Use AJAX to make an asynchronous call to an external data file
1. Create a Bar graph

## Set up

Let's create our standard setup in `index.html`:

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <link rel="stylesheet" href="app.css">
    </head>
    <body>
        <svg></svg>
        <script src="https://d3js.org/d3.v5.min.js"></script>
        <script src="app.js" charset="utf-8"></script>
    </body>
</html>
```

`app.js`:

```javascript
var WIDTH = 800;
var HEIGHT = 600;

d3.select('svg')
    .style('width', WIDTH)
    .style('height', HEIGHT);
```

`app.css`:

```css
svg {
    border:1px solid black;
}
```

This is what we should have:

![](https://i.imgur.com/unogWXl.png)

## Create an external file to hold our data

Let's create an external `data.json` file, which will hold fake data regarding how often job posts require certain skills

```json
[
  {
    "name": "HTML",
    "count": 21
  },
  {
    "name": "CSS",
    "count": 17
  },
  {
    "name": "Responsive Web Design",
    "count": 17
  },
  {
    "name": "JavaScript",
    "count": 17
  },
  {
    "name": "Git",
    "count": 16
  },
  {
    "name": "Angular.js",
    "count": 9
  },
  {
    "name": "Node.js",
    "count": 9
  },
  {
    "name": "PostgreSQL",
    "count": 8
  },
  {
    "name": "Agile Project Management",
    "count": 8
  },
  {
    "name": "MongoDB",
    "count": 7
  },
  {
    "name": "Trello",
    "count": 7
  },
  {
    "name": "Testing / TDD",
    "count": 7
  },
  {
    "name": "jQuery",
    "count": 7
  },
  {
    "name": "User Testing",
    "count": 6
  },
  {
    "name": "MySQL",
    "count": 6
  },
  {
    "name": "PHP",
    "count": 6
  },
  {
    "name": "React.js",
    "count": 6
  },
  {
    "name": "AJAX",
    "count": 6
  },
  {
    "name": "Express.js",
    "count": 5
  },
  {
    "name": "Heroku",
    "count": 5
  },
  {
    "name": "Wireframing",
    "count": 5
  },
  {
    "name": "Sass/SCSS",
    "count": 5
  },
  {
    "name": "Mobile Web",
    "count": 4
  },
  {
    "name": "Rails",
    "count": 4
  },
  {
    "name": "WordPress",
    "count": 4
  },
  {
    "name": "Drupal",
    "count": 3
  },
  {
    "name": "Ruby",
    "count": 3
  },
  {
    "name": "Ember.js",
    "count": 3
  },
  {
    "name": "Python",
    "count": 3
  },
  {
    "name": "Amazon EC2",
    "count": 2
  },
  {
    "name": "Computer Science degree",
    "count": 1
  },
  {
    "name": "Backbone.js",
    "count": 1
  },
  {
    "name": "Less",
    "count": 1
  },
  {
    "name": "Prototyping",
    "count": 1
  },
  {
    "name": "Redis",
    "count": 1
  }
]
```

## Make an AJAX Request

### Write the basic code:

D3 has lots of different methods for making AJAX requests to file of different data types:

```javascript
d3.json('path').then(function(data){
    //do something with the json data here
});
d3.csv('path').then(function(data){
    //do something with the csv data here
});
d3.tsv('path').then(function(data){
    //do something with the tsv data here
});
d3.xml('path').then(function(data){
    //do something with the xml data here
});
d3.html('path').then(function(data){
    //do something with the html data here
});
d3.text('path').then(function(data){
    //do something with the text data here
});
```

Since our data is in JSON format, we'll use the first kind of call:

```javascript
var WIDTH = 800;
var HEIGHT = 600;

d3.select('svg')
    .style('width', WIDTH)
    .style('height', HEIGHT);

d3.json('path').then(function(data){
    console.log(data);
});
```

### Handle file access

If you opened the `index.html` file in the browser directly, instead of serving it on a web server, you'll notice we've encountered an error.  Check your developer console:

![](https://i.imgur.com/OyNP4o0.png)

The issue here is that web browsers are not supposed to make AJAX requests to files on your computer.  If it could, this would be a huge security flaw.  Let's create a basic file server.  To do this, you'll need to install [Node.js](https://nodejs.org/en/).  Once that's done, open up your computer's terminal

- Mac: `command + space` then type `terminal` and hit enter
- Windows: click Start, type `cmd` and hit enter

Next type the following into your terminal:

```
npm install -g http-server
```

If you get error messages try

```
sudo npm install -g http-server
```

This installs a basic http server that was built using Node.js.  To run it, use the terminal to navigate to the directory where you code is (type `cd` to change folders in the terminal) and run the following:

```
http-server .
```

You should see something like this:

![](https://i.imgur.com/Wja8NNL.png)

Now go to http://localhost:8080/ in your browser.  You should now see that your AJAX call is succeeding (if you have issues, hold down shift and hit the refresh button to force the browser to reload all files that may have been cached):

![](https://i.imgur.com/9QOUqSK.png)

## Use AJAX data to create SVG elements

Now that our AJAX calls are succeeding, let's start building our app.  From here on out, it's all basic JavaScript and D3.  Note that everything we'll write for the rest of this lesson is done within the success callback of our AJAX request.  In production we might want to move this code elsewhere, but for now this is easier for learning.  Let's create some rectangles for our bar graph:

```javascript
d3.json('data.json').then(function(data){
    d3.select('svg').selectAll('rect')
        .data(data)
        .enter()
        .append('rect');
});
```

Our Elements tab in our dev tools should look something like this:

![](https://i.imgur.com/39BKG1V.png)

## Adjust the height/width of the bars

Let's create a scale that maps the `count` property of each element in `data` to a visual height for the corresponding bar.  We'll use a linear scale:

```javascript
var yScale = d3.scaleLinear();
yScale.range([0, HEIGHT]);
var yDomain = d3.extent(data, function(datum, index){
    return datum.count;
})
yScale.domain(yDomain);
```

Immediatley after the above code, let's tell D3 to adjust the height using the `yScale`

```javascript
d3.selectAll('rect')
    .attr('height', function(datum, index){
        return yScale(datum.count);
    });
```

Now our rectangles have height, but no width:

![](https://i.imgur.com/HKSnXzl.png)

In our `app.css` let's give all our bars the same width:

```css
rect {
    width: 15px;
}
```

![](https://i.imgur.com/W2yoUyC.png)

## Adjust the horizontal/vertical placement of the bars

Our bars all overlap each other at the moment.  Let's space them out by mapping x position to index in the data array:

```javascript
var xScale = d3.scaleLinear();
xScale.range([0, WIDTH]);
xScale.domain([0, data.length]);
d3.selectAll('rect')
    .attr('x', function(datum, index){
        return xScale(index);
    });
```

This takes the width of the entire SVG and divides it by the number of data elements we have.  Then, each element is a assigned an `x` value based on this value multiplied by whatever index it is in the `data` array.  The first element is `WIDTH/data.length * 0` the second element is `WIDTH/data.length * 1`, etc.  Don't forget, arrays start at index 0, not 1

![](https://i.imgur.com/3d7ddVy.png)

Now let's move the bars so they grow from the bottom, not the hang from the top:

```javascript
d3.selectAll('rect')
    .attr('y', function(datum, index){
        return HEIGHT - yScale(datum.count);
    });
```

Our last few bars don't have any height, because we've mapped the minimum `count` property of our data to a visual range value of 0 in our `yScale`.  Let's adjust this code:

```javascript
var yScale = d3.scaleLinear();
yScale.range([0, HEIGHT]);
var yDomain = d3.extent(data, function(datum, index){
    return datum.count;
})
```

to be this code:

```javascript
var yScale = d3.scaleLinear();
yScale.range([10, HEIGHT]); //change min value to 10
var yDomain = d3.extent(data, function(datum, index){
    return datum.count;
})
```

Now we get this:

![](https://i.imgur.com/hhk4iu5.png)

## Make width of bars dynamic

Currently, our bars have a fixed width.  No matter how many elements we have, they have 15px width.  If we had more data elements, the bars could overlap.  Let's change this.  Since each `rect` will be the same width, no matter what the data is, we can just assign `width` a computed value:

```javascript
d3.selectAll('rect')
    .attr('width', WIDTH/data.length);
```

Now let's adjust our `rect` css so our bars are more visible:

```css
rect {
    /*  remove the width rule that was here */
    stroke:white;
    stroke-width:1px;
}
```

## Change the color of the bar based on data

Right now the bars are black.  A linear scale will interpolate between colors just like a regular number:

```javascript
var colorScale = d3.scaleLinear();
colorScale.domain(yDomain) // the yDomain has already been determined.  Let's use that
colorScale.range(['#00cc00', 'blue'])
d3.selectAll('rect')
    .attr('fill', function(datum, index){
        return colorScale(datum.count)
    })
```

## Add axes

The left axis is just like before:

```javascript
var leftAxis = d3.axisLeft(yScale);
d3.select('svg')
    .append('g').attr('id', 'left-axis')
    .call(leftAxis);
```

To create the bottom axis, we need to be able to map strings to points on a domain.  We'll use a band scale for this, which just divides up the range into equal parts and maps it to an array of discrete values (values that can't be interpolated. e.g. strings):

```javascript
var skillScale = d3.scaleBand();
var skillDomain = data.map(function(skill){
    return skill.name
});
skillScale.range([0, WIDTH]);
skillScale.domain(skillDomain);
```

Notice we use `data.map()`.  This is regular javascript which simply loops through an array and modifies each element based on the given function.  It then returns the resulting array.  In the above example, `skillDomain` will be an array containing the various name properties of each of the data elements.

Once we have an array of each of the skills, we use this as the domain and map each skill to a point within the range.  Remember the point in the range is created by dividing up the full range equally based on the number of elements in the domain.

Now that we have a scale which maps each skill text to a point in the x range, we can create the bottom axis as before:

```javascript
var bottomAxis = d3.axisBottom(skillScale);
d3.select('svg')
    .append('g').attr('id', 'bottom-axis')
    .call(bottomAxis)
    .attr('transform', 'translate(0,'+HEIGHT+')');
```

We still need to stop the `<svg>` from clipping everything:

```css
svg {
    overflow: visible;
}
```

Our result:

![](https://i.imgur.com/0hRVCR0.png)

The text is all cluttered, though.  Let's use some CSS to fix this:

```css
#bottom-axis text {
    transform:rotate(45deg);
}
```

It's rotated, but it's rotated around the center of the element.  Let's change this, so it rotates around the start of the text:

```css
#bottom-axis text {
    transform:rotate(45deg);
    text-anchor: start;
}
```

![](https://i.imgur.com/HYebbY2.png)

Let's move the graph to the right, so we can see the values for the left axis:

```css
svg {
    overflow: visible;
    margin-left: 20px;
}
```

![](https://i.imgur.com/dI9qSBJ.png)
