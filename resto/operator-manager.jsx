"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  operators = [],
  onAddOperator = () => {},
  onRemoveOperator = () => {},
  onDragStart = () => {},
  onDragEnd = () => {},
  className = "",
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [newOperatorName, setNewOperatorName] = React.useState("");
  const [selectedColor, setSelectedColor] = React.useState("#67e8f9");
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  
  const colors = [
    "#67e8f9", "#10b981", "#8b5cf6", "#f43f5e", "#fbbf24", 
    "#ff9966", "#4a9eff", "#f97316", "#a855f7", "#14b8a6"
  ];

  const filteredOperators = React.useMemo(() => {
    if (!searchTerm.trim()) return operators;
    return operators.filter((operator) =>
      operator.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [operators, searchTerm]);

  const handleDragStart = (e, operator) => {
    onDragStart(e, operator);
    e.dataTransfer.setData("text/plain", JSON.stringify(operator));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleAddOperator = () => {
    if (newOperatorName.trim()) {
      onAddOperator({
        id: Date.now().toString(),
        name: newOperatorName.trim(),
        color: selectedColor
      });
      setNewOperatorName("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddOperator();
    }
  };

  return (
    <div className={`bg-[#1D1D1F] rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-sm font-medium">Operator Manager</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#67e8f9] hover:text-[#a5f3ff] text-xs flex items-center"
        >
          {isExpanded ? (
            <>
              <span>Collapse</span>
              <i className="fas fa-chevron-up ml-1"></i>
            </>
          ) : (
            <>
              <span>Expand</span>
              <i className="fas fa-chevron-down ml-1"></i>
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <>
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search operators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#2A2A2A] text-white text-xs rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setSearchTerm("")}
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            )}
          </div>

          <div
            className="flex flex-wrap gap-2 overflow-y-auto max-h-48 mb-3 p-1"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#67e8f9 #2A2A2A" }}
          >
            {filteredOperators.length > 0 ? (
              filteredOperators.map((operator) => (
                <div
                  key={operator.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, operator)}
                  onDragEnd={onDragEnd}
                  className="bg-[#2A2A2A] text-white text-xs rounded-full px-3 py-1.5 cursor-grab hover:bg-[#3A3A3A] active:cursor-grabbing flex items-center whitespace-nowrap group"
                >
                  <div 
                    className="w-2.5 h-2.5 rounded-full mr-1.5" 
                    style={{ backgroundColor: operator.color }}
                  ></div>
                  {operator.name}
                  <button 
                    onClick={() => onRemoveOperator(operator.id)}
                    className="ml-2 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-xs w-full text-center py-2">
                No operators found
              </div>
            )}
          </div>

          <div className="bg-[#2A2A2A] rounded p-2">
            <h4 className="text-white text-xs font-medium mb-2">Add New Operator</h4>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Operator name"
                  value={newOperatorName}
                  onChange={(e) => setNewOperatorName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-[#3A3A3A] text-white text-xs rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
                />
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-8 h-8 rounded flex items-center justify-center bg-[#3A3A3A] hover:bg-[#4A4A4A]"
                  style={{ borderColor: selectedColor }}
                >
                  <div 
                    className="w-5 h-5 rounded-full" 
                    style={{ backgroundColor: selectedColor }}
                  ></div>
                </button>
                
                {showColorPicker && (
                  <div className="absolute bottom-full left-0 mb-1 bg-[#3A3A3A] p-2 rounded shadow-lg z-10">
                    <div className="grid grid-cols-5 gap-1">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            setSelectedColor(color);
                            setShowColorPicker(false);
                          }}
                          className="w-5 h-5 rounded-full hover:ring-2 hover:ring-white"
                          style={{ backgroundColor: color }}
                        ></button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleAddOperator}
                disabled={!newOperatorName.trim()}
                className={`px-3 py-2 rounded text-xs font-medium ${
                  newOperatorName.trim()
                    ? "bg-[#67e8f9] text-[#1D1D1F] hover:bg-[#a5f3ff]"
                    : "bg-[#3A3A3A] text-gray-400 cursor-not-allowed"
                }`}
              >
                Add
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StoryComponent() {
  const [operators, setOperators] = React.useState([
    { id: "1", name: "John Doe", color: "#67e8f9" },
    { id: "2", name: "Jane Smith", color: "#10b981" },
    { id: "3", name: "Mark Johnson", color: "#8b5cf6" },
    { id: "4", name: "Emily Wilson", color: "#f43f5e" },
    { id: "5", name: "Michael Brown", color: "#fbbf24" },
    { id: "6", name: "Sarah Davis", color: "#ff9966" },
    { id: "7", name: "Robert Miller", color: "#4a9eff" },
    { id: "8", name: "Jennifer Garcia", color: "#f97316" },
    { id: "9", name: "William Martinez", color: "#a855f7" },
    { id: "10", name: "Elizabeth Anderson", color: "#14b8a6" },
  ]);

  const handleAddOperator = (newOperator) => {
    setOperators([...operators, newOperator]);
  };

  const handleRemoveOperator = (operatorId) => {
    setOperators(operators.filter(op => op.id !== operatorId));
  };

  const handleDragStart = (e, operator) => {
    console.log(`Dragging operator: ${operator.name}`);
  };

  return (
    <div className="p-4 bg-[#121214] min-h-screen">
      <h2 className="text-white text-xl mb-4">Operator Manager Component</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-white text-lg mb-2">Default View</h3>
          <MainComponent 
            operators={operators} 
            onAddOperator={handleAddOperator}
            onRemoveOperator={handleRemoveOperator}
            onDragStart={handleDragStart}
          />
        </div>

        <div>
          <h3 className="text-white text-lg mb-2">With Few Operators</h3>
          <MainComponent 
            operators={operators.slice(0, 3)} 
            onAddOperator={handleAddOperator}
            onRemoveOperator={handleRemoveOperator}
            onDragStart={handleDragStart}
          />
        </div>

        <div>
          <h3 className="text-white text-lg mb-2">Empty State</h3>
          <MainComponent 
            operators={[]} 
            onAddOperator={handleAddOperator}
            onRemoveOperator={handleRemoveOperator}
            onDragStart={handleDragStart}
          />
        </div>

        <div>
          <h3 className="text-white text-lg mb-2">Custom Width</h3>
          <MainComponent 
            operators={operators} 
            onAddOperator={handleAddOperator}
            onRemoveOperator={handleRemoveOperator}
            onDragStart={handleDragStart}
            className="max-w-[300px]"
          />
        </div>
      </div>
    </div>
  );
});
}