"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  operators = [],
  operatorColors = {},
  onRemoveOperator = () => {},
  onAddOperator = () => {},
  onDragStart = () => {},
  onDragEnd = () => {},
  onColorChange = () => {},
  title = "Operators",
  searchPlaceholder = "Search operators...",
  addButtonText = "Add Operator", 
  emptyStateText = "No operators found",
  maxHeight = "300px",
  className = "",
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [newOperatorName, setNewOperatorName] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);
  
  const filteredOperators = React.useMemo(() => {
    if (!searchTerm.trim()) return operators;
    return operators.filter(operator => 
      operator.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [operators, searchTerm]);

  const getContrastTextColor = (bgColor) => {
    if (!bgColor) return "#FFFFFF";
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  const handleAddOperator = () => {
    if (newOperatorName.trim()) {
      onAddOperator(newOperatorName.trim());
      setNewOperatorName("");
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddOperator();
    }
  };

  return (
    <div className={`bg-[#1D1D1F] rounded-lg shadow-lg overflow-hidden ${className}`}>
      <div className="p-3 bg-[#2A2A2A] border-b border-[#3A3A3A] flex justify-between items-center">
        <h3 className="text-sm font-bold text-[#67e8f9]">{title}</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs text-white hover:text-[#67e8f9] transition-colors"
        >
          <i className={`fas fa-${isAdding ? 'times' : 'plus'} mr-1`}></i>
          {isAdding ? "Cancel" : addButtonText}
        </button>
      </div>

      <div className="p-2">
        <div className="relative mb-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="bg-[#3A3A3A] text-white border border-[#4A4A4A] rounded px-3 py-1.5 pl-8 w-full text-xs focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent"
          />
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#86868B] text-xs"></i>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#86868B] hover:text-white"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          )}
        </div>

        {isAdding && (
          <div className="mb-2 bg-[#2A2A2A] p-2 rounded">
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newOperatorName}
                onChange={(e) => setNewOperatorName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Operator name"
                className="bg-[#3A3A3A] text-white border border-[#4A4A4A] rounded px-2 py-1 text-xs flex-1 min-w-0 focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent"
                autoFocus
              />
              <button
                onClick={handleAddOperator}
                className="bg-gradient-to-r from-[#4a9eff] to-[#67e8f9] text-black font-medium px-2 py-1 rounded hover:opacity-90 transition-opacity text-xs whitespace-nowrap flex-shrink-0"
              >
                Add
              </button>
            </div>
          </div>
        )}

        <div 
          className="operator-list-container" 
          style={{ 
            maxHeight, 
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#67e8f9 #1D1D1F',
          }}
        >
          {filteredOperators.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {filteredOperators.map((operator) => {
                const operatorColor = operatorColors[operator] || "#4a9eff";
                const textColor = getContrastTextColor(operatorColor);
                
                return (
                  <div
                    key={operator}
                    className="group flex items-center rounded-full pl-1 pr-2 py-0.5 transition-all hover:shadow-md"
                    style={{ 
                      backgroundColor: operatorColor,
                      color: textColor,
                    }}
                    draggable="true"
                    onDragStart={() => onDragStart(operator)}
                    onDragEnd={onDragEnd}
                  >
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center mr-1 text-xs"
                      style={{ 
                        backgroundColor: `${textColor}20`,
                        color: textColor,
                      }}
                    >
                      <i className="fas fa-user"></i>
                    </div>
                    <span className="text-xs font-medium mr-1">{operator}</span>
                    <button
                      onClick={() => onRemoveOperator(operator)}
                      className="opacity-70 hover:opacity-100 transition-opacity"
                      style={{ color: textColor }}
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-[#86868B] italic text-xs">
              {searchTerm ? "No matching operators found" : emptyStateText}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .operator-list-container::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .operator-list-container::-webkit-scrollbar-track {
          background: #1D1D1F;
          border-radius: 3px;
        }
        
        .operator-list-container::-webkit-scrollbar-thumb {
          background: #4A4A4A;
          border-radius: 3px;
          border: 1px solid #67e8f9;
        }
        
        .operator-list-container::-webkit-scrollbar-thumb:hover {
          background: #67e8f9;
        }
      `}</style>
    </div>
  );
}

function StoryComponent() {
  const [operators, setOperators] = React.useState([
    "Adis", "Munib", "Sanin", "Farik", "Harun", "Almedin", "Enes", "Jasmin", "Kemal", "Mirza"
  ]);
  
  const [operatorColors, setOperatorColors] = React.useState({
    "Adis": "#4a9eff",
    "Munib": "#8b5cf6", 
    "Sanin": "#ef4444",
    "Farik": "#22c55e",
    "Harun": "#f59e0b",
    "Almedin": "#ec4899",
    "Enes": "#14b8a6",
    "Jasmin": "#6366f1",
    "Kemal": "#f97316",
    "Mirza": "#84cc16"
  });

  const handleRemoveOperator = (operatorToRemove) => {
    setOperators(operators.filter(op => op !== operatorToRemove));
  };

  const handleAddOperator = (newOperator) => {
    if (!operators.includes(newOperator)) {
      setOperators([...operators, newOperator]);
      
      const colors = ["#4a9eff", "#8b5cf6", "#ef4444", "#22c55e", "#f59e0b", "#ec4899", "#14b8a6"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setOperatorColors({...operatorColors, [newOperator]: randomColor});
    }
  };

  const handleDragStart = (operator) => {
    console.log(`Started dragging ${operator}`);
  };

  const handleDragEnd = () => {
    console.log("Drag ended");
  };

  const handleColorChange = (operator, color) => {
    setOperatorColors({...operatorColors, [operator]: color});
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Compact Operator Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Default State</h2>
          <MainComponent 
            operators={operators}
            operatorColors={operatorColors}
            onRemoveOperator={handleRemoveOperator}
            onAddOperator={handleAddOperator}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onColorChange={handleColorChange}
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Empty State</h2>
          <MainComponent 
            operators={[]}
            operatorColors={{}}
            onRemoveOperator={handleRemoveOperator}
            onAddOperator={handleAddOperator}
            onColorChange={handleColorChange}
            emptyStateText="No operators available"
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Custom Title and Button Text</h2>
          <MainComponent 
            operators={operators.slice(0, 5)}
            operatorColors={operatorColors}
            onRemoveOperator={handleRemoveOperator}
            onAddOperator={handleAddOperator}
            onColorChange={handleColorChange}
            title="Team Members"
            addButtonText="New Member"
            searchPlaceholder="Find member..."
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Limited Height</h2>
          <MainComponent 
            operators={operators}
            operatorColors={operatorColors}
            onRemoveOperator={handleRemoveOperator}
            onAddOperator={handleAddOperator}
            onColorChange={handleColorChange}
            maxHeight="150px"
          />
        </div>
      </div>
    </div>
  );
});
}