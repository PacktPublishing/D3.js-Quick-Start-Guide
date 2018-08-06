# Creating a map

In this section we'll generate `<path>` elements from GeoJSON data that will draw a map of the world

## Lesson Objectives

1. Define GeoJSON
1. Use a projection
1. Generate a `<path>` using a projection and the GeoJSON data

## Define GeoJSON

GeoJSON is just JSON data that has specific properties that are assigned specific data types.  Here's an example:

```javascript
{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [125.6, 10.1]
    },
    "properties": {
        "name": "Dinagat Islands"
    }
}
```

In this example, we have one `Feature` who's geometry is a `Point` with the coordinates `[125.6, 10.1]`.  It has "Dinagat Islands" as its name.  Each `Feature` follows this general structure:

```javascript
{
    "type": STRING,
    "geometry": {
        "type": STRING,
        "coordinates": ARRAY
    },
    "properties": OBJECT
}
```

We can also have a `Feature Collection` which is many `Features` grouped together:

```javascript
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [102.0, 0.5]
            },
            "properties": {
                "prop0": "value0"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
                ]
            },
            "properties": {
                "prop0": "value0",
                "prop1": 0.0
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                        [100.0, 1.0], [100.0, 0.0]
                    ]
                ]
            },
            "properties": {
                "prop0": "value0",
                "prop1": { "this": "that" }
            }
        }
    ]
}
```

This basically follows the form:

```javascript
{
    "type": "FeatureCollection",
    "features": ARRAY
}
```

The `features` property is an array of `feature` objects which we've defined previously.

### Set up the HTML

Let's set up a basic D3 page:

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <title></title>
    <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>
    <script src="https://cdn.rawgit.com/mahuntington/mapping-demo/master/map_data3.js" charset="utf-8"></script>
</head>
<body>
    <svg></svg>
    <script src="app.js" charset="utf-8"></script>
</body>
</html>
```

The only thing different from the setup that we've used in previous chapters is this line:

```html
<script src="https://cdn.rawgit.com/mahuntington/mapping-demo/master/map_data3.js" charset="utf-8"></script>
```

This just loads an external javascript file which sets our GeoJSON data to a variable.

```javascript
var map_json = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            id: "AFG",
            properties: {
                name: "Afghanistan"
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    //lots of coordinates
                ]
            }
        }
        // lots of other countries
    ]
}
```

Note that the `map_json` variable is just a JavaScript object that adheres to the GeoJSON structure (it adds an `id` property which is optional).  This is very important.  If the object didn't adhere to the GeoJSON structure, D3 would not work as it should.

## Use a projection

Now let's start our `app.js` file:

```javascript
var width = 960;
var height = 490;

d3.select('svg')
    .attr('width', width)
    .attr('height', height);
```

At the bottom of `app.js` let's add:

```javascript
var worldProjection = d3.geoEquirectangular();
```

This generates a projection, which governs how we're going to display a round world on a flat page.  There's lots of different types of projections we can use: https://github.com/d3/d3-geo/blob/master/README.md#azimuthal-projections

The line above tells D3 to create an equirectangular projection (https://github.com/d3/d3-geo/blob/master/README.md#geoEquirectangular)

## Generate a `<path>` using a projection and the GeoJSON data

Now that we have our projection, we're going to generate `<path>` elements for each element in the array set to the `features` property of `map_json`

```javascript
d3.select('svg').selectAll('path')
    .data(map_json.features)
    .enter()
    .append('path')
    .attr('fill', '#099');
```

![](https://i.imgur.com/ljSlk4s.png)

We created the `path` elements, but they each need a `d` attribute which will determine how they're going to drawn (i.e. their shape).

We want something like:

```javascript
d3.selectAll('path').attr('d', function(datum, index){
    //somehow use datum to generate the value for the 'd' attributes
});
```

Writing the kind of code described in the comment above would be very difficult.  Luckily, D3 can generate that entire function for us.  All we need to do is specify the kind of projection we want to use.  At the bottom of `app.js` add the following:

```javascript
var dAttributeFunction = d3.geoPath()
    .projection(worldProjection);

d3.selectAll('path').attr('d', dAttributeFunction);
```

`geoPath()` generates the function that we'll use for the `d` attribute, and `projection(worldProjection)` tells it to use the `worldProjection` var created earlier so that the `path` elements appear as an equirectangular projection like this:

![](https://i.imgur.com/hX7hOoB.png)

## Conclusion

In this section we've covered how to use D3 to create a projection and render GeoJSON data as a map.  Congratulations!  You've made it to the end of this book.  No go off and create amazing visualizations.
