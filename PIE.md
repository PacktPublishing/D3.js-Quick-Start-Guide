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
    { label: 'Abulia', count: 10 },
    { label: 'Betelgeuse', count: 20 },
    { label: 'Cantaloupe', count: 30 },
    { label: 'Dijkstra', count: 40 }
];
```

## Create an Ordinal Scale

An ordinal scale maps discrete values (can't be interpolated) to discrete values.

```javascript
var mapper = d3.scaleOrdinal();
mapper.range([45, 63, 400]);
mapper.domain(['Bob', 'Sally', 'Zagthor']);

console.log(mapper('Bob'));
console.log(mapper('Sally'));
console.log(mapper('Zagthor'));
```

You cannot invert ordinal scales:

```javascript
console.log(mapper.invert(45));
```
