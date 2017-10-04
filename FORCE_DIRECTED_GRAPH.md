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
