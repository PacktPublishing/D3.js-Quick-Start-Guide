# Introduction

The era of big data is upon us!  Advances in hardware have made it possible for computers to store, analyze, and transmit massive amounts of information in a way that was previously impossible.  Data Science has become one of the most in-demand fields in the United States, companies are constantly coming up with new techniques to analyze customer information, and it seems like every day there are new ways to visualize all this data.

One of the best ways to present your data is via an interactive graphic on the web.  The advantage of this approach is that its interactivity allows creators to pack more information into a single visualization, while the ubiquity of the web allows anyone to instantly access it.  Gone are the days of power point presentations, or worse yet, printing static images onto paper for handout.  There are many ways to create a web-based interactive data visualization, but none is more popular than a JavaScript library called D3.js.

To understand why D3.js works so well, it's important to understand what SVG is and how it relates to D3.  SVG stands for Scalable Vector Graphics, and it's a way to display shapes using mathematical directions/commands.  Traditionally, the information for an image is stored in a grid, also called a `raster`.  Each pixel of the image has a specific color:

![](https://upload.wikimedia.org/wikipedia/commons/5/54/Raster_graphic_fish_20x23squares_sdtv-example.jpg)

But with SVG, a set of succinct drawing directions are stored.  For example, the drawing command for a circle is:

```html
<circle r=50><circle>
```

This code produces a much smaller file size, and because it's a set of drawing directions, the image can enlarged without any pixelation.  A raster image becomes blurry and pixelated as it's enlarged.  The advantage of raster graphics over vector graphics is that they're great for storing complex images like photographs.  In a situation like a photograph, where each pixel probably has a different color, it's better to use a raster image.  Imagine writing SVG drawing commands for a photograph: you would end up creating a new element for each pixel, and the file size would be too large.

Once an SVG drawing command is written, a program needs to interpret command and display the image.  Up until somewhat recently, only designated drawing applications like Adobe Illustrator could view and manipulate these images.  But by 2011 all major modern browsers supported SVG tags, allowing for developers to embed SVG directly on a web page.  Since the SVG image was directly embedded in the code of a web page, JavaScript -- which normally is used for manipulating HTML -- could be used to manipulate the shape, size, and colors of the image in response to user events.  To make the circle in the SVG example above grow to twice its original size, all that JavaScript had to do was change the `r` attribute:

```html
<circle r=100><circle>
```

This was the massive breakthrough that allowed complex interactive data visualizations to be hosted on the web.

D3.js came in at this point because writing the code to make complex Data Driven Documents (how D3 got its name) that linked SVG images with the big data that had become available on the internet was a difficult task.  It rose to prominence during the Obama/Romney presidential debates as the New York times publishes a series of amazing visualizations.  Check out some examples here:

- https://archive.nytimes.com/www.nytimes.com/interactive/2012/11/07/us/politics/obamas-diverse-base-of-support.html
- http://archive.nytimes.com/www.nytimes.com/interactive/2012/11/02/us/politics/paths-to-the-white-house.html
- https://archive.nytimes.com/www.nytimes.com/interactive/2012/10/15/us/politics/swing-history.html
- https://www.nytimes.com/elections/2012/electoral-map.html
- https://archive.nytimes.com/www.nytimes.com/interactive/2012/09/06/us/politics/convention-word-counts.html
- https://archive.nytimes.com/www.nytimes.com/interactive/2012/03/07/us/politics/how-candidates-fared-with-different-demographic-groups.html

D3 simplifies some of the most common, as well as some of the most complex tasks that a developer can run into when creating browser-based visualizations.  At it's core, D3 easily maps SVG image properties to data values.  As the data values change, due to user interactions, so do the images.

D3 is a massive library, full of millions of options, but its core concepts are easy to learn.  One does not need to know every detail of the library in order to become a functional D3 developer.  Instead, this book attempts to teach the most fundamental aspects of D3, so that the reader can get job-ready quickly.  It does so by stepping the user through a series of the most common graphs that a developer will be asked to make: a scatter plot, a bar graph, a pie chart, a force directed graph, and a map.  The goal is not only to teach the basics but also give the reader a final set of builds that are fun to work towards as well as useful to draw from as their career continues.

Please note, the code demonstrated here was created to be easy to understand from an educational standpoint.  It is not meant to be code that is ready for production.  Nor does it employ ES6 or ES7 syntax.  Often times demonstrating a concept in code that is production-ready or written in  ES6/ES7 can hinder the educational experience.  It is assumed that the reader is comfortable enough with the core concepts of programming that they can refine the code on their own, once they are comfortable with the fundamentals of D3.
