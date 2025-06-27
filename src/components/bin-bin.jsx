"use client";
import React from "react";

export default function BinBin({ operators, scheduleData }) {
  return (
    <div className="bin-bin-container">
      {scheduleData.map((day) => (
        <div key={`${day.date}-${day.day}`} className="day-card">
          <h3>{day.date} ({day.day})</h3>
          {day.shifts.map((shift) => (
            <div key={shift.time} className="shift">
              <h4>{shift.time}</h4>
              <div className="operators">
                {Object.entries(shift.operators).map(([vehicle, operator]) => (
                  <div key={vehicle} className="operator-assignment">
                    <span className="vehicle">{vehicle}</span>
                    <span className="operator">{operator || "Unassigned"}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
