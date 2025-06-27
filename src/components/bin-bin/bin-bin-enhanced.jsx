"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  initialData = [],
  initialOperators = [],
  initialMachines = [],
  availableWeeks = [],
  onSave,
  onWeekChange
}) {
  const [scheduleData, setScheduleData] = React.useState(initialData);
  const [operators, setOperators] = React.useState(initialOperators);
  const [machines, setMachines] = React.useState(initialMachines || ["M58-J-467", "M53-E-929", "A35-J-924"]);
  const [currentWeek, setCurrentWeek] = React.useState(availableWeeks[0] || { weekNumber: 1, year: 2025, dateRange: "01.01-07.01" });
  const [showFilters, setShowFilters] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filters, setFilters] = React.useState({
    date: "",
    shift: "",
    operator: "",
    machine: ""
  });
  const [appliedFilters, setAppliedFilters] = React.useState({
    date: "",
    shift: "",
    operator: "",
    machine: ""
  });
  const [editingCell, setEditingCell] = React.useState(null);
  const [editValue, setEditValue] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);

  const days = ["P", "U", "S", "Č", "P", "S", "N"];
  const shifts = ["08.00-16.00", "20.00-04.00"];

  React.useEffect(() => {
    setScheduleData(initialData);
  }, [initialData]);

  React.useEffect(() => {
    setOperators(initialOperators);
  }, [initialOperators]);

  const handleWeekChange = (week) => {
    setCurrentWeek(week);
    if (onWeekChange) {
      onWeekChange(week);
    }
  };

  const handleCellClick = (date, shift, machine) => {
    if (!isEditing) {
      setEditingCell({ date, shift, machine });
      
      const dayData = scheduleData.find(day => day.date === date);
      if (dayData) {
        const shiftData = dayData.shifts.find(s => s.time === shift);
        if (shiftData) {
          setEditValue(shiftData.operators[machine] || "");
        }
      }
      
      setIsEditing(true);
    }
  };

  const handleCellChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleCellBlur = () => {
    if (editingCell) {
      const { date, shift, machine } = editingCell;
      
      const updatedData = [...scheduleData];
      const dayIndex = updatedData.findIndex(day => day.date === date);
      
      if (dayIndex !== -1) {
        const shiftIndex = updatedData[dayIndex].shifts.findIndex(s => s.time === shift);
        
        if (shiftIndex !== -1) {
          updatedData[dayIndex].shifts[shiftIndex].operators[machine] = editValue;
          setScheduleData(updatedData);
          setHasChanges(true);
        }
      }
      
      setEditingCell(null);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCellBlur();
    } else if (e.key === "Escape") {
      setEditingCell(null);
      setIsEditing(false);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(scheduleData);
      setHasChanges(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  const applyFilters = () => {
    setAppliedFilters({...filters});
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      date: "",
      shift: "",
      operator: "",
      machine: ""
    });
    setAppliedFilters({
      date: "",
      shift: "",
      operator: "",
      machine: ""
    });
  };

  const filteredData = React.useMemo(() => {
    return scheduleData.filter(day => {
      // Date filter
      if (appliedFilters.date && !day.date.includes(appliedFilters.date)) {
        return false;
      }
      
      // Shift and operator/machine filters
      if (appliedFilters.shift || appliedFilters.operator || appliedFilters.machine) {
        const matchingShifts = day.shifts.filter(shift => {
          // Shift filter
          if (appliedFilters.shift && !shift.time.includes(appliedFilters.shift)) {
            return false;
          }
          
          // Operator filter
          if (appliedFilters.operator) {
            const hasOperator = Object.values(shift.operators).some(
              op => op && op.toLowerCase().includes(appliedFilters.operator.toLowerCase())
            );
            if (!hasOperator) return false;
          }
          
          // Machine filter
          if (appliedFilters.machine) {
            const hasMachine = Object.keys(shift.operators).some(
              m => m.toLowerCase().includes(appliedFilters.machine.toLowerCase())
            );
            if (!hasMachine) return false;
          }
          
          return true;
        });
        
        if (matchingShifts.length === 0) {
          return false;
        }
      }
      
      // Search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        
        // Check date and day
        if (day.date.toLowerCase().includes(searchLower) || day.day.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Check shifts
        const matchingShifts = day.shifts.some(shift => {
          // Check shift time
          if (shift.time.toLowerCase().includes(searchLower)) {
            return true;
          }
          
          // Check operators
          return Object.entries(shift.operators).some(([machine, operator]) => {
            return (
              machine.toLowerCase().includes(searchLower) ||
              (operator && operator.toLowerCase().includes(searchLower))
            );
          });
        });
        
        if (!matchingShifts) {
          return false;
        }
      }
      
      return true;
    });
  }, [scheduleData, searchTerm, appliedFilters]);

  return (
    <div className="bg-[#121214] text-white p-4 rounded-lg shadow-lg w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <div className="flex flex-col w-full md:w-auto">
          <h2 className="text-xl font-bold mb-1">Schedule Manager</h2>
          <div className="flex items-center gap-2">
            <select 
              className="bg-[#1D1D1F] text-white border border-[#2A2A2A] rounded px-3 py-1.5 text-sm"
              value={`${currentWeek.weekNumber}-${currentWeek.year}`}
              onChange={(e) => {
                const [weekNumber, year] = e.target.value.split('-').map(Number);
                const selectedWeek = availableWeeks.find(w => w.weekNumber === weekNumber && w.year === year);
                if (selectedWeek) {
                  handleWeekChange(selectedWeek);
                }
              }}
            >
              {availableWeeks.map((week) => (
                <option key={`${week.weekNumber}-${week.year}`} value={`${week.weekNumber}-${week.year}`}>
                  Week {week.weekNumber} ({week.dateRange})
                </option>
              ))}
            </select>
            <span className="text-[#67e8f9] text-sm">
              {currentWeek.dateRange}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#1D1D1F] text-white border border-[#2A2A2A] rounded pl-8 pr-3 py-1.5 w-full"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#86868B]"></i>
          </div>
          
          <button 
            className={`px-3 py-1.5 rounded flex items-center gap-1 ${showFilters ? 'bg-[#67e8f9] text-[#121214]' : 'bg-[#1D1D1F] text-white hover:bg-[#2A2A2A]'}`}
            onClick={toggleFilters}
          >
            <i className="fas fa-filter"></i>
            <span>Filters</span>
            {Object.values(appliedFilters).some(f => f) && (
              <span className="bg-[#f43f5e] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {Object.values(appliedFilters).filter(f => f).length}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-[#1D1D1F] rounded-lg p-4 mb-4 animate-fade-in border border-[#2A2A2A]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-[#86868B] mb-1">Date</label>
              <input
                type="text"
                className="bg-[#2A2A2A] text-white border border-[#3A3A3A] rounded px-3 py-1.5 w-full"
                placeholder="e.g. 01.01"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm text-[#86868B] mb-1">Shift</label>
              <select
                className="bg-[#2A2A2A] text-white border border-[#3A3A3A] rounded px-3 py-1.5 w-full"
                value={filters.shift}
                onChange={(e) => handleFilterChange('shift', e.target.value)}
              >
                <option value="">All Shifts</option>
                {shifts.map(shift => (
                  <option key={shift} value={shift}>{shift}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-[#86868B] mb-1">Operator</label>
              <select
                className="bg-[#2A2A2A] text-white border border-[#3A3A3A] rounded px-3 py-1.5 w-full"
                value={filters.operator}
                onChange={(e) => handleFilterChange('operator', e.target.value)}
              >
                <option value="">All Operators</option>
                {operators.map(operator => (
                  <option key={operator} value={operator}>{operator}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-[#86868B] mb-1">Machine</label>
              <select
                className="bg-[#2A2A2A] text-white border border-[#3A3A3A] rounded px-3 py-1.5 w-full"
                value={filters.machine}
                onChange={(e) => handleFilterChange('machine', e.target.value)}
              >
                <option value="">All Machines</option>
                {machines.map(machine => (
                  <option key={machine} value={machine}>{machine}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4 gap-2">
            <button
              className="bg-[#2A2A2A] text-white hover:bg-[#3A3A3A] px-3 py-1.5 rounded"
              onClick={clearFilters}
            >
              Clear All
            </button>
            <button
              className="bg-[#67e8f9] text-[#121214] hover:bg-[#4fd1e5] px-3 py-1.5 rounded"
              onClick={applyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#1D1D1F] border-b border-[#2A2A2A]">
              <th className="py-2 px-3 text-left text-sm font-medium text-[#86868B]">Date</th>
              <th className="py-2 px-3 text-left text-sm font-medium text-[#86868B]">Day</th>
              <th className="py-2 px-3 text-left text-sm font-medium text-[#86868B]">Shift</th>
              {machines.map(machine => (
                <th key={machine} className="py-2 px-3 text-left text-sm font-medium text-[#86868B]">{machine}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.flatMap((day, dayIndex) => 
                day.shifts.map((shift, shiftIndex) => (
                  <tr 
                    key={`${day.date}-${shift.time}`} 
                    className={`border-b border-[#2A2A2A] ${dayIndex % 2 === 0 ? 'bg-[#18181B]' : 'bg-[#1D1D1F]'}`}
                  >
                    {shiftIndex === 0 && (
                      <>
                        <td 
                          className="py-2 px-3 text-sm" 
                          rowSpan={day.shifts.length}
                        >
                          {day.date}
                        </td>
                        <td 
                          className="py-2 px-3 text-sm" 
                          rowSpan={day.shifts.length}
                        >
                          {day.day}
                        </td>
                      </>
                    )}
                    <td className="py-2 px-3 text-sm">{shift.time}</td>
                    {machines.map(machine => (
                      <td 
                        key={`${day.date}-${shift.time}-${machine}`} 
                        className="py-2 px-3 text-sm relative"
                        onClick={() => handleCellClick(day.date, shift.time, machine)}
                      >
                        {editingCell && 
                         editingCell.date === day.date && 
                         editingCell.shift === shift.time && 
                         editingCell.machine === machine ? (
                          <input
                            type="text"
                            className="bg-[#2A2A2A] text-white border border-[#67e8f9] rounded px-2 py-1 w-full"
                            value={editValue}
                            onChange={handleCellChange}
                            onBlur={handleCellBlur}
                            onKeyDown={handleKeyDown}
                            autoFocus
                          />
                        ) : (
                          <span className={`block py-1 px-2 rounded ${shift.operators[machine] ? 'bg-[#1D1D1F]' : 'text-[#86868B] italic'}`}>
                            {shift.operators[machine] || "Not assigned"}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan={3 + machines.length} className="py-4 text-center text-[#86868B]">
                  No data matches your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-[#86868B]">
          {filteredData.length} days • {filteredData.reduce((acc, day) => acc + day.shifts.length, 0)} shifts
        </div>
        <button
          className={`px-4 py-2 rounded ${hasChanges ? 'bg-[#67e8f9] text-[#121214] hover:bg-[#4fd1e5]' : 'bg-[#2A2A2A] text-[#86868B] cursor-not-allowed'}`}
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Save Changes
        </button>
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
    },
    {
      date: "04.01",
      day: "Č",
      shifts: [
        {
          time: "08.00-16.00",
          operators: {
            "M58-J-467": "",
            "M53-E-929": "Mark Johnson",
            "A35-J-924": "Jane Smith"
          }
        },
        {
          time: "20.00-04.00",
          operators: {
            "M58-J-467": "John Doe",
            "M53-E-929": "",
            "A35-J-924": ""
          }
        }
      ]
    }
  ]);

  const mockOperators = ["John Doe", "Jane Smith", "Mark Johnson", "Alex Wilson", "Sarah Parker"];
  const mockMachines = ["M58-J-467", "M53-E-929", "A35-J-924"];
  
  const mockWeeks = [
    { weekNumber: 1, year: 2025, dateRange: "01.01-07.01" },
    { weekNumber: 2, year: 2025, dateRange: "08.01-14.01" },
    { weekNumber: 3, year: 2025, dateRange: "15.01-21.01" },
    { weekNumber: 4, year: 2025, dateRange: "22.01-28.01" }
  ];

  const handleSave = (data) => {
    console.log("Saving data:", data);
    setMockData(data);
    alert("Schedule saved successfully!");
  };

  const handleWeekChange = (week) => {
    console.log("Week changed to:", week);
  };

  return (
    <div className="p-4 bg-[#121214] min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">Enhanced Schedule Manager</h1>
      
      <MainComponent 
        initialData={mockData}
        initialOperators={mockOperators}
        initialMachines={mockMachines}
        availableWeeks={mockWeeks}
        onSave={handleSave}
        onWeekChange={handleWeekChange}
      />
      
      <div className="mt-8 p-4 bg-[#1D1D1F] rounded-lg text-white">
        <h2 className="text-xl font-bold mb-4">Component Features</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Schedule display with week selection dropdown</li>
          <li>Search functionality for quick filtering</li>
          <li>Advanced filtering by date, shift, operator, and machine</li>
          <li>Editable cells - click on any operator cell to edit</li>
          <li>Save changes functionality</li>
          <li>Responsive design for all screen sizes</li>
        </ul>
      </div>
    </div>
  );
});
}