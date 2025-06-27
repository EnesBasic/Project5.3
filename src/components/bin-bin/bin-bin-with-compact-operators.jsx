"use client";
import React from "react";



export default function Index() {
  return (function CompactOperatorPanel({
  operators,
  onAddOperator,
  onDeleteOperator,
  onDragStart,
  onCollapse,
  isCollapsed,
  operatorColors
}) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-[#1D1D1F] border-t border-[#2A2A2A] transition-all duration-300 ${
        isCollapsed ? "h-12" : "h-[180px]"
      }`}
    >
      <div className="flex justify-between items-center p-3 border-b border-[#2A2A2A]">
        <h2 className="text-white font-medium">Operators</h2>
        <div className="flex gap-2">
          <button
            className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white rounded-md px-3 py-1 text-sm"
            onClick={onAddOperator}
          >
            <i className="fas fa-plus mr-1"></i> Add
          </button>
          <button
            className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white rounded-md px-3 py-1 text-sm"
            onClick={onCollapse}
          >
            <i className={`fas fa-chevron-${isCollapsed ? "up" : "down"} mr-1`}></i>
            {isCollapsed ? "Expand" : "Collapse"}
          </button>
        </div>
      </div>

      <div
        className={`p-3 overflow-y-auto ${
          isCollapsed ? "hidden" : "block"
        } h-[132px]`}
      >
        <div className="flex flex-wrap gap-2">
          {operators.map((operator) => (
            <div
              key={operator}
              className="bg-[#2A2A2A] rounded-md px-3 py-2 flex items-center gap-2 cursor-move"
              draggable
              onDragStart={(e) => onDragStart(e, operator)}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: operatorColors[operator] || "#67e8f9",
                  color: getContrastTextColor(operatorColors[operator] || "#67e8f9"),
                }}
              >
                <i className="fas fa-user text-[10px]"></i>
              </div>
              <span className="text-white">{operator}</span>
              <button
                className="text-red-400 hover:text-red-300"
                onClick={() => onDeleteOperator(operator)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getContrastTextColor(bgColor) {
  if (!bgColor) return "#FFFFFF";
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

function MainComponent() {
  const [operators, setOperators] = React.useState([
    "Adis",
    "Munib",
    "Sanin",
    "Farik",
    "Harun",
    "Almedin",
    "Enes",
  ]);

  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [schedule, setSchedule] = React.useState({});
  const [selectedCell, setSelectedCell] = React.useState(null);
  const [draggedOperator, setDraggedOperator] = React.useState(null);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const shifts = ["Morning", "Afternoon", "Evening", "Night"];

  const operatorColors = {
    Adis: "#4a9eff",
    Munib: "#8b5cf6",
    Sanin: "#ef4444",
    Farik: "#22c55e",
    Harun: "#f59e0b",
    Almedin: "#ec4899",
    Enes: "#14b8a6",
  };

  const handleAddOperator = () => {
    const newOperator = prompt("Enter operator name:");
    if (newOperator && newOperator.trim() !== "") {
      setOperators([...operators, newOperator]);
    }
  };

  const handleDeleteOperator = (operatorToDelete) => {
    if (confirm(`Are you sure you want to remove ${operatorToDelete}?`)) {
      setOperators(
        operators.filter((operator) => operator !== operatorToDelete),
      );

      setSchedule((prev) => {
        const newSchedule = {};
        Object.keys(prev).forEach((key) => {
          newSchedule[key] = Array.isArray(prev[key])
            ? prev[key].filter((op) => op !== operatorToDelete)
            : prev[key];
        });
        return newSchedule;
      });
    }
  };

  const handleDragStart = (e, operator) => {
    setDraggedOperator(operator);
    e.dataTransfer.setData("text/plain", operator);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleDrop = (e, day, shift) => {
    e.preventDefault();
    const operator = e.dataTransfer.getData("text/plain");
    if (operator) {
      setSchedule((prev) => {
        const cellKey = `${day}-${shift}`;
        const currentOperators = prev[cellKey] || [];

        if (!Array.isArray(currentOperators)) {
          return {
            ...prev,
            [cellKey]: [operator],
          };
        }

        if (!currentOperators.includes(operator)) {
          return {
            ...prev,
            [cellKey]: [...currentOperators, operator],
          };
        }

        return prev;
      });
    }
    setDraggedOperator(null);
  };

  const handleDragOver = (e, day, shift) => {
    e.preventDefault();
    setSelectedCell({ day, shift });
  };

  const handleDragLeave = () => {
    setSelectedCell(null);
  };

  const handleCellClick = (day, shift) => {
    setSelectedCell({ day, shift });
  };

  const removeOperator = (day, shift, operator) => {
    setSchedule((prev) => {
      const cellKey = `${day}-${shift}`;
      const currentOperators = prev[cellKey] || [];

      if (!Array.isArray(currentOperators)) {
        delete prev[cellKey];
        return { ...prev };
      }

      const newOperators = currentOperators.filter((op) => op !== operator);

      if (newOperators.length === 0) {
        const newSchedule = { ...prev };
        delete newSchedule[cellKey];
        return newSchedule;
      }

      return {
        ...prev,
        [cellKey]: newOperators,
      };
    });
  };

  const getOperatorColor = (operator) => {
    return operatorColors[operator] || "#67e8f9";
  };

  const getContrastTextColor = (bgColor) => {
    if (!bgColor) return "#FFFFFF";
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  return (
    <div className="bg-[#121214] min-h-screen pb-[180px] relative">
      <div className="container mx-auto p-4">
        <h1 className="text-white text-2xl font-bold mb-6">Weekly Schedule</h1>

        <div className="bg-[#1D1D1F] rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-3 bg-[#2A2A2A] text-white font-medium text-left"></th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="p-3 bg-[#2A2A2A] text-white font-medium text-center"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr key={shift}>
                  <td className="p-3 border-t border-[#2A2A2A] text-white font-medium">
                    {shift}
                  </td>
                  {days.map((day) => {
                    const cellKey = `${day}-${shift}`;
                    const cellOperators = schedule[cellKey] || [];
                    const isSelected =
                      selectedCell &&
                      selectedCell.day === day &&
                      selectedCell.shift === shift;

                    return (
                      <td
                        key={cellKey}
                        className={`p-3 border-t border-[#2A2A2A] relative min-h-[80px] min-w-[120px] ${
                          isSelected ? "bg-[#2A2A2A]" : ""
                        }`}
                        onDragOver={(e) => handleDragOver(e, day, shift)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, day, shift)}
                        onClick={() => handleCellClick(day, shift)}
                      >
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(cellOperators) &&
                          cellOperators.length > 0 ? (
                            cellOperators.map((operator, index) => (
                              <div
                                key={index}
                                className="bg-[#2A2A2A] rounded-full px-2 py-1 flex items-center gap-1 text-xs"
                              >
                                <div
                                  className="w-4 h-4 rounded-full flex items-center justify-center"
                                  style={{
                                    backgroundColor: getOperatorColor(operator),
                                    color: getContrastTextColor(
                                      getOperatorColor(operator),
                                    ),
                                  }}
                                >
                                  <i className="fas fa-user text-[8px]"></i>
                                </div>
                                <span className="text-white">{operator}</span>
                                <button
                                  className="text-red-400 hover:text-red-300 ml-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeOperator(day, shift, operator);
                                  }}
                                >
                                  <i className="fas fa-times text-[10px]"></i>
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="h-8 flex items-center justify-center text-gray-500 text-sm w-full">
                              {isSelected ? "Drop operator here" : ""}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CompactOperatorPanel
        operators={operators}
        onAddOperator={handleAddOperator}
        onDeleteOperator={handleDeleteOperator}
        onDragStart={handleDragStart}
        onCollapse={toggleCollapse}
        isCollapsed={isCollapsed}
        operatorColors={operatorColors}
      />
    </div>
  );
}

function StoryComponent() {
  return (
    <div className="bg-[#121214]">
      <h2 className="text-white text-xl p-4">
        BinBin with CompactOperatorPanel
      </h2>
      <MainComponent />
    </div>
  );
});
}