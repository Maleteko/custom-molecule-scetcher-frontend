
<template>
  <div class="center">
    <select class="form-select" aria-label="Default select example" v-model="selectTemplate">
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
    <div class="input-group mb-3">
    <input type="text" class="form-control" placeholder="Insert SMILES string" aria-label="SMILES string" aria-describedby="basic-addon2" v-model="smilesString">
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button" @click="drawMolecules">Button</button>
      </div>
    </div>
    <div class="SVGcontainer" ref="SVGcontainerRef">
      <svg ref="canvas" :viewBox="viewBox" :width="svgWidth" height="500"></svg>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, watchEffect, nextTick } from 'vue';
import colors from '../assets/draw_templates/default/colors.json';
import draw_templates from '../assets/draw_templates/config.json';
import { Line } from "../utils/svg";
import { drawSingleBond, drawDoubleBond, drawTripleBond } from "../assets/draw_templates/default/bonds";
import { drawAtom } from "../assets/draw_templates/default/atoms";

export default {
  setup() {
    const smilesString = ref('');
    const canvas = ref(null);
    const viewBox = ref('');
    const selectTemplate = ref('');
    const options = ref([]);
    const SVGcontainerRef = ref(null);
    const svgWidth = ref(250);

    const fillSelectBox = () => {
      options.value = Object.keys(draw_templates).map((template) => {
        return {
          label: template,
          value: template
        };
      });
    };

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

      const atoms = coordinates["atoms"];

      coordinates["bonds"].forEach((bond, index) => {
        const startPoint = {'x': atoms[bond["atom1"]]["x"], 'y': atoms[bond["atom1"]]["y"]};
        const endPoint = {'x': atoms[bond["atom2"]]["x"], 'y': atoms[bond["atom2"]]["y"]};
        const line = new Line(startPoint, endPoint)
        let svgBonds;
        switch (bond["order"]) {
          case 1:
            svgBonds = drawSingleBond(line, index);
            break;
          case 2:
            svgBonds = drawDoubleBond(line, index);
            break;
          case 3:
            svgBonds = drawTripleBond(line, index);
            break;
        }
        svgBonds.forEach((svgBond) => {
          canvas.value.appendChild(svgBond);
        });
      });

      coordinates["atoms"].forEach((atom, index) => {
        minX = Math.min(minX, atom["x"] - 0.5);
        minY = Math.min(minY, atom["y"] - 0.5);
        maxX = Math.max(maxX, atom["x"] + 0.5);
        maxY = Math.max(maxY, atom["y"] + 0.5);

        const svgAtoms = drawAtom(atom, index);
        svgAtoms.forEach((svgAtom) =>{
          canvas.value.appendChild(svgAtom);
        });
      });
      viewBox.value = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
    };

    const drawMolecules = async () => {
      const coordinates = await getCoordinates();
      generateSVG(coordinates["data"]);
    };

    fillSelectBox();

    return {
      smilesString,
      drawMolecules,
      canvas,
      viewBox,
      selectTemplate,
      options,
      SVGcontainerRef,
      svgWidth
    };
  }
}
</script>

<style scoped>
</style>