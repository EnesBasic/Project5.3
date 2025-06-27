#!/bin/bash

# 1. Ensure all components have proper content
cat > src/components/bin-bin.jsx << 'EOL'
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
EOL

# 2. Update MainComponent with absolute imports
cat > src/components/schedule/MainComponent.jsx << 'EOL'
'use client';
import CalHeader from '@/components/cal-header.jsx';
import BinBin from '@/components/bin-bin.jsx';
import CalFooter from '@/components/cal-footer.jsx';

export default function MainComponent(props) {
  if (props.error) return <div className="error">{props.error}</div>;
  if (props.isLoading) return <div>Loading...</div>;

  return (
    <div className="schedule-app">
      <CalHeader {...props} />
      <BinBin 
        operators={props.initialOperators} 
        scheduleData={props.initialData} 
      />
      <CalFooter />
    </div>
  );
}
EOL

# 3. Clear Next.js cache
rm -rf .next
npm run build
npm run start