"use client";
import React from "react";

import "@/styles/globals.css";
import "@/styles/calendar.css";
import "@/styles/scrollbar.css";
import "@/styles/animations.css";
import "@/styles/tooltip.css";
import CalHeader from "@/components/cal-header";
import CalGrid1 from "@/components/cal-grid-1";
import CalFooter from "@/components/cal-footer";
import MiniCalendars from "@/components/mini-calendars";

function MainComponent() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = React.useState(false);
  const [showMiniCalendars, setShowMiniCalendars] = React.useState(false);
  const [buttonText, setButtonText] = React.useState("Sed");
  const [showEvents, setShowEvents] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [events, setEvents] = React.useState({});
  const [selectedIcon, setSelectedIcon] = React.useState("columns");
  const [showSchedule, setShowSchedule] = React.useState(false);
  const [scheduleData, setScheduleData] = React.useState(null);
  const [availableSchedules, setAvailableSchedules] = React.useState([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = React.useState(false);

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

  const categoryColors = {
    "odmor-godisnji": "#ff9966",
    "odmor-bolovanje": "#4a9eff",
    "odmor-slobodan-dan": "#67e8f9",
    work: "#10b981",
    meeting: "#8b5cf6",
    personal: "#f43f5e",
    islamic: "#fbbf24",
  };

  React.useEffect(() => {
    fetchAllSchedules();
  }, []);

  React.useEffect(() => {
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
    setEvents(sampleEvents);
  }, []);

  const fetchAllSchedules = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/get-all-schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      console.log("Fetched schedules:", data);

      if (data.schedules) {
        setAvailableSchedules(data.schedules);
      } else {
        console.error("No schedules found in response:", data);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

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

  const weeks = getWeeksInMonth(currentDate);

  const getISOWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((d.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  };

  const handleDayClick = (e, date) => {
    console.log("Day clicked:", date);
  };

  const fetchEvents = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (forceRefresh) {
        const newDate = new Date(Date.now() + 86400000 * 21).toDateString();
        setEvents((prev) => ({
          ...prev,
          [newDate]: [
            {
              id: "7",
              text: "Conference",
              category: "work",
              time: "9:00 AM - 5:00 PM",
            },
          ],
        }));
      }
    } catch (err) {
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = (id) => {
    const updatedEvents = {};
    Object.entries(events).forEach(([date, eventList]) => {
      const filteredEvents = eventList.filter((event) => event.id !== id);
      if (filteredEvents.length > 0) {
        updatedEvents[date] = filteredEvents;
      }
    });
    setEvents(updatedEvents);
  };

  const hasScheduleForWeek = (startDate, endDate) => {
    if (!availableSchedules || availableSchedules.length === 0) {
      return false;
    }

    return availableSchedules.some(
      (schedule) =>
        schedule.week_start_date === startDate &&
        schedule.week_end_date === endDate
    );
  };

  const WeekButton = ({ weekStartDate, weekEndDate }) => {
    const weekNumber = getISOWeekNumber(weekStartDate);
    const formattedStartDate = weekStartDate.toISOString().split("T")[0];
    const formattedEndDate = weekEndDate.toISOString().split("T")[0];

    const hasSchedule = hasScheduleForWeek(
      formattedStartDate,
      formattedEndDate
    );

    return (
      <button
        className={`w-full h-full py-1 px-2 rounded ${
          hasSchedule
            ? "bg-[#1D1D1F] hover:bg-[#2a2a2a] active:bg-[#3a3a3a] text-[#67e8f9] cursor-pointer"
            : "bg-[#1D1D1F] text-[#86868B] opacity-70 cursor-default"
        }`}
        onClick={() => {
          console.log(
            "Week button clicked:",
            weekNumber,
            formattedStartDate,
            formattedEndDate
          );
          if (hasSchedule) {
            handleWeekClick(weekNumber, weekStartDate, weekEndDate);
          }
        }}
        disabled={!hasSchedule}
      >
        <div className="flex flex-col items-center justify-center">
          <span className="font-medium">{weekNumber}</span>
          {hasSchedule && <span className="text-[10px] mt-0.5">View</span>}
        </div>
      </button>
    );
  };

  const handleWeekClick = async (weekNumber, weekStartDate, weekEndDate) => {
    console.log(
      "handleWeekClick called with:",
      weekNumber,
      weekStartDate,
      weekEndDate
    );

    const formattedStartDate = weekStartDate.toISOString().split("T")[0];
    const formattedEndDate = weekEndDate.toISOString().split("T")[0];

    if (hasScheduleForWeek(formattedStartDate, formattedEndDate)) {
      setIsLoadingSchedule(true);

      try {
        console.log(
          "Fetching schedule for:",
          formattedStartDate,
          formattedEndDate
        );

        const response = await fetch("/api/get-schedule-by-week-dates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          }),
        });

        const data = await response.json();
        console.log("Schedule data received:", data);

        if (!data.error) {
          setScheduleData({
            month: data.scheduleInfo.month,
            year: data.scheduleInfo.year,
            dateRange: data.scheduleInfo.date_range,
            schedule: data.schedule,
            weekNumber: weekNumber,
            weekStartDate: formattedStartDate,
            weekEndDate: formattedEndDate,
          });

          setShowSchedule(true);
        } else {
          console.error("Failed to fetch schedule:", data.error);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setIsLoadingSchedule(false);
      }
    }
  };

  const handleBackToCalendar = () => {
    setShowSchedule(false);
  };

  const handleSaveSchedule = async (scheduleData) => {
    try {
      setIsLoadingSchedule(true);

      const response = await fetch("/api/update-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduleId: scheduleData.scheduleId,
          weekNumber: scheduleData.weekNumber,
          year: scheduleData.year,
          weekStartDate: scheduleData.weekStartDate,
          weekEndDate: scheduleData.weekEndDate,
          dateRange: scheduleData.dateRange,
          schedule: scheduleData.schedule,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Schedule updated successfully:", data);
        setShowSchedule(false);
        fetchAllSchedules();
      } else {
        console.error("Failed to update schedule:", data.message);
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
    } finally {
      setIsLoadingSchedule(false);
    }
  };

  const needsExtraPadding = showMiniCalendars || showEvents;

  if (showSchedule && scheduleData) {
    const mockOperators = ["John Doe", "Jane Smith", "Mark Johnson"];

    const mockScheduleData = [
      {
        date: "01.01",
        day: "P",
        shifts: [
          {
            time: "08.00-16.00",
            operators: {
              "M58-J-467": "John Doe",
              "M53-E-929": "Jane Smith",
              "A35-J-924": "",
            },
          },
          {
            time: "20.00-04.00",
            operators: {
              "M58-J-467": "",
              "M53-E-929": "Mark Johnson",
              "A35-J-924": "",
            },
          },
        ],
      },
      {
        date: "02.01",
        day: "U",
        shifts: [
          {
            time: "08.00-16.00",
            operators: {
              "M58-J-467": "Jane Smith",
              "M53-E-929": "",
              "A35-J-924": "John Doe",
            },
          },
          {
            time: "20.00-04.00",
            operators: {
              "M58-J-467": "Mark Johnson",
              "M53-E-929": "",
              "A35-J-924": "",
            },
          },
        ],
      },
    ];

    const availableWeeks = availableSchedules.map((schedule) => ({
      weekNumber: schedule.week_number,
      year: schedule.year,
      dateRange: schedule.date_range,
    }));

    return (
      <div className="min-h-screen font-inter p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col overflow-y-auto bg-[#121214]">
        <div className="w-full max-w-[99%] mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Schedule for Week {scheduleData.weekNumber} (
              {scheduleData.dateRange})
            </h1>
            <button
              onClick={handleBackToCalendar}
              className="bg-[#1D1D1F] hover:bg-[#2a2a2a] text-[#67e8f9] px-4 py-2 rounded-lg flex items-center"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Calendar
            </button>
          </div>

          <BinBinWithSingleHeader
            operators={mockOperators}
            data={scheduleData.schedule || mockScheduleData}
            availableWeeks={availableWeeks}
            initialWeek={{
              weekNumber: scheduleData.weekNumber,
              year: scheduleData.year,
              dateRange: scheduleData.dateRange,
            }}
            onSave={(data) => {
              console.log("Saving schedule data:", data);
              handleSaveSchedule({
                ...scheduleData,
                schedule: data,
              });
            }}
            onWeekChange={(week) => {
              console.log("Week changed:", week);
              const selectedWeek = availableSchedules.find(
                (schedule) =>
                  schedule.week_number === week.weekNumber &&
                  schedule.year === week.year
              );

              if (selectedWeek) {
                const startDate = new Date(selectedWeek.week_start_date);
                const endDate = new Date(selectedWeek.week_end_date);
                handleWeekClick(week.weekNumber, startDate, endDate);
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-inter p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col overflow-y-auto"
      style={{
        backgroundImage:
          "url('https://ucarecdn.com/220aeb18-08cb-4769-a57d-b8bbb8f89791/-/format/auto/')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        maxHeight: "100vh",
      }}
    >
      {isLoadingSchedule && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#67e8f9]"></div>
        </div>
      )}

      <div className="w-full max-w-[99%] mx-auto rounded-xl px-1 py-[6px] sm:p-1 md:py-2 md:px-1 lg:py-3 lg:px-2 shadow-2xl mt-1 sm:mt-2 md:mt-3">
        <CalHeader
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          setShowMonthPicker={setShowMonthPicker}
          navigateMonth={navigateMonth}
          monthNames={monthNames}
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
          toggleMiniCalendar={() => setShowMiniCalendars(!showMiniCalendars)}
          showMiniCalendar={showMiniCalendars}
          events={events}
          categoryColors={categoryColors}
        />

        <div className="my-2 sm:my-2.5 md:my-3 overflow-x-auto">
          <div className="min-w-[320px] w-full">
            <CalGrid1
              weeks={weeks}
              dayNames={dayNames}
              buttonText={buttonText}
              handleDayClick={handleDayClick}
              handleWeekClick={handleWeekClick}
              events={events}
              currentDate={currentDate}
              categoryColors={categoryColors}
              getISOWeekNumber={getISOWeekNumber}
            />
          </div>
        </div>

        <div className="mt-2 sm:mt-2.5 md:mt-3">
          <CalFooter
            showEvents={showEvents}
            setShowEvents={setShowEvents}
            loading={loading}
            fetchEvents={fetchEvents}
            error={error}
            events={events}
            handleDeleteEvent={handleDeleteEvent}
            categoryColors={categoryColors}
          />
        </div>
      </div>

      {showMonthPicker && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowMonthPicker(false)}
        >
          <div
            className="bg-[#1D1D1F] rounded-lg p-3 sm:p-4 w-[280px] sm:w-[320px] md:w-[360px] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Select Month
            </h3>
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {monthNames.map((month, index) => (
                <button
                  key={month}
                  className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white text-xs sm:text-sm py-1.5 sm:py-2 rounded transition-colors"
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

      {showMiniCalendars && (
        <div className="mt-4">
          <div className="bg-[#1a1a1a] rounded-lg p-2 border border-[#2a2a2a]">
            <MiniCalendars
              currentDate={currentDate}
              events={events}
              categoryColors={categoryColors}
            />
          </div>
        </div>
      )}

      {needsExtraPadding && <div className="pb-20"></div>}

      <style jsx global>{`
        @keyframes vibrate {
          0% { transform: translateX(0); }
          25% { transform: translateX(0.5px); }
          50% { transform: translateX(0); }
          75% { transform: translateX(-0.5px); }
          100% { transform: translateX(0); }
        }
        .vibrate {
          animation: vibrate 0.3s infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }
        @keyframes slide-right {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes slide-left {
          from { width: 100%; }
          to { width: 0; }
        }
        .slide-right {
          animation: slide-right 0.3s ease-in-out;
        }
        .slide-left {
          animation: slide-left 0.3s ease-in-out;
        }
        
        html, body {
          height: 100%;
          overflow: auto;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;