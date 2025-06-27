"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  initialData = [],
  initialOperators = [],
  onSave,
  onWeekChange,
  availableWeeks = []
}) {
  const [data, setData] = React.useState(initialData);
  const [operators, setOperators] = React.useState(initialOperators);
  const [newOperator, setNewOperator] = React.useState("");
  const [selectedWeek, setSelectedWeek] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [draggedOperator, setDraggedOperator] = React.useState(null);
  const [dragTarget, setDragTarget] = React.useState(null);
  const [showConfirmSave, setShowConfirmSave] = React.useState(false);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  React.useEffect(() => {
    setOperators(initialOperators);
  }, [initialOperators]);

  const handleAddOperator = () => {
    if (newOperator.trim() && !operators.includes(newOperator.trim())) {
      setOperators([...operators, newOperator.trim()]);
      setNewOperator("");
    }
  };

  const handleRemoveOperator = (operatorToRemove) => {
    setOperators(operators.filter(operator => operator !== operatorToRemove));
    
    // Also remove this operator from all shifts in the data
    const updatedData = data.map(day => ({
      ...day,
      shifts: day.shifts.map(shift => ({
        ...shift,
        operators: Object.fromEntries(
          Object.entries(shift.operators).map(([vehicle, operator]) => [
            vehicle, 
            operator === operatorToRemove ? "" : operator
          ])
        )
      }))
    }));
    
    setData(updatedData);
    setIsEditing(true);
  };

  const handleDragStart = (e, operator) => {
    setIsDragging(true);
    setDraggedOperator(operator);
  };

  const handleDragOver = (e, dayIndex, shiftIndex, vehicle) => {
    e.preventDefault();
    setDragTarget({ dayIndex, shiftIndex, vehicle });
  };

  const handleDrop = (e, dayIndex, shiftIndex, vehicle) => {
    e.preventDefault();
    
    if (!draggedOperator) return;
    
    const newData = [...data];
    
    // Remove operator from previous assignment if it exists
    newData.forEach((day, dIndex) => {
      day.shifts.forEach((shift, sIndex) => {
        Object.keys(shift.operators).forEach(veh => {
          if (shift.operators[veh] === draggedOperator) {
            newData[dIndex].shifts[sIndex].operators[veh] = "";
          }
        });
      });
    });
    
    // Assign to new position
    newData[dayIndex].shifts[shiftIndex].operators[vehicle] = draggedOperator;
    
    setData(newData);
    setIsDragging(false);
    setDraggedOperator(null);
    setDragTarget(null);
    setIsEditing(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedOperator(null);
    setDragTarget(null);
  };

  const handleCellClick = (dayIndex, shiftIndex, vehicle) => {
    const newData = [...data];
    const currentOperator = newData[dayIndex].shifts[shiftIndex].operators[vehicle];
    
    // Clear the cell
    newData[dayIndex].shifts[shiftIndex].operators[vehicle] = "";
    
    setData(newData);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(data);
      setIsEditing(false);
      setShowConfirmSave(false);
    }
  };

  const handleWeekSelect = (week) => {
    setSelectedWeek(week);
    if (onWeekChange) {
      onWeekChange(week);
    }
  };

  const getVehicles = () => {
    if (data.length === 0 || data[0].shifts.length === 0) return [];
    return Object.keys(data[0].shifts[0].operators);
  };

  const vehicles = getVehicles();

  return (
    <div className="bg-[#1D1D1F] rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-[#2A2A2A]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-white text-xl font-semibold">Schedule Manager</h2>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
              <select 
                className="bg-[#2A2A2A] text-white rounded-lg px-3 py-2 w-full appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
                value={selectedWeek ? JSON.stringify(selectedWeek) : ""}
                onChange={(e) => e.target.value && handleWeekSelect(JSON.parse(e.target.value))}
              >
                <option value="">Select Week</option>
                {availableWeeks.map((week, index) => (
                  <option key={index} value={JSON.stringify(week)}>
                    Week {week.weekNumber} ({week.dateRange})
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#67e8f9]">
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>
            
            <button
              onClick={() => isEditing ? setShowConfirmSave(true) : null}
              disabled={!isEditing}
              className={`px-4 py-2 rounded-lg font-medium ${
                isEditing 
                  ? "bg-[#67e8f9] text-[#1D1D1F] hover:bg-[#a5f3ff]" 
                  : "bg-[#2A2A2A] text-gray-500 cursor-not-allowed"
              }`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-1">
          <div className="bg-[#2A2A2A] rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white text-sm font-medium">Add Operator</h3>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newOperator}
                onChange={(e) => setNewOperator(e.target.value)}
                placeholder="New operator name"
                className="flex-grow bg-[#1D1D1F] text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
                onKeyPress={(e) => e.key === 'Enter' && handleAddOperator()}
              />
              <button
                onClick={handleAddOperator}
                className="bg-[#67e8f9] text-[#1D1D1F] px-3 py-2 rounded hover:bg-[#a5f3ff] transition-colors"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
          
          <CompactOperatorDragSection
            operators={operators}
            onDragStart={handleDragStart}
            onRemoveOperator={handleRemoveOperator}
            className="mb-4"
          />
          
          <div className="bg-[#2A2A2A] rounded-lg p-3">
            <h3 className="text-white text-sm font-medium mb-2">Instructions</h3>
            <ul className="text-gray-300 text-xs space-y-1">
              <li className="flex items-start">
                <i className="fas fa-mouse-pointer mt-0.5 mr-1.5 text-[#67e8f9]"></i>
                <span>Drag operators to assign them</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-times mt-0.5 mr-1.5 text-[#67e8f9]"></i>
                <span>Click on a cell to clear it</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-save mt-0.5 mr-1.5 text-[#67e8f9]"></i>
                <span>Save changes when done</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="lg:col-span-4 overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-[#2A2A2A] text-white text-left p-2 text-sm font-medium rounded-tl-lg">Date</th>
                <th className="bg-[#2A2A2A] text-white text-left p-2 text-sm font-medium">Shift</th>
                {vehicles.map((vehicle, index) => (
                  <th 
                    key={index} 
                    className={`bg-[#2A2A2A] text-white text-left p-2 text-sm font-medium ${
                      index === vehicles.length - 1 ? 'rounded-tr-lg' : ''
                    }`}
                  >
                    {vehicle}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((day, dayIndex) => (
                day.shifts.map((shift, shiftIndex) => (
                  <tr 
                    key={`${dayIndex}-${shiftIndex}`} 
                    className={`${dayIndex % 2 === 0 ? 'bg-[#1D1D1F]' : 'bg-[#252527]'}`}
                  >
                    {shiftIndex === 0 && (
                      <td 
                        rowSpan={day.shifts.length} 
                        className="border-b border-[#2A2A2A] p-2 text-white text-sm"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{day.date}</span>
                          <span className="text-gray-400 text-xs">{day.day}</span>
                        </div>
                      </td>
                    )}
                    <td className="border-b border-[#2A2A2A] p-2 text-white text-sm">
                      {shift.time}
                    </td>
                    {vehicles.map((vehicle, vIndex) => (
                      <td 
                        key={vIndex} 
                        className={`border-b border-[#2A2A2A] p-2 text-sm ${
                          dragTarget && 
                          dragTarget.dayIndex === dayIndex && 
                          dragTarget.shiftIndex === shiftIndex && 
                          dragTarget.vehicle === vehicle
                            ? 'bg-[#3A3A3A]'
                            : ''
                        }`}
                        onDragOver={(e) => handleDragOver(e, dayIndex, shiftIndex, vehicle)}
                        onDrop={(e) => handleDrop(e, dayIndex, shiftIndex, vehicle)}
                        onClick={() => handleCellClick(dayIndex, shiftIndex, vehicle)}
                      >
                        {shift.operators[vehicle] ? (
                          <div className="bg-[#3A3A3A] text-white rounded px-2 py-1 text-xs flex items-center">
                            <i className="fas fa-user-circle mr-1 text-[#67e8f9]"></i>
                            {shift.operators[vehicle]}
                          </div>
                        ) : (
                          <div className="h-6 rounded border border-dashed border-[#3A3A3A] flex items-center justify-center text-[#3A3A3A] text-xs">
                            <i className="fas fa-plus"></i>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ))}
            </tbody>
          </table>
          
          {data.length === 0 && (
            <div className="bg-[#2A2A2A] rounded-lg p-6 text-center">
              <i className="fas fa-calendar-alt text-[#67e8f9] text-3xl mb-2"></i>
              <p className="text-white">Select a week to view the schedule</p>
            </div>
          )}
        </div>
      </div>
      
      {showConfirmSave && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1D1D1F] rounded-lg p-4 max-w-md w-full mx-4">
            <h3 className="text-white text-lg font-medium mb-2">Save Changes?</h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to save these changes to the schedule?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmSave(false)}
                className="px-4 py-2 bg-[#2A2A2A] text-white rounded hover:bg-[#3A3A3A]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#67e8f9] text-[#1D1D1F] rounded hover:bg-[#a5f3ff]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CompactOperatorDragSection({ operators = [], onDragStart, onRemoveOperator, className = "" }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isExpanded, setIsExpanded] = React.useState(false);

  const filteredOperators = React.useMemo(() => {
    if (!searchTerm.trim()) return operators;
    return operators.filter((operator) =>
      operator.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [operators, searchTerm]);

  const handleDragStart = (e, operator) => {
    if (onDragStart) {
      onDragStart(e, operator);
    }
    e.dataTransfer.setData("text/plain", operator);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className={`bg-[#2A2A2A] rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white text-sm font-medium">Operators</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#67e8f9] hover:text-[#a5f3ff] text-xs"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>

      <div className="relative mb-2">
        <input
          type="text"
          placeholder="Search operators..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1D1D1F] text-white text-xs rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
        />
        {searchTerm && (
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            onClick={() => setSearchTerm("")}
          >
            <i className="fas fa-times text-xs"></i>
          </button>
        )}
      </div>

      <div
        className={`flex flex-wrap gap-1.5 overflow-y-auto ${isExpanded ? "max-h-48" : "max-h-20"}`}
        style={{ scrollbarWidth: "thin", scrollbarColor: "#67e8f9 #1D1D1F" }}
      >
        {filteredOperators.length > 0 ? (
          filteredOperators.map((operator, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, operator)}
              className="bg-[#1D1D1F] text-white text-xs rounded px-2 py-1 cursor-grab hover:bg-[#3A3A3A] active:cursor-grabbing flex items-center whitespace-nowrap group"
            >
              <i className="fas fa-user-circle mr-1 text-[#67e8f9]"></i>
              {operator}
              <button
                onClick={() => onRemoveOperator && onRemoveOperator(operator)}
                className="ml-1.5 text-gray-400 hover:text-[#ff6b6b] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-xs w-full text-center py-1">
            No operators found
          </div>
        )}
      </div>
    </div>
  );
}

  const [mockData, setMockData] = React.useState([
    {
      date: "01.01",
      day: "P",
      shifts: [
        {
          time: "08.00-16.00",
          operators: {
            "M58-J-467": "John Doe",
            "M53-E-929": "Jane Smith",
            "A35-J-924": "",
          },
        },
        {
          time: "20.00-04.00",
          operators: {
            "M58-J-467": "",
            "M53-E-929": "Mark Johnson",
            "A35-J-924": "",
          },
        },
      ],
    },
    {
      date: "02.01",
      day: "U",
      shifts: [
        {
          time: "08.00-16.00",
          operators: {
            "M58-J-467": "Jane Smith",
            "M53-E-929": "",
            "A35-J-924": "John Doe",
          },
        },
        {
          time: "20.00-04.00",
          operators: {
            "M58-J-467": "Mark Johnson",
            "M53-E-929": "",
            "A35-J-924": "",
          },
        },
      ],
    },
    {
      date: "03.01",
      day: "S",
      shifts: [
        {
          time: "08.00-16.00",
          operators: {
            "M58-J-467": "",
            "M53-E-929": "John Doe",
            "A35-J-924": "Mark Johnson",
          },
        },
        {
          time: "20.00-04.00",
          operators: {
            "M58-J-467": "Jane Smith",
            "M53-E-929": "",
            "A35-J-924": "",
          },
        },
      ],
    },
  ]);

  const mockOperators = ["John Doe", "Jane Smith", "Mark Johnson", "Emily Wilson", "Michael Brown"];
  
  const mockAvailableWeeks = [
    { weekNumber: 1, year: 2025, dateRange: "01.01 - 07.01" },
    { weekNumber: 2, year: 2025, dateRange: "08.01 - 14.01" },
    { weekNumber: 3, year: 2025, dateRange: "15.01 - 21.01" },
  ];

  const handleSave = (data) => {
    console.log("Saving data:", data);
    setMockData(data);
  };

  const handleWeekChange = (week) => {
    console.log("Week changed:", week);
  };

  return (
    <div className="p-4 bg-[#121214] min-h-screen">
      <h2 className="text-white text-2xl mb-6">BinBin Compact</h2>
      
      <div className="mb-8">
        <h3 className="text-white text-lg mb-4">Default View</h3>
        <MainComponent 
          initialData={mockData}
          initialOperators={mockOperators}
          onSave={handleSave}
          onWeekChange={handleWeekChange}
          availableWeeks={mockAvailableWeeks}
        />
      </div>
      
      <div className="mb-8">
        <h3 className="text-white text-lg mb-4">Empty State</h3>
        <MainComponent 
          initialData={[]}
          initialOperators={mockOperators}
          onSave={handleSave}
          onWeekChange={handleWeekChange}
          availableWeeks={mockAvailableWeeks}
        />
      </div>
      
      <div>
        <h3 className="text-white text-lg mb-4">No Operators</h3>
        <MainComponent 
          initialData={mockData}
          initialOperators={[]}
          onSave={handleSave}
          onWeekChange={handleWeekChange}
          availableWeeks={mockAvailableWeeks}
        />
      </div>
    </div>
  );
});
}