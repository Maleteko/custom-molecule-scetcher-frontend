
<template>
  <div class="center">
    <div class="input-group mb-3">
    <input type="text" class="form-control" placeholder="Insert SMILES string" aria-label="SMILES string" aria-describedby="basic-addon2" v-model="smilesString">
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button" @click="drawMolecules">Button</button>
      </div>
    </div>
    <div>
      <svg ref="canvas" :viewBox="viewBox" width="500" height="500"></svg>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import atom_colors from '../assets/atom_colors.json';

export default {
  setup() {
    const smilesString = ref('');
    const canvas = ref(null);
    const viewBox = ref('');

    const getCoordinates = async () => {
      let response;
      try {
        response = await axios.post('http://localhost:8000/coordinates/',
          { smiles: smilesString.value },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

      } catch (error) {
        // Handle any errors
        console.error(error);
      }
      return response;
    };

    const generateSVG = (coordinates) => {
      console.log(coordinates);
      // Clear the SVG
      while (canvas.value.firstChild) {
        canvas.value.firstChild.remove();
      }

      let minX = Number.POSITIVE_INFINITY;
      let minY = Number.POSITIVE_INFINITY;
      let maxX = Number.NEGATIVE_INFINITY;
      let maxY = Number.NEGATIVE_INFINITY;
     
      // Draw a line for each bond
      coordinates["bonds"].forEach((bond, index) => {
        const atoms = coordinates["atoms"]
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', atoms[bond["atom1"]]["x"]);
        line.setAttribute('y1', atoms[bond["atom1"]]["y"]);
        line.setAttribute('x2', atoms[bond["atom2"]]["x"]);
        line.setAttribute('y2', atoms[bond["atom2"]]["y"]);
        line.setAttribute('stroke', 'black');
        line.setAttribute('stroke-width', '0.1');
        line.setAttribute('class', "bond");
        line.setAttribute('id', "bond"+index);
        canvas.value.appendChild(line);
      });


      // Draw a circle for each atom
      coordinates["atoms"].forEach((atom, index) => {

        minX = Math.min(minX, atom["x"] - 0.5);
        minY = Math.min(minY, atom["y"] - 0.5);
        maxX = Math.max(maxX, atom["x"] + 0.5);
        maxY = Math.max(maxY, atom["y"] + 0.5);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', atom["x"]);
        circle.setAttribute('cy', atom["y"]);
        circle.setAttribute('r', '0.3');
        circle.setAttribute('fill', atom_colors[atom["element"]]);
        circle.setAttribute('stroke', 'black');
        circle.setAttribute('stroke-width', '0.05');
        circle.setAttribute('class', "atom");
        circle.setAttribute('id', "atom"+index);
        canvas.value.appendChild(circle);
      });
      viewBox.value = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
    };

    const drawMolecules = async () => {
      const coordinates = await getCoordinates();
      generateSVG(coordinates["data"]);
    };

    return {
      smilesString,
      drawMolecules,
      canvas,
      viewBox
    };
  }
}
</script>

<style scoped>
</style>