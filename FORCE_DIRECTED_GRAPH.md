# Force Directed Graphs

This lesson covers how to make a force directed graph which will visualize relationships between various nodes.  In it we will learn about the following:

- Creating a physics based force that will center nodes
- Creating a physics based force that make the nodes repel each other
- Creating a physics based force that will link the nodes to show their relationship

## Describe a Force Directed Graph

A force directed graph is a graph that is affected by various forces (e.g. gravity, repulsion, etc).  It can be extremely useful when setting up graphs of relationships

## Describe how to set up a graph of relationships

### Display

- We're going to have a list of nodes representing people and display them as circles
- We're going to have a list of links representing connections between people and display them as lines

### Physics

- We're going to have a gravitational force at the center of the `svg` that draws all nodes towards it
- We're going to have repulsive forces on each node so that they don't get too close each other
- We're going to have link forces that connect each of the nodes so that they don't repel each other too much

## Set up the HTML

Pretty standard index.html file, but we'll need two `<g>` elements:

- One to contain the nodes (people - circles)
- One to contain the links (relationships - lines)

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
            <g id="nodes"></g>
            <g id="links"></g>
        </svg>
        <script src="app.js" charset="utf-8"></script>
    </body>
</html>
```

## Set up styling for nodes and links

Create an `app.css` file for our circles (nodes/people) and lines (links/relationships)

```css
circle {
    fill: red;
    r: 5;
}

line {
    stroke: grey;
    stroke-width: 1;
}
```

Don't forget to link to it in your index.html file!

```html
<head>
    <link rel="stylesheet" href="app.css">
    <script src="https://d3js.org/d3.v5.min.js"></script>
</head>
```

## Set up svg

At the top of our `app.js` file, add the following:

```javascript
var WIDTH = 300;
var HEIGHT = 200;

d3.select("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);
```

If we open up `index.html` in Chrome and look at Elements in the dev tools, we should see this:

![](https://i.imgur.com/s6worhU.png)

## Add data for people

Let's create an array of people objects at the bottom of `app.js`:

```javascript
var nodesData =  [
    {"name": "Charlie"},
    {"name": "Mac"},
    {"name": "Dennis"},
    {"name": "Dee"},
    {"name": "Frank"},
    {"name": "Cricket"}
];
```

## Add data for relationships

Now let's create the relationships by adding the following array to the bottom of `app.js`.  **NOTE** that the attributes must be `source` and `target` in order for D3 to do its magic

```javascript
var linksData = [
    {"source": "Charlie", "target": "Mac"},
    {"source": "Dennis", "target": "Mac"},
    {"source": "Dennis", "target": "Dee"},
    {"source": "Dee", "target": "Mac"},
    {"source": "Dee", "target": "Frank"},
    {"source": "Cricket", "target": "Dee"}
];
```

## Add circles to the svg

Add the following to the bottom of `app.js`:

```javascript
var nodes = d3.select("#nodes")
    .selectAll("circle")
    .data(nodesData)
    .enter()
    .append("circle");
```

This will create circles for each element in our `nodesData` array.  Our dev tools should look like this:

![](https://i.imgur.com/TO2ogs5.png)

## Add lines to the svg

Add the following to the bottom of `app.js`:

```javascript
var links = d3.select("#links")
    .selectAll("line")
    .data(linksData)
    .enter()
    .append("line");
```

This will create lines for each element in our `linksData` array.  Our dev tools should look like this:

![](https://i.imgur.com/MpIl6Z4.png)

## Create simulation

Now we'll generate a simulation by adding the following to the bottom of `app.js`:

```javascript
d3.forceSimulation()
```

Note that this simply creates a simulation, but doesn't specify how the simulation should run.  Let's tell it what data to act on by modifying the previous line of code:

```javascript
d3.forceSimulation()
    .nodes(nodesData) // add this line
```

## Specify how the simulation affects the visual elements

At this point, our visualization still looks the same as before.

![](https://i.imgur.com/MpIl6Z4.png)

Let's have our simulation affect the circles/lines that we created

- The simulation runs "ticks" which run very quickly
- Each time a new "tick" occurs, you can update the visual elements.  This allows our simulation to animate
- D3 will calculate and tack on positional data to our regular data so that we can make use of it

Add the following to the bottom of `app.js`:

```javascript
d3.forceSimulation()
    .nodes(nodesData)
    .on("tick", function(){
        nodes.attr("cx", function(datum) { return datum.x; })
            .attr("cy", function(datum) { return datum.y; });

        links.attr("x1", function(datum) { return datum.source.x; })
            .attr("y1", function(datum) { return datum.source.y; })
            .attr("x2", function(datum) { return datum.target.x; })
            .attr("y2", function(datum) { return datum.target.y; });
    });
```

Now our circles distance themselves from each other a little bit, but this is just a side effect of not having any forces attached to them.  We'll add forces next.

![](https://i.imgur.com/jwfpTp9.png)

## Create forces

Let's create a centering force at the center of the screen that pulls all elements towards it.  Adjust the code we added in the previous step so it looks like below.  **NOTE**, we only add `.force("center_force", d3.forceCenter(WIDTH / 2, HEIGHT / 2))` to the previous code:

```javascript
d3.forceSimulation()
    .nodes(nodesData)
    .force("center_force", d3.forceCenter(WIDTH / 2, HEIGHT / 2)) // add this line
    .on("tick", function(){
        nodes.attr("cx", function(datum) { return datum.x; })
            .attr("cy", function(datum) { return datum.y; });

        links.attr("x1", function(datum) { return datum.source.x; })
            .attr("y1", function(datum) { return datum.source.y; })
            .attr("x2", function(datum) { return datum.target.x; })
            .attr("y2", function(datum) { return datum.target.y; });
    });
```

Now our circles are pulled towards the center of the SVG element:

![](https://i.imgur.com/ggGNctB.png)

Create a force on each of the nodes so that they repel each other.  Just like in the last step, we only add `.force("charge_force", d3.forceManyBody())` to the previous code:

```javascript
d3.forceSimulation()
    .nodes(nodesData)
    .force("center_force", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
    .force("charge_force", d3.forceManyBody()) //add this line
    .on("tick", function(){
        nodes.attr("cx", function(datum) { return datum.x; })
            .attr("cy", function(datum) { return datum.y; });

        links.attr("x1", function(datum) { return datum.source.x; })
            .attr("y1", function(datum) { return datum.source.y; })
            .attr("x2", function(datum) { return datum.target.x; })
            .attr("y2", function(datum) { return datum.target.y; });
    });
```

You'll notice that the cx/cy values for the circles change rapidly initially before finally stopping.  This is because D3 is running a simulation.  The center_force is trying to reach a state of equilibrium with the charge_force.  You'll even notice when you first load the page that the circles move outward from the center.  This is due to the same reason.

![](https://i.imgur.com/C37zzPO.png)

Lastly, we'll create the links between the nodes so that they don't repel each other too much.  Just like in the last step, we only add the following code to what we previously had:

```javascript
.force("links", d3.forceLink(linksData).id(function(datum){
    return datum.name
}).distance(160))
```

Our last chunk of code should now look like this:

```javascript
d3.forceSimulation()
    .nodes(nodesData)
    .force("center_force", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
    .force("charge_force", d3.forceManyBody())
    .force("links", d3.forceLink(linksData).id(function(datum){ //add this
        return datum.name //add this
    }).distance(160)) //add this
    .on("tick", function(){
        nodes.attr("cx", function(datum) { return datum.x; })
            .attr("cy", function(datum) { return datum.y; });

        links.attr("x1", function(datum) { return datum.source.x; })
            .attr("y1", function(datum) { return datum.source.y; })
            .attr("x2", function(datum) { return datum.target.x; })
            .attr("y2", function(datum) { return datum.target.y; });
    });    
```

- The `d3.forceLink` function takes the array of links.  It then uses the `source` and `target` attributes of each link data object to connect the nodes via their `.name` properties (as specified in the return value of the function we just wrote)
- You can tack on `.distance()` to specify how long the links are visually between each node

Finally, our graph looks like this:

![](https://i.imgur.com/1w8Po1b.png)

## Conclusion

In this chapter we used D3 to create a graph that visualizes relationships between various nodes of data. This can be very useful in situations like graphing a friend network, showing parent/child company relationships, or displaying a company's staff hierarchy.  In the next chapter we'll cover how to create a map from GeoJSON data.
