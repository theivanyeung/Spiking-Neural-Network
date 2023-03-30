/**
 * Main functions
 */

// Setting positions of neurons and connections using euclidean distance formula
export const euclideanDistance = (position1, position2) => {
  const [x1, y1] = position1;
  const [x2, y2] = position2;
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

// Generate fake data
export const generateFakeData = (numNeurons, maxConnectionDistance) => {
  const neurons = [];
  const connections = [];

  for (let i = 0; i < numNeurons; i++) {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const position = [x, y];
    neurons.push({
      position,
      inactive: false,
      pulsing: false,
      tempPulsing: false,
      tempPulse: false,
      secondaryPulsing: false,
      age: 0,
      tempAge: 0,
      layer: null,
    });

    if (i > 0) {
      for (let j = 0; j < i; j++) {
        const otherNeuron = neurons[j];
        if (
          euclideanDistance(position, otherNeuron.position) <=
          maxConnectionDistance
        ) {
          connections.push({
            startPosition: otherNeuron.position,
            endPosition: position,
            inactive: false,
            pulsing: false,
            tempPulsing: false,
            tempPulse: false,
            secondaryPulsing: false,
            age: 0,
            tempAge: 0,
            layer: null,
          });
        }
      }
    }
  }

  return { neurons, connections };
};
