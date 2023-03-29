import { useState, useEffect, useRef } from "react";

const Neuron = ({
  position,
  inactive,
  pulsing,
  tempPulsing,
  tempPulse,
  secondaryPulsing,
  age,
  tempAge,
}) => {
  const [x, y] = position;
  let fillColor = "#454545";
  if (pulsing && inactive) {
    fillColor = "#521212";
  } else if (tempPulse && tempPulsing) {
    fillColor = "#FFFFFF";
  } else if (tempPulsing) {
    fillColor = "#521212";
  } else if (pulsing) {
    fillColor = "#FFFFFF";
  } else if (secondaryPulsing) {
    fillColor = "#B2B2B2";
  } else if (tempAge > 0) {
    fillColor = "#521212";
  } else if (age > 0) {
    fillColor = "#521212";
  }
  return <circle cx={x} cy={y} r={1.5} fill={fillColor} />;
};

const Connection = ({
  startPosition,
  endPosition,
  inactive,
  pulsing,
  tempPulsing,
  tempPulse,
  secondaryPulsing,
  age,
  tempAge,
}) => {
  const [x1, y1] = startPosition;
  const [x2, y2] = endPosition;
  let strokeColor = "#454545";
  if (pulsing && inactive) {
    strokeColor = "#521212";
  } else if (tempPulse && tempPulsing) {
    strokeColor = "#FFFFFF";
  } else if (tempPulsing) {
    strokeColor = "#521212";
  } else if (pulsing) {
    strokeColor = "#FFFFFF";
  } else if (secondaryPulsing) {
    strokeColor = "#B2B2B2";
  } else if (tempAge > 0) {
    strokeColor = "#521212";
  } else if (age > 0) {
    strokeColor = "#521212";
  }
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={strokeColor}
      strokeWidth={0.25}
    />
  );
};

/**
 * ACTIVATION
 */

const activateNeuronsAndConnections = (networkData, isActive) => {};

/**
 * SECONDARY PULSING
 */

const secondaryInactiveNeuronsAndConnections = (networkData) => {
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

const secondaryPulseNeuronsAndConnections = (networkData, layerNum) => {
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

/**
 * MAIN PULSING
 */

const inactiveNeuronsAndConnections = (networkData) => {
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

const pulseNeuronsAndConnections = (networkData, layerNum) => {
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

const exploreNeuronsAndConnections = (
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

const euclideanDistance = (position1, position2) => {
  const [x1, y1] = position1;
  const [x2, y2] = position2;
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

const generateFakeData = (numNeurons, maxConnectionDistance) => {
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

const Home = () => {
  const [networkData, setNetworkData] = useState({
    neurons: [],
    connections: [],
  });

  // Activation

  // Secondary pulsing

  const [secondaryInactiveInterval, setSecondaryInactiveInterval] = useState(0);
  const [secondaryTempLayerNum, setSecondaryTempLayerNum] = useState(
    Math.max(...networkData.neurons.map((neuron) => neuron.layer))
  );
  const secondaryInactiveIntervalRef = useRef(secondaryInactiveInterval);
  const secondaryTempLayerNumRef = useRef(secondaryTempLayerNum);

  useEffect(() => {
    secondaryInactiveIntervalRef.current = secondaryInactiveInterval;
  }, [secondaryInactiveInterval]);

  useEffect(() => {
    secondaryTempLayerNumRef.current = secondaryTempLayerNum;
  }, [secondaryTempLayerNum]);

  // Main pulsing
  const [tempLayerNum, setTempLayerNum] = useState(
    Math.max(...networkData.neurons.map((neuron) => neuron.layer))
  );
  const [inactiveInterval, setInactiveInterval] = useState(0);
  const [isInactive, setIsInactive] = useState(false);
  const tempLayerNumRef = useRef(tempLayerNum);
  const inactiveIntervalRef = useRef(inactiveInterval);
  const isInactiveRef = useRef(isInactive);

  useEffect(() => {
    tempLayerNumRef.current = tempLayerNum;
  }, [tempLayerNum]);

  useEffect(() => {
    inactiveIntervalRef.current = inactiveInterval;
  }, [inactiveInterval]);

  useEffect(() => {
    isInactiveRef.current = isInactive;
  }, [isInactive]);

  useEffect(() => {
    const fakeData = generateFakeData(1000, 100);
    setNetworkData(fakeData);

    const interval = setInterval(() => {
      if (inactiveIntervalRef.current <= 0) {
        setIsInactive(false);
      }
      setNetworkData((currentNetworkData) => {
        if (isInactiveRef.current && inactiveIntervalRef.current > 0) {
          return inactiveNeuronsAndConnections(currentNetworkData);
        } else {
          if (tempLayerNumRef.current >= 0) {
            setTempLayerNum((currentLayerNum) => currentLayerNum - 1);
            return pulseNeuronsAndConnections(
              currentNetworkData,
              tempLayerNumRef.current
            );
          } else {
            const updatedNetworkData = exploreNeuronsAndConnections(
              currentNetworkData,
              50,
              1,
              10
            );

            // Update tempLayerNum based on the updated network data
            const maxLayer = Math.max(
              ...updatedNetworkData.neurons.map((neuron) => neuron.layer)
            );

            setTempLayerNum(maxLayer);

            // Start inactive period
            setInactiveInterval(20);
            setIsInactive(true);

            return updatedNetworkData;
          }
        }
      });
      if (isInactiveRef.current && inactiveIntervalRef.current > 0) {
        setInactiveInterval(
          (currentInactiveInterval) => currentInactiveInterval - 1
        );
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <svg width="100vw" height="100vh" style={{ backgroundColor: "#070a0b" }}>
        {networkData.connections.map((connection, index) => (
          <Connection
            key={`connection-${index}`}
            startPosition={connection.startPosition}
            endPosition={connection.endPosition}
            inactive={connection.inactive}
            pulsing={connection.pulsing}
            tempPulsing={connection.tempPulsing}
            tempPulse={connection.tempPulse}
            secondaryPulsing={connection.secondaryPulsing}
            age={connection.age}
            tempAge={connection.tempAge}
            layer={connection.layer}
          />
        ))}
        {networkData.neurons.map((neuron, index) => (
          <Neuron
            key={`neuron-${index}`}
            position={neuron.position}
            inactive={neuron.inactive}
            pulsing={neuron.pulsing}
            tempPulsing={neuron.tempPulsing}
            tempPulse={neuron.tempPulse}
            secondaryPulsing={neuron.secondaryPulsing}
            age={neuron.age}
            tempAge={neuron.tempAge}
            layer={neuron.layer}
          />
        ))}
      </svg>
    </>
  );
};

export default Home;

