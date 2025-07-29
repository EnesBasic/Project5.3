"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  operators = [],
  machines = [],
  schedule = {},
  onAssignOperator = () => {},
  onRemoveOperator = () => {},
}) {
  const [expandedOperators, setExpandedOperators] = React.useState(true);
  const [draggedOperator, setDraggedOperator] = React.useState(null);
  const [hoveredCell, setHoveredCell] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const shifts = ["morning", "evening"];
  const dayLabels = {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
  };
  const shiftLabels = {
    morning: "08:00-16:00",
    evening: "16:00-00:00",
  };

  const filteredOperators = operators.filter(operator => 
    operator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragStart = (operator) => {
    setDraggedOperator(operator);
  };

  const handleDragEnd = () => {
    setDraggedOperator(null);
    setHoveredCell(null);
  };

  const handleDrop = (day, shift, machine) => {
    if (draggedOperator) {
      onAssignOperator(day, shift, machine, draggedOperator);
      setDraggedOperator(null);
    }
  };

  const handleDragOver = (e, day, shift, machine) => {
    e.preventDefault();
    setHoveredCell({ day, shift, machine });
  };

  const handleDragLeave = () => {
    setHoveredCell(null);
  };

  const getAssignedOperator = (day, shift, machine) => {
    return schedule[day]?.[shift]?.[machine] || null;
  };

  const toggleOperatorsPanel = () => {
    setExpandedOperators(!expandedOperators);
  };

  return (
    <div className="relative min-h-screen pb-24">
      <div className="bg-[#121214] text-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-[#67e8f9]">Weekly Schedule</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border border-[#2a2a2a] bg-[#1D1D1F]"></th>
                {days.map(day => (
                  <th 
                    key={day} 
                    className="p-2 border border-[#2a2a2a] bg-[#1D1D1F] text-center font-medium"
                    colSpan={machines.length}
                  >
                    {dayLabels[day]}
                  </th>
                ))}
              </tr>
              <tr>
                <th className="p-2 border border-[#2a2a2a] bg-[#1D1D1F]"></th>
                {days.map(day => (
                  machines.map(machine => (
                    <th 
                      key={`${day}-${machine}`} 
                      className="p-2 border border-[#2a2a2a] bg-[#1D1D1F] text-center text-xs font-medium"
                    >
                      {machine}
                    </th>
                  ))
                ))}
              </tr>
            </thead>
            <tbody>
              {shifts.map(shift => (
                <tr key={shift}>
                  <td className="p-2 border border-[#2a2a2a] bg-[#1D1D1F] font-medium">
                    {shiftLabels[shift]}
                  </td>
                  {days.map(day => (
                    machines.map(machine => {
                      const assignedOperator = getAssignedOperator(day, shift, machine);
                      const isHovered = hoveredCell && 
                        hoveredCell.day === day && 
                        hoveredCell.shift === shift && 
                        hoveredCell.machine === machine;
                      
                      return (
                        <td 
                          key={`${day}-${shift}-${machine}`}
                          className={`p-2 border border-[#2a2a2a] text-center h-16 align-middle ${
                            isHovered ? 'bg-[#2a2a2a]' : 'bg-[#1D1D1F]'
                          }`}
                          onDragOver={(e) => handleDragOver(e, day, shift, machine)}
                          onDragLeave={handleDragLeave}
                          onDrop={() => handleDrop(day, shift, machine)}
                        >
                          {assignedOperator ? (
                            <div className="flex items-center justify-center">
                              <div className="bg-[#2a2a2a] px-2 py-1 rounded-md flex items-center">
                                <span className="text-sm">{assignedOperator}</span>
                                <button 
                                  className="ml-2 text-red-500 hover:text-red-400"
                                  onClick={() => onRemoveOperator(day, shift, machine)}
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[#86868B] text-sm">
                              {draggedOperator && isHovered ? (
                                <span className="text-[#67e8f9]">Drop here</span>
                              ) : (
                                <span>-</span>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`fixed bottom-0 left-0 right-0 bg-[#1D1D1F] border-t border-[#2a2a2a] shadow-lg transition-all duration-300 ${
        expandedOperators ? 'h-48' : 'h-12'
      }`}>
        <div className="flex justify-between items-center px-4 h-12 border-b border-[#2a2a2a]">
          <h3 className="text-white font-medium">Operators</h3>
          <div className="flex items-center">
            {expandedOperators && (
              <div className="relative mr-4">
                <input
                  type="text"
                  placeholder="Search operators..."
                  className="bg-[#2a2a2a] text-white px-3 py-1 rounded-md text-sm w-48 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#86868B] hover:text-white"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            )}
            <button 
              className="text-[#67e8f9] hover:text-white"
              onClick={toggleOperatorsPanel}
            >
              <i className={`fas fa-chevron-${expandedOperators ? 'down' : 'up'}`}></i>
            </button>
          </div>
        </div>
        
        {expandedOperators && (
          <div className="p-4 h-36 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {filteredOperators.length > 0 ? (
                filteredOperators.map((operator, index) => (
                  <div
                    key={index}
                    className="bg-[#2a2a2a] text-white px-3 py-2 rounded-md cursor-grab hover:bg-[#3a3a3a] transition-colors"
                    draggable
                    onDragStart={() => handleDragStart(operator)}
                    onDragEnd={handleDragEnd}
                  >
                    {operator}
                  </div>
                ))
              ) : (
                <div className="text-[#86868B] w-full text-center py-4">
                  {searchTerm ? "No operators match your search" : "No operators available"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StoryComponent() {
  const [schedule, setSchedule] = React.useState({
    monday: {
      morning: {
        "M58-J-467": "John Doe",
        "M53-E-929": "Jane Smith"
      },
      evening: {
        "M58-J-467": "Mark Johnson"
      }
    },
    wednesday: {
      morning: {
        "A35-J-924": "Emily Davis"
      }
    }
  });

  const operators = [
    "John Doe",
    "Jane Smith",
    "Mark Johnson",
    "Emily Davis",
    "Robert Wilson",
    "Sarah Brown",
    "Michael Taylor",
    "Lisa Anderson",
    "David Martinez",
    "Jennifer Thomas",
    "James Jackson",
    "Patricia White",
    "Richard Harris",
    "Elizabeth Clark",
    "Charles Lewis"
  ];

  const machines = ["M58-J-467", "M53-E-929", "A35-J-924"];

  const handleAssignOperator = (day, shift, machine, operator) => {
    setSchedule(prev => {
      const newSchedule = { ...prev };
      if (!newSchedule[day]) {
        newSchedule[day] = {};
      }
      if (!newSchedule[day][shift]) {
        newSchedule[day][shift] = {};
      }
      newSchedule[day][shift][machine] = operator;
      return newSchedule;
    });
  };

  const handleRemoveOperator = (day, shift, machine) => {
    setSchedule(prev => {
      const newSchedule = { ...prev };
      if (newSchedule[day]?.[shift]?.[machine]) {
        delete newSchedule[day][shift][machine];
        
        // Clean up empty objects
        if (Object.keys(newSchedule[day][shift]).length === 0) {
          delete newSchedule[day][shift];
        }
        if (Object.keys(newSchedule[day]).length === 0) {
          delete newSchedule[day];
        }
      }
      return newSchedule;
    });
  };

  return (
    <div className="bg-[#121214] min-h-screen p-4">
      <h1 className="text-2xl font-bold text-white mb-6">BinBin with Sticky Operators</h1>
      <MainComponent 
        operators={operators}
        machines={machines}
        schedule={schedule}
        onAssignOperator={handleAssignOperator}
        onRemoveOperator={handleRemoveOperator}
      />
    </div>
  );
});
}