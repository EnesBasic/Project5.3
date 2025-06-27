async function handler({ id }) {
  try {
    if (!id) {
      return {
        success: false,
        error: "Schedule ID is required",
      };
    }

    // Convert id to integer
    const scheduleId = parseInt(id, 10);

    if (isNaN(scheduleId)) {
      return {
        success: false,
        error: "Invalid schedule ID format",
      };
    }

    // Get the schedule from the database
    const scheduleResult = await sql`
      SELECT id, week_number as "weekNumber", year, date_range as "dateRange", 
      created_at as "createdAt", updated_at as "updatedAt", operator_colors as "operatorColors"
      FROM schedules 
      WHERE id = ${scheduleId}
    `;

    if (scheduleResult.length === 0) {
      return {
        success: false,
        error: "Schedule not found",
      };
    }

    const schedule = scheduleResult[0];

    // Get the schedule entries
    const entriesResult = await sql`
      SELECT id, day, shift, machine, operator, 
      created_at as "createdAt", updated_at as "updatedAt"
      FROM schedule_entries 
      WHERE schedule_id = ${scheduleId}
    `;

    // Process the data to format it for the frontend
    const entriesByDay = {};

    // Group entries by day
    for (const entry of entriesResult) {
      if (!entriesByDay[entry.day]) {
        entriesByDay[entry.day] = {};
      }

      if (!entriesByDay[entry.day][entry.shift]) {
        entriesByDay[entry.day][entry.shift] = {
          operators: {},
        };
      }

      entriesByDay[entry.day][entry.shift].operators[entry.machine] =
        entry.operator;
    }

    // Format the data for the frontend
    const formattedEntries = [];
    for (const [day, shifts] of Object.entries(entriesByDay)) {
      const dayEntry = {
        day,
        date: "", // This would need to be calculated based on the week
        shifts: [],
      };

      for (const [shift, data] of Object.entries(shifts)) {
        dayEntry.shifts.push({
          time: shift,
          operators: data.operators,
        });
      }

      formattedEntries.push(dayEntry);
    }

    // Add formatted entries to the schedule object
    schedule.entries = formattedEntries;

    // Ensure operatorColors is an object
    schedule.operatorColors = schedule.operatorColors || {};

    return {
      success: true,
      schedule,
    };
  } catch (error) {
    console.error("Error retrieving schedule:", error);
    return {
      success: false,
      error: "Failed to retrieve schedule",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}