import { useState, useEffect, useRef } from "react";

import dynamic from "next/dynamic";

import Neuron from "../components/Neuron";
import Connection from "../components/Connection";

import {
  secondaryInactiveNeuronsAndConnections,
  secondaryPulseNeuronsAndConnections,
} from "../functions/secondary_pulsing";

import {
  inactiveNeuronsAndConnections,
  pulseNeuronsAndConnections,
  exploreNeuronsAndConnections,
} from "../functions/main_pulsing";

import {
  euclideanDistance,
  generateFakeData,
} from "../functions/main_functions";

const DynamicScreenRecorder = dynamic(
  () => import("../components/ScreenRecorder"),
  { ssr: false }
);

/**
 * ACTIVATION
 */

const activateNeuronsAndConnections = (networkData, isActive) => {
  // Activate randomly...
};

const Home = () => {
  const [networkData, setNetworkData] = useState({
    neurons: [],
    connections: [],
  });

  // Activation

  // Secondary pulsing

  // const [secondaryInactiveInterval, setSecondaryInactiveInterval] = useState(0);
  // const [secondaryTempLayerNum, setSecondaryTempLayerNum] = useState(
  //   Math.max(...networkData.neurons.map((neuron) => neuron.layer))
  // );
  // const secondaryInactiveIntervalRef = useRef(secondaryInactiveInterval);
  // const secondaryTempLayerNumRef = useRef(secondaryTempLayerNum);

  // useEffect(() => {
  //   secondaryInactiveIntervalRef.current = secondaryInactiveInterval;
  // }, [secondaryInactiveInterval]);

  // useEffect(() => {
  //   secondaryTempLayerNumRef.current = secondaryTempLayerNum;
  // }, [secondaryTempLayerNum]);

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
            setInactiveInterval(1);
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
      <DynamicScreenRecorder />
      <svg width="100vw" height="100vh">
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

