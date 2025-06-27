"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  operators = [],
  onAddOperator,
  onDeleteOperator,
  onDragStart,
  onCollapse,
  isCollapsed = false,
  operatorColors = {},
  className = ""
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [draggedOperator, setDraggedOperator] = React.useState(null);
  
  const filteredOperators = React.useMemo(() => {
    if (!searchTerm.trim()) return operators;
    return operators.filter((operator) =>
      operator.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [operators, searchTerm]);

  const handleDragStart = (e, operator) => {
    setDraggedOperator(operator);
    if (onDragStart) {
      onDragStart(e, operator);
    }
    e.dataTransfer.setData("text/plain", operator);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedOperator(null);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const getOperatorColor = (operator) => {
    return operatorColors[operator] || "#67e8f9";
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-[#1D1D1F] border-t border-[#2A2A2A] shadow-lg z-10 transition-all duration-300 ${isCollapsed ? 'h-10' : 'h-[220px]'} ${className}`}>
      <div className="px-4 py-2 flex items-center justify-between border-b border-[#2A2A2A]">
        <h3 className="text-white text-sm font-medium">Operators</h3>
        <div className="flex items-center space-x-2">
          {!isCollapsed && (
            <button
              onClick={onAddOperator}
              className="text-[#67e8f9] hover:text-[#a5f3ff] text-xs bg-[#2A2A2A] px-2 py-1 rounded flex items-center"
            >
              <i className="fas fa-plus mr-1"></i>
              Add Operator
            </button>
          )}
          <button
            onClick={onCollapse}
            className="text-[#67e8f9] hover:text-[#a5f3ff] text-xs"
          >
            <i className={`fas fa-chevron-${isCollapsed ? 'up' : 'down'}`}></i>
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="px-4 py-2">
            <div className="relative">
              <input
                type="text"
                name="operator-search"
                placeholder="Search operators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#2A2A2A] text-white text-xs rounded pl-8 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={handleClearSearch}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col h-[130px]">
            <div className="px-4 py-1 text-xs text-gray-400">
              Drag operators to schedule
            </div>
            <div 
              className="px-4 py-1 flex flex-wrap gap-2 overflow-y-auto flex-1"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#67e8f9 #2A2A2A" }}
            >
              {filteredOperators.length > 0 ? (
                filteredOperators.map((operator, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, operator)}
                    onDragEnd={handleDragEnd}
                    className={`bg-[#2A2A2A] text-white text-xs rounded px-2 py-1 cursor-grab hover:bg-[#3A3A3A] active:cursor-grabbing flex items-center ${draggedOperator === operator ? 'opacity-50' : ''}`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full flex items-center justify-center mr-1.5" 
                      style={{ backgroundColor: getOperatorColor(operator) }}
                    >
                      <i className="fas fa-user text-[8px] text-[#1D1D1F]"></i>
                    </div>
                    <span className="mr-2">{operator}</span>
                    <button 
                      onClick={() => onDeleteOperator && onDeleteOperator(operator)}
                      className="text-gray-400 hover:text-white ml-1"
                    >
                      <i className="fas fa-times text-[10px]"></i>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-xs w-full text-center py-4">
                  No operators found
                </div>
              )}
            </div>
          </div>
        </>
      )}
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
  
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [dragTarget, setDragTarget] = React.useState(null);
  
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
    "Elizabeth Anderson": "#c084fc"
  };

  const handleAddOperator = () => {
    const newOperator = `New Operator ${Math.floor(Math.random() * 100)}`;
    setOperators([...operators, newOperator]);
  };

  const handleDeleteOperator = (operatorToDelete) => {
    setOperators(operators.filter(operator => operator !== operatorToDelete));
  };

  const handleDragStart = (e, operator) => {
    setDragTarget(operator);
    console.log(`Dragging operator: ${operator}`);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const operator = e.dataTransfer.getData("text/plain");
    if (operator) {
      console.log(`Dropped operator: ${operator} in drop zone`);
      setDragTarget(null);
    }
  };

  return (
    <div className="bg-[#121214] min-h-screen pb-[220px]">
      <div className="container mx-auto p-4">
        <h1 className="text-white text-2xl font-bold mb-6">Compact Operator Drag Section</h1>
        
        <div className="mb-8">
          <h2 className="text-white text-lg mb-4">Drop Zone Demo</h2>
          <div 
            className="bg-[#1D1D1F] border-2 border-dashed border-[#2A2A2A] rounded-lg h-[200px] flex items-center justify-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="text-center">
              {dragTarget ? (
                <p className="text-[#67e8f9] text-lg">Drop "{dragTarget}" here</p>
              ) : (
                <p className="text-gray-400">Drag an operator here</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-white text-lg mb-4">Expanded Panel</h2>
          <div className="bg-[#1D1D1F] border border-[#2A2A2A] rounded-lg h-[300px] relative">
            <div className="p-4">
              <p className="text-white">Content above the panel</p>
            </div>
            <MainComponent 
              operators={operators} 
              onAddOperator={handleAddOperator}
              onDeleteOperator={handleDeleteOperator}
              onDragStart={handleDragStart}
              onCollapse={toggleCollapse}
              isCollapsed={false}
              operatorColors={operatorColors}
              className="absolute"
            />
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-white text-lg mb-4">Collapsed Panel</h2>
          <div className="bg-[#1D1D1F] border border-[#2A2A2A] rounded-lg h-[300px] relative">
            <div className="p-4">
              <p className="text-white">Content above the panel</p>
            </div>
            <MainComponent 
              operators={operators} 
              onAddOperator={handleAddOperator}
              onDeleteOperator={handleDeleteOperator}
              onDragStart={handleDragStart}
              onCollapse={toggleCollapse}
              isCollapsed={true}
              operatorColors={operatorColors}
              className="absolute"
            />
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-white text-lg mb-4">With Few Operators</h2>
          <div className="bg-[#1D1D1F] border border-[#2A2A2A] rounded-lg h-[300px] relative">
            <div className="p-4">
              <p className="text-white">Content above the panel</p>
            </div>
            <MainComponent 
              operators={operators.slice(0, 3)} 
              onAddOperator={handleAddOperator}
              onDeleteOperator={handleDeleteOperator}
              onDragStart={handleDragStart}
              onCollapse={toggleCollapse}
              isCollapsed={false}
              operatorColors={operatorColors}
              className="absolute"
            />
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-white text-lg mb-4">With Search Filtering</h2>
          <div className="bg-[#1D1D1F] border border-[#2A2A2A] rounded-lg h-[300px] relative">
            <div className="p-4">
              <p className="text-white">Try searching for "John" or "Smith" in the panel below</p>
            </div>
            <MainComponent 
              operators={operators} 
              onAddOperator={handleAddOperator}
              onDeleteOperator={handleDeleteOperator}
              onDragStart={handleDragStart}
              onCollapse={toggleCollapse}
              isCollapsed={false}
              operatorColors={operatorColors}
              className="absolute"
            />
          </div>
        </div>
      </div>
      
      <MainComponent 
        operators={operators} 
        onAddOperator={handleAddOperator}
        onDeleteOperator={handleDeleteOperator}
        onDragStart={handleDragStart}
        onCollapse={toggleCollapse}
        isCollapsed={isCollapsed}
        operatorColors={operatorColors}
      />
    </div>
  );
});
}