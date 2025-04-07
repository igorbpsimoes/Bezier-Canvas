/**
 * Collection of functions used for drawing Bezier curves and control elements
 */

/**
 * Draws control points of a curve
 */
export const drawPoints = (context, curve) => {
  if (!context) return;
  for (let j = 0; j < curve.controlPoints.length; j++) {
    context.fillRect(
      curve.controlPoints[j].x - 8,
      curve.controlPoints[j].y - 8,
      16,
      16
    );
  }
};

/**
 * Draws control polygons (lines connecting control points)
 */
export const drawPoligonals = (context, curve) => {
  if (!context) return;
  for (let j = 0; j < curve.controlPoints.length - 1; j++) {
    context.beginPath();
    context.moveTo(curve.controlPoints[j].x, curve.controlPoints[j].y);
    context.lineTo(curve.controlPoints[j + 1].x, curve.controlPoints[j + 1].y);
    context.stroke();
  }
};

/**
 * Draws the Bezier curve segments
 */
export const drawCurves = (context, curve) => {
  if (!context || curve.controlPoints.length <= 2) return;
  
  for (let j = 0; j < curve.curvePoints.length - 1; j++) {
    context.beginPath();
    context.moveTo(curve.curvePoints[j].x, curve.curvePoints[j].y);
    context.lineTo(curve.curvePoints[j + 1].x, curve.curvePoints[j + 1].y);
    context.stroke();
  }
};

/**
 * Draws points for the current coordinates being placed
 */
export const drawCoordinatesPoints = (context, coordinates) => {
  if (!context) return;
  for (let j = 0; j < coordinates.length; j++) {
    context.fillRect(coordinates[j].x - 8, coordinates[j].y - 8, 16, 16);
  }
};

/**
 * Draws lines connecting current coordinates being placed
 */
export const drawCoordinatesPoligonals = (context, coordinates) => {
  if (!context) return;
  for (let j = 0; j < coordinates.length - 1; j++) {
    context.beginPath();
    context.moveTo(coordinates[j].x, coordinates[j].y);
    context.lineTo(coordinates[j + 1].x, coordinates[j + 1].y);
    context.stroke();
  }
};