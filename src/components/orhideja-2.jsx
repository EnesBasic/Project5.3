"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  initialOperators = [],
  initialData = [],
  availableWeeks = [],
  onSave = () => {},
  onWeekChange = () => {}
}) {
  const [operators, setOperators] = React.useState(initialOperators);
  const [scheduleData, setScheduleData] = React.useState(initialData);
  const [newOperator, setNewOperator] = React.useState("");
  const [editingCell, setEditingCell] = React.useState(null);
  const [selectedOperator, setSelectedOperator] = React.useState("");
  const [showOperatorModal, setShowOperatorModal] = React.useState(false);
  const [showWeekSelector, setShowWeekSelector] = React.useState(false);
  const [notes, setNotes] = React.useState("");
  const [showNotes, setShowNotes] = React.useState(false);

  const dayColors = {
    "P": "#3b82f6", // Monday - blue
    "U": "#10b981", // Tuesday - green
    "S": "#8b5cf6", // Wednesday - purple
    "Č": "#f59e0b", // Thursday - amber
    "P": "#ef4444", // Friday - red
    "S": "#6366f1", // Saturday - indigo
    "N": "#ec4899"  // Sunday - pink
  };

  const handleAddOperator = () => {
    if (newOperator.trim() && !operators.includes(newOperator.trim())) {
      setOperators([...operators, newOperator.trim()]);
      setNewOperator("");
    }
  };

  const handleRemoveOperator = (operatorToRemove) => {
    setOperators(operators.filter(op => op !== operatorToRemove));
    
    // Remove this operator from all shifts
    const updatedSchedule = scheduleData.map(day => {
      return {
        ...day,
        shifts: day.shifts.map(shift => {
          const updatedOperators = { ...shift.operators };
          Object.keys(updatedOperators).forEach(machine => {
            if (updatedOperators[machine] === operatorToRemove) {
              updatedOperators[machine] = "";
            }
          });
          return { ...shift, operators: updatedOperators };
        })
      };
    });
    
    setScheduleData(updatedSchedule);
  };

  const handleCellClick = (dayIndex, shiftIndex, machine) => {
    setEditingCell({ dayIndex, shiftIndex, machine });
    setSelectedOperator("");
    setShowOperatorModal(true);
  };

  const handleAssignOperator = () => {
    if (editingCell) {
      const { dayIndex, shiftIndex, machine } = editingCell;
      
      const updatedSchedule = [...scheduleData];
      updatedSchedule[dayIndex].shifts[shiftIndex].operators[machine] = selectedOperator;
      
      setScheduleData(updatedSchedule);
      setShowOperatorModal(false);
      setEditingCell(null);
    }
  };

  const handleClearCell = () => {
    if (editingCell) {
      const { dayIndex, shiftIndex, machine } = editingCell;
      
      const updatedSchedule = [...scheduleData];
      updatedSchedule[dayIndex].shifts[shiftIndex].operators[machine] = "";
      
      setScheduleData(updatedSchedule);
      setShowOperatorModal(false);
      setEditingCell(null);
    }
  };

  const handleSaveSchedule = () => {
    onSave(scheduleData);
  };

  const getMachines = () => {
    const allMachines = new Set();
    scheduleData.forEach(day => {
      day.shifts.forEach(shift => {
        Object.keys(shift.operators).forEach(machine => {
          allMachines.add(machine);
        });
      });
    });
    return Array.from(allMachines);
  };

  const machines = getMachines();

  return (
    <div className="bg-[#121214] text-white rounded-lg shadow-xl p-4 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex flex-col mb-4 md:mb-0">
          <h2 className="text-xl font-bold text-[#67e8f9] mb-1">Schedule Management</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowWeekSelector(true)}
              className="bg-[#1D1D1F] hover:bg-[#2a2a2a] text-[#67e8f9] px-3 py-1.5 rounded-lg text-sm flex items-center"
            >
              <i className="fas fa-calendar-week mr-2"></i>
              Change Week
            </button>
            <button 
              onClick={() => setShowNotes(!showNotes)}
              className="bg-[#1D1D1F] hover:bg-[#2a2a2a] text-[#67e8f9] px-3 py-1.5 rounded-lg text-sm flex items-center"
            >
              <i className="fas fa-sticky-note mr-2"></i>
              {showNotes ? "Hide Notes" : "Show Notes"}
            </button>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleSaveSchedule}
            className="bg-[#10b981] hover:bg-[#0d9668] text-white px-4 py-2 rounded-lg flex items-center"
          >
            <i className="fas fa-save mr-2"></i>
            Save Schedule
          </button>
        </div>
      </div>
      
      {showNotes && (
        <div className="mb-6 bg-[#1D1D1F] p-3 rounded-lg">
          <h3 className="text-[#67e8f9] font-medium mb-2">Schedule Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[#2A2A2A] text-white border border-[#3A3A3A] rounded-lg p-2 min-h-[100px]"
            placeholder="Add notes about this schedule..."
          />
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-[#67e8f9] font-medium mb-2">Operators</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {operators.map((operator, index) => (
            <div 
              key={index} 
              className="bg-[#1D1D1F] text-white px-3 py-1.5 rounded-lg flex items-center"
            >
              <span className="mr-2">{operator}</span>
              <button 
                onClick={() => handleRemoveOperator(operator)}
                className="text-[#ef4444] hover:text-[#f87171] transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={newOperator}
            onChange={(e) => setNewOperator(e.target.value)}
            placeholder="Add new operator"
            className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded-l-lg px-3 py-2 flex-grow"
          />
          <button
            onClick={handleAddOperator}
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-r-lg"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-[#2A2A2A] bg-[#1D1D1F] p-2 text-left">Date/Day</th>
              <th className="border border-[#2A2A2A] bg-[#1D1D1F] p-2 text-left">Shift</th>
              {machines.map((machine, index) => (
                <th key={index} className="border border-[#2A2A2A] bg-[#1D1D1F] p-2 text-center">
                  {machine}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scheduleData.map((day, dayIndex) => (
              day.shifts.map((shift, shiftIndex) => (
                <tr key={`${dayIndex}-${shiftIndex}`} className="hover:bg-[#1a1a1a]">
                  {shiftIndex === 0 && (
                    <td 
                      rowSpan={day.shifts.length} 
                      className="border border-[#2A2A2A] p-2 align-middle"
                      style={{ backgroundColor: dayColors[day.day] || '#1D1D1F' }}
                    >
                      <div className="font-bold">{day.date}</div>
                      <div>{day.day}</div>
                    </td>
                  )}
                  <td className="border border-[#2A2A2A] p-2">{shift.time}</td>
                  {machines.map((machine, machineIndex) => (
                    <td 
                      key={machineIndex} 
                      className="border border-[#2A2A2A] p-2 text-center cursor-pointer hover:bg-[#2A2A2A]"
                      onClick={() => handleCellClick(dayIndex, shiftIndex, machine)}
                    >
                      {shift.operators[machine] || "-"}
                    </td>
                  ))}
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
      
      {showOperatorModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1D1D1F] rounded-lg p-4 w-[90%] max-w-md">
            <h3 className="text-[#67e8f9] font-medium mb-4">
              Assign Operator to {editingCell ? editingCell.machine : ""}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm text-[#86868B] mb-1">Select Operator</label>
              <select
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                className="w-full bg-[#2A2A2A] text-white border border-[#3A3A3A] rounded-lg p-2"
              >
                <option value="">-- Select Operator --</option>
                {operators.map((operator, index) => (
                  <option key={index} value={operator}>{operator}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleClearCell}
                className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-3 py-1.5 rounded-lg"
              >
                Clear
              </button>
              <button
                onClick={() => setShowOperatorModal(false)}
                className="bg-[#4b5563] hover:bg-[#374151] text-white px-3 py-1.5 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignOperator}
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-3 py-1.5 rounded-lg"
                disabled={!selectedOperator}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showWeekSelector && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1D1D1F] rounded-lg p-4 w-[90%] max-w-md">
            <h3 className="text-[#67e8f9] font-medium mb-4">Select Week</h3>
            
            <div className="max-h-[300px] overflow-y-auto mb-4">
              {availableWeeks.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {availableWeeks.map((week, index) => (
                    <button
                      key={index}
                      className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white p-3 rounded-lg text-left"
                      onClick={() => {
                        onWeekChange(week);
                        setShowWeekSelector(false);
                      }}
                    >
                      <div className="font-medium">Week {week.weekNumber}, {week.year}</div>
                      <div className="text-sm text-[#86868B]">{week.dateRange}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-[#86868B] py-4">
                  No weeks available
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowWeekSelector(false)}
                className="bg-[#4b5563] hover:bg-[#374151] text-white px-3 py-1.5 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StoryComponent() {
  const [mockScheduleData, setMockScheduleData] = React.useState([
    {
      date: "01.01",
      day: "P",
      shifts: [
        {
          time: "08.00-16.00",
          operators: {
            "M58-J-467": "John Doe",
            "M53-E-929": "Jane Smith", 
            "A35-J-924": ""
          }
        },
        {
          time: "20.00-04.00",
          operators: {
            "M58-J-467": "",
            "M53-E-929": "Mark Johnson",
            "A35-J-924": ""
          }
        }
      ]
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
            "A35-J-924": "John Doe"  
          }
        },
        {
          time: "20.00-04.00",
          operators: {
            "M58-J-467": "Mark Johnson",
            "M53-E-929": "",
            "A35-J-924": ""
          }
        }
      ]
    },
    {
      date: "03.01", 
      day: "S",
      shifts: [
        {
          time: "08.00-16.00",
          operators: {
            "M58-J-467": "Mark Johnson",
            "M53-E-929": "John Doe",
            "A35-J-924": ""  
          }
        },
        {
          time: "20.00-04.00",
          operators: {
            "M58-J-467": "",
            "M53-E-929": "Jane Smith",
            "A35-J-924": ""
          }
        }
      ]
    }
  ]);

  const mockOperators = ["John Doe", "Jane Smith", "Mark Johnson"];
  
  const mockAvailableWeeks = [
    { weekNumber: 1, year: 2025, dateRange: "01.01 - 07.01" },
    { weekNumber: 2, year: 2025, dateRange: "08.01 - 14.01" },
    { weekNumber: 3, year: 2025, dateRange: "15.01 - 21.01" }
  ];

  const handleSave = (data) => {
    console.log("Saving schedule data:", data);
    setMockScheduleData(data);
    alert("Schedule saved successfully!");
  };

  const handleWeekChange = (week) => {
    console.log("Week changed to:", week);
    alert(`Changed to Week ${week.weekNumber}, ${week.year}`);
  };

  return (
    <div className="min-h-screen bg-[#121214] p-4 font-inter">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-2xl font-semibold mb-6">
          Schedule Management Component
        </h1>

        <div className="mb-8">
          <MainComponent 
            initialOperators={mockOperators}
            initialData={mockScheduleData}
            availableWeeks={mockAvailableWeeks}
            onSave={handleSave}
            onWeekChange={handleWeekChange}
          />
        </div>

        <div className="bg-[#1D1D1F]/80 rounded-lg p-4">
          <h2 className="text-white text-xl font-semibold mb-4">
            Component Details
          </h2>
          <div className="text-[#86868B] space-y-2">
            <p>
              The Schedule Management component allows users to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>View and edit operator schedules for different machines</li>
              <li>Add and remove operators from the system</li>
              <li>Assign operators to specific machines for each shift</li>
              <li>Navigate between different weekly schedules</li>
              <li>Add notes to schedules for additional context</li>
              <li>Save schedule changes</li>
            </ul>
            <p className="mt-4">
              The component uses color coding for different days of the week and provides an intuitive interface for managing complex scheduling requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
}