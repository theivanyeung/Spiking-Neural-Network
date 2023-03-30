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
  let strokeColor = "#2F2F2F";
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
      strokeWidth={0.15}
    />
  );
};

export default Connection;
