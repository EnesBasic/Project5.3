"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  data = [],
  title = "Schedule Overview",
  onEdit = () => {},
  onDelete = () => {},
  onAdd = () => {},
  onExport = () => {},
  onImport = () => {},
  onFilterChange = () => {},
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showFilterPanel, setShowFilterPanel] = React.useState(false);
  const [filters, setFilters] = React.useState({
    date: "",
    shift: "",
    operator: "",
    machine: "",
  });
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: "ascending",
  });

  const uniqueDates = React.useMemo(() => 
    [...new Set(data.map(item => item.date))].sort(), [data]);
  
  const uniqueShifts = React.useMemo(() => 
    [...new Set(data.map(item => item.shift))].sort(), [data]);
  
  const uniqueOperators = React.useMemo(() => 
    [...new Set(data.map(item => item.operator))].sort(), [data]);
  
  const uniqueMachines = React.useMemo(() => 
    [...new Set(data.map(item => item.machine))].sort(), [data]);

  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      date: "",
      shift: "",
      operator: "",
      machine: "",
    });
    onFilterChange({});
  };

  const applyFilters = () => {
    setShowFilterPanel(false);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredData = React.useMemo(() => {
    let result = [...data];
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(item => 
        Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(lowerSearchTerm)
        )
      );
    }
    
    if (filters.date) {
      result = result.filter(item => item.date === filters.date);
    }
    if (filters.shift) {
      result = result.filter(item => item.shift === filters.shift);
    }
    if (filters.operator) {
      result = result.filter(item => item.operator === filters.operator);
    }
    if (filters.machine) {
      result = result.filter(item => item.machine === filters.machine);
    }
    
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [data, searchTerm, filters, sortConfig]);

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-[#1D1D1F] text-white rounded-lg shadow-lg p-4 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex space-x-2">
          <button 
            onClick={onExport} 
            className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white px-3 py-1 rounded text-sm flex items-center"
          >
            <i className="fas fa-file-export mr-1"></i> Export
          </button>
          <button 
            onClick={onImport} 
            className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white px-3 py-1 rounded text-sm flex items-center"
          >
            <i className="fas fa-file-import mr-1"></i> Import
          </button>
          <button 
            onClick={onAdd} 
            className="bg-[#67e8f9] hover:bg-[#22d3ee] text-black px-3 py-1 rounded text-sm flex items-center"
          >
            <i className="fas fa-plus mr-1"></i> Add
          </button>
        </div>
      </div>
      
      <div className="flex items-center mb-4 relative">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search..."
            className="bg-[#2A2A2A] text-white px-3 py-2 rounded w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        <button 
          onClick={toggleFilterPanel}
          className={`ml-2 px-3 py-2 rounded flex items-center ${activeFiltersCount > 0 ? 'bg-[#67e8f9] text-black' : 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]'}`}
        >
          <i className="fas fa-filter mr-1"></i>
          {activeFiltersCount > 0 && (
            <span className="bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs ml-1">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>
      
      {showFilterPanel && (
        <div className="bg-[#2A2A2A] rounded-lg p-4 mb-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <select 
                className="bg-[#3A3A3A] text-white px-3 py-2 rounded w-full"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              >
                <option value="">All Dates</option>
                {uniqueDates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Shift</label>
              <select 
                className="bg-[#3A3A3A] text-white px-3 py-2 rounded w-full"
                value={filters.shift}
                onChange={(e) => handleFilterChange("shift", e.target.value)}
              >
                <option value="">All Shifts</option>
                {uniqueShifts.map(shift => (
                  <option key={shift} value={shift}>{shift}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Operator</label>
              <select 
                className="bg-[#3A3A3A] text-white px-3 py-2 rounded w-full"
                value={filters.operator}
                onChange={(e) => handleFilterChange("operator", e.target.value)}
              >
                <option value="">All Operators</option>
                {uniqueOperators.map(operator => (
                  <option key={operator} value={operator}>{operator}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Machine</label>
              <select 
                className="bg-[#3A3A3A] text-white px-3 py-2 rounded w-full"
                value={filters.machine}
                onChange={(e) => handleFilterChange("machine", e.target.value)}
              >
                <option value="">All Machines</option>
                {uniqueMachines.map(machine => (
                  <option key={machine} value={machine}>{machine}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button 
              onClick={clearFilters}
              className="bg-[#3A3A3A] hover:bg-[#4A4A4A] text-white px-3 py-1 rounded text-sm"
            >
              Clear Filters
            </button>
            <button 
              onClick={applyFilters}
              className="bg-[#67e8f9] hover:bg-[#22d3ee] text-black px-3 py-1 rounded text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#2A2A2A] rounded-lg overflow-hidden">
          <thead className="bg-[#3A3A3A]">
            <tr>
              <th 
                className="px-4 py-2 text-left cursor-pointer hover:bg-[#4A4A4A]"
                onClick={() => requestSort("date")}
              >
                Date {getSortIndicator("date")}
              </th>
              <th 
                className="px-4 py-2 text-left cursor-pointer hover:bg-[#4A4A4A]"
                onClick={() => requestSort("shift")}
              >
                Shift {getSortIndicator("shift")}
              </th>
              <th 
                className="px-4 py-2 text-left cursor-pointer hover:bg-[#4A4A4A]"
                onClick={() => requestSort("machine")}
              >
                Machine {getSortIndicator("machine")}
              </th>
              <th 
                className="px-4 py-2 text-left cursor-pointer hover:bg-[#4A4A4A]"
                onClick={() => requestSort("operator")}
              >
                Operator {getSortIndicator("operator")}
              </th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr 
                  key={index} 
                  className={index % 2 === 0 ? "bg-[#2A2A2A]" : "bg-[#333333]"}
                >
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.shift}</td>
                  <td className="px-4 py-2">{item.machine}</td>
                  <td className="px-4 py-2">{item.operator}</td>
                  <td className="px-4 py-2 text-right">
                    <button 
                      onClick={() => onEdit(item)} 
                      className="text-[#67e8f9] hover:text-[#22d3ee] mr-2"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      onClick={() => onDelete(item)} 
                      className="text-red-400 hover:text-red-500"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-400">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        Showing {filteredData.length} of {data.length} entries
      </div>
    </div>
  );
}

function StoryComponent() {
  const [mockData, setMockData] = React.useState([
    { id: 1, date: "2025-01-01", shift: "Morning", machine: "M58-J-467", operator: "John Doe" },
    { id: 2, date: "2025-01-01", shift: "Evening", machine: "M53-E-929", operator: "Jane Smith" },
    { id: 3, date: "2025-01-02", shift: "Morning", machine: "A35-J-924", operator: "Mark Johnson" },
    { id: 4, date: "2025-01-02", shift: "Evening", machine: "M58-J-467", operator: "Sarah Williams" },
    { id: 5, date: "2025-01-03", shift: "Morning", machine: "M53-E-929", operator: "John Doe" },
    { id: 6, date: "2025-01-03", shift: "Evening", machine: "A35-J-924", operator: "Jane Smith" },
    { id: 7, date: "2025-01-04", shift: "Morning", machine: "M58-J-467", operator: "Mark Johnson" },
    { id: 8, date: "2025-01-04", shift: "Evening", machine: "M53-E-929", operator: "Sarah Williams" },
  ]);

  const handleEdit = (item) => {
    console.log("Edit item:", item);
  };

  const handleDelete = (item) => {
    setMockData(mockData.filter(i => i.id !== item.id));
    console.log("Delete item:", item);
  };

  const handleAdd = () => {
    const newId = Math.max(...mockData.map(item => item.id)) + 1;
    const newItem = {
      id: newId,
      date: "2025-01-05",
      shift: "Morning",
      machine: "A35-J-924",
      operator: "New Operator"
    };
    setMockData([...mockData, newItem]);
    console.log("Add new item");
  };

  const handleExport = () => {
    console.log("Export data");
  };

  const handleImport = () => {
    console.log("Import data");
  };

  const handleFilterChange = (filters) => {
    console.log("Filters changed:", filters);
  };

  return (
    <div className="p-4 bg-[#121214] min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">BinBin with Filters</h1>
      
      <MainComponent 
        data={mockData}
        title="Schedule Overview"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        onExport={handleExport}
        onImport={handleImport}
        onFilterChange={handleFilterChange}
      />
      
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
});
}