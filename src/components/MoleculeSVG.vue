<template>
  <div class="center">
    <select class="form-select" aria-label="Default select example" v-model="selectTemplate" @change="load_template">
      <option v-for="option in draw_options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
    <div class="input-group pad">
      <input type="text" @keyup.enter="drawMolecules" class="form-control" laceholder="Insert SMILES string" aria-label="SMILES string" aria-describedby="basic-addon2" v-model="smilesString">
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button" @click="drawMolecules">Draw</button>
        <button class="btn btn-outline-secondary" type="button" @click="downloadSVG">Download SVG</button>
      </div>
    </div>
    <div v-if="show_error" class="alert alert-danger" role="alert">
      {{ error_message }}
    </div>
    <button type="button" class="btn btn-primary" @click="drawTestMolecule" hidden>Draw test molecule</button>
    <div class="SVGcontainer">
      <svg ref="canvas" :viewBox="viewBox"></svg>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import draw_templates from '../assets/draw_templates/config.json';
import { Line } from "../utils/svg";

import { drawio_drawSingleBond, drawio_drawDoubleBond, drawio_drawTripleBond } from "../assets/draw_templates/drawio/bonds";
import { drawio_drawAtom } from "../assets/draw_templates/drawio/atoms";

import { default_drawSingleBond, default_drawDoubleBond, default_drawTripleBond } from "../assets/draw_templates/default/bonds";
import { default_drawAtom } from "../assets/draw_templates/default/atoms";
import smiles_examples from "../assets/example_smiles.json";

export default {
  setup() {
    const smilesString = ref('');
    const canvas = ref(null);
    const viewBox = ref('-100 -100 200 200');
    const selectTemplate = ref('default');
    const draw_options = ref([]);
    const show_error = ref(false);
    const error_message = ref('');

    const apiAddress = import.meta.env.VITE_APP_BACKEND_API;

    let drawSingleBond = default_drawSingleBond;
    let drawDoubleBond = default_drawDoubleBond;
    let drawTripleBond = default_drawTripleBond;
    let drawAtom = default_drawAtom;

    smilesString.val   = ref('CCO');

    // funtion to show error_banner and error_message when error occurs. The error banner dissapears after 5 secondsy
    const showError = (message) => {
      error_message.value = message;
      show_error.value = true;
      setTimeout(() => {
        show_error.value = false;
        error_message.value = '';
      }, 5000);
    };

    const load_template = () => {
      if (selectTemplate.value === 'default') {
        drawSingleBond = default_drawSingleBond;
        drawDoubleBond = default_drawDoubleBond;
        drawTripleBond = default_drawTripleBond;
        drawAtom = default_drawAtom;
      } else if (selectTemplate.value === 'drawio') {
        drawSingleBond = drawio_drawSingleBond;
        drawDoubleBond = drawio_drawDoubleBond;
        drawTripleBond = drawio_drawTripleBond;
        drawAtom = drawio_drawAtom;
      }
      drawMolecules();
    };

    const fillSelectBox = () => {
      draw_options.value = Object.keys(draw_templates).map((template) => {
        return {
          label: template,
          value: template
        };
      });
    };

    const getCoordinates = async () => {
      let response;
      try {
        response = await axios.post(apiAddress + '/coordinates/',
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
      if ("error" in response.data) {
        showError(response.data["error"]);
      }
      return response;
    };

    const generateSVG = (coordinates) => {
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
        minX = Math.min(minX, atom["x"] - 60);
        minY = Math.min(minY, atom["y"] - 60);
        maxX = Math.max(maxX, atom["x"] + 60);
        maxY = Math.max(maxY, atom["y"] + 60);

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

    const drawTestMolecule = () => {
      const smiles = smiles_examples[Math.floor(Math.random() * smiles_examples.length)];
      smilesString.value = smiles;      
      drawMolecules();
    };

    const downloadSVG = () => {
      const svgData = new XMLSerializer().serializeToString(canvas.value);
      const svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = "molecule.svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    drawTestMolecule();
    fillSelectBox();

    return {
      smilesString,
      drawMolecules,
      drawTestMolecule,
      canvas,
      viewBox,
      selectTemplate,
      load_template,
      draw_options,
      downloadSVG,
      show_error,
      error_message
    };
  }
}
</script>

<style scoped>

.pad {
  padding: 5px;
}

</style>