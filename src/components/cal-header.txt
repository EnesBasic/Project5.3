"use client";
import React from "react";



export default function Index() {
  return ("use client";

function MainComponent({
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

function StoryComponent() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = React.useState(false);
  const [selectedIcon, setSelectedIcon] = React.useState("table");
  const [showMiniCalendar, setShowMiniCalendar] = React.useState(false);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const toggleMiniCalendar = () => {
    setShowMiniCalendar(!showMiniCalendar);
  };

  const categoryColors = {
    "odmor-godisnji": "#ff9966",
    "odmor-bolovanje": "#4a9eff",
    "odmor-slobodan-dan": "#67e8f9",
    work: "#10b981",
    meeting: "#8b5cf6",
    personal: "#f43f5e",
    islamic: "#fbbf24",
  };

  const sampleEvents = {
    [new Date().toDateString()]: [
      {
        id: "1",
        text: "Team Meeting",
        category: "meeting",
        time: "10:00 AM",
      },
      {
        id: "2",
        text: "Lunch with Client",
        category: "work",
        time: "12:30 PM",
      },
    ],
    [new Date(Date.now() + 86400000).toDateString()]: [
      {
        id: "3",
        text: "Annual Leave",
        category: "odmor-godisnji",
        isVacationDay: true,
        isStart: true,
        date: new Date(Date.now() + 86400000),
        endDate: new Date(Date.now() + 86400000 * 5),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black p-4 font-inter">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-2xl font-semibold mb-6">
          Calendar Header Component
        </h1>
        <div className="bg-[#1D1D1F] rounded-lg p-4 mb-8">
          <MainComponent
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            setShowMonthPicker={setShowMonthPicker}
            navigateMonth={navigateMonth}
            monthNames={monthNames}
            selectedIcon={selectedIcon}
            setSelectedIcon={setSelectedIcon}
            toggleMiniCalendar={toggleMiniCalendar}
            showMiniCalendar={showMiniCalendar}
            events={sampleEvents}
            categoryColors={categoryColors}
          />
          {showMonthPicker && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowMonthPicker(false)}
            >
              <div
                className="bg-[#1D1D1F] rounded-lg p-4 w-80"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-white text-lg font-semibold mb-4">
                  Month Picker (Demo)
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {monthNames.map((month, index) => (
                    <button
                      key={month}
                      className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white py-2 rounded"
                      onClick={() => {
                        const newDate = new Date(currentDate);
                        newDate.setMonth(index);
                        setCurrentDate(newDate);
                        setShowMonthPicker(false);
                      }}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {showMiniCalendar && (
          <div className="mt-4 mb-8">
            <div className="bg-[#1a1a1a] rounded-lg p-2 border border-[#2a2a2a]">
              <MiniCalendars
                currentDate={currentDate}
                events={sampleEvents}
                categoryColors={categoryColors}
              />
            </div>
          </div>
        )}

        <div className="bg-[#1D1D1F] rounded-lg p-4">
          <h2 className="text-white text-xl font-semibold mb-4">
            Component Details
          </h2>
          <div className="text-[#86868B] space-y-2">
            <p>
              This calendar header component provides navigation controls for a
              calendar view:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Today button (left) - Quickly jump to current date</li>
              <li>
                Month/year display (center) - Shows current month and year with
                month picker on click
              </li>
              <li>
                Navigation arrows - Move forward and backward through months
              </li>
              <li>
                Settings button (right) - For calendar configuration with option
                to toggle mini calendars view
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});
}