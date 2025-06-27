"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  operators = [],
  onAddOperator,
  onRemoveOperator,
  onDragStart,
  className = "",
  isReadOnly = false,
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [newOperator, setNewOperator] = React.useState("");
  const [showAddForm, setShowAddForm] = React.useState(false);

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

  const handleAddOperator = () => {
    if (newOperator.trim() && onAddOperator) {
      onAddOperator(newOperator.trim());
      setNewOperator("");
      setShowAddForm(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddOperator();
    }
  };

  return (
    <div className={`bg-[#1D1D1F] rounded-lg p-2 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white text-sm font-medium">Operateri</h3>
        <div className="flex items-center space-x-2">
          {!isReadOnly && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-[#67e8f9] hover:text-[#a5f3ff] text-xs"
            >
              {showAddForm ? (
                <i className="fas fa-times"></i>
              ) : (
                <i className="fas fa-plus"></i>
              )}
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#67e8f9] hover:text-[#a5f3ff] text-xs"
          >
            {isExpanded ? "Smanji" : "Proširi"}
          </button>
        </div>
      </div>

      {showAddForm && !isReadOnly && (
        <div className="mb-2 flex">
          <input
            type="text"
            placeholder="Ime operatera..."
            value={newOperator}
            onChange={(e) => setNewOperator(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-[#2A2A2A] text-white text-xs rounded-l px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
          />
          <button
            onClick={handleAddOperator}
            className="bg-[#67e8f9] text-[#1D1D1F] text-xs font-medium rounded-r px-2 py-1 hover:bg-[#a5f3ff]"
          >
            Dodaj
          </button>
        </div>
      )}

      <div className="relative mb-2">
        <input
          type="text"
          placeholder="Pretraži operatere..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#2A2A2A] text-white text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
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
        className={`flex flex-wrap gap-1 overflow-y-auto ${
          isExpanded ? "max-h-48" : "max-h-16"
        }`}
        style={{ scrollbarWidth: "thin", scrollbarColor: "#67e8f9 #2A2A2A" }}
      >
        {filteredOperators.length > 0 ? (
          filteredOperators.map((operator, index) => (
            <div
              key={index}
              draggable={!isReadOnly}
              onDragStart={(e) => handleDragStart(e, operator)}
              className="bg-[#2A2A2A] text-white text-xs rounded px-2 py-1 cursor-grab hover:bg-[#3A3A3A] active:cursor-grabbing flex items-center whitespace-nowrap group"
            >
              <i className="fas fa-user-circle mr-1 text-[#67e8f9]"></i>
              {operator}
              {!isReadOnly && onRemoveOperator && (
                <button
                  onClick={() => onRemoveOperator(operator)}
                  className="ml-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-xs w-full text-center py-1">
            Nema pronađenih operatera
          </div>
        )}
      </div>
    </div>
  );
}

  const [operators, setOperators] = React.useState([
    "Adnan Hodžić",
    "Emir Selimović",
    "Amina Begić",
    "Damir Kovačević",
    "Lejla Hasanović",
    "Mirza Delić",
    "Selma Mehmedović",
    "Tarik Ibrahimović",
  ]);

  const handleAddOperator = (newOperator) => {
    if (!operators.includes(newOperator)) {
      setOperators([...operators, newOperator]);
    }
  };

  const handleRemoveOperator = (operatorToRemove) => {
    setOperators(operators.filter((op) => op !== operatorToRemove));
  };

  const handleDragStart = (e, operator) => {
    console.log(`Povlačenje operatera: ${operator}`);
  };

  return (
    <div className="p-4 bg-[#121214] min-h-screen">
      <h2 className="text-white text-xl mb-4">
        Kompaktni Menadžer Operatera za BinBin
      </h2>

      <div className="mb-8">
        <h3 className="text-white text-lg mb-2">Standardni Prikaz</h3>
        <MainComponent
          operators={operators}
          onAddOperator={handleAddOperator}
          onRemoveOperator={handleRemoveOperator}
          onDragStart={handleDragStart}
        />
      </div>

      <div className="mb-8">
        <h3 className="text-white text-lg mb-2">Samo za Čitanje</h3>
        <MainComponent
          operators={operators}
          onDragStart={handleDragStart}
          isReadOnly={true}
        />
      </div>

      <div className="mb-8">
        <h3 className="text-white text-lg mb-2">Sa Malo Operatera</h3>
        <MainComponent
          operators={operators.slice(0, 3)}
          onAddOperator={handleAddOperator}
          onRemoveOperator={handleRemoveOperator}
          onDragStart={handleDragStart}
        />
      </div>

      <div className="mb-8">
        <h3 className="text-white text-lg mb-2">Prilagođena Širina</h3>
        <MainComponent
          operators={operators}
          onAddOperator={handleAddOperator}
          onRemoveOperator={handleRemoveOperator}
          onDragStart={handleDragStart}
          className="max-w-[300px]"
        />
      </div>

      <div>
        <h3 className="text-white text-lg mb-2">Bez Operatera</h3>
        <MainComponent
          operators={[]}
          onAddOperator={handleAddOperator}
          onRemoveOperator={handleRemoveOperator}
          onDragStart={handleDragStart}
        />
      </div>
    </div>
  );
});
}