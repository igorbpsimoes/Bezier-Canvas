import Point from '../models/Point';

/**
 * Implements De Casteljau's algorithm to find a point on a Bezier curve
 * @param {number} avaliationParameter - The parameter t (0-1) to evaluate the curve at
 * @param {Object} curveObject - The curve object containing control points
 * @param {Array} tempCoordinates - Temporary array for calculations
 * @returns {Point} - The point on the Bezier curve at parameter t
 */
export const findCurvePoint = (avaliationParameter, curveObject, tempCoordinates = []) => {
  const complement = 1 - avaliationParameter;
  const n = curveObject.controlPoints.length - 1;
  let workingCoordinates = [...tempCoordinates];
  
  // Initial step
  for (let i = 0; i <= n - 1; ++i) {
    const x = complement * curveObject.controlPoints[i].x + avaliationParameter * curveObject.controlPoints[i + 1].x;
    const y = complement * curveObject.controlPoints[i].y + avaliationParameter * curveObject.controlPoints[i + 1].y;
    workingCoordinates.push(new Point(x, y));
  }
  
  // Recursive steps
  for (let k = 2; k <= n; k++) {
    for (let i = 0; i <= n - k; i++) {
      const x = complement * workingCoordinates[i].x + avaliationParameter * workingCoordinates[i + 1].x;
      const y = complement * workingCoordinates[i].y + avaliationParameter * workingCoordinates[i + 1].y;
      workingCoordinates[i] = new Point(x, y);
    }
  }
  
  return workingCoordinates[0];
};