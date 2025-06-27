async function handler({ startDate, endDate }) {
  try {
    console.log("Get Schedule By Week Dates function called");
    console.log("Requested dates:", { startDate, endDate });

    // Validate required fields
    if (!startDate || !endDate) {
      console.log("Validation failed - missing required fields");
      return {
        status: 400,
        body: {
          success: false,
          message: "Start date and end date are required",
        },
      };
    }

    // Get schedule for the specified date range
    const scheduleResult = await sql`
      SELECT id, week_number, year, week_start_date, week_end_date, date_range, schedule, created_at 
      FROM schedules 
      WHERE week_start_date = ${startDate} AND week_end_date = ${endDate}
    `;

    console.log(
      `Retrieved ${scheduleResult.length} schedules for the specified date range`
    );

    if (scheduleResult.length === 0) {
      return {
        status: 404,
        body: {
          success: false,
          message: "Schedule not found for the specified dates",
        },
      };
    }

    const scheduleInfo = {
      id: scheduleResult[0].id,
      week_number: scheduleResult[0].week_number,
      year: scheduleResult[0].year,
      week_start_date: scheduleResult[0].week_start_date,
      week_end_date: scheduleResult[0].week_end_date,
      date_range: scheduleResult[0].date_range,
      created_at: scheduleResult[0].created_at,
    };

    return {
      status: 200,
      body: {
        success: true,
        scheduleInfo,
        schedule: scheduleResult[0].schedule,
      },
    };
  } catch (error) {
    console.error("Error fetching schedule by dates:", error);
    return {
      status: 500,
      body: {
        success: false,
        message: "Failed to fetch schedule",
        error: error.message,
      },
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}