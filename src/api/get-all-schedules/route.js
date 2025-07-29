async function handler() {
  try {
    const schedulesQuery = `
      SELECT 
        id, 
        week_number as "weekNumber", 
        year, 
        date_range as "dateRange", 
        created_at as "createdAt", 
        updated_at as "updatedAt"
      FROM schedules 
      ORDER BY year DESC, week_number DESC
    `;
    const schedules = await sql(schedulesQuery);

    const entriesQuery = `
      SELECT 
        id, 
        schedule_id as "scheduleId", 
        day, 
        shift, 
        machine, 
        operator, 
        created_at as "createdAt", 
        updated_at as "updatedAt"
      FROM schedule_entries
    `;
    const entries = await sql(entriesQuery);

    const entriesByScheduleId = entries.reduce((acc, entry) => {
      if (!acc[entry.scheduleId]) {
        acc[entry.scheduleId] = [];
      }
      acc[entry.scheduleId].push(entry);
      return acc;
    }, {});

    schedules.forEach((schedule) => {
      schedule.entries = entriesByScheduleId[schedule.id] || [];
    });

    return {
      success: true,
      schedules,
    };
  } catch (error) {
    console.error("Error retrieving schedules:", error);
    return {
      success: false,
      error: "Failed to retrieve schedules",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}