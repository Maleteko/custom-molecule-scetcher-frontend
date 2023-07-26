
<template>
  <div class="center">
    <select class="form-select" aria-label="Default select example" v-model="selectTemplate">
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
    <div class="input-group">
      <input type="text" @keyup.enter="drawMolecules" class="form-control" laceholder="Insert SMILES string" aria-label="SMILES string" aria-describedby="basic-addon2" v-model="smilesString">
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button" @click="drawMolecules">Draw</button>
        <button class="btn btn-outline-secondary" type="button" @click="downloadSVG">Download SVG</button>
      </div>
    </div>
    <button type="button" class="btn btn-primary" @click="drawTestMolecule" hidden>Draw test molecule</button>
    <div class="SVGcontainer" ref="SVGcontainerRef">
      <svg ref="canvas" :viewBox="viewBox"></svg>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, watchEffect, nextTick } from 'vue';
import colors from '../assets/draw_templates/default/colors.json';
import draw_templates from '../assets/draw_templates/config.json';
import { Line } from "../utils/svg";
import { drawSingleBond, drawDoubleBond, drawTripleBond } from "../assets/draw_templates/custom/bonds";
import { drawAtom } from "../assets/draw_templates/custom/atoms";

export default {
  setup() {
    const smilesString = ref('COC1=CC(=C(C=C1CCN)OC)Br');
    const canvas = ref(null);
    const viewBox = ref('');
    const selectTemplate = ref('');
    const options = ref([]);
    const SVGcontainerRef = ref(null);

    const smiles_examples = [
      "CC(=O)OC1=CC=CC=C1C(=O)O",
      "CC1=C(C2=CC3=NC(=CC4=C(C(=C([N-]4)C=C5C(=C(C(=N5)C=C1[N-]2)C=C)C)C=C)C)C(=C3CCC(=O)[O-])C)CCC(=O)[O-]",
      "CCCCCC1=CC(=C2C3C=C(CCC3C(OC2=C1)(C)C)C)O",
      "CCN(CC)C(=O)C1CN(C2CC3=CC4=C(C2=C1)C=CC=C4N3)C",
      "CCN[C@H](C)CC1=CC2=C(C=C1)OCO2"
    ]

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

    drawMolecules();
    fillSelectBox();

    return {
      smilesString,
      drawMolecules,
      drawTestMolecule,
      canvas,
      viewBox,
      selectTemplate,
      options,
      SVGcontainerRef,
      downloadSVG
    };
  }
}
</script>

<style scoped>
</style>