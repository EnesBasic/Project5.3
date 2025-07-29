async function handler({ scheduleId, format = "json" }) {
  if (!scheduleId) {
    return { error: "Schedule ID is required" };
  }

  try {
    // Get the schedule data
    const schedule = await sql`
      SELECT * FROM schedules WHERE id = ${scheduleId}
    `;

    if (schedule.length === 0) {
      return { error: "Schedule not found" };
    }

    // Get all entries for this schedule
    const entries = await sql`
      SELECT * FROM schedule_entries 
      WHERE schedule_id = ${scheduleId}
      ORDER BY 
        CASE 
          WHEN day = 'monday' THEN 1
          WHEN day = 'tuesday' THEN 2
          WHEN day = 'wednesday' THEN 3
          WHEN day = 'thursday' THEN 4
          WHEN day = 'friday' THEN 5
          WHEN day = 'saturday' THEN 6
          WHEN day = 'sunday' THEN 7
        END,
        shift,
        machine
    `;

    const scheduleData = {
      id: schedule[0].id,
      weekNumber: schedule[0].week_number,
      year: schedule[0].year,
      dateRange: schedule[0].date_range,
      entries: entries.map((entry) => ({
        id: entry.id,
        day: entry.day,
        shift: entry.shift,
        machine: entry.machine,
        operator: entry.operator,
        notes: entry.notes,
      })),
    };

    // Export in the requested format
    if (format === "csv") {
      const csvContent = generateCSV(scheduleData);
      return {
        data: csvContent,
        filename: `schedule_week${scheduleData.weekNumber}_${scheduleData.year}.csv`,
        contentType: "text/csv",
      };
    } else if (format === "text") {
      const textContent = generateText(scheduleData);
      return {
        data: textContent,
        filename: `schedule_week${scheduleData.weekNumber}_${scheduleData.year}.txt`,
        contentType: "text/plain",
      };
    } else {
      // Default to JSON
      return {
        data: JSON.stringify(scheduleData, null, 2),
        filename: `schedule_week${scheduleData.weekNumber}_${scheduleData.year}.json`,
        contentType: "application/json",
      };
    }
  } catch (error) {
    return { error: `Failed to export schedule: ${error.message}` };
  }
}

function generateCSV(scheduleData) {
  // CSV header
  let csv = "Day,Shift,Machine,Operator,Notes\n";

  // Add each entry as a row
  scheduleData.entries.forEach((entry) => {
    // Format the day to capitalize first letter
    const day = entry.day.charAt(0).toUpperCase() + entry.day.slice(1);

    // Escape any commas in the fields
    const operator = entry.operator.includes(",")
      ? `"${entry.operator}"`
      : entry.operator;
    const machine = entry.machine.includes(",")
      ? `"${entry.machine}"`
      : entry.machine;
    const notes = entry.notes
      ? entry.notes.includes(",")
        ? `"${entry.notes}"`
        : entry.notes
      : "";

    csv += `${day},${entry.shift},${machine},${operator},${notes}\n`;
  });

  return csv;
}

function generateText(scheduleData) {
  // Create a text representation of the schedule
  let text = `Schedule for Week ${scheduleData.weekNumber}, ${scheduleData.year} (${scheduleData.dateRange})\n\n`;

  // Group entries by day
  const dayOrder = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const entriesByDay = {};

  dayOrder.forEach((day) => {
    entriesByDay[day] = scheduleData.entries.filter(
      (entry) => entry.day === day
    );
  });

  // Format each day
  dayOrder.forEach((day) => {
    if (entriesByDay[day].length > 0) {
      const formattedDay = day.charAt(0).toUpperCase() + day.slice(1);
      text += `${formattedDay}:\n`;

      // Group by shift
      const shifts = [
        ...new Set(entriesByDay[day].map((entry) => entry.shift)),
      ];

      shifts.forEach((shift) => {
        const shiftEntries = entriesByDay[day].filter(
          (entry) => entry.shift === shift
        );
        const formattedShift = shift.charAt(0).toUpperCase() + shift.slice(1);
        text += `  ${formattedShift} Shift:\n`;

        shiftEntries.forEach((entry) => {
          text += `    ${entry.machine}: ${entry.operator}`;
          if (entry.notes) {
            text += ` (${entry.notes})`;
          }
          text += "\n";
        });

        text += "\n";
      });
    }
  });

  return text;
}

function handler({ year }) {
  if (!year) {
    const currentDate = new Date();
    year = currentDate.getFullYear();
  }

  year = parseInt(year, 10);

  // ISO week date calculation
  function getISOWeek(d) {
    // Copy date to avoid modifying original
    const date = new Date(d.getTime());
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
    // Return ISO week number
    return weekNo;
  }

  // Get the first date of an ISO week
  function getFirstDateOfISOWeek(w, y) {
    // Create date object for January 1st
    const simple = new Date(Date.UTC(y, 0, 1 + (w - 1) * 7));
    // Get day of week, with Monday as 1 and Sunday as 7
    const dow = simple.getUTCDay() || 7;
    // Adjust to Monday of the week
    simple.setUTCDate(simple.getUTCDate() - dow + 1);
    return simple;
  }

  function formatDate(date, includeYear = false) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getUTCMonth()];
    const day = date.getUTCDate();

    return includeYear
      ? `${month} ${day} ${date.getUTCFullYear()}`
      : `${month} ${day}`;
  }

  // Get the last ISO week of the year
  function getLastISOWeekOfYear(y) {
    const lastDay = new Date(Date.UTC(y, 11, 31));
    let weekNumber = getISOWeek(lastDay);

    // If last day is in week 1 of next year, get week from Dec 24
    if (weekNumber === 1) {
      const dec24 = new Date(Date.UTC(y, 11, 24));
      weekNumber = getISOWeek(dec24);
    }

    return weekNumber;
  }

  const lastWeek = getLastISOWeekOfYear(year);
  const weeks = [];

  // For debugging - log the current week
  const now = new Date();
  const currentWeek = getISOWeek(now);
  console.log(
    `Current ISO Week: ${currentWeek}, Year: ${now.getUTCFullYear()}`
  );

  for (let weekNumber = 1; weekNumber <= lastWeek; weekNumber++) {
    const startDate = getFirstDateOfISOWeek(weekNumber, year);
    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 6);

    // Determine the actual year for the week
    const actualYear =
      weekNumber === 1 && startDate.getUTCFullYear() < year
        ? startDate.getUTCFullYear()
        : weekNumber >= 52 && endDate.getUTCFullYear() > year
        ? endDate.getUTCFullYear()
        : year;

    const dateRange = `${formatDate(startDate)} - ${formatDate(endDate, true)}`;

    weeks.push({
      weekNumber,
      year: actualYear,
      dateRange,
    });
  }

  return weeks;
}
export async function POST(request) {
  return handler(await request.json());
}