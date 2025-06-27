"use client";
import React from "react";



export default function Index() {
  return ("use client";

function WeekButton({ weekStartDate, weekEndDate }) {
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
          7,
      )
    );
  };

  return (
    <div
      className={`
        h-[30px]
        flex items-center justify-center text-[#ff9966] text-xs bg-[#161618] 
        border-2 border-[#2a2a2a] shadow-[inset_0px_1px_2px_rgba(0,0,0,0.4)] 
        cursor-pointer hover:bg-[#1a1a1a] transition-colors duration-100
        relative group
      `}
    >
      <span className="transition-opacity duration-300">
        {getISOWeekNumber(weekStartDate)}
      </span>
      <div className="absolute left-1/2 -translate-x-1/2 -top-6 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {weekStartDate.toLocaleDateString()} -{" "}
        {weekEndDate.toLocaleDateString()}
      </div>
    </div>
  );
}

function MainComponent({
  weeks,
  dayNames,
  buttonText,
  handleDayClick,
  events,
  currentDate,
  categoryColors,
  getISOWeekNumber,
  handleWeekClick,
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="w-full">
      <div className="grid grid-cols-8 gap-[2px] bg-[#2a2a2a] rounded overflow-hidden p-[2px] py-2 sm:py-2.5 md:py-3">
        <div
          className={`
            h-[30px] 
            flex items-center justify-center 
            text-[#ff9966] text-xs font-medium 
            bg-[#161618] border-2 border-[#2a2a2a] rounded-tl 
            shadow-[inset_0px_1px_2px_rgba(0,0,0,0.4)] 
            hover:bg-[#1a1a1a] 
            transition-all duration-100
            relative
            group
          `}
        >
          <div className="flex items-center">
            <span className="relative">
              {buttonText}
              <span
                className={`
                absolute left-0 bottom-[-1px] 
                h-[1px] bg-[#ff9966]
                transition-all duration-300 ease-in-out
                w-0
                group-hover:w-full
              `}
              ></span>
            </span>
          </div>
        </div>
        {[
          { day: "Pon", color: "#67e8f9", bg: "#161618" },
          { day: "Uto", color: "#67e8f9", bg: "#161618" },
          { day: "Sri", color: "#67e8f9", bg: "#161618" },
          { day: "Čet", color: "#67e8f9", bg: "#161618" },
          { day: "Pet", color: "#67e8f9", bg: "#161618" },
          { day: "Sub", color: "#ffd700", bg: "#161618" },
          { day: "Ned", color: "#ffd700", bg: "#161618" },
        ].map(({ day, color, bg }, index, array) => (
          <div
            key={day}
            className={`h-[30px] flex items-center justify-center text-xs font-medium border-2 border-l-0 border-[#2a2a2a] shadow-[inset_0px_1px_2px_rgba(0,0,0,0.4)] ${
              index === array.length - 1 ? "rounded-tr" : ""
            }`}
            style={{
              color,
              backgroundColor: bg,
            }}
          >
            {day}
          </div>
        ))}
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            <div
              className={`
                h-[30px]
                flex items-center justify-center text-[#ff9966] text-xs bg-[#161618] 
                border-2 border-t-0 border-[#2a2a2a] shadow-[inset_0px_1px_2px_rgba(0,0,0,0.4)] 
                ${weekIndex === weeks.length - 1 ? "rounded-bl" : ""}
                cursor-pointer hover:bg-[#1a1a1a] transition-colors duration-100
              `}
              onClick={() => handleWeekClick && handleWeekClick(week[0].date)}
            >
              <span className="transition-opacity duration-300">
                {getISOWeekNumber(week[0].date)}
              </span>
            </div>
            {week.map((dayObj, dayIndex) => {
              const dateStr = dayObj.date?.toDateString();
              const dayEvents = events[dateStr] || [];
              const vacationEvents = dayEvents.filter(
                (e) => e.category.startsWith("odmor") && e.isVacationDay,
              );
              const startVacation = vacationEvents.find(
                (e) => e.isStart && !e._isMarker,
              );
              const isWeekend = dayIndex === 5 || dayIndex === 6;

              const isToday =
                dayObj.date &&
                dayObj.date.getDate() === today.getDate() &&
                dayObj.date.getMonth() === today.getMonth() &&
                dayObj.date.getFullYear() === today.getFullYear();

              const hasNonVacationEvents =
                dayEvents.filter(
                  (e) =>
                    !e._isMarker &&
                    !e.category.startsWith("odmor") &&
                    !e.isVacationDay,
                ).length > 0;

              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  onDoubleClick={(e) => handleDayClick(e, dayObj.date)}
                  onClick={(e) => e.preventDefault()}
                  className={`
                    h-[30px]
                    flex flex-col justify-center items-center text-xs cursor-pointer
                    transition-colors duration-100 relative
                    ${
                      isToday
                        ? "!bg-[#1a365d] !text-white relative z-20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_0_8px_rgba(26,54,93,0.6)] transform translate-y-[1px] scale-105"
                        : dayObj.isPreviousMonth || dayObj.isNextMonth
                          ? isWeekend
                            ? "text-[#8e8e93] bg-[#1d1d1f]"
                            : "bg-[#1d1d1f]"
                          : isWeekend
                            ? "text-white bg-[#333333]"
                            : "text-white bg-[#333333]"
                    }
                    ${
                      dayObj.isPreviousMonth || dayObj.isNextMonth
                        ? "text-[#4a5568] shadow-[inset_0px_1px_2px_rgba(0,0,0,0.4)] bg-[#161618]"
                        : isWeekend
                          ? "text-white"
                          : "text-white"
                    }
                    ${
                      !vacationEvents.length && dayEvents.length > 0 && !isToday
                        ? ""
                        : isToday
                          ? "border border-[#3182ce]"
                          : "border border-[#2a2a2a]"
                    }
                    ${
                      vacationEvents.length > 0 && !isToday
                        ? `
                      ${
                        vacationEvents[0].isStart
                          ? "border-l-2 !rounded-l"
                          : "border-l-0"
                      }
                      ${
                        vacationEvents[0].isEnd
                          ? "border-r-2 !rounded-r"
                          : "border-r-0"
                      }
                      border-t-2 border-b-2
                    `
                        : !isToday
                          ? "hover:bg-[#2a2a2a]"
                          : ""
                    }
                    ${
                      weekIndex === weeks.length - 1 &&
                      dayIndex === week.length - 1
                        ? "rounded-br"
                        : ""
                    }
                    ${isToday ? "rounded-md" : ""}
                  `}
                  style={
                    vacationEvents.length > 0 && !isToday
                      ? {
                          borderColor:
                            categoryColors[vacationEvents[0].category],
                        }
                      : {}
                  }
                >
                  <div
                    className={`z-10 relative leading-none ${
                      isToday
                        ? "text-sm font-bold text-white"
                        : "text-xs font-semibold"
                    }`}
                  >
                    {startVacation ? (
                      <div className="relative group/tooltip">
                        <span
                          className={`truncate block max-w-[60px] text-center leading-none ${
                            isToday ? "text-sm font-bold" : "text-xs"
                          }`}
                        >
                          {dayObj.day}
                        </span>
                        <div className="absolute left-1/2 -translate-x-1/2 -top-6 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          Godišnji: {startVacation.text}
                        </div>
                      </div>
                    ) : (
                      dayObj.day
                    )}
                  </div>

                  {hasNonVacationEvents && !isToday && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-500"></div>
                  )}

                  {hasNonVacationEvents && isToday && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-300 z-30"></div>
                  )}

                  {vacationEvents.length > 0 && (
                    <>
                      <div
                        className={`absolute inset-x-0 inset-y-0 ${
                          vacationEvents.length > 1 ? "vibrate" : ""
                        } ${isToday ? "opacity-50" : ""}`}
                        style={{
                          backgroundColor: `${
                            categoryColors[vacationEvents[0].category]
                          }80`,
                          borderColor: `${
                            categoryColors[vacationEvents[0].category]
                          }`,
                          borderWidth: "1px",
                          zIndex: isToday ? "10" : "0",
                        }}
                      />
                      {vacationEvents.length > 1 && (
                        <div
                          className={`absolute inset-x-0 bottom-0 h-1/2 vibrate ${isToday ? "opacity-50" : ""}`}
                          style={{
                            backgroundColor: `${
                              categoryColors[vacationEvents[1].category]
                            }80`,
                            animationDelay: "0.15s",
                            zIndex: isToday ? "10" : "0",
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
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
      `}</style>
    </div>
  );
}

function CalGrid({
  weeks,
  dayNames,
  WeekButton,
  handleDayClick,
  events,
  currentDate,
  categoryColors,
  getISOWeekNumber,
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-0.5 sm:gap-1 text-white">
      {/* Header row with day names */}
      <div className="bg-[#1D1D1F] rounded-tl-lg p-1 sm:p-1.5 text-center text-xs sm:text-sm font-medium">
        Week
      </div>
      {dayNames.map((day, index) => (
        <div
          key={day}
          className={`bg-[#1D1D1F] ${
            index === dayNames.length - 1 ? "rounded-tr-lg" : ""
          } p-1 sm:p-1.5 text-center text-xs sm:text-sm font-medium`}
        >
          {day}
        </div>
      ))}

      {/* Calendar grid */}
      {weeks.map((week, weekIndex) => (
        <React.Fragment key={weekIndex}>
          {/* Week number column - now using the WeekButton component directly */}
          <div className="bg-[#1D1D1F] text-center">
            <WeekButton
              weekStartDate={week[0].date}
              weekEndDate={
                new Date(new Date(week[6].date).setHours(23, 59, 59))
              }
            />
          </div>

          {/* Days of the week */}
          {week.map((day, dayIndex) => {
            const isToday =
              day.date.toDateString() === new Date().toDateString();
            const isCurrentMonth =
              day.date.getMonth() === currentDate.getMonth();
            const dateString = day.date.toDateString();
            const hasEvents =
              events[dateString] && events[dateString].length > 0;

            // Check for vacation days
            const vacationEvents = hasEvents
              ? events[dateString].filter((event) => event.isVacationDay)
              : [];
            const isVacationDay = vacationEvents.length > 0;

            // Get vacation category for styling
            const vacationCategory = isVacationDay
              ? vacationEvents[0].category
              : null;

            return (
              <div
                key={dayIndex}
                className={`relative bg-[#1D1D1F] p-1 sm:p-1.5 text-center min-h-[40px] sm:min-h-[50px] md:min-h-[60px] ${
                  isToday ? "ring-1 ring-[#67e8f9]" : ""
                } ${!isCurrentMonth ? "opacity-40" : ""} ${
                  isVacationDay ? `border-l-4` : ""
                }`}
                style={{
                  borderLeftColor: isVacationDay
                    ? categoryColors[vacationCategory]
                    : "transparent",
                }}
                onClick={(e) => handleDayClick(e, day.date)}
              >
                <div
                  className={`text-xs sm:text-sm ${
                    isToday
                      ? "bg-[#67e8f9] text-black font-medium rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center mx-auto"
                      : ""
                  }`}
                >
                  {day.day}
                </div>

                {/* Event indicators */}
                {hasEvents && !isVacationDay && (
                  <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                    {events[dateString]
                      .filter((event) => !event.isVacationDay)
                      .slice(0, 3)
                      .map((event, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              categoryColors[event.category] || "#999",
                          }}
                        ></div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

  const [currentDate, setCurrentDate] = React.useState(new Date());
  const buttonText = "#";
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const categoryColors = {
    "odmor-godisnji": "#ff9966",
    "odmor-bolovanje": "#4a9eff",
    "odmor-slobodan-dan": "#67e8f9",
    work: "#ff5252",
  };

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
          7,
      )
    );
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
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push({
          day: currentDate.getDate(),
          date: new Date(currentDate),
          isPreviousMonth:
            currentDate.getMonth() < date.getMonth() ||
            (currentDate.getMonth() === 11 && date.getMonth() === 0),
          isNextMonth:
            currentDate.getMonth() > date.getMonth() ||
            (currentDate.getMonth() === 0 && date.getMonth() === 11),
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(week);
    }

    return weeks;
  };

  const weeks = getWeeksInMonth(currentDate);
  const events = {
    [new Date().toDateString()]: [
      { text: "Meeting with team", category: "work" },
      { text: "Lunch with client", category: "work" },
    ],
    [new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      15,
    ).toDateString()]: [
      {
        text: "Vacation",
        category: "odmor-godisnji",
        isVacationDay: true,
        isStart: true,
        isEnd: false,
      },
    ],
    [new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      16,
    ).toDateString()]: [
      {
        text: "Vacation",
        category: "odmor-godisnji",
        isVacationDay: true,
        isStart: false,
        isEnd: false,
      },
    ],
    [new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      17,
    ).toDateString()]: [
      {
        text: "Vacation",
        category: "odmor-godisnji",
        isVacationDay: true,
        isStart: false,
        isEnd: true,
      },
    ],
    [new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      22,
    ).toDateString()]: [
      {
        text: "Sick",
        category: "odmor-bolovanje",
        isVacationDay: true,
        isStart: true,
        isEnd: true,
      },
    ],
    [new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      10,
    ).toDateString()]: [
      { text: "Project deadline", category: "work" },
      { text: "Team review", category: "work" },
    ],
  };

  const handleDayClick = (e, date) => {
    console.log("Day clicked:", date);
  };

  const handleWeekClick = (date) => {
    console.log("Week clicked:", date, "Week number:", getISOWeekNumber(date));
  };

  return (
    <div className="min-h-screen bg-black p-4 font-inter">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-white text-xl mb-4">Original Calendar</h2>
        <MainComponent
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

        <h2 className="text-white text-xl mt-8 mb-4">
          Updated CalGrid with WeekButton
        </h2>
        <CalGrid
          weeks={weeks}
          dayNames={dayNames}
          WeekButton={WeekButton}
          handleDayClick={handleDayClick}
          events={events}
          currentDate={currentDate}
          categoryColors={categoryColors}
          getISOWeekNumber={getISOWeekNumber}
        />
      </div>
    </div>
  );
});
}