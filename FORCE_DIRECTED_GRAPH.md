# Force Directed Graphs

## Describe a Force Directed Graph

- A force directed graph is a graph that is affected by various forces (e.g. gravity, repulsion, etc)
- It can be extremely useful when setting up graphs of relationships

## Describe how a to set up a graph of relationships

### Display

- We're going to have a list of nodes representing people and display them as circles
- We're going to have a list of links representing connections between people and display them as lines

### Physics

- We're going to have a gravitational force at the center of the `svg` that draws all nodes towards it
- We're going to have forces on each node so that they repel each other
- We're going to have link forces that connect each of the nodes so that they don't repel each other too much

## Set up the HTML

Pretty standard, but we'll need two `<g>` elements:

- One to contain the nodes (people - circles)
- One to contain the links (relationships - lines)

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
            <g id="nodes"></g>
            <g id="links"></g>
        </svg>
        <script src="app.js" charset="utf-8"></script>
    </body>
</html>
```

## Set up styling for nodes and links

Create a css file for our circles (nodes/people) and lines (links/relationships)

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

Don't forget to link to it!

```html
<link rel="stylesheet" href="app.css">
```

## Set up svg

Standard:

```javascript
var WIDTH = 300;
var HEIGHT = 200;

d3.select("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);
```

## Add data for people

```javascript
var nodesData =  [
    {"name": "Travis", "sex": "M"},
    {"name": "Rake", "sex": "M"},
    {"name": "Diana", "sex": "F"},
    {"name": "Rachel", "sex": "F"},
    {"name": "Shawn", "sex": "M"},
    {"name": "Emerald", "sex": "F"}
];
```

## Add data for relationships

Note that the attributes must be `source` and `target` in order for D3 to do its magic

```javascript
var linksData = [
    {"source": "Travis", "target": "Rake"},
    {"source": "Diana", "target": "Rake"},
    {"source": "Diana", "target": "Rachel"},
    {"source": "Rachel", "target": "Rake"},
    {"source": "Rachel", "target": "Shawn"},
    {"source": "Emerald", "target": "Rachel"}
];
```

## Add circles to the svg

```javascript
var nodes = d3.select("#nodes")
    .selectAll("circle")
    .data(nodesData)
    .enter()
    .append("circle");
```

## Add lines to the svg

```javascript
var links = d3.select("#links")
    .selectAll("line")
    .data(linksData)
    .enter()
    .append("line");
```
