class Line {
  constructor(startPoint, endPoint) {

    if (!this.isValidPoint(startPoint) || !this.isValidPoint(endPoint)) {
      throw new Error("Invalid input. Points must have 'x' and 'y' properties.");
    }
    this.startPoint = startPoint;
    this.endPoint = endPoint;
  }

  isValidPoint(point) {
    return typeof point === "object" && point !== null && "x" in point && "y" in point;
  }
}

const getRotationAndTranslation = (line) => {
  const { startPoint, endPoint } = line;
  const { x: x1, y: y1 } = startPoint;
  const { x: x2, y: y2 } = endPoint;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const angleRadians = Math.atan2(dy, dx);
  const angleDegrees = (angleRadians * 180) / Math.PI;

  const rotation = `rotate(${angleDegrees})`;
  const translation = `translate(${x1}, ${y1})`;

  let scale = '';
  const length = Math.sqrt(dx * dx + dy * dy);
  const deviation = 10;
  if (length < 150 - deviation || length > 150 + deviation) {
    console.warn(`Length of bond is ${length} which is not 150. The bond template is scaled to ${length}.`);
    scale = `scale(${length/150})`;
  }

  return translation+scale+rotation;
};

const calculateOrthogonalTransformation = (line, value) => {
  // Calculate the direction vector of the line
  const direction = {
    x: line.endPoint.x - line.startPoint.x,
    y: line.endPoint.y - line.startPoint.y
  };

  // Normalize the direction vector
  const length = Math.sqrt(direction.x ** 2 + direction.y ** 2);
  const normalizedDirection = {
    x: direction.x / length,
    y: direction.y / length
  };

  // Calculate the orthogonal vector
  const orthogonal = {
    x: -normalizedDirection.y,
    y: normalizedDirection.x
  };

  // Calculate the transformed point
  const orthogonalResized = {
    x: orthogonal.x * value,
    y: orthogonal.y * value
  };

  // Format the transformation string
  const transformation = `translate(${orthogonalResized.x}, ${orthogonalResized.y})`;

  return transformation;
}

export { Line, getRotationAndTranslation, calculateOrthogonalTransformation };