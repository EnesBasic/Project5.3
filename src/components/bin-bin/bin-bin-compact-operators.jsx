"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  operators = [],
  machines = [],
  shifts = [],
  days = [],
  schedule = {},
  onScheduleChange = () => {},
}) {
  const [draggedOperator, setDraggedOperator] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [cellToRemove, setCellToRemove] = React.useState(null);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [tooltipContent, setTooltipContent] = React.useState("");
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [successMessage, setSuccessMessage] = React.useState(null);

  const filteredOperators = React.useMemo(() => {
    return operators.filter((operator) =>
      operator.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [operators, searchTerm]);

  const handleDragStart = (operator) => {
    setDraggedOperator(operator);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (day, shift, machine) => {
    if (!draggedOperator) return;

    const newSchedule = { ...schedule };
    if (!newSchedule[day]) newSchedule[day] = {};
    if (!newSchedule[day][shift]) newSchedule[day][shift] = {};
    
    newSchedule[day][shift][machine] = draggedOperator;
    onScheduleChange(newSchedule);
    setDraggedOperator(null);
  };

  const handleCellClick = (day, shift, machine) => {
    if (schedule[day]?.[shift]?.[machine]) {
      setCellToRemove({ day, shift, machine });
      setShowConfirmation(true);
    }
  };

  const confirmRemove = () => {
    if (!cellToRemove) return;
    
    const { day, shift, machine } = cellToRemove;
    const newSchedule = { ...schedule };
    
    if (newSchedule[day]?.[shift]?.[machine]) {
      newSchedule[day][shift][machine] = "";
      onScheduleChange(newSchedule);
    }
    
    setShowConfirmation(false);
    setCellToRemove(null);
  };

  const cancelRemove = () => {
    setShowConfirmation(false);
    setCellToRemove(null);
  };

  const handleMouseEnter = (e, content) => {
    if (!content) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipContent(content);
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage("Schedule saved successfully!");
    } catch (err) {
      setError("Failed to save schedule. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#121214] text-white p-4 rounded-lg shadow-lg max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Operator Schedule</h1>
        <p className="text-gray-400">Drag and drop operators to assign them to machines</p>
      </div>
      
      <div className="mb-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search operators..."
            className="w-full p-2 bg-[#1D1D1F] border border-[#2A2A2A] rounded text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="bg-[#1D1D1F] border border-[#2A2A2A] rounded p-2 max-h-[150px] overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {filteredOperators.map((operator, index) => (
              <div
                key={index}
                className="bg-[#2A2A2A] text-white px-3 py-1 rounded cursor-move text-sm flex items-center"
                draggable
                onDragStart={() => handleDragStart(operator)}
              >
                <span className="truncate">{operator}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border border-[#2A2A2A] bg-[#1D1D1F]">Day/Shift</th>
              {shifts.map((shift) => (
                <th 
                  key={shift} 
                  className="p-2 border border-[#2A2A2A] bg-[#1D1D1F] text-center"
                  colSpan={machines.length}
                >
                  {shift}
                </th>
              ))}
            </tr>
            <tr>
              <th className="p-2 border border-[#2A2A2A] bg-[#1D1D1F]"></th>
              {shifts.map((shift) => (
                machines.map((machine) => (
                  <th 
                    key={`${shift}-${machine}`} 
                    className="p-2 border border-[#2A2A2A] bg-[#1D1D1F] text-center text-sm"
                  >
                    {machine}
                  </th>
                ))
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td className="p-2 border border-[#2A2A2A] bg-[#1D1D1F] font-medium">
                  {day}
                </td>
                {shifts.map((shift) => (
                  machines.map((machine) => (
                    <td 
                      key={`${day}-${shift}-${machine}`} 
                      className="p-2 border border-[#2A2A2A] bg-[#1D1D1F] text-center h-12"
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(day, shift, machine)}
                      onClick={() => handleCellClick(day, shift, machine)}
                      onMouseEnter={(e) => handleMouseEnter(e, schedule[day]?.[shift]?.[machine])}
                      onMouseLeave={handleMouseLeave}
                    >
                      {schedule[day]?.[shift]?.[machine] ? (
                        <div className="bg-[#3A3A3C] p-1 rounded text-sm truncate">
                          {schedule[day][shift][machine]}
                        </div>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-500 text-xs">
                          Drop here
                        </div>
                      )}
                    </td>
                  ))
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 flex justify-end gap-4">
        <button 
          className="px-4 py-2 bg-[#2A2A2A] text-white rounded hover:bg-[#3A3A3C] transition-colors"
          onClick={() => onScheduleChange({})}
        >
          Clear All
        </button>
        <button 
          className={`px-4 py-2 rounded transition-colors flex items-center ${
            isLoading 
              ? "bg-[#3A3A3C] cursor-not-allowed" 
              : "bg-[#0A84FF] hover:bg-[#0070E0]"
          }`}
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="mr-2">Saving</span>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </>
          ) : (
            "Save Schedule"
          )}
        </button>
      </div>
      
      {successMessage && (
        <div className="mt-4 p-2 bg-green-800/20 border border-green-800 text-green-400 rounded">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-2 bg-red-800/20 border border-red-800 text-red-400 rounded">
          {error}
        </div>
      )}
      
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1D1D1F] p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Remove Operator</h3>
            <p className="mb-6">
              Are you sure you want to remove {
                cellToRemove && schedule[cellToRemove.day]?.[cellToRemove.shift]?.[cellToRemove.machine]
              } from this position?
            </p>
            <div className="flex justify-end gap-4">
              <button 
                className="px-4 py-2 bg-[#2A2A2A] text-white rounded hover:bg-[#3A3A3C]"
                onClick={cancelRemove}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={confirmRemove}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showTooltip && tooltipContent && (
        <div 
          className="fixed bg-[#1D1D1F] text-white px-2 py-1 rounded text-sm z-50 pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
}

  const [schedule, setSchedule] = React.useState({
    Monday: {
      Morning: {
        "Machine A": "John Doe",
        "Machine B": "Jane Smith",
      },
      Afternoon: {
        "Machine C": "Bob Johnson",
      },
    },
    Tuesday: {
      Morning: {
        "Machine A": "Alice Williams",
      },
      Afternoon: {
        "Machine B": "Charlie Brown",
        "Machine C": "Diana Prince",
      },
    },
  });

  const operators = [
    "John Doe",
    "Jane Smith", 
    "Bob Johnson",
    "Alice Williams",
    "Charlie Brown",
    "Diana Prince",
    "Ethan Hunt",
    "Fiona Gallagher",
    "George Miller",
    "Hannah Baker",
    "Ian Malcolm",
    "Julia Roberts",
    "Kevin Hart",
    "Laura Palmer",
    "Michael Scott",
  ];

  const machines = ["Machine A", "Machine B", "Machine C"];
  const shifts = ["Morning", "Afternoon"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="p-4 bg-[#0A0A0A] min-h-screen">
      <MainComponent
        operators={operators}
        machines={machines}
        shifts={shifts}
        days={days}
        schedule={schedule}
        onScheduleChange={setSchedule}
      />
    </div>
  );
});
}