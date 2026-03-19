import React from "react";
import { ClipLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className="flex justify-center mt-4">
      <ClipLoader color="#6366f1" />
    </div>
  );
}