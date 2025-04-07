import React, { useEffect, useRef, useState, useCallback } from 'react';
import Point from '../../models/Point';
import Curve from '../../models/Curve';
import BezierControls from './BezierControls';
import { findCurvePoint } from '../../utils/bezierMath';
import { getMousePos, switchRed, switchBlack } from '../../utils/canvasHelpers';
import {
  drawPoints,
  drawPoligonals,
  drawCurves,
  drawCoordinatesPoints,
  drawCoordinatesPoligonals
} from './DrawingFunctions';
import './BezierCanvas.css';

const BLACK = "#000000";
const RED = "#FF0000";

const BezierCanvas = () => {
  // Refs and state setup
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [curves, setCurves] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [curveIndex, setCurveIndex] = useState(0);
  const [modifying, setModifying] = useState(false);
  const [editedControlPointIndex, setEditedControlPointIndex] = useState(0);
  const [showPoints, setShowPoints] = useState(true);
  const [showPoligonals, setShowPoligonals] = useState(true);
  const [showCurves, setShowCurves] = useState(true);
  const [avaliationNumber, setAvaliationNumber] = useState(100);

  // Canvas drawing function to render the current state
  const drawAllBut = useCallback((selectedCurveIndex) => {
    const ctx = contextRef.current;
    if (!ctx) return;

    if (showPoints || showPoligonals || showCurves) {
      if (curves.length > 0) {
        // Draw selected curve in red
        switchRed(ctx, RED);
        if (showPoints) {
          drawPoints(ctx, curves[selectedCurveIndex]);
        }
        if (showPoligonals) {
          drawPoligonals(ctx, curves[selectedCurveIndex]);
        }
        if (showCurves) {
          drawCurves(ctx, curves[selectedCurveIndex]);
        }

        // Draw other curves in black
        switchBlack(ctx, BLACK);
        for (let i = 0; i < curves.length; i++) {
          if (i !== selectedCurveIndex) {
            if (showPoints) {
              drawPoints(ctx, curves[i]);
            }
            if (showPoligonals) {
              drawPoligonals(ctx, curves[i]);
            }
            if (showCurves) {
              drawCurves(ctx, curves[i]);
            }
          }
        }
      }

      // Draw current coordinates
      switchRed(ctx, RED);
      if (showPoints) {
        drawCoordinatesPoints(ctx, coordinates);
      }
      if (showPoligonals) {
        drawCoordinatesPoligonals(ctx, coordinates);
      }
    }
  }, [curves, coordinates, showPoints, showPoligonals, showCurves]);

  // Curve calculation function
  const modifyCurve = useCallback((updatedCurves = curves) => {
    const ctx = contextRef.current;
    if (!ctx) return;

    const avaliation = avaliationNumber;
    const currentCurves = updatedCurves || [...curves];

    // Reset curve points
    currentCurves[curveIndex].curvePoints = [];
    currentCurves[curveIndex].curvePoints.push(currentCurves[curveIndex].controlPoints[0]);
    let startPoint = currentCurves[curveIndex].curvePoints[0];

    // Recalculate curve points
    for (let i = 1; i <= avaliation; i++) {
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);

      const nextPoint = findCurvePoint(i/avaliation, currentCurves[curveIndex]);
      currentCurves[curveIndex].curvePoints.push(nextPoint);
      startPoint = nextPoint;

      if (showCurves) {
        ctx.lineTo(nextPoint.x, nextPoint.y);
        ctx.stroke();
      }
    }

    if (updatedCurves) {
      setCurves(currentCurves);
    }
  }, [curves, curveIndex, avaliationNumber, showCurves]);

  // Event handlers
  const checkPointIntersection = useCallback((event) => {
    const pos = getMousePos(canvasRef.current, event);

    for (let i = 0; i < curves.length; i++) {
      for (let j = 0; j < curves[i].controlPoints.length; j++) {
        if (
          pos.x >= curves[i].controlPoints[j].x - 8 &&
          pos.x <= curves[i].controlPoints[j].x + 8 &&
          pos.y >= curves[i].controlPoints[j].y - 8 &&
          pos.y <= curves[i].controlPoints[j].y + 8
        ) {
          setModifying(true);
          setCurveIndex(i);
          setEditedControlPointIndex(j);
          break;
        }
      }
    }
  }, [curves]);

  const movePoint = useCallback((event) => {
    const ctx = contextRef.current;
    if (modifying && ctx) {
      const pos = getMousePos(canvasRef.current, event);
      const updatedCurves = [...curves];
      updatedCurves[curveIndex].controlPoints[editedControlPointIndex] = new Point(pos.x, pos.y);
      setCurves(updatedCurves);

      if (updatedCurves[curveIndex].controlPoints.length > 2) {
        modifyCurve(updatedCurves);
      }

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      drawAllBut(curveIndex);
    }
  }, [modifying, curves, curveIndex, editedControlPointIndex, modifyCurve, drawAllBut]);

  const addPoint = useCallback((event) => {
    const ctx = contextRef.current;
    if (!modifying && ctx) {
      const pos = getMousePos(canvasRef.current, event);

      if (showPoints) {
        ctx.fillRect(pos.x - 8, pos.y - 8, 16, 16);
      }

      if (showPoligonals) {
        const arraySize = coordinates.length;
        if (arraySize > 0) {
          const x = coordinates[arraySize - 1].x;
          const y = coordinates[arraySize - 1].y;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        }
      }

      const newCoordinates = [...coordinates, new Point(pos.x, pos.y)];
      setCoordinates(newCoordinates);
    } else {
      setModifying(false);
    }
  }, [modifying, showPoints, showPoligonals, coordinates]);

  // Initialize canvas and add event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    contextRef.current = ctx;

    // Initial setup
    ctx.fillStyle = RED;
    ctx.strokeStyle = RED;

    // Add event listeners
    canvas.addEventListener("mousedown", checkPointIntersection);
    canvas.addEventListener("mousemove", movePoint);
    canvas.addEventListener("mouseup", addPoint);

    // Clean up event listeners on unmount
    return () => {
      canvas.removeEventListener("mousedown", checkPointIntersection);
      canvas.removeEventListener("mousemove", movePoint);
      canvas.removeEventListener("mouseup", addPoint);
    };
  }, [checkPointIntersection, movePoint, addPoint]);

  // Redraw all curves when state changes
  useEffect(() => {
    const ctx = contextRef.current;
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      drawAllBut(curveIndex);
    }
  }, [curves, curveIndex, showPoints, showPoligonals, showCurves, drawAllBut]);

  // Button handler functions
  const createCurve = useCallback(() => {
    const ctx = contextRef.current;
    if (coordinates.length > 0 && ctx) {
      const newCurves = [...curves];
      newCurves.push(new Curve([...coordinates]));

      if (coordinates.length > 2) {
        const curveNum = newCurves.length - 1;
        const avaliation = avaliationNumber;

        // Initialize curve points with first control point
        newCurves[curveNum].curvePoints.push(coordinates[0]);
        let startPoint = newCurves[curveNum].curvePoints[0];

        // Calculate curve points using De Casteljau's algorithm
        for (let i = 1; i <= avaliation; i++) {
          ctx.beginPath();
          ctx.moveTo(startPoint.x, startPoint.y);

          // Find next curve point
          const nextPoint = findCurvePoint(i/avaliation, newCurves[curveNum]);
          newCurves[curveNum].curvePoints.push(nextPoint);
          startPoint = nextPoint;

          if (showCurves) {
            ctx.lineTo(nextPoint.x, nextPoint.y);
            ctx.stroke();
          }
        }
      }

      setCurves(newCurves);
      setCoordinates([]);
      switchBlack(ctx, BLACK);
    }
  }, [coordinates, curves, avaliationNumber, showCurves]);

  const selectPreviousCurve = useCallback(() => {
    if (curves.length > 1) {
      let newIndex = curveIndex - 1;
      if (newIndex < 0) {
        newIndex = curves.length - 1;
      }
      setCurveIndex(newIndex);
      setEditedControlPointIndex(curves[newIndex].controlPoints.length - 1);
    }
  }, [curves, curveIndex]);

  const selectNextCurve = useCallback(() => {
    if (curves.length > 1) {
      let newIndex = curveIndex + 1;
      if (newIndex === curves.length) {
        newIndex = 0;
      }
      setCurveIndex(newIndex);
      setEditedControlPointIndex(curves[newIndex].controlPoints.length - 1);
    }
  }, [curves, curveIndex]);

  const addControlPoint = useCallback(() => {
    if (curves.length > 0) {
      const updatedCurves = [...curves];
      // Add point at center of the smaller canvas
      updatedCurves[curveIndex].controlPoints.push(new Point(425, 225));
      setCurves(updatedCurves);
      modifyCurve(updatedCurves);
    }
  }, [curves, curveIndex, modifyCurve]);

  const deleteControlPoint = useCallback(() => {
    if (curves.length > 0) {
      const updatedCurves = [...curves];
      const len = updatedCurves[curveIndex].controlPoints.length;
      const safeIndex = Math.min(Math.max(0, editedControlPointIndex), len - 1);

      updatedCurves[curveIndex].controlPoints.splice(safeIndex, 1);
      const newEditedIndex = Math.max(0, safeIndex - 1);
      setEditedControlPointIndex(newEditedIndex);

      if (updatedCurves[curveIndex].controlPoints.length > 2) {
        modifyCurve(updatedCurves);
      } else if (updatedCurves[curveIndex].controlPoints.length > 0) {
        updatedCurves[curveIndex].curvePoints = [];
        setCurves(updatedCurves);
      } else {
        updatedCurves.splice(curveIndex, 1);
        setCurves(updatedCurves);
        setCurveIndex(0);
      }
    }
  }, [curves, curveIndex, editedControlPointIndex, modifyCurve]);

  const clearCanvas = useCallback(() => {
    const ctx = contextRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setCoordinates([]);
    setCurves([]);
    setCurveIndex(0);
    switchRed(ctx, RED);
  }, []);

  const deleteCurve = useCallback(() => {
    const ctx = contextRef.current;
    if (curves.length > 0) {
      const updatedCurves = [...curves];
      updatedCurves.splice(curveIndex, 1);

      if (curveIndex === updatedCurves.length && curveIndex !== 0) {
        setCurveIndex(curveIndex - 1);
      }

      setCurves(updatedCurves);

      if (updatedCurves.length === 0) {
        switchRed(ctx, RED);
      }
    } else {
      clearCanvas();
    }
  }, [curves, curveIndex, clearCanvas]);

  // UI event handlers
  const togglePoints = () => setShowPoints(!showPoints);
  const togglePoligonals = () => setShowPoligonals(!showPoligonals);
  const toggleCurves = () => setShowCurves(!showCurves);

  const handleAvaliationChange = useCallback((e) => {
    const value = parseInt(e.target.value) || 100;
    setAvaliationNumber(value);

    // Recalculate all curves with the new avaliation number
    if (curves.length > 0 && contextRef.current) {
      const ctx = contextRef.current;

      // Update all curves with new avaliation number
      const updatedCurves = [...curves];
      for (let i = 0; i < updatedCurves.length; i++) {
        if (updatedCurves[i].controlPoints.length > 2) {
          // Save current curve index
          const savedCurveIndex = curveIndex;

          // Temporarily set curve index to current iteration
          setCurveIndex(i);

          // Recalculate curve
          updatedCurves[i].curvePoints = [];
          updatedCurves[i].curvePoints.push(updatedCurves[i].controlPoints[0]);

          // Calculate points using new avaliation number
          for (let j = 1; j <= value; j++) {
            const nextPoint = findCurvePoint(j/value, updatedCurves[i]);
            updatedCurves[i].curvePoints.push(nextPoint);
          }

          // Restore original curve index
          setCurveIndex(savedCurveIndex);
        }
      }

      // Update curves state
      setCurves(updatedCurves);

      // Redraw the canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      drawAllBut(curveIndex);
    }
  }, [curves, curveIndex, drawAllBut]);

  return (
    <div className="bezier-canvas-container">
      <canvas
        ref={canvasRef}
        width={850}
        height={450}
        className="bezier-canvas"
      />

      <BezierControls
        createCurve={createCurve}
        selectPreviousCurve={selectPreviousCurve}
        selectNextCurve={selectNextCurve}
        addControlPoint={addControlPoint}
        deleteControlPoint={deleteControlPoint}
        deleteCurve={deleteCurve}
        clearCanvas={clearCanvas}
        showPoints={showPoints}
        showPoligonals={showPoligonals}
        showCurves={showCurves}
        avaliationNumber={avaliationNumber}
        togglePoints={togglePoints}
        togglePoligonals={togglePoligonals}
        toggleCurves={toggleCurves}
        handleAvaliationChange={handleAvaliationChange}
      />
    </div>
  );
};

export default BezierCanvas;
