"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  operators = [],
  onDragStart,
  onDelete,
  className = "",
  title = "Operators",
  colorMap = {}
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isExpanded, setIsExpanded] = React.useState(false);

  const filteredOperators = React.useMemo(() => {
    if (!searchTerm.trim()) return operators;
    return operators.filter((operator) =>
      operator.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [operators, searchTerm]);

  const handleDragStart = (e, operator) => {
    if (onDragStart) {
      onDragStart(e, operator);
    }
    e.dataTransfer.setData("text/plain", operator);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDelete = (operator) => {
    if (onDelete) {
      onDelete(operator);
    }
  };

  const getOperatorColor = (operator) => {
    return colorMap[operator] || "#67e8f9";
  };

  return (
    <div className={`bg-[#1D1D1F] rounded-lg p-3 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-sm font-semibold">{title}</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#67e8f9] hover:text-[#a5f3ff] text-xs flex items-center"
        >
          {isExpanded ? (
            <>
              <i className="fas fa-chevron-up mr-1"></i> Collapse
            </>
          ) : (
            <>
              <i className="fas fa-chevron-down mr-1"></i> Expand
            </>
          )}
        </button>
      </div>

      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
          <i className="fas fa-search text-gray-400 text-xs"></i>
        </div>
        <input
          type="text"
          placeholder="Search operators..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#2A2A2A] text-white text-xs rounded pl-8 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
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
        className={`flex flex-wrap gap-2 overflow-y-auto transition-all duration-300 ${
          isExpanded ? "max-h-64" : "max-h-24"
        }`}
        style={{ scrollbarWidth: "thin", scrollbarColor: "#67e8f9 #2A2A2A" }}
      >
        {filteredOperators.length > 0 ? (
          filteredOperators.map((operator, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, operator)}
              className="bg-[#2A2A2A] text-white text-xs rounded-full px-3 py-1.5 cursor-grab hover:bg-[#3A3A3A] active:cursor-grabbing flex items-center whitespace-nowrap transition-colors duration-200"
            >
              <div 
                className="w-4 h-4 rounded-full mr-2 flex items-center justify-center"
                style={{ backgroundColor: getOperatorColor(operator) }}
              >
                <i className="fas fa-user text-[8px] text-[#1D1D1F]"></i>
              </div>
              <span className="mr-2">{operator}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(operator);
                }}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <i className="fas fa-times text-[10px]"></i>
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-xs w-full text-center py-2">
            No operators found
          </div>
        )}
      </div>
    </div>
  );
}

function StoryComponent() {
  const [operators, setOperators] = React.useState([
    "John Doe",
    "Jane Smith",
    "Mark Johnson",
    "Emily Wilson",
    "Michael Brown",
    "Sarah Davis",
    "Robert Miller",
    "Jennifer Garcia",
    "William Martinez",
    "Elizabeth Anderson",
  ]);

  const operatorColors = {
    "John Doe": "#ff9966",
    "Jane Smith": "#4a9eff",
    "Mark Johnson": "#10b981",
    "Emily Wilson": "#8b5cf6",
    "Michael Brown": "#f43f5e",
    "Sarah Davis": "#fbbf24",
    "Robert Miller": "#67e8f9",
    "Jennifer Garcia": "#ec4899",
    "William Martinez": "#a3e635",
    "Elizabeth Anderson": "#c084fc",
  };

  const handleDragStart = (e, operator) => {
    console.log(`Dragging operator: ${operator}`);
  };

  const handleDelete = (operator) => {
    console.log(`Deleting operator: ${operator}`);
    setOperators(operators.filter(op => op !== operator));
  };

  return (
    <div className="p-6 bg-[#121214] min-h-screen">
      <h2 className="text-white text-xl mb-6">Operator Drag Panel</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-white text-lg mb-3">Default View</h3>
            <MainComponent 
              operators={operators} 
              onDragStart={handleDragStart} 
              onDelete={handleDelete}
              colorMap={operatorColors}
            />
          </div>

          <div>
            <h3 className="text-white text-lg mb-3">With Few Operators</h3>
            <MainComponent
              operators={operators.slice(0, 3)}
              onDragStart={handleDragStart}
              onDelete={handleDelete}
              colorMap={operatorColors}
              title="Shift Operators"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-white text-lg mb-3">With Many Operators</h3>
            <MainComponent
              operators={[
                ...operators,
                ...operators.map((op) => `${op} (Shift 2)`),
              ]}
              onDragStart={handleDragStart}
              onDelete={handleDelete}
              colorMap={operatorColors}
              title="All Operators"
            />
          </div>

          <div>
            <h3 className="text-white text-lg mb-3">Custom Width</h3>
            <MainComponent
              operators={operators}
              onDragStart={handleDragStart}
              onDelete={handleDelete}
              colorMap={operatorColors}
              className="max-w-[300px]"
              title="Team A"
            />
          </div>
        </div>
      </div>
    </div>
  );
});
}