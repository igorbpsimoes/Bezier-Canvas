/**
 * Gets mouse position relative to canvas
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {MouseEvent} event - The mouse event
 * @returns {Object} - The x and y coordinates of the mouse relative to the canvas
 */
export const getMousePos = (canvas, event) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};

/**
 * Sets canvas context's drawing color to red
 * @param {CanvasRenderingContext2D} context - The canvas rendering context
 * @param {string} redColor - The red color value
 */
export const switchRed = (context, redColor) => {
  if (!context) return;
  context.fillStyle = redColor;
  context.strokeStyle = redColor;
};

/**
 * Sets canvas context's drawing color to black
 * @param {CanvasRenderingContext2D} context - The canvas rendering context
 * @param {string} blackColor - The black color value
 */
export const switchBlack = (context, blackColor) => {
  if (!context) return;
  context.fillStyle = blackColor;
  context.strokeStyle = blackColor;
};