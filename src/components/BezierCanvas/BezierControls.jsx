import React from 'react';
import './BezierCanvas.css';

/**
 * Controls component for the Bezier Canvas
 * Contains buttons and inputs for manipulating curves
 */
const BezierControls = ({ 
  createCurve, 
  selectPreviousCurve, 
  selectNextCurve,
  addControlPoint,
  deleteControlPoint,
  deleteCurve,
  clearCanvas,
  showPoints,
  showPoligonals,
  showCurves,
  avaliationNumber,
  togglePoints,
  togglePoligonals,
  toggleCurves,
  handleAvaliationChange
}) => {
  return (
    <>
      <div className="button-controls">
        <button onClick={createCurve} className="create-button">
          Create
        </button>
        <button onClick={selectPreviousCurve} className="navigation-button">
          Prev
        </button>
        <button onClick={selectNextCurve} className="navigation-button">
          Next
        </button>
        <button onClick={addControlPoint} className="edit-button">
          Add Point
        </button>
        <button onClick={deleteControlPoint} className="edit-button">
          Del Point
        </button>
        <button onClick={deleteCurve} className="delete-button">
          Del Curve
        </button>
        <button onClick={clearCanvas} className="clear-button">
          Clear All
        </button>
      </div>
      
      <div className="checkbox-controls">
        <div className="avaliation-input">
          <label htmlFor="avaliationField">Avaliation:</label>
          <input
            id="avaliationField"
            type="text"
            value={avaliationNumber}
            onChange={handleAvaliationChange}
            placeholder="Points"
          />
        </div>

        <div className="visibility-toggles">
          <div className="toggle-control">
            <input
              id="pointCheckbox"
              type="checkbox"
              checked={showPoints}
              onChange={togglePoints}
            />
            <label htmlFor="pointCheckbox">Points</label>
          </div>
          
          <div className="toggle-control">
            <input
              id="poligonalCheckbox"
              type="checkbox"
              checked={showPoligonals}
              onChange={togglePoligonals}
            />
            <label htmlFor="poligonalCheckbox">Poligonals</label>
          </div>
          
          <div className="toggle-control">
            <input
              id="curveCheckbox"
              type="checkbox"
              checked={showCurves}
              onChange={toggleCurves}
            />
            <label htmlFor="curveCheckbox">Curves</label>
          </div>
        </div>
      </div>
    </>
  );
};

export default BezierControls;