import { calculateOrthogonalTransformation } from "../../../utils/svg"

const drawSingleBond = (line, index) => {
    const svgLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    svgLine.setAttribute('x1', line.startPoint.x);
    svgLine.setAttribute('y1', line.startPoint.y);
    svgLine.setAttribute('x2', line.endPoint.x);
    svgLine.setAttribute('y2', line.endPoint.y);
    svgLine.setAttribute('stroke', 'black');
    svgLine.setAttribute('stroke-width', '10');
    svgLine.setAttribute('class', "bond");
    svgLine.setAttribute('id', "bond"+index);
    return [ svgLine ];
};

const drawDoubleBond = (line, index) => {
    const svgLine1 = drawSingleBond(line, index+"_0")[0];
    svgLine1.setAttribute('transform', calculateOrthogonalTransformation(line, 10));
    const svgLine2 = drawSingleBond(line, index+"_1")[0];
    svgLine2.setAttribute('transform', calculateOrthogonalTransformation(line, -10));
    return [ svgLine1, svgLine2 ];
};

const drawTripleBond = (line, index) => {
    const svgLine1 = drawSingleBond(line, index+"_0")[0];
    svgLine1.setAttribute('transform', calculateOrthogonalTransformation(line, 20));
    const svgLine2 = drawSingleBond(line, index+"_1")[0];
    const svgLine3 = drawSingleBond(line, index+"_2")[0];
    svgLine3.setAttribute('transform', calculateOrthogonalTransformation(line, -20));
    return [ svgLine1, svgLine2, svgLine3 ];
};

export { drawSingleBond, drawDoubleBond, drawTripleBond}