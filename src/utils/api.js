export const getCoordinates = async (smilesString) => {
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