async function handler() {
  try {
    console.log("Get All Schedules function called");

    const schedulesResult = await sql`
      SELECT 
        id, 
        week_number, 
        year, 
        week_start_date, 
        week_end_date, 
        date_range,
        schedule
      FROM 
        schedules
      ORDER BY 
        week_start_date DESC
    `;

    console.log(`Retrieved ${schedulesResult.length} schedules`);

    return {
      status: 200,
      body: {
        success: true,
        schedules: schedulesResult,
      },
    };
  } catch (error) {
    console.error("Error getting all schedules:", error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message || "An unexpected error occurred",
        schedules: [],
      },
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}