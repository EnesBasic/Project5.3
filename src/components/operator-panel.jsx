"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  operators = [],
  onAddOperator,
  onDeleteOperator,
  className = "",
}) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredOperators = React.useMemo(() => {
    if (!searchTerm.trim()) return operators;
    return operators.filter((operator) =>
      operator.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [operators, searchTerm]);

  const handleDragStart = (e, operator) => {
    e.dataTransfer.setData("text/plain", operator);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-10 ${className}`}>
      <div className="bg-[#1D1D1F] border-t border-[#2A2A2A] shadow-lg mx-auto max-w-7xl">
        <div className="px-4 py-2 flex items-center justify-between border-b border-[#2A2A2A]">
          <div className="flex items-center">
            <h3 className="text-white font-medium mr-2">Operators</h3>
            <span className="bg-[#2A2A2A] text-[#67e8f9] text-xs px-2 py-0.5 rounded-full">
              {operators.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onAddOperator}
              className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#67e8f9] text-xs px-2 py-1 rounded flex items-center"
            >
              <i className="fas fa-plus mr-1"></i>
              Add
            </button>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white text-xs px-2 py-1 rounded"
            >
              <i className={`fas fa-chevron-${isExpanded ? 'down' : 'up'}`}></i>
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-3">
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search operators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#2A2A2A] text-white text-sm rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setSearchTerm("")}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
              {filteredOperators.length > 0 ? (
                filteredOperators.map((operator, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, operator)}
                    className="bg-[#2A2A2A] text-white text-sm rounded-full px-3 py-1.5 cursor-grab hover:bg-[#3A3A3A] active:cursor-grabbing flex items-center group"
                  >
                    <i className="fas fa-user-circle mr-2 text-[#67e8f9]"></i>
                    {operator}
                    {onDeleteOperator && (
                      <button
                        onClick={() => onDeleteOperator(operator)}
                        className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm w-full text-center py-2">
                  No operators found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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

  const handleAddOperator = () => {
    const newOperatorName = prompt("Enter new operator name:");
    if (newOperatorName && newOperatorName.trim()) {
      setOperators([...operators, newOperatorName.trim()]);
    }
  };

  const handleDeleteOperator = (operatorToDelete) => {
    if (confirm(`Are you sure you want to remove ${operatorToDelete}?`)) {
      setOperators(operators.filter(op => op !== operatorToDelete));
    }
  };

  return (
    <div className="p-4 bg-[#121214] min-h-screen">
      <h2 className="text-white text-xl mb-4">Operator Panel Component</h2>
      
      <div className="mb-8">
        <h3 className="text-white text-lg mb-2">Default View</h3>
        <div className="border border-[#2A2A2A] rounded-lg p-4 bg-[#1A1A1C] h-[400px] relative">
          <div className="text-white mb-8">
            Main content area (schedule, calendar, etc.)
          </div>
          <MainComponent 
            operators={operators} 
            onAddOperator={handleAddOperator}
            onDeleteOperator={handleDeleteOperator}
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-white text-lg mb-2">With Few Operators</h3>
        <div className="border border-[#2A2A2A] rounded-lg p-4 bg-[#1A1A1C] h-[400px] relative">
          <div className="text-white mb-8">
            Main content area (schedule, calendar, etc.)
          </div>
          <MainComponent 
            operators={operators.slice(0, 3)} 
            onAddOperator={handleAddOperator}
            onDeleteOperator={handleDeleteOperator}
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-white text-lg mb-2">With Many Operators</h3>
        <div className="border border-[#2A2A2A] rounded-lg p-4 bg-[#1A1A1C] h-[400px] relative">
          <div className="text-white mb-8">
            Main content area (schedule, calendar, etc.)
          </div>
          <MainComponent 
            operators={[
              ...operators,
              ...operators.map((op) => `${op} (Shift 2)`),
            ]} 
            onAddOperator={handleAddOperator}
            onDeleteOperator={handleDeleteOperator}
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-white text-lg mb-2">Read-Only (No Delete)</h3>
        <div className="border border-[#2A2A2A] rounded-lg p-4 bg-[#1A1A1C] h-[400px] relative">
          <div className="text-white mb-8">
            Main content area (schedule, calendar, etc.)
          </div>
          <MainComponent 
            operators={operators} 
            onAddOperator={handleAddOperator}
          />
        </div>
      </div>
    </div>
  );
});
}