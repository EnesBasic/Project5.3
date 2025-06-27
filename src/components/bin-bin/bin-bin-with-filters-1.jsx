"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  data = [],
  title = "Schedule Overview",
  onRowClick = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onExport = () => {},
  onImport = () => {},
  onAdd = () => {},
  loading = false,
  error = null,
  searchPlaceholder = "Search schedules...",
  emptyStateMessage = "No schedules found",
  showActions = true,
  showSearch = true,
  showHeader = true,
  columns = [
    { id: "date", label: "Date", sortable: true },
    { id: "shift", label: "Shift", sortable: true },
    { id: "operator", label: "Operator", sortable: true },
    { id: "machine", label: "Machine", sortable: true },
  ],
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState({
    key: "date",
    direction: "ascending",
  });
  const [showFilterPanel, setShowFilterPanel] = React.useState(false);
  const [filters, setFilters] = React.useState({
    date: "",
    shift: "",
    operator: "",
    machine: "",
  });
  const [activeFilters, setActiveFilters] = React.useState({});
  const [filterOptions, setFilterOptions] = React.useState({
    dates: [],
    shifts: [],
    operators: [],
    machines: [],
  });

  React.useEffect(() => {
    if (data && data.length > 0) {
      const dates = [...new Set(data.map(item => item.date))];
      const shifts = [...new Set(data.map(item => item.shift))];
      const operators = [...new Set(data.map(item => item.operator))];
      const machines = [...new Set(data.map(item => item.machine))];
      
      setFilterOptions({
        dates,
        shifts,
        operators,
        machines,
      });
    }
  }, [data]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const applyFilters = () => {
    setActiveFilters(filters);
    setShowFilterPanel(false);
  };

  const clearFilters = () => {
    setFilters({
      date: "",
      shift: "",
      operator: "",
      machine: "",
    });
    setActiveFilters({});
  };

  const sortedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    
    let filteredData = [...data];
    
    if (Object.values(activeFilters).some(filter => filter !== "")) {
      filteredData = filteredData.filter(item => {
        return Object.entries(activeFilters).every(([key, value]) => {
          if (!value) return true;
          return item[key]?.toString().toLowerCase().includes(value.toLowerCase());
        });
      });
    }
    
    if (searchTerm) {
      filteredData = filteredData.filter(item => {
        return Object.values(item).some(
          value => 
            value && 
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    return [...filteredData].sort((a, b) => {
      if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;
      
      const aValue = a[sortConfig.key].toString().toLowerCase();
      const bValue = b[sortConfig.key].toString().toLowerCase();
      
      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [data, searchTerm, sortConfig, activeFilters]);

  const activeFilterCount = Object.values(activeFilters).filter(v => v !== "").length;

  return (
    <div className="w-full bg-[#1D1D1F] rounded-lg shadow-lg overflow-hidden font-inter">
      {showHeader && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-[#2A2A2A]">
          <h2 className="text-xl font-semibold text-white mb-3 sm:mb-0">{title}</h2>
          {showActions && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onAdd}
                className="bg-[#67e8f9] hover:bg-[#22d3ee] text-[#121214] px-3 py-1.5 rounded-md text-sm font-medium flex items-center"
              >
                <i className="fas fa-plus mr-1.5"></i>
                Add
              </button>
              <button
                onClick={onImport}
                className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center"
              >
                <i className="fas fa-file-import mr-1.5"></i>
                Import
              </button>
              <button
                onClick={onExport}
                className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center"
              >
                <i className="fas fa-file-export mr-1.5"></i>
                Export
              </button>
            </div>
          )}
        </div>
      )}

      {showSearch && (
        <div className="p-4 border-b border-[#2A2A2A]">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#2A2A2A] text-white rounded-md px-3 py-2 pl-9 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#86868B]"></i>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeFilterCount > 0 || showFilterPanel
                    ? "bg-[#67e8f9] text-[#121214]"
                    : "bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]"
                }`}
              >
                <i className="fas fa-filter mr-1.5"></i>
                Filter
                {activeFilterCount > 0 && (
                  <span className="ml-1.5 bg-[#121214] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]"
                >
                  <i className="fas fa-times mr-1.5"></i>
                  Clear
                </button>
              )}
            </div>
          </div>

          {showFilterPanel && (
            <div className="mt-3 p-3 bg-[#2A2A2A] rounded-md animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#86868B] mb-1">Date</label>
                  <select
                    value={filters.date}
                    onChange={(e) => handleFilterChange("date", e.target.value)}
                    className="w-full bg-[#3A3A3A] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
                  >
                    <option value="">All Dates</option>
                    {filterOptions.dates.map((date) => (
                      <option key={date} value={date}>
                        {date}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#86868B] mb-1">Shift</label>
                  <select
                    value={filters.shift}
                    onChange={(e) => handleFilterChange("shift", e.target.value)}
                    className="w-full bg-[#3A3A3A] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
                  >
                    <option value="">All Shifts</option>
                    {filterOptions.shifts.map((shift) => (
                      <option key={shift} value={shift}>
                        {shift}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#86868B] mb-1">Operator</label>
                  <select
                    value={filters.operator}
                    onChange={(e) => handleFilterChange("operator", e.target.value)}
                    className="w-full bg-[#3A3A3A] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
                  >
                    <option value="">All Operators</option>
                    {filterOptions.operators.map((operator) => (
                      <option key={operator} value={operator}>
                        {operator}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#86868B] mb-1">Machine</label>
                  <select
                    value={filters.machine}
                    onChange={(e) => handleFilterChange("machine", e.target.value)}
                    className="w-full bg-[#3A3A3A] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
                  >
                    <option value="">All Machines</option>
                    {filterOptions.machines.map((machine) => (
                      <option key={machine} value={machine}>
                        {machine}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => setShowFilterPanel(false)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-[#3A3A3A] text-white hover:bg-[#4A4A4A]"
                >
                  Cancel
                </button>
                <button
                  onClick={applyFilters}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-[#67e8f9] text-[#121214] hover:bg-[#22d3ee]"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#67e8f9]"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-500">{error}</div>
        ) : sortedData.length === 0 ? (
          <div className="text-center p-8 text-[#86868B]">
            {activeFilterCount > 0 ? "No results match your filters" : emptyStateMessage}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-[#2A2A2A]">
            <thead className="bg-[#2A2A2A]">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    scope="col"
                    className={`px-4 py-3 text-left text-xs font-medium text-[#86868B] uppercase tracking-wider ${
                      column.sortable ? "cursor-pointer hover:bg-[#3A3A3A]" : ""
                    }`}
                    onClick={() => column.sortable && handleSort(column.id)}
                  >
                    <div className="flex items-center">
                      {column.label}
                      {column.sortable && sortConfig.key === column.id && (
                        <span className="ml-1">
                          {sortConfig.direction === "ascending" ? (
                            <i className="fas fa-sort-up text-[#67e8f9]"></i>
                          ) : (
                            <i className="fas fa-sort-down text-[#67e8f9]"></i>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {showActions && <th scope="col" className="px-4 py-3 text-right"></th>}
              </tr>
            </thead>
            <tbody className="bg-[#1D1D1F] divide-y divide-[#2A2A2A]">
              {sortedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-[#2A2A2A] cursor-pointer transition-colors"
                  onClick={() => onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={`${rowIndex}-${column.id}`}
                      className="px-4 py-3 whitespace-nowrap text-sm text-white"
                    >
                      {row[column.id]}
                    </td>
                  ))}
                  {showActions && (
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                          className="text-[#67e8f9] hover:text-[#22d3ee]"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row);
                          }}
                          className="text-[#ef4444] hover:text-[#dc2626]"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

  const [mockData, setMockData] = React.useState([
    {
      id: 1,
      date: "2025-01-15",
      shift: "Morning (08:00-16:00)",
      operator: "John Doe",
      machine: "M58-J-467",
      status: "Completed",
    },
    {
      id: 2,
      date: "2025-01-15",
      shift: "Evening (16:00-00:00)",
      operator: "Jane Smith",
      machine: "M53-E-929",
      status: "In Progress",
    },
    {
      id: 3,
      date: "2025-01-16",
      shift: "Night (00:00-08:00)",
      operator: "Mark Johnson",
      machine: "A35-J-924",
      status: "Scheduled",
    },
    {
      id: 4,
      date: "2025-01-17",
      shift: "Morning (08:00-16:00)",
      operator: "Sarah Williams",
      machine: "M58-J-467",
      status: "Completed",
    },
    {
      id: 5,
      date: "2025-01-18",
      shift: "Evening (16:00-00:00)",
      operator: "John Doe",
      machine: "M53-E-929",
      status: "Scheduled",
    },
  ]);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleRowClick = (row) => {
    console.log("Row clicked:", row);
  };

  const handleEdit = (row) => {
    console.log("Edit row:", row);
  };

  const handleDelete = (row) => {
    console.log("Delete row:", row);
    setMockData(mockData.filter((item) => item.id !== row.id));
  };

  const handleAdd = () => {
    console.log("Add new row");
    const newId = Math.max(...mockData.map((item) => item.id)) + 1;
    const newRow = {
      id: newId,
      date: "2025-01-20",
      shift: "Morning (08:00-16:00)",
      operator: "New Operator",
      machine: "New Machine",
      status: "Scheduled",
    };
    setMockData([...mockData, newRow]);
  };

  const handleExport = () => {
    console.log("Export data");
  };

  const handleImport = () => {
    console.log("Import data");
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const simulateError = () => {
    setError("Failed to load data. Please try again later.");
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#121214] p-4 font-inter">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-white text-2xl font-semibold mb-4">BinBinWithFilters Component</h1>
          <p className="text-[#86868B] mb-6">
            A data table component with search, sort, and filter functionality
          </p>

          <div className="mb-8">
            <MainComponent
              data={mockData}
              title="Schedule Overview"
              onRowClick={handleRowClick}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
              onExport={handleExport}
              onImport={handleImport}
              searchPlaceholder="Search schedules..."
              emptyStateMessage="No schedules found"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">Loading State</h2>
            <MainComponent
              data={mockData}
              title="Loading Example"
              loading={true}
              showActions={false}
            />
          </div>

          <div>
            <h2 className="text-white text-xl font-semibold mb-4">Error State</h2>
            <MainComponent
              data={[]}
              title="Error Example"
              error="Failed to load data. Please try again."
              showActions={false}
            />
          </div>
        </div>

        <div>
          <h2 className="text-white text-xl font-semibold mb-4">Empty State</h2>
          <MainComponent
            data={[]}
            title="Empty Example"
            emptyStateMessage="No data available"
            showActions={false}
          />
        </div>

        <div>
          <h2 className="text-white text-xl font-semibold mb-4">Custom Columns</h2>
          <MainComponent
            data={mockData}
            title="Custom Columns Example"
            columns={[
              { id: "date", label: "Date", sortable: true },
              { id: "operator", label: "Operator", sortable: true },
              { id: "status", label: "Status", sortable: true },
            ]}
            showActions={false}
          />
        </div>

        <div className="bg-[#1D1D1F]/80 rounded-lg p-4">
          <h2 className="text-white text-xl font-semibold mb-4">Component Controls</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={simulateLoading}
              className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white px-4 py-2 rounded-md"
            >
              Simulate Loading
            </button>
            <button
              onClick={simulateError}
              className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white px-4 py-2 rounded-md"
            >
              Simulate Error
            </button>
            <button
              onClick={() => setMockData([])}
              className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white px-4 py-2 rounded-md"
            >
              Clear Data
            </button>
            <button
              onClick={() => setMockData(mockData)}
              className="bg-[#67e8f9] hover:bg-[#22d3ee] text-[#121214] px-4 py-2 rounded-md"
            >
              Reset Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
}