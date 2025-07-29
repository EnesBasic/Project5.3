"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  initialData = [],
  initialOperators = [],
  availableWeeks = [],
  onSave = () => {},
  onWeekChange = () => {},
}) {
  const [data, setData] = React.useState(initialData);
  const [operators, setOperators] = React.useState(initialOperators);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [editingCell, setEditingCell] = React.useState(null);
  const [editValue, setEditValue] = React.useState("");
  const [selectedWeek, setSelectedWeek] = React.useState(
    availableWeeks.length > 0 ? availableWeeks[0] : null
  );
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({
    date: "",
    shift: "",
    operator: "",
    machine: "",
  });
  const [availableMachines, setAvailableMachines] = React.useState([]);

  React.useEffect(() => {
    if (data && data.length > 0) {
      const machines = new Set();
      data.forEach((day) => {
        day.shifts.forEach((shift) => {
          Object.keys(shift.operators).forEach((machine) => {
            machines.add(machine);
          });
        });
      });
      setAvailableMachines(Array.from(machines));
    }
  }, [data]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      date: "",
      shift: "",
      operator: "",
      machine: "",
    });
  };

  const applyFilters = (dataToFilter) => {
    if (!dataToFilter) return [];
    
    return dataToFilter.filter((day) => {
      if (filters.date && !day.date.includes(filters.date)) {
        return false;
      }

      const filteredShifts = day.shifts.filter((shift) => {
        if (filters.shift && !shift.time.includes(filters.shift)) {
          return false;
        }

        if (filters.operator || filters.machine) {
          let matchesOperatorOrMachine = false;
          
          for (const [machine, operator] of Object.entries(shift.operators)) {
            const matchesMachine = !filters.machine || machine.includes(filters.machine);
            
            const matchesOperator = !filters.operator || 
              (operator && operator.toLowerCase().includes(filters.operator.toLowerCase()));
            
            if ((filters.operator && filters.machine && matchesOperator && matchesMachine) ||
                (filters.operator && !filters.machine && matchesOperator) ||
                (!filters.operator && filters.machine && matchesMachine)) {
              matchesOperatorOrMachine = true;
              break;
            }
          }
          
          return matchesOperatorOrMachine;
        }
        
        return true;
      });

      return filteredShifts.length > 0;
    });
  };

  const filteredData = applyFilters(data);

  const handleCellClick = (date, time, machine) => {
    const dayData = data.find((d) => d.date === date);
    if (!dayData) return;

    const shiftData = dayData.shifts.find((s) => s.time === time);
    if (!shiftData) return;

    const currentValue = shiftData.operators[machine] || "";
    setEditingCell({ date, time, machine });
    setEditValue(currentValue);
  };

  const handleCellBlur = () => {
    if (!editingCell) return;

    const { date, time, machine } = editingCell;
    const newData = [...data];
    const dayIndex = newData.findIndex((d) => d.date === date);
    if (dayIndex === -1) return;

    const shiftIndex = newData[dayIndex].shifts.findIndex(
      (s) => s.time === time
    );
    if (shiftIndex === -1) return;

    newData[dayIndex].shifts[shiftIndex].operators[machine] = editValue;
    setData(newData);
    setEditingCell(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCellBlur();
    } else if (e.key === "Escape") {
      setEditingCell(null);
    }
  };

  const handleWeekChange = (e) => {
    const weekNumber = parseInt(e.target.value);
    const week = availableWeeks.find((w) => w.weekNumber === weekNumber);
    if (week) {
      setSelectedWeek(week);
      onWeekChange(week);
    }
  };

  const handleSave = () => {
    onSave(data);
  };

  const getDayAbbreviation = (dayIndex) => {
    const days = ["P", "U", "S", "Č", "P", "S", "N"];
    return days[dayIndex] || "";
  };

  return (
    <div className="bg-[#121214] text-white p-4 rounded-lg shadow-lg max-w-full overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <div className="flex items-center">
          <h2 className="text-xl font-bold mr-4">Schedule</h2>
          {availableWeeks.length > 0 && (
            <select
              value={selectedWeek?.weekNumber || ""}
              onChange={handleWeekChange}
              className="bg-[#1D1D1F] text-white border border-[#2A2A2A] rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
            >
              {availableWeeks.map((week) => (
                <option key={week.weekNumber} value={week.weekNumber}>
                  Week {week.weekNumber} ({week.dateRange})
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              className="bg-[#1D1D1F] text-white border border-[#2A2A2A] rounded pl-8 pr-3 py-1.5 w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#86868B]"></i>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`bg-[#1D1D1F] hover:bg-[#2a2a2a] text-white px-3 py-1.5 rounded border border-[#2A2A2A] flex items-center ${
              Object.values(filters).some(f => f !== "") ? "text-[#67e8f9]" : ""
            }`}
          >
            <i className="fas fa-filter mr-1"></i>
            Filter
          </button>
          <button
            onClick={handleSave}
            className="bg-[#1D1D1F] hover:bg-[#2a2a2a] text-[#67e8f9] px-3 py-1.5 rounded border border-[#2A2A2A] flex items-center"
          >
            <i className="fas fa-save mr-1"></i>
            Save
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-[#1D1D1F] border border-[#2A2A2A] rounded-lg p-4 mb-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-[#86868B] mb-1">Date</label>
              <input
                type="text"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
                placeholder="Filter by date..."
                className="bg-[#2A2A2A] text-white border border-[#3A3A3A] rounded px-3 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#86868B] mb-1">Shift</label>
              <input
                type="text"
                value={filters.shift}
                onChange={(e) => handleFilterChange("shift", e.target.value)}
                placeholder="Filter by shift..."
                className="bg-[#2A2A2A] text-white border border-[#3A3A3A] rounded px-3 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#86868B] mb-1">Operator</label>
              <input
                type="text"
                value={filters.operator}
                onChange={(e) => handleFilterChange("operator", e.target.value)}
                placeholder="Filter by operator..."
                className="bg-[#2A2A2A] text-white border border-[#3A3A3A] rounded px-3 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#86868B] mb-1">Machine</label>
              <input
                type="text"
                value={filters.machine}
                onChange={(e) => handleFilterChange("machine", e.target.value)}
                placeholder="Filter by machine..."
                className="bg-[#2A2A2A] text-white border border-[#3A3A3A] rounded px-3 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white px-3 py-1.5 rounded mr-2"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#1D1D1F] border-b border-[#2A2A2A]">
              <th className="py-2 px-4 text-left text-sm font-medium text-[#86868B]">
                Date
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-[#86868B]">
                Day
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-[#86868B]">
                Shift
              </th>
              {availableMachines.map((machine) => (
                <th
                  key={machine}
                  className="py-2 px-4 text-left text-sm font-medium text-[#86868B]"
                >
                  {machine}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((day, dayIndex) => {
                return day.shifts.map((shift, shiftIndex) => (
                  <tr
                    key={`${day.date}-${shift.time}`}
                    className={`border-b border-[#2A2A2A] ${
                      dayIndex % 2 === 0 ? "bg-[#1A1A1A]" : "bg-[#1D1D1F]"
                    } hover:bg-[#2A2A2A]`}
                  >
                    {shiftIndex === 0 && (
                      <td
                        className="py-2 px-4 text-sm"
                        rowSpan={day.shifts.length}
                      >
                        {day.date}
                      </td>
                    )}
                    {shiftIndex === 0 && (
                      <td
                        className="py-2 px-4 text-sm"
                        rowSpan={day.shifts.length}
                      >
                        {day.day || getDayAbbreviation(dayIndex % 7)}
                      </td>
                    )}
                    <td className="py-2 px-4 text-sm">{shift.time}</td>
                    {availableMachines.map((machine) => (
                      <td
                        key={`${day.date}-${shift.time}-${machine}`}
                        className="py-2 px-4 text-sm relative"
                        onClick={() =>
                          handleCellClick(day.date, shift.time, machine)
                        }
                      >
                        {editingCell &&
                        editingCell.date === day.date &&
                        editingCell.time === shift.time &&
                        editingCell.machine === machine ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleCellBlur}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="bg-[#2A2A2A] text-white border border-[#67e8f9] rounded px-2 py-1 w-full focus:outline-none"
                          />
                        ) : (
                          <span
                            className={`block w-full h-full cursor-pointer ${
                              shift.operators[machine] ? "" : "text-[#86868B]"
                            }`}
                          >
                            {shift.operators[machine] || ""}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ));
              })
            ) : (
              <tr>
                <td
                  colSpan={3 + availableMachines.length}
                  className="py-4 px-4 text-center text-[#86868B]"
                >
                  No data available or no matches for current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Operators</h3>
        <div className="flex flex-wrap gap-2">
          {operators.map((operator, index) => (
            <div
              key={index}
              className="bg-[#1D1D1F] border border-[#2A2A2A] rounded-lg px-3 py-1.5 text-sm"
            >
              {operator}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StoryComponent() {
  const mockOperators = ["John Doe", "Jane Smith", "Mark Johnson", "Sarah Williams", "Robert Brown"];
  
  const mockData = [
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
            "A35-J-924": "Sarah Williams"
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
            "M53-E-929": "Robert Brown",
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
            "M58-J-467": "Robert Brown",
            "M53-E-929": "John Doe",
            "A35-J-924": ""  
          }
        },
        {
          time: "20.00-04.00",
          operators: {
            "M58-J-467": "",
            "M53-E-929": "Sarah Williams",
            "A35-J-924": "Jane Smith"
          }
        }
      ]
    }
  ];
  
  const mockWeeks = [
    { weekNumber: 1, year: 2025, dateRange: "01.01 - 07.01" },
    { weekNumber: 2, year: 2025, dateRange: "08.01 - 14.01" },
    { weekNumber: 3, year: 2025, dateRange: "15.01 - 21.01" }
  ];

  return (
    <div className="p-4 bg-[#121214] min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">BinBin Complete with Filters</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Default View</h2>
        <MainComponent 
          initialData={mockData}
          initialOperators={mockOperators}
          availableWeeks={mockWeeks}
          onSave={(data) => console.log("Saving data:", data)}
          onWeekChange={(week) => console.log("Week changed:", week)}
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Empty State</h2>
        <MainComponent 
          initialData={[]}
          initialOperators={[]}
          availableWeeks={[]}
          onSave={(data) => console.log("Saving data:", data)}
          onWeekChange={(week) => console.log("Week changed:", week)}
        />
      </div>
    </div>
  );
});
}