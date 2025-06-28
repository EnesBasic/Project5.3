"use client";
import React from "react";

export default function CalHeader({
  currentDate,
  setCurrentDate,
  setShowMonthPicker,
  navigateMonth,
  monthNames,
  selectedIcon,
  setSelectedIcon,
  toggleMiniCalendar,
  showMiniCalendar,
  events,
  categoryColors,
}) {
  const [showSettings, setShowSettings] = React.useState(false);

  const handleToggleMiniCalendar = () => {
    toggleMiniCalendar();
    setShowSettings(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-1 px-1">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="w-8 h-8 bg-gradient-to-br from-[#4a9eff] to-[#67e8f9] text-black font-bold rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-[#67e8f9]/30 transform hover:scale-110 transition-all duration-200"
          >
            <span className="text-sm">{new Date().getDate()}</span>
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigateMonth(-1)}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-r from-[#4a9eff]/20 to-[#4a9eff]/10 hover:from-[#4a9eff]/30 hover:to-[#4a9eff]/20 transition-all duration-100 transform hover:scale-110 shadow-lg hover:shadow-[#4a9eff]/20 group"
          >
            <i className="fas fa-chevron-left text-[#4a9eff] text-xs group-hover:text-[#67e8f9] transition-colors duration-100"></i>
          </button>
          <h2
            onClick={() => setShowMonthPicker(true)}
            className="text-xl sm:text-2xl md:text-2xl lg:text-2xl font-bold bg-gradient-to-r from-[#4a9eff] to-[#67e8f9] text-transparent bg-clip-text whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity duration-100 px-2"
          >
            {`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-r from-[#4a9eff]/10 to-[#4a9eff]/20 hover:from-[#4a9eff]/20 hover:to-[#4a9eff]/30 transition-all duration-100 transform hover:scale-110 shadow-lg hover:shadow-[#4a9eff]/20 group"
          >
            <i className="fas fa-chevron-right text-[#4a9eff] text-xs group-hover:text-[#67e8f9] transition-colors duration-100"></i>
          </button>
        </div>
        <div className="flex gap-1 pr-[2px]">
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-8 h-8 bg-gradient-to-br from-[#4a9eff] to-[#67e8f9] text-black font-bold rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-[#67e8f9]/30 transform hover:scale-110 transition-all duration-200"
            >
              <i className="fas fa-cog text-xs"></i>
            </button>
            {showSettings && (
              <div className="absolute right-0 mt-1 bg-[#1a1a1a] rounded-md shadow-lg py-1 z-10 border border-[#2a2a2a]">
                <div className="p-2">
                  <button
                    className={`flex items-center justify-center p-2 w-full ${
                      showMiniCalendar ? "bg-[#3a3a3a]" : "bg-[#2a2a2a]"
                    } rounded transition-colors hover:bg-[#3a3a3a]`}
                    onClick={handleToggleMiniCalendar}
                  >
                    <i className="fas fa-table text-[#67e8f9]"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}