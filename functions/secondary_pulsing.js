/**
 * SECONDARY PULSING
 */

export const secondaryInactiveNeuronsAndConnections = (networkData) => {
  const newNeurons = networkData.neurons.map((neuron) => {
    return {
      ...neuron,
      secondaryPulsing: false,
    };
  });

  const newConnections = networkData.connections.map((connection) => {
    return {
      ...connection,
      secondaryPulsing: false,
    };
  });

  return { neurons: newNeurons, connections: newConnections };
};

export const secondaryPulseNeuronsAndConnections = (networkData, layerNum) => {
  const newNeurons = networkData.neurons.map((neuron) => {
    const newSecondaryPulsing = layerNum == neuron.layer;
    return {
      ...neuron,
      secondaryPulsing: newSecondaryPulsing,
    };
  });

  const newConnections = networkData.connections.map((connection) => {
    const newSecondaryPulsing = layerNum == connection.layer;
    return {
      ...connection,
      secondaryPulsing: newSecondaryPulsing,
    };
  });

  return { neurons: newNeurons, connections: newConnections };
};
