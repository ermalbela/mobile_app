import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

// Simple star path
const StarIcon = ({ size = 20, fill , stroke = "gray" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.4 8.168L12 18.896l-7.334 3.864 1.4-8.168L.132 9.21l8.2-1.192L12 .587z"
      fill={fill}
      stroke={stroke}
      strokeWidth={1}
    />
  </Svg>
);

const FractionalStar = ({ fillPercent }) => {
  return (
    <View style={{ width: 20, height: 20, position: "relative" }}>
      {/* Gray star background */}
      <StarIcon size={20} stroke="gray" fill="none" />

      {/* Gold overlay */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${fillPercent}%`, // percent of star filled
          height: 20,
          overflow: "hidden",
        }}
      >
        <StarIcon size={20} stroke="gold" fill="gold" />
      </View>
    </View>
  );
};

export default FractionalStar;
