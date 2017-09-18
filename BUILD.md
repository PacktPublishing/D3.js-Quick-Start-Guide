# D3 Build

## Lesson Objectives

1. Add link to d3 library

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
