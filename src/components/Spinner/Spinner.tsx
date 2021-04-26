import React from "react";
import "./Spinner.css";
import Image from "../../resources/small_logo.png";

const Spinner = () => {
  return (
    <div className="speed2">
      <div className="speed">
        <div className="spinner">
          <img src={Image} />
        </div>{" "}
      </div>
    </div>
  );
};

export default Spinner;
