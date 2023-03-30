/**
 * MAIN PULSING
 */

export const inactiveNeuronsAndConnections = (networkData) => {
  const newNeurons = networkData.neurons.map((neuron) => {
    return {
      ...neuron,
      inactive: true,
    };
  });

  const newConnections = networkData.connections.map((connection) => {
    return {
      ...connection,
      inactive: true,
    };
  });

  return { neurons: newNeurons, connections: newConnections };
};

export const pulseNeuronsAndConnections = (networkData, layerNum) => {
  // the pulse will start at the source neurons and will pulse from there throughout the entire red area retracing its previous path

  const newNeurons = networkData.neurons.map((neuron) => {
    const newTempPulsing = neuron.pulsing || neuron.age > 0;
    const newTempPulse = layerNum == neuron.layer;
    return {
      ...neuron,
      inactive: false,
      tempPulsing: newTempPulsing,
      tempPulse: newTempPulse,
    };
  });

  const newConnections = networkData.connections.map((connection) => {
    const newTempPulsing = connection.pulsing || connection.age > 0;
    const newTempPulse = layerNum == connection.layer;
    return {
      ...connection,
      inactive: false,
      tempPulsing: newTempPulsing,
      tempPulse: newTempPulse,
    };
  });

  return { neurons: newNeurons, connections: newConnections };
};

export const exploreNeuronsAndConnections = (
  networkData,
  edgeDistanceThreshold,
  pulsingDuration,
  numSourceNeurons
) => {
  const newNeurons = networkData.neurons.map((neuron) => {
    const newAge = neuron.pulsing ? neuron.age + 1 : neuron.age;
    const pulsing = neuron.pulsing && neuron.age < pulsingDuration;
    const newLayer = neuron.age > 0 ? neuron.layer + 1 : neuron.layer;
    return {
      ...neuron,
      age: newAge,
      pulsing,
      tempPulsing: false,
      tempPulse: false,
      layer: newLayer,
    };
  });

  const newConnections = networkData.connections.map((connection) => {
    const sourceNeuron = networkData.neurons.find(
      (neuron) =>
        neuron.position[0] === connection.startPosition[0] &&
        neuron.position[1] === connection.startPosition[1]
    );

    if (sourceNeuron.pulsing && sourceNeuron.age === pulsingDuration) {
      const targetNeuronIndex = newNeurons.findIndex(
        (neuron) =>
          neuron.position[0] === connection.endPosition[0] &&
          neuron.position[1] === connection.endPosition[1]
      );

      if (targetNeuronIndex !== -1 && newNeurons[targetNeuronIndex].age === 0) {
        newNeurons[targetNeuronIndex] = {
          ...newNeurons[targetNeuronIndex],
          pulsing: true,
          tempPulsing: false,
          tempPulse: false,
          age: 1,
          layer: 0,
        };
      }

      return {
        ...connection,
        pulsing: true,
        tempPulsing: false,
        tempPulse: false,
        age: 1,
        layer: 0,
      };
    } else {
      const newAge = connection.pulsing ? connection.age + 1 : connection.age;
      const pulsing = connection.pulsing && connection.age < pulsingDuration;
      const newLayer =
        connection.age > 0 ? connection.layer + 1 : connection.layer;
      return {
        ...connection,
        age: newAge,
        pulsing,
        tempPulsing: false,
        tempPulse: false,
        layer: newLayer,
      };
    }
  });

  const edgeNeurons = networkData.neurons
    .map((neuron, index) => {
      const [x, y] = neuron.position;
      const isEdgeNeuron =
        x <= edgeDistanceThreshold ||
        y <= edgeDistanceThreshold ||
        x >= window.innerWidth - edgeDistanceThreshold ||
        y >= window.innerHeight - edgeDistanceThreshold;

      if (isEdgeNeuron) {
        return index;
      }
      return null;
    })
    .filter((index) => index !== null);

  const randomIndices = [];
  while (randomIndices.length < numSourceNeurons) {
    const randomIndex = Math.floor(Math.random() * edgeNeurons.length);
    if (!randomIndices.includes(randomIndex)) {
      randomIndices.push(randomIndex);
    }
  }

  randomIndices.forEach((randomIndex) => {
    const index = edgeNeurons[randomIndex];
    if (!newNeurons[index].pulsing && newNeurons[index].age === 0) {
      newNeurons[index] = {
        ...newNeurons[index],
        pulsing: true,
        tempPulsing: false,
        tempPulse: false,
        age: 1,
        layer: 0,
      };
    }
  });

  return { neurons: newNeurons, connections: newConnections };
};
