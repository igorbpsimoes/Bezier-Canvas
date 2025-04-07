/**
 * Represents a Bezier curve with control points and calculated curve points
 */
class Curve {
  constructor(controlPoints) {
    this.controlPoints = controlPoints;
    this.curvePoints = [];
  }
}

export default Curve;