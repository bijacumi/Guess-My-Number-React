import React from "react";
import DigitsTable from "./DigitsTable";
import CluesTable from "./CluesTable";
import "./Tutorial.scss";

const Tutorial: React.FC = () => {

  return (
    <div className="tutorial-section">
      <div className="table-header">
        <span>Digits group</span>
        <span>Clues</span>
      </div>
      <div className="table-content">
        <DigitsTable />
        <CluesTable />
      </div>
    </div>
  );
};

export default Tutorial;
