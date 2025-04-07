# Bezier Canvas Interface

## How to Run
For the React version:
1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. Open http://localhost:3000 in your browser

## Usage Instructions
When using the interface, there are some rules to keep in mind:

1. Before creating a curve, set the number of evaluations for the De Casteljau algorithm so the curve can be drawn. If you don't do this initially, you can still set it later - when a control point is moved, the curve will be redrawn using the specified number of evaluations.

2. The "Prev" and "Next" buttons only cycle through curves that have already been created using the "Create" button.

3. The "Add Point" button will add a control point to the selected curve at the center of the canvas.

4. The "Del Point" button will delete the last modified control point or those following it in succession after that point has been removed, until reaching the "end" of the curve.

5. You can only move control points after creating the curve with the "Create" button.

6. To move a control point, click near the upper left quadrant of the square or its center. Clicking on other quadrants may cause the program to behave unexpectedly.

7. When you modify a control point, the curve it belongs to will be selected.

8. A curve drawn in red indicates that it is currently selected.

## About Bezier Curves
Bezier curves are parametric curves widely used in computer graphics and related fields. The curves shown in this interface are calculated using the De Casteljau algorithm, which is a recursive method to evaluate points on a Bezier curve.

The "Avaliation" parameter controls how many points are calculated along the curve, effectively determining the curve's smoothness. A higher number gives a smoother curve with more segments.
