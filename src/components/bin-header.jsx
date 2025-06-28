"use client";
import React from "react";

export default function CalHeader({
  weekNumber = 1,
  year = 2025,
  dateRange = "Jan 1 - Jan 5 2025",
  onSave = () => {},
  onCancel = () => {},
  isLoading = false,
  error = null,
  availableWeeks = [],
  onWeekChange = () => {},
  onBack = () => {},
  isEditing = false,
  setIsEditing = () => {},
}) {
  const generateWeeksForYear = (inputYear) => {
    const weeks = [];

    if (inputYear === 2025) {
      weeks.push(
        {
          weekNumber: 1,
          year: inputYear,
          dateRange: `Jan 1 - Jan 5 ${inputYear}`,
          customFormat: `1:01-05/1`,
          startDate: new Date(inputYear, 0, 1),
          endDate: new Date(inputYear, 0, 5),
        },
        {
          weekNumber: 2,
          year: inputYear,
          dateRange: `Jan 6 - Jan 12 ${inputYear}`,
          customFormat: `2:06-12/1`,
          startDate: new Date(inputYear, 0, 6),
          endDate: new Date(inputYear, 0, 12),
        },
        {
          weekNumber: 3,
          year: inputYear,
          dateRange: `Jan 13 - Jan 19 ${inputYear}`,
          customFormat: `3:13-19/1`,
          startDate: new Date(inputYear, 0, 13),
          endDate: new Date(inputYear, 0, 19),
        }
      );
    }

    return weeks;
  };

  const [allWeeks] = React.useState(generateWeeksForYear(year));
  const [selectedWeek, setSelectedWeek] = React.useState({
    weekNumber,
    year,
    dateRange,
  });

  const handleWeekChange = (weekNum, yr) => {
    const selectedWeekData = allWeeks.find(
      (week) => week.weekNumber === weekNum && week.year === yr
    );
    if (selectedWeekData) {
      setSelectedWeek(selectedWeekData);
      onWeekChange(selectedWeekData);
    }
  };

  const formattedHeaderDate = `${selectedWeek.dateRange}`;

  return (
    <div className="w-full bg-[#1D1D1F] rounded-lg shadow-lg overflow-hidden">
      <div className="p-3 bg-[#2A2A2A] border-b border-[#3A3A3A]">
        <div className="flex items-center justify-between">
          <div className="w-24"></div>
          <div className="flex-grow text-center">
            <h2 className="text-lg font-bold bg-gradient-to-r from-[#4a9eff] to-[#67e8f9] text-transparent bg-clip-text px-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] filter-none transform scale-105 transition-transform duration-300 whitespace-nowrap overflow-hidden text-ellipsis">
              {formattedHeaderDate}
            </h2>
            <div className="h-0.5 w-32 bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40 mx-auto mt-1 rounded-full shadow-sm"></div>
          </div>
          <div className="w-24"></div>
        </div>
      </div>
      <div className="p-1 bg-[#2A2A2A] border-b border-[#3A3A3A] flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-[#3A3A3A] text-[#67e8f9] border border-[#3A3A3A] h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center mr-2"
          title="Nazad"
        >
          <i className="fas fa-arrow-left text-sm"></i>
        </button>
        <div className="flex-1 flex items-center justify-center px-2">
          <div className="flex">
            <button
              className="bg-[#1D1D1F] text-white border-y border-[#3A3A3A] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent flex items-center justify-between text-xs h-7"
              style={{ minWidth: "110px", borderLeft: "none", borderRight: "none" }}
            >
              <span>{selectedWeek.customFormat}</span>
              <i className="fas fa-chevron-down ml-2 text-xs"></i>
            </button>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`${isEditing ? "bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40" : "bg-[#3A3A3A]"} text-[#67e8f9] border ${isEditing ? "border-[#67e8f9]/30" : "border-[#3A3A3A]"} h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center`}
            title={isEditing ? "Otkaži Uređivanje" : "Uredi"}
          >
            <i className={`fas fa-${isEditing ? "times" : "edit"} text-sm`}></i>
          </button>
        </div>
      </div>
      <div className="p-4 text-white">
        <div className="border border-dashed border-[#3A3A3A] rounded-lg p-8 flex items-center justify-center">
          <p className="text-[#67e8f9]">Schedule content would be displayed here</p>
        </div>
      </div>
    </div>
  );
}