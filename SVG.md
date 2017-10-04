# SVG

## Base tag

Everything goes inside here

```xml
<svg></svg>
```

## Positioning

SVG tag is an inline element

- (0,0) - x = 0, y = 0
- starts at top left
- y increases vertically down
- can use negative values
	- -x goes left
	- -y goes up

## Styling

Can be done with attributes:

- `fill=red` or `fill=#ff0000` fill color
- `stroke=red` or `stroke=#ff0000` stroke color
- `stroke-width=4` width of stroke
- `fill-opacity=0.5` transparency of fill
- `stroke-opacity=0.5` transparency of stroke
- `transform = "translate(2,3)"`
- `transform = "scale(2.1)"`
- `transform = "rotate(45)"`


Can also be done with CSS:

```css
circle {
	fill:red;
	stroke:blue;
	stroke-width:3;
	fill-opacity:0.5;
	stroke-opacity:0.1;
	transform:rotate(45deg) scale(0.4) translate(155px, 1px);
}
```

## Circle

- attributes
	- `r` radius
	- `cx` x position
	- `cy` y position

```xml
<circle r="50" cx="200" cy="300"/>
```

## Line

- attributes
	- `x1` starting x position
	- `y1` starting y position
	- `x2` ending x position
	- `y2` ending y position

```xml
<line x1="0" y1="0" x2="100" y2="100"/> <!-- no stroke, so invisible -->
<line x1="0" y1="0" x2="100" y2="100" stroke="purple"/>
```

## Rectangle

- attributes
	- `x` x position of top left
	- `y` y position of top left
	- `width` width
	- `height` height

```xml
<rect x="50" y="20" width="150" height="150"/>
```

## Ellipse

- attributes
	- `cx` x position
	- `cy` y position
	- `rx` x radius
	- `ry` y radius

```xml
<ellipse cx="200" cy="80" rx="100" ry="50"/>
```

## Polygon

- attributes
	- `points` set of coordinate pairs
		- each pair is of the form x,y

```xml
<polygon points="200,10 250,190 160,210" />
```

## Polyline

A series of connected lines.  Can have a fill like a polygon, but won't automatically rejoin itself

```xml
<polyline points="20,20 40,25 60,40 80,120 120,140 200,180" stroke="blue" fill="none"/>
```

## Path

https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths

- attributes
	- `d` a set of drawing commands
		- M = moveto
		- L = lineto
		- C = curveto
			- C x1 y1, x2 y2, x y
			- first pair is first control point
			- second pair is second control point
			- last pair is final ending point of curve
		- S = smooth curveto
			- S x2 y2, x y
			- follows another S or C command
			- uses x2 y2 of previous S or C command
		- Q = quadratic Bézier curve
			- Q x1 y1, x y
			- uses one control point for start and end controls (x1, y1)
		- T = smooth quadratic Bézier curveto
			- T x y
			- strings together multiple quadratic lines
		- Z = closepath
	- **Note:** All of the commands above can also be expressed with lower letters. Capital letters means absolutely positioned, lower cases means relatively positioned.

```xml
<path d="M150 0 L75 200 L225 200 Z" />
<path d="M0 70 C 0 120, 50 120, 50 70 S 100 20, 100 70" stroke="black" fill="transparent"/>
<path d="M0 100 Q 50 50, 100 100 T 200 100 Z" stroke="black" fill="transparent"/>
```

## Text

Content of tag is the text

- attributes
	- `x` x position of top left
	- `y` y position of top left

```xml
<text x="0" y="15">I love SVG!</text>
```

Can use font-family and font-size CSS styling

## Group

- no special attributes, so use transform
- can put multiple elements inside it.
- positioning and styling apply to children

```xml
<g></g>
```

## Arc

An arc is a command that you can add to a path that will draw part of an ellipse.

![two point](http://blog.arcbees.com/wp-content/uploads/svg-arc2.png)

Two points intersect only two ellipses with the same width/height and rotation.

```
A rx ry x-axis-rotation large-arc-flag sweep-flag x y
```

- A - create an arc draw command
- rx - x radius
- ry - y radius
- x-axis-rotation - rotate ellipse a certain number of degrees
- large-arc-flag - whether or not to travel along arc for more than 180 degrees
- sweep-flag - whether to move clock-wise or not
- x - destination x value
- y - destination y value

![flags](https://developer.mozilla.org/@api/deki/files/345/=SVGArcs_Flags.png)

Play with the values here: http://codepen.io/lingtalfi/pen/yaLWJG

## Documentation

https://developer.mozilla.org/en-US/docs/Web/SVG/Element
