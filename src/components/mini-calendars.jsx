"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  currentDate = new Date(),
  events = {},
  categoryColors = {
    "odmor-godisnji": "#ff9966",
    "odmor-bolovanje": "#4a9eff",
    "odmor-slobodan-dan": "#67e8f9",
    work: "#10b981",
    meeting: "#8b5cf6",
    personal: "#f43f5e",
    islamic: "#fbbf24",
  },
}) {
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

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getWeeksInMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let dayOfWeek = firstDay.getDay() || 7;
    dayOfWeek = dayOfWeek === 1 ? 0 : dayOfWeek - 1;
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - dayOfWeek);
    const endDate = new Date(lastDay);
    const daysToAdd = 7 - endDate.getDay();
    if (endDate.getDay() !== 0) {
      endDate.setDate(endDate.getDate() + daysToAdd);
    }
    const weeks = [];
    let currentDateIter = new Date(startDate);
    while (currentDateIter <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push({
          day: currentDateIter.getDate(),
          date: new Date(currentDateIter),
          isPreviousMonth:
            currentDateIter.getMonth() < date.getMonth() ||
            (currentDateIter.getMonth() === 11 && date.getMonth() === 0),
          isNextMonth:
            currentDateIter.getMonth() > date.getMonth() ||
            (currentDateIter.getMonth() === 0 && date.getMonth() === 11),
        });
        currentDateIter.setDate(currentDateIter.getDate() + 1);
      }
      weeks.push(week);
    }
    return weeks;
  };

  const hasEvent = (date) => {
    const dateString = date.toDateString();
    return events[dateString] && events[dateString].length > 0;
  };

  const getEventCategory = (date) => {
    const dateString = date.toDateString();
    if (events[dateString] && events[dateString].length > 0) {
      return events[dateString][0].category;
    }
    return null;
  };

  const renderMiniCalendar = (monthOffset) => {
    const calendarDate = new Date(currentDate);
    calendarDate.setMonth(currentDate.getMonth() + monthOffset);

    const weeks = getWeeksInMonth(calendarDate);
    const today = new Date();

    return (
      <div className="bg-[#1d1d1f] rounded-lg p-2 shadow-lg flex-1 min-w-[140px]">
        <div className="text-center text-[#67e8f9] text-sm font-medium mb-2">
          {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day, index) => (
            <div
              key={day}
              className={`text-center text-xs ${
                index >= 5 ? "text-[#ffd700]" : "text-[#67e8f9]"
              }`}
            >
              {day.charAt(0)}
            </div>
          ))}

          {weeks.flat().map((dayObj, index) => {
            const isToday = dayObj.date.toDateString() === today.toDateString();
            const hasEventForDay = hasEvent(dayObj.date);
            const eventCategory = getEventCategory(dayObj.date);

            return (
              <div
                key={index}
                className={`
                  text-center text-xs cursor-pointer rounded-full w-5 h-5 mx-auto flex items-center justify-center relative
                  ${
                    isToday
                      ? "bg-[#3b82f6] text-white"
                      : dayObj.isPreviousMonth || dayObj.isNextMonth
                        ? "text-[#4a5568]"
                        : "text-[#e5e5ea] hover:bg-[#2a2a2a]"
                  }
                `}
              >
                {dayObj.day}
                {hasEventForDay && (
                  <span
                    className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{
                      backgroundColor:
                        categoryColors[eventCategory] || "#67e8f9",
                    }}
                  ></span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 flex-wrap sm:flex-nowrap">
        {renderMiniCalendar(-1)}
        {renderMiniCalendar(1)}
      </div>
    </div>
  );
}

function StoryComponent() {
  const [currentDate, setCurrentDate] = React.useState(new Date());

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
    [new Date(Date.now() + 86400000 * 7).toDateString()]: [
      {
        id: "4",
        text: "Doctor Appointment",
        category: "odmor-bolovanje",
        isVacationDay: true,
        isStart: true,
        date: new Date(Date.now() + 86400000 * 7),
      },
      {
        id: "5",
        text: "Project Deadline",
        category: "work",
        time: "5:00 PM",
      },
    ],
    [new Date(Date.now() + 86400000 * 14).toDateString()]: [
      { id: "6", text: "Ramadan Start", category: "islamic" },
    ],
  };

  return (
    <div className="min-h-screen bg-[#121214] p-4 font-inter">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-2xl font-semibold mb-6">
          Mini Calendars Component
        </h1>

        <div className="bg-[#1D1D1F]/80 rounded-lg p-4 mb-8">
          <MainComponent
            currentDate={currentDate}
            events={sampleEvents}
            categoryColors={categoryColors}
          />
        </div>

        <div className="bg-[#1D1D1F]/80 rounded-lg p-4 mb-8">
          <h2 className="text-white text-xl font-semibold mb-4">
            With Different Date
          </h2>
          <MainComponent
            currentDate={new Date(2025, 5, 15)}
            events={sampleEvents}
            categoryColors={categoryColors}
          />
        </div>

        <div className="bg-[#1D1D1F]/80 rounded-lg p-4">
          <h2 className="text-white text-xl font-semibold mb-4">
            Component Details
          </h2>
          <div className="text-[#86868B] space-y-2">
            <p>
              The Mini Calendars component displays two compact calendar views:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Previous month (left) and next month (right)</li>
              <li>Month and year displayed at the top of each calendar</li>
              <li>Single-letter day abbreviations for weekdays</li>
              <li>Weekend days highlighted in gold</li>
              <li>Current day highlighted in blue</li>
              <li>Event indicators shown as colored dots</li>
              <li>Responsive layout that works on various screen sizes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});
}