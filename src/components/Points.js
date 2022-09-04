import React from "react";
import CheckIcon from "@mui/icons-material/Check";

function points({ title, subtitle }) {
  return (
    <div className="list-item">
      <div className="check">
        <CheckIcon style={{ fontSize: 40, color: "#fff" }} />
      </div>
      <div className="text">
        <h1>{title}</h1>
        {subtitle}
      </div>
    </div>
  );
}

export default points;
