"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  operators = [],
  shifts = [],
  days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  onAssignOperator = () => {},
  onRemoveOperator = () => {},
  onDeleteOperator = () => {},
  operatorColors = {},
  className = ""
}) {
  const [draggedOperator, setDraggedOperator] = React.useState(null);
  const [hoveredCell, setHoveredCell] = React.useState(null);

  const handleDragStart = (e, operator) => {
    setDraggedOperator(operator);
  };

  const handleDragOver = (e, day, shift) => {
    e.preventDefault();
    setHoveredCell({ day, shift });
  };

  const handleDragLeave = () => {
    setHoveredCell(null);
  };

  const handleDrop = (e, day, shift) => {
    e.preventDefault();
    if (draggedOperator) {
      onAssignOperator(draggedOperator, day, shift);
      setDraggedOperator(null);
      setHoveredCell(null);
    }
  };

  const getAssignedOperators = (day, shift) => {
    return shifts
      .find(s => s.name === shift)
      ?.assignments?.[day] || [];
  };

  const handleRemoveOperator = (operator, day, shift) => {
    onRemoveOperator(operator, day, shift);
  };

  const getOperatorColor = (operator) => {
    return operatorColors[operator] || "#67e8f9";
  };

  return (
    <div className={`bg-[#121214] text-white p-4 rounded-lg ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b border-[#2A2A2A] text-left"></th>
              {days.map((day, index) => (
                <th key={index} className="p-2 border-b border-[#2A2A2A] text-left">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift, shiftIndex) => (
              <tr key={shiftIndex}>
                <td className="p-2 border-b border-[#2A2A2A] font-medium">
                  {shift.name}
                </td>
                {days.map((day, dayIndex) => {
                  const isHovered = hoveredCell && hoveredCell.day === day && hoveredCell.shift === shift.name;
                  const assignedOperators = getAssignedOperators(day, shift.name);
                  
                  return (
                    <td 
                      key={dayIndex}
                      className={`p-2 border-b border-[#2A2A2A] min-w-[150px] h-[80px] align-top ${
                        isHovered ? "bg-[#2A2A2A]" : ""
                      }`}
                      onDragOver={(e) => handleDragOver(e, day, shift.name)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, day, shift.name)}
                    >
                      <div className="flex flex-wrap gap-1">
                        {assignedOperators.map((operator, opIndex) => (
                          <div 
                            key={opIndex}
                            className="bg-[#2A2A2A] text-white text-xs rounded-full px-2 py-1 flex items-center"
                          >
                            <div 
                              className="w-3 h-3 rounded-full mr-1 flex-shrink-0"
                              style={{ backgroundColor: getOperatorColor(operator) }}
                            ></div>
                            <span className="mr-1 truncate max-w-[80px]">{operator}</span>
                            <button
                              onClick={() => handleRemoveOperator(operator, day, shift.name)}
                              className="text-gray-400 hover:text-white"
                            >
                              <i className="fas fa-times text-[10px]"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <BinBinOperatorPanel
          operators={operators}
          onDragStart={handleDragStart}
          onDelete={onDeleteOperator}
          colorMap={operatorColors}
          title="Operators"
        />
      </div>
    </div>
  );
}

  const [operators, setOperators] = React.useState([
    "John Doe",
    "Jane Smith",
    "Mark Johnson",
    "Emily Wilson",
    "Michael Brown",
    "Sarah Davis"
  ]);

  const [shifts, setShifts] = React.useState([
    {
      name: "Morning",
      assignments: {
        "Monday": ["John Doe", "Jane Smith"],
        "Tuesday": ["Mark Johnson"],
        "Wednesday": ["Emily Wilson"],
        "Thursday": ["Michael Brown"],
        "Friday": ["Sarah Davis"],
        "Saturday": [],
        "Sunday": []
      }
    },
    {
      name: "Afternoon",
      assignments: {
        "Monday": ["Mark Johnson"],
        "Tuesday": ["Emily Wilson"],
        "Wednesday": ["Michael Brown"],
        "Thursday": ["Sarah Davis"],
        "Friday": ["John Doe"],
        "Saturday": ["Jane Smith"],
        "Sunday": []
      }
    },
    {
      name: "Evening",
      assignments: {
        "Monday": ["Emily Wilson"],
        "Tuesday": ["Michael Brown"],
        "Wednesday": ["Sarah Davis"],
        "Thursday": ["John Doe"],
        "Friday": ["Jane Smith"],
        "Saturday": ["Mark Johnson"],
        "Sunday": ["Emily Wilson"]
      }
    }
  ]);

  const operatorColors = {
    "John Doe": "#ff9966",
    "Jane Smith": "#4a9eff",
    "Mark Johnson": "#10b981",
    "Emily Wilson": "#8b5cf6",
    "Michael Brown": "#f43f5e",
    "Sarah Davis": "#fbbf24"
  };

  const handleAssignOperator = (operator, day, shiftName) => {
    setShifts(prevShifts => {
      return prevShifts.map(shift => {
        if (shift.name === shiftName) {
          const currentAssignments = shift.assignments[day] || [];
          if (!currentAssignments.includes(operator)) {
            return {
              ...shift,
              assignments: {
                ...shift.assignments,
                [day]: [...currentAssignments, operator]
              }
            };
          }
        }
        return shift;
      });
    });
  };

  const handleRemoveOperator = (operator, day, shiftName) => {
    setShifts(prevShifts => {
      return prevShifts.map(shift => {
        if (shift.name === shiftName) {
          return {
            ...shift,
            assignments: {
              ...shift.assignments,
              [day]: (shift.assignments[day] || []).filter(op => op !== operator)
            }
          };
        }
        return shift;
      });
    });
  };

  const handleDeleteOperator = (operator) => {
    setOperators(prevOperators => prevOperators.filter(op => op !== operator));
    
    setShifts(prevShifts => {
      return prevShifts.map(shift => {
        const newAssignments = {};
        Object.keys(shift.assignments).forEach(day => {
          newAssignments[day] = shift.assignments[day].filter(op => op !== operator);
        });
        
        return {
          ...shift,
          assignments: newAssignments
        };
      });
    });
  };

  return (
    <div className="p-6 bg-[#121214] min-h-screen font-roboto">
      <h2 className="text-white text-xl mb-6">BinBin with Modern Operator Panel</h2>
      
      <MainComponent 
        operators={operators}
        shifts={shifts}
        onAssignOperator={handleAssignOperator}
        onRemoveOperator={handleRemoveOperator}
        onDeleteOperator={handleDeleteOperator}
        operatorColors={operatorColors}
      />
      
      <div className="mt-8 p-4 bg-[#1D1D1F] rounded-lg">
        <h3 className="text-white text-lg mb-4">Component Usage</h3>
        <p className="text-gray-300 mb-2">
          Drag operators from the panel at the bottom to assign them to shifts.
        </p>
        <p className="text-gray-300 mb-2">
          Click the X on an operator to remove them from a shift.
        </p>
        <p className="text-gray-300">
          Click the X on an operator in the panel to delete them completely.
        </p>
      </div>
    </div>
  );
});
}