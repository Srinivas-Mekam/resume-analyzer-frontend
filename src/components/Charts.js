import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ATSGauge({ score }) {
  return (
    <div style={{ width: 150 }}>
      <CircularProgressbar
        value={score}
        text={`${score}%`}
        styles={buildStyles({
          pathColor: "#22c55e",
          textColor: "#000"
        })}
      />
    </div>
  );
}