import colors from "./colors.json";

export const default_drawAtom = (atom, index) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', atom["x"]);
    circle.setAttribute('cy', atom["y"]);
    circle.setAttribute('r', '50');
    circle.setAttribute('fill', colors[atom["element"]]);
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('stroke-width', '5');
    circle.setAttribute('class', "atom");
    circle.setAttribute('id', "atom"+index);
    return [ circle ];
};