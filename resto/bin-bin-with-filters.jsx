"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  data = [],
  title = "Schedule Overview",
  onEdit = () => {},
  onDelete = () => {},
  onFilterChange = () => {},
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({
    dateRange: { start: "", end: "" },
    shift: "",
    operator: "",
    machine: "",
  });
  const [activeFilters, setActiveFilters] = React.useState(0);
  const [tempFilters, setTempFilters] = React.useState({
    dateRange: { start: "", end: "" },
    shift: "",
    operator: "",
    machine: "",
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    if (!showFilters) {
      setTempFilters({ ...filters });
    }
  };

  const applyFilters = () => {
    setFilters({ ...tempFilters });
    setShowFilters(false);
    
    let count = 0;
    if (tempFilters.dateRange.start || tempFilters.dateRange.end) count++;
    if (tempFilters.shift) count++;
    if (tempFilters.operator) count++;
    if (tempFilters.machine) count++;
    
    setActiveFilters(count);
    onFilterChange(tempFilters);
  };

  const resetFilters = () => {
    const emptyFilters = {
      dateRange: { start: "", end: "" },
      shift: "",
      operator: "",
      machine: "",
    };
    setTempFilters(emptyFilters);
    setFilters(emptyFilters);
    setActiveFilters(0);
    onFilterChange(emptyFilters);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const searchMatch =
        searchTerm === "" ||
        Object.values(item).some(
          (val) =>
            val &&
            val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      const dateMatch =
        (!filters.dateRange.start && !filters.dateRange.end) ||
        (item.date &&
          (!filters.dateRange.start ||
            new Date(item.date) >= new Date(filters.dateRange.start)) &&
          (!filters.dateRange.end ||
            new Date(item.date) <= new Date(filters.dateRange.end)));

      const shiftMatch =
        !filters.shift || (item.shift && item.shift === filters.shift);

      const operatorMatch =
        !filters.operator ||
        (item.operator &&
          item.operator.toLowerCase().includes(filters.operator.toLowerCase()));

      const machineMatch =
        !filters.machine ||
        (item.machine &&
          item.machine.toLowerCase().includes(filters.machine.toLowerCase()));

      return searchMatch && dateMatch && shiftMatch && operatorMatch && machineMatch;
    });
  }, [data, searchTerm, filters]);

  return (
    <div className="bg-[#1D1D1F] rounded-lg shadow-lg p-4 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#2A2A2A] text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#67e8f9]"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              <i className="fas fa-search"></i>
            </span>
          </div>
          <div className="relative">
            <button
              onClick={toggleFilters}
              className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white px-3 py-2 rounded-lg flex items-center"
            >
              <i className="fas fa-filter mr-1"></i>
              Filters
              {activeFilters > 0 && (
                <span className="ml-1.5 bg-[#67e8f9] text-[#1D1D1F] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>
            {showFilters && (
              <div className="absolute right-0 mt-2 w-80 bg-[#2A2A2A] rounded-lg shadow-lg p-4 z-10 animate-fade-in">
                <h3 className="text-white font-semibold mb-3">Filter Options</h3>
                
                <div className="mb-3">
                  <label className="block text-gray-300 text-sm mb-1">Date Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      className="bg-[#3A3A3A] text-white px-2 py-1 rounded w-1/2 text-sm"
                      value={tempFilters.dateRange.start}
                      onChange={(e) =>
                        setTempFilters({
                          ...tempFilters,
                          dateRange: { ...tempFilters.dateRange, start: e.target.value },
                        })
                      }
                    />
                    <input
                      type="date"
                      className="bg-[#3A3A3A] text-white px-2 py-1 rounded w-1/2 text-sm"
                      value={tempFilters.dateRange.end}
                      onChange={(e) =>
                        setTempFilters({
                          ...tempFilters,
                          dateRange: { ...tempFilters.dateRange, end: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="block text-gray-300 text-sm mb-1">Shift</label>
                  <select
                    className="bg-[#3A3A3A] text-white px-2 py-1 rounded w-full text-sm"
                    value={tempFilters.shift}
                    onChange={(e) =>
                      setTempFilters({ ...tempFilters, shift: e.target.value })
                    }
                  >
                    <option value="">All Shifts</option>
                    <option value="morning">Morning</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="block text-gray-300 text-sm mb-1">Operator</label>
                  <input
                    type="text"
                    className="bg-[#3A3A3A] text-white px-2 py-1 rounded w-full text-sm"
                    placeholder="Filter by operator name"
                    value={tempFilters.operator}
                    onChange={(e) =>
                      setTempFilters({ ...tempFilters, operator: e.target.value })
                    }
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm mb-1">Machine ID</label>
                  <input
                    type="text"
                    className="bg-[#3A3A3A] text-white px-2 py-1 rounded w-full text-sm"
                    placeholder="Filter by machine ID"
                    value={tempFilters.machine}
                    onChange={(e) =>
                      setTempFilters({ ...tempFilters, machine: e.target.value })
                    }
                  />
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={resetFilters}
                    className="bg-[#4A4A4A] hover:bg-[#5A5A5A] text-white px-3 py-1 rounded text-sm"
                  >
                    Reset
                  </button>
                  <button
                    onClick={applyFilters}
                    className="bg-[#67e8f9] hover:bg-[#4ad8e9] text-[#1D1D1F] px-3 py-1 rounded text-sm font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#2A2A2A] rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#3A3A3A] text-gray-300 text-left">
              <th className="px-4 py-3 text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-sm font-medium">Day</th>
              <th className="px-4 py-3 text-sm font-medium">Shift</th>
              <th className="px-4 py-3 text-sm font-medium">Machine</th>
              <th className="px-4 py-3 text-sm font-medium">Operator</th>
              <th className="px-4 py-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3A3A3A]">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="text-white hover:bg-[#3A3A3A]">
                  <td className="px-4 py-3 text-sm">{item.date}</td>
                  <td className="px-4 py-3 text-sm">{item.day}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.shift === "morning"
                          ? "bg-blue-900 text-blue-200"
                          : "bg-purple-900 text-purple-200"
                      }`}
                    >
                      {item.shift}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{item.machine}</td>
                  <td className="px-4 py-3 text-sm">{item.operator}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="text-[#67e8f9] hover:text-[#4ad8e9]"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                  No data found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {filteredData.length > 0 && (
        <div className="mt-4 text-right text-sm text-gray-400">
          Showing {filteredData.length} of {data.length} entries
        </div>
      )}
    </div>
  );
}

function StoryComponent() {
  const [mockData, setMockData] = React.useState([
    {
      date: "2025-01-15",
      day: "Monday", 
      shift: "morning",
      machine: "M58-J-467",
      operator: "John Doe",
    },
    {
      date: "2025-01-15",
      day: "Monday",
      shift: "evening", 
      machine: "M53-E-929",
      operator: "Jane Smith",
    },
    {
      date: "2025-01-16",
      day: "Tuesday",
      shift: "morning",
      machine: "A35-J-924", 
      operator: "Mark Johnson",
    },
    {
      date: "2025-01-16",
      day: "Tuesday",
      shift: "evening",
      machine: "M58-J-467",
      operator: "Sarah Williams",
    },
    {
      date: "2025-01-17",
      day: "Wednesday",
      shift: "morning",
      machine: "M53-E-929",
      operator: "John Doe",
    },
    {
      date: "2025-01-17",
      day: "Wednesday", 
      shift: "evening",
      machine: "A35-J-924",
      operator: "Jane Smith",
    },
    {
      date: "2025-01-18",
      day: "Thursday",
      shift: "morning",
      machine: "M58-J-467",
      operator: "Mark Johnson",
    },
    {
      date: "2025-01-18",
      day: "Thursday",
      shift: "evening",
      machine: "M53-E-929",
      operator: "Sarah Williams",
    },
  ]);

  const handleEdit = (item) => {
    console.log("Edit item:", item);
  };

  const handleDelete = (item) => {
    console.log("Delete item:", item);
    setMockData(mockData.filter((i) => i !== item));
  };

  const handleFilterChange = (filters) => {
    console.log("Filters applied:", filters);
  };

  return (
    <div className="p-6 bg-[#121214] min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">BinBin With Filters</h1>
      
      <MainComponent
        data={mockData}
        title="Schedule Overview"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFilterChange={handleFilterChange}
      />
      
      <div className="mt-12 border-t border-[#2A2A2A] pt-8">
        <h2 className="text-xl font-bold text-white mb-4">Empty State</h2>
        <MainComponent
          data={[]}
          title="Empty Schedule"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
});
}