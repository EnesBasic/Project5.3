"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  onBack = () => {},
  selectedWeek = { weekNumber: 1, year: 2025 },
  formattedDropdownDate = "Jan 1 - Jan 7 2025",
  availableWeeks = [1, 2, 3],
  showSearch = false,
  setShowSearch = () => {},
  searchTerm = "",
  onSearchChange = () => {},
  onClearSearch = () => {},
  setIsDropdownOpen = () => {},
  handleWeekChange = () => {},
  showFilterPanel = false,
  setShowFilterPanel = () => {},
  activeFilters = 0,
  isEditing = false,
  setIsEditing = () => {},
  handleSave = () => {},
  handleCancel = () => {},
  dateFilter = "",
  shiftFilter = "",
  operatorFilter = "",
  machineFilter = "",
  onDateFilterChange = () => {},
  onShiftFilterChange = () => {},
  onOperatorFilterChange = () => {},
  onMachineFilterChange = () => {},
  onResetFilters = () => {},
  dates = [],
  shifts = [],
  operators = [],
  machines = [],
  isDropdownOpen = false,
  weekOptions = [],
  highlightedOperator = null,
  children = null,
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-1 bg-[#2A2A2A] border-b border-[#3A3A3A] flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-[#3A3A3A] text-[#67e8f9] border border-[#3A3A3A] h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center"
          title="Nazad"
        >
          <i className="fas fa-arrow-left text-sm"></i>
        </button>
        
        {showSearch ? (
          <div className="relative flex-grow mx-2">
            <input
              type="text"
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Pretraži operatore..."
              className="bg-[#3A3A3A] text-white border border-[#4A4A4A] rounded px-3 py-1 pl-8 w-full text-xs focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent h-7"
              autoFocus
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#86868B] text-xs"></i>
            {searchTerm && (
              <button
                onClick={onClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#86868B] hover:text-white"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            )}
            
            {highlightedOperator && (
              <div
                className="absolute right-8 top-1/2 transform -translate-y-1/2 px-2 py-0.5 rounded text-[10px] z-10 bg-[#4a9eff] text-white"
              >
                {highlightedOperator}
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-2 flex-grow justify-center">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-[#22c55e]/80 to-[#22c55e]/60 text-white h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center border border-[#22c55e]/30"
                  title="Sačuvaj"
                >
                  <i className="fas fa-save text-sm"></i>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gradient-to-r from-[#ef4444]/80 to-[#ef4444]/60 text-white h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center border border-[#ef4444]/30"
                  title="Otkaži"
                >
                  <i className="fas fa-times text-sm"></i>
                </button>
              </>
            ) : null}
          </div>
        )}
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`${showFilterPanel || activeFilters > 0 ? 'bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40' : 'bg-[#3A3A3A]'} text-[#67e8f9] border ${showFilterPanel || activeFilters > 0 ? 'border-[#67e8f9]/30' : 'border-[#3A3A3A]'} h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center relative`}
            title="Filter options"
          >
            <i className="fas fa-filter text-sm"></i>
            {activeFilters > 0 && (
              <div className="absolute -top-1.5 -right-1.5 bg-[#67e8f9] text-black text-[8px] font-bold rounded-full w-3 h-3 flex items-center justify-center">
                {activeFilters}
              </div>
            )}
          </button>
          
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`${showSearch ? 'bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40' : 'bg-[#3A3A3A]'} text-[#67e8f9] border ${showSearch ? 'border-[#67e8f9]/30' : 'border-[#3A3A3A]'} h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center`}
            title="Pretraži"
          >
            <i className="fas fa-search text-sm"></i>
          </button>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`${isEditing ? 'bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40' : 'bg-[#3A3A3A]'} text-[#67e8f9] border ${isEditing ? 'border-[#67e8f9]/30' : 'border-[#3A3A3A]'} h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center`}
            title={isEditing ? "Otkaži Uređivanje" : "Uredi"}
          >
            <i className={`fas fa-${isEditing ? 'times' : 'edit'} text-sm`}></i>
          </button>
        </div>
      </div>
      
      <div className="p-3 bg-[#2A2A2A] border-b border-[#3A3A3A]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="relative inline-block w-auto">
              <button
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent flex items-center justify-between text-xs"
                style={{ minWidth: "110px" }}
              >
                <span>
                  {selectedWeek.weekNumber + ":" + formattedDropdownDate}
                </span>
                <i className="fas fa-chevron-down ml-2 text-xs"></i>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-auto min-w-full bg-[#1D1D1F] border border-[#3A3A3A] rounded shadow-lg max-h-60 overflow-y-auto">
                  {weekOptions.map((week) => (
                    <div
                      key={week.weekNumber + "-" + week.year}
                      onClick={() => handleWeekChange(week.weekNumber, week.year)}
                      className="px-3 py-2 hover:bg-[#3A3A3A] cursor-pointer text-white whitespace-nowrap text-xs"
                    >
                      {week.weekNumber + ":" + week.formattedDate}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex w-full mt-1">
              <button
                onClick={() => handleWeekChange(selectedWeek.weekNumber - 1, selectedWeek.year)}
                className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded-l px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent flex items-center justify-center text-xs hover:bg-[#3A3A3A] transition-colors flex-1"
                disabled={!availableWeeks.includes(selectedWeek.weekNumber - 1)}
                title="Previous Week"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              <button
                onClick={() => handleWeekChange(selectedWeek.weekNumber + 1, selectedWeek.year)}
                className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded-r px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent flex items-center justify-center text-xs hover:bg-[#3A3A3A] transition-colors flex-1 border-l-0"
                disabled={!availableWeeks.includes(selectedWeek.weekNumber + 1)}
                title="Next Week"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          
          <div className="flex-grow text-center">
            <h2 className="text-lg font-bold bg-gradient-to-r from-[#4a9eff] to-[#67e8f9] text-transparent bg-clip-text px-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] filter-none transform scale-105 transition-transform duration-300">
              {formattedDropdownDate}
            </h2>
            <div className="h-0.5 w-32 bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40 mx-auto mt-1 rounded-full shadow-sm"></div>
          </div>
          
          <div className="w-8"></div>
        </div>
      </div>
      
      {showFilterPanel && (
        <div className="p-3 bg-[#2A2A2A] border-b border-[#3A3A3A]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-[#67e8f9]">Opcije Filtera</h3>
            <button 
              onClick={onResetFilters}
              className="text-xs text-[#67e8f9] hover:text-white"
            >
              Poništi Sve Filtere
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-white text-xs mb-1">Datum</label>
              <select
                value={dateFilter}
                onChange={onDateFilterChange}
                className="bg-[#3A3A3A] text-white border border-[#4A4A4A] rounded px-2 py-1.5 w-full text-xs focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent"
              >
                <option value="">Svi Datumi</option>
                {dates.map((date) => (
                  <option key={date.value} value={date.value}>
                    {date.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-white text-xs mb-1">Smjena</label>
              <select
                value={shiftFilter}
                onChange={onShiftFilterChange}
                className="bg-[#3A3A3A] text-white border border-[#4A4A4A] rounded px-2 py-1.5 w-full text-xs focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent"
              >
                <option value="">Sve Smjene</option>
                {shifts.map((shift) => (
                  <option key={shift.value} value={shift.value}>
                    {shift.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-white text-xs mb-1">Operator</label>
              <select
                value={operatorFilter}
                onChange={onOperatorFilterChange}
                className="bg-[#3A3A3A] text-white border border-[#4A4A4A] rounded px-2 py-1.5 w-full text-xs focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent"
              >
                <option value="">Svi Operatori</option>
                {operators.map((operator) => (
                  <option key={operator.value} value={operator.value}>
                    {operator.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-white text-xs mb-1">Vozilo</label>
              <select
                value={machineFilter}
                onChange={onMachineFilterChange}
                className="bg-[#3A3A3A] text-white border border-[#4A4A4A] rounded px-2 py-1.5 w-full text-xs focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent"
              >
                <option value="">Sva Vozila</option>
                {machines.map((machine) => (
                  <option key={machine.value} value={machine.value}>
                    {machine.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {activeFilters > 0 && (
            <div className="mt-3 p-2 bg-[#1D1D1F] rounded text-xs text-[#67e8f9]">
              <span className="font-medium">Aktivni Filteri: </span>
              {dateFilter && <span className="mr-2">Datum: {dateFilter}</span>}
              {shiftFilter && <span className="mr-2">Smjena: {shiftFilter}</span>}
              {operatorFilter && <span className="mr-2">Operator: {operatorFilter}</span>}
              {machineFilter && <span className="mr-2">Vozilo: {machineFilter}</span>}
            </div>
          )}
        </div>
      )}
      
      {children}
    </div>
  );
}

function StoryComponent() {
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [selectedWeek, setSelectedWeek] = React.useState({ weekNumber: 1, year: 2025 });
  const [showFilterPanel, setShowFilterPanel] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [dateFilter, setDateFilter] = React.useState("");
  const [shiftFilter, setShiftFilter] = React.useState("");
  const [operatorFilter, setOperatorFilter] = React.useState("");
  const [machineFilter, setMachineFilter] = React.useState("");
  const [highlightedOperator, setHighlightedOperator] = React.useState(null);
  
  const availableWeeks = [1, 2, 3, 4, 5];
  
  const weekOptions = [
    { weekNumber: 1, year: 2025, formattedDate: "01-07/01" },
    { weekNumber: 2, year: 2025, formattedDate: "08-14/01" },
    { weekNumber: 3, year: 2025, formattedDate: "15-21/01" },
    { weekNumber: 4, year: 2025, formattedDate: "22-28/01" },
    { weekNumber: 5, year: 2025, formattedDate: "29-04/02" },
  ];
  
  const dates = [
    { value: "01.01", label: "01.01 (P)" },
    { value: "02.01", label: "02.01 (U)" },
    { value: "03.01", label: "03.01 (S)" },
  ];
  
  const shifts = [
    { value: "08.00-16.00", label: "8-16" },
    { value: "21.00-05.00", label: "21-5" },
  ];
  
  const operators = [
    { value: "Adis", label: "Adis" },
    { value: "Munib", label: "Munib" },
    { value: "Sanin", label: "Sanin" },
  ];
  
  const machines = [
    { value: "M58-J-467", label: "M58-J-467" },
    { value: "M53-E-929", label: "M53-E-929" },
    { value: "A35-J-924", label: "A35-J-924" },
  ];
  
  const handleWeekChange = (weekNumber, year) => {
    setSelectedWeek({ weekNumber, year });
    setIsDropdownOpen(false);
  };
  
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === "") {
      setHighlightedOperator(null);
    } else {
      const matchedOperator = operators.find(op => 
        op.label.toLowerCase().includes(term.toLowerCase())
      )?.value || null;
      setHighlightedOperator(matchedOperator);
    }
  };
  
  const clearSearch = () => {
    setSearchTerm("");
    setHighlightedOperator(null);
  };
  
  const resetFilters = () => {
    setDateFilter("");
    setShiftFilter("");
    setOperatorFilter("");
    setMachineFilter("");
  };
  
  const activeFilters = [dateFilter, shiftFilter, operatorFilter, machineFilter].filter(Boolean).length;
  
  const handleSave = () => {
    alert("Schedule saved!");
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  return (
    <div className="p-4 bg-[#1D1D1F] min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">BinBin Header Component</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Default State</h2>
        <div className="bg-[#1D1D1F] rounded-lg shadow-lg overflow-hidden">
          <MainComponent
            selectedWeek={selectedWeek}
            formattedDropdownDate="01-07/01"
            availableWeeks={availableWeeks}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onClearSearch={clearSearch}
            setIsDropdownOpen={setIsDropdownOpen}
            handleWeekChange={handleWeekChange}
            showFilterPanel={showFilterPanel}
            setShowFilterPanel={setShowFilterPanel}
            activeFilters={activeFilters}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
            handleCancel={handleCancel}
            dateFilter={dateFilter}
            shiftFilter={shiftFilter}
            operatorFilter={operatorFilter}
            machineFilter={machineFilter}
            onDateFilterChange={(e) => setDateFilter(e.target.value)}
            onShiftFilterChange={(e) => setShiftFilter(e.target.value)}
            onOperatorFilterChange={(e) => setOperatorFilter(e.target.value)}
            onMachineFilterChange={(e) => setMachineFilter(e.target.value)}
            onResetFilters={resetFilters}
            dates={dates}
            shifts={shifts}
            operators={operators}
            machines={machines}
            isDropdownOpen={isDropdownOpen}
            weekOptions={weekOptions}
            highlightedOperator={highlightedOperator}
          >
            <div className="p-4 text-center text-white">
              <p>Schedule content would go here</p>
            </div>
          </MainComponent>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">With Search Active</h2>
        <div className="bg-[#1D1D1F] rounded-lg shadow-lg overflow-hidden">
          <MainComponent
            selectedWeek={selectedWeek}
            formattedDropdownDate="01-07/01"
            availableWeeks={availableWeeks}
            showSearch={true}
            setShowSearch={setShowSearch}
            searchTerm="ad"
            onSearchChange={handleSearchChange}
            onClearSearch={clearSearch}
            setIsDropdownOpen={setIsDropdownOpen}
            handleWeekChange={handleWeekChange}
            showFilterPanel={false}
            setShowFilterPanel={setShowFilterPanel}
            activeFilters={0}
            isEditing={false}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
            handleCancel={handleCancel}
            dates={dates}
            shifts={shifts}
            operators={operators}
            machines={machines}
            isDropdownOpen={false}
            weekOptions={weekOptions}
            highlightedOperator="Adis"
          >
            <div className="p-4 text-center text-white">
              <p>Schedule content would go here</p>
            </div>
          </MainComponent>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">With Filters Active</h2>
        <div className="bg-[#1D1D1F] rounded-lg shadow-lg overflow-hidden">
          <MainComponent
            selectedWeek={selectedWeek}
            formattedDropdownDate="01-07/01"
            availableWeeks={availableWeeks}
            showSearch={false}
            setShowSearch={setShowSearch}
            searchTerm=""
            onSearchChange={handleSearchChange}
            onClearSearch={clearSearch}
            setIsDropdownOpen={setIsDropdownOpen}
            handleWeekChange={handleWeekChange}
            showFilterPanel={true}
            setShowFilterPanel={setShowFilterPanel}
            activeFilters={2}
            isEditing={false}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
            handleCancel={handleCancel}
            dateFilter="01.01"
            shiftFilter="08.00-16.00"
            operatorFilter=""
            machineFilter=""
            onDateFilterChange={(e) => setDateFilter(e.target.value)}
            onShiftFilterChange={(e) => setShiftFilter(e.target.value)}
            onOperatorFilterChange={(e) => setOperatorFilter(e.target.value)}
            onMachineFilterChange={(e) => setMachineFilter(e.target.value)}
            onResetFilters={resetFilters}
            dates={dates}
            shifts={shifts}
            operators={operators}
            machines={machines}
            isDropdownOpen={false}
            weekOptions={weekOptions}
            highlightedOperator={null}
          >
            <div className="p-4 text-center text-white">
              <p>Schedule content would go here</p>
            </div>
          </MainComponent>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Editing Mode</h2>
        <div className="bg-[#1D1D1F] rounded-lg shadow-lg overflow-hidden">
          <MainComponent
            selectedWeek={selectedWeek}
            formattedDropdownDate="01-07/01"
            availableWeeks={availableWeeks}
            showSearch={false}
            setShowSearch={setShowSearch}
            searchTerm=""
            onSearchChange={handleSearchChange}
            onClearSearch={clearSearch}
            setIsDropdownOpen={setIsDropdownOpen}
            handleWeekChange={handleWeekChange}
            showFilterPanel={false}
            setShowFilterPanel={setShowFilterPanel}
            activeFilters={0}
            isEditing={true}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
            handleCancel={handleCancel}
            dateFilter=""
            shiftFilter=""
            operatorFilter=""
            machineFilter=""
            onDateFilterChange={(e) => setDateFilter(e.target.value)}
            onShiftFilterChange={(e) => setShiftFilter(e.target.value)}
            onOperatorFilterChange={(e) => setOperatorFilter(e.target.value)}
            onMachineFilterChange={(e) => setMachineFilter(e.target.value)}
            onResetFilters={resetFilters}
            dates={dates}
            shifts={shifts}
            operators={operators}
            machines={machines}
            isDropdownOpen={false}
            weekOptions={weekOptions}
            highlightedOperator={null}
          >
            <div className="p-4 text-center text-white">
              <p>Schedule content would go here</p>
            </div>
          </MainComponent>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Week Dropdown Open</h2>
        <div className="bg-[#1D1D1F] rounded-lg shadow-lg overflow-hidden">
          <MainComponent
            selectedWeek={selectedWeek}
            formattedDropdownDate="01-07/01"
            availableWeeks={availableWeeks}
            showSearch={false}
            setShowSearch={setShowSearch}
            searchTerm=""
            onSearchChange={handleSearchChange}
            onClearSearch={clearSearch}
            setIsDropdownOpen={setIsDropdownOpen}
            handleWeekChange={handleWeekChange}
            showFilterPanel={false}
            setShowFilterPanel={setShowFilterPanel}
            activeFilters={0}
            isEditing={false}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
            handleCancel={handleCancel}
            dateFilter=""
            shiftFilter=""
            operatorFilter=""
            machineFilter=""
            onDateFilterChange={(e) => setDateFilter(e.target.value)}
            onShiftFilterChange={(e) => setShiftFilter(e.target.value)}
            onOperatorFilterChange={(e) => setOperatorFilter(e.target.value)}
            onMachineFilterChange={(e) => setMachineFilter(e.target.value)}
            onResetFilters={resetFilters}
            dates={dates}
            shifts={shifts}
            operators={operators}
            machines={machines}
            isDropdownOpen={true}
            weekOptions={weekOptions}
            highlightedOperator={null}
          >
            <div className="p-4 text-center text-white">
              <p>Schedule content would go here</p>
            </div>
          </MainComponent>
        </div>
      </div>
    </div>
  );
});
}