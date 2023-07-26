# Vue.js Frontend for Molecular 2D Structure Visualization

This Vue.js frontend is part of a project that provides a web-based tool for visualizing the 2D structure of molecules based on SMILES strings. Users can enter a SMILES string, and the frontend sends an API POST request to the Django backend to calculate the 2D coordinates of the molecule using RDKit. The frontend then renders the molecular structure using various templates.

## Prerequisites

Before running the frontend, make sure you have the following installed:

- Node.js (v14 or later)
- npm (Node Package Manager)

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project's root directory.

    ```bash
    cd path/to/vue-frontend/
    ```

3. Install the required npm packages.

    ```bash
    npm install
    ```

## Configuration

Open the `.env` file and ensure that the `VITE_APP_BACKEND_API` variable is set to the correct URL where the Django backend is running. This URL will be used for sending API requests to the backend.

```
VITE_APP_BACKEND_API='http://your-django-backend-url/'
```

## Running the Development Server

To start the development server and run the frontend locally, use the following command:

```bash
npm run serve
```

The frontend will now be running at `http://localhost:5173/`.

## Build for Production

To build the frontend for production, use the following command:

```bash
npm run build
```

## Adding New Templates

The frontend supports multiple templates for rendering the 2D molecular structures. To add a new template:

1. Create a new Vue component for your template in the `src/assets/draw_templates` directory.
2. Add the new template to the `draw_templates` array in the `src/components/MoleculeSVG.vue` file.

    ```javascript
    import { new_drawSingleBond, new_drawDoubleBond, new_drawTripleBond } from '../assets/draw_templates/new/drawBond.js';
    import { new_drawAtom } from '../assets/draw_templates/new/drawAtom.js';

    [...]

    const load_template = () => {
    [...]
      else if (selectTemplate.value === 'new') {
        drawSingleBond = new_drawSingleBond;
        drawDoubleBond = new_drawDoubleBond;
        drawTripleBond = new_drawTripleBond;
        drawAtom = new_drawAtom;
    ```
3. Add the new template to the `config` array in the `src/assets/draw_templates/config.json` file.

    ```json
    {
      [...]
      "new":
      {
        "atoms" : "new/atoms.js",
        "bonds": "new/bonds.js"
      }
    }
    ```

## Dependencies

The frontend utilizes the following main dependencies:

- Vue.js: JavaScript framework for building user interfaces.
- Axios: HTTP client for making API requests to the Django backend.

## Contributing

Contributions to this project are welcome. If you find any issues or want to suggest improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).