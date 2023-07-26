import { calculateOrthogonalTransformation, getRotationAndTranslation } from "../../../utils/svg"

const svg_paths = [
    ["M 0 1 L 37 0 L 104 1 L 149.47 1",
    "M 0 1 M 0 1 C 12.6 3.52 13.91 0.37 37 0 M 0 1 C 11.88 -0.46 23.47 1.18 37 0 M 37 0 C 51.76 -3.63 67.87 -1.98 104 1 M 37 0 C 54.18 0.34 73.89 1.46 104 1 M 104 1 C 124.29 3.26 143.59 1.12 149.47 1 M 104 1 C 121 0.81 140.08 -0.71 149.47 1"],
    ["M 0 2 L 48 0 L 92 3 L 149.47 2",
    "M 0 2 M 0 2 C 19.05 7.45 15.52 1.16 48 0 M 0 2 C 15.73 -1.09 30.91 2.18 48 0 M 48 0 C 58.79 -6.78 72.27 -3.26 92 3 M 48 0 C 57.11 0.3 71.31 2.82 92 3 M 92 3 C 119.5 7.53 144.99 2.87 149.47 2 M 92 3 C 113.29 2.33 138.73 -1.1 149.47 2"],
    ["M 0 0 L 59 2 L 149.47 0",
    "M 0 0 M 0 0 C 15.89 2.06 26.14 1.08 59 2 M 0 0 C 18.42 -0.05 36.67 1.54 59 2 M 59 2 C 78.24 -0.41 98.16 -0.1 149.47 0 M 59 2 C 83.57 1.64 109.38 1.5 149.47 0"]
]
const drawPath = (line, index) => {
    const random_path = Math.floor(Math.random() * svg_paths.length);
    // iterate thrugh svg_paths with index and create a path for each
    const elements = [];
    svg_paths[random_path].forEach((path, i) => {
        const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svgPath.setAttribute('d', path);
        svgPath.setAttribute('fill', "none");
        svgPath.setAttribute('stroke', "black");
        svgPath.setAttribute('stroke-width', '4');
        svgPath.setAttribute('stroke-linecap', 'round');
        svgPath.setAttribute('stroke-linejoin', 'round');
        svgPath.setAttribute('class', "bond");
        svgPath.setAttribute('id', "bond"+index+"_"+i);
        elements.push(svgPath);
    });
    return elements;
};


const drawSingleBond = (line, index) => {
    const svgLine = drawPath(line, index)[0];
    svgLine.setAttribute('transform', getRotationAndTranslation(line));
    return [ svgLine ];
    };


const drawDoubleBond = (line, index) => {
    const svgLine1 = drawPath(line, index+"_0")[0];
    svgLine1.setAttribute('transform', calculateOrthogonalTransformation(line, 10)+getRotationAndTranslation(line));
    const svgLine2 = drawPath(line, index+"_1")[0];
    svgLine2.setAttribute('transform',  calculateOrthogonalTransformation(line, -10)+getRotationAndTranslation(line));
    return [ svgLine1, svgLine2 ];
};

const drawTripleBond = (line, index) => {
    const svgLine1 = drawPath(line, index+"_0")[0];
    svgLine1.setAttribute('transform', calculateOrthogonalTransformation(line, 20)+getRotationAndTranslation(line));
    const svgLine2 = drawPath(line, index+"_1")[0];
    svgLine2.setAttribute('transform', getRotationAndTranslation(line));
    const svgLine3 = drawPath(line, index+"_2")[0];
    svgLine3.setAttribute('transform', calculateOrthogonalTransformation(line, -20)+getRotationAndTranslation(line));
    return [ svgLine1, svgLine2, svgLine3 ];
};

export { drawSingleBond, drawDoubleBond, drawTripleBond }