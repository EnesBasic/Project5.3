"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  operators = [],
  onAddOperator,
  onRemoveOperator,
  onUpdateOperator,
  className = "",
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddingOperator, setIsAddingOperator] = React.useState(false);
  const [newOperatorName, setNewOperatorName] = React.useState("");
  const [newOperatorColor, setNewOperatorColor] = React.useState("#67e8f9");
  const [isExpanded, setIsExpanded] = React.useState(false);

  const colors = [
    "#67e8f9", // cyan
    "#10b981", // green
    "#8b5cf6", // purple
    "#f43f5e", // red
    "#fbbf24", // yellow
    "#ff9966", // orange
    "#4a9eff", // blue
  ];

  const filteredOperators = React.useMemo(() => {
    if (!searchTerm.trim()) return operators;
    return operators.filter((operator) =>
      operator.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [operators, searchTerm]);

  const handleAddOperator = () => {
    if (newOperatorName.trim() && onAddOperator) {
      onAddOperator({
        name: newOperatorName.trim(),
        color: newOperatorColor,
      });
      setNewOperatorName("");
      setIsAddingOperator(false);
    }
  };

  const handleRemoveOperator = (operatorId) => {
    if (onRemoveOperator) {
      onRemoveOperator(operatorId);
    }
  };

  return (
    <div className={`bg-[#1D1D1F] rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-sm font-medium">Operators</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#67e8f9] hover:text-[#a5f3ff] text-xs"
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
          <button
            onClick={() => setIsAddingOperator(!isAddingOperator)}
            className="text-[#67e8f9] hover:text-[#a5f3ff] text-xs flex items-center"
          >
            <i className={`fas ${isAddingOperator ? "fa-times" : "fa-plus"} mr-1`}></i>
            {isAddingOperator ? "Cancel" : "Add"}
          </button>
        </div>
      </div>

      <div className="relative mb-2">
        <input
          type="text"
          placeholder="Search operators..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#2A2A2A] text-white text-xs rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
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

      {isAddingOperator && (
        <div className="mb-3 bg-[#2A2A2A] p-2 rounded">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Operator name"
              value={newOperatorName}
              onChange={(e) => setNewOperatorName(e.target.value)}
              className="flex-1 bg-[#3A3A3A] text-white text-xs rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
            />
            <button
              onClick={handleAddOperator}
              disabled={!newOperatorName.trim()}
              className={`bg-[#67e8f9] text-[#1D1D1F] text-xs rounded px-2 py-1.5 ${
                !newOperatorName.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-[#a5f3ff]"
              }`}
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setNewOperatorColor(color)}
                className={`w-5 h-5 rounded-full ${
                  newOperatorColor === color ? "ring-2 ring-white" : ""
                }`}
                style={{ backgroundColor: color }}
              ></button>
            ))}
          </div>
        </div>
      )}

      <div
        className={`flex flex-wrap gap-1.5 overflow-y-auto ${
          isExpanded ? "max-h-48" : "max-h-20"
        }`}
        style={{ scrollbarWidth: "thin", scrollbarColor: "#67e8f9 #2A2A2A" }}
      >
        {filteredOperators.length > 0 ? (
          filteredOperators.map((operator) => (
            <div
              key={operator.id}
              className="bg-[#2A2A2A] text-white text-xs rounded-full px-2 py-1 flex items-center whitespace-nowrap"
            >
              <span
                className="w-2.5 h-2.5 rounded-full mr-1.5"
                style={{ backgroundColor: operator.color }}
              ></span>
              <span className="mr-1.5">{operator.name}</span>
              <button
                onClick={() => handleRemoveOperator(operator.id)}
                className="text-gray-400 hover:text-white"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-xs w-full text-center py-2">
            {searchTerm ? "No operators found" : "No operators added"}
          </div>
        )}
      </div>
    </div>
  );
}

function StoryComponent() {
  const [operators, setOperators] = React.useState([
    { id: 1, name: "John Doe", color: "#67e8f9" },
    { id: 2, name: "Jane Smith", color: "#10b981" },
    { id: 3, name: "Mark Johnson", color: "#8b5cf6" },
    { id: 4, name: "Emily Wilson", color: "#f43f5e" },
    { id: 5, name: "Michael Brown", color: "#fbbf24" },
  ]);

  const handleAddOperator = (newOperator) => {
    setOperators([
      ...operators,
      {
        id: operators.length > 0 ? Math.max(...operators.map(o => o.id)) + 1 : 1,
        ...newOperator
      }
    ]);
  };

  const handleRemoveOperator = (operatorId) => {
    setOperators(operators.filter(op => op.id !== operatorId));
  };

  return (
    <div className="p-4 bg-[#121214] min-h-screen">
      <h2 className="text-white text-xl mb-4">Compact Operator Manager</h2>

      <div className="mb-8">
        <h3 className="text-white text-lg mb-2">Default View</h3>
        <MainComponent 
          operators={operators} 
          onAddOperator={handleAddOperator}
          onRemoveOperator={handleRemoveOperator}
        />
      </div>

      <div className="mb-8">
        <h3 className="text-white text-lg mb-2">Empty State</h3>
        <MainComponent 
          operators={[]} 
          onAddOperator={handleAddOperator}
          onRemoveOperator={handleRemoveOperator}
        />
      </div>

      <div className="mb-8">
        <h3 className="text-white text-lg mb-2">Many Operators</h3>
        <MainComponent 
          operators={[
            ...operators,
            { id: 6, name: "Sarah Davis", color: "#ff9966" },
            { id: 7, name: "Robert Miller", color: "#4a9eff" },
            { id: 8, name: "Jennifer Garcia", color: "#67e8f9" },
            { id: 9, name: "William Martinez", color: "#10b981" },
            { id: 10, name: "Elizabeth Anderson", color: "#8b5cf6" },
            { id: 11, name: "David Thompson", color: "#f43f5e" },
            { id: 12, name: "Lisa Rodriguez", color: "#fbbf24" },
          ]}
          onAddOperator={handleAddOperator}
          onRemoveOperator={handleRemoveOperator}
        />
      </div>

      <div>
        <h3 className="text-white text-lg mb-2">Custom Width</h3>
        <MainComponent 
          operators={operators} 
          onAddOperator={handleAddOperator}
          onRemoveOperator={handleRemoveOperator}
          className="max-w-[300px]"
        />
      </div>
    </div>
  );
});
}