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
  let fillColor = "#2F2F2F";
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
  return <circle cx={x} cy={y} r={1} fill={fillColor} />;
};

export default Neuron;
