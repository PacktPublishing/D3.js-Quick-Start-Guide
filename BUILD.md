# D3 Build

## Lesson Objectives

1. Add link to d3 library
1. Add an `<svg>` tag and size it with D3

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
