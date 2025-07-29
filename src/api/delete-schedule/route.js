async function handler({ scheduleId }) {
  try {
    console.log("Delete Schedule function called");
    console.log("Received data:", { scheduleId });

    // Validate required fields
    if (!scheduleId) {
      console.log("Validation failed - missing required field");
      return {
        status: 400,
        body: {
          success: false,
          message: "Missing required field: scheduleId is required",
        },
      };
    }

    // Check if schedule exists
    const scheduleCheck = await sql`
      SELECT id FROM schedules WHERE id = ${scheduleId}
    `;

    if (scheduleCheck.length === 0) {
      console.log("No schedule found with ID:", scheduleId);
      return {
        status: 404,
        body: {
          success: false,
          message: "No schedule found with the specified ID",
        },
      };
    }

    // Delete the schedule
    const result = await sql`
      DELETE FROM schedules
      WHERE id = ${scheduleId}
      RETURNING id
    `;

    console.log("Database operation result:", result);

    if (result && result.length > 0) {
      console.log("Schedule deleted successfully with ID:", result[0].id);
      return {
        status: 200,
        body: {
          success: true,
          message: "Schedule deleted successfully",
          scheduleId: result[0].id,
        },
      };
    } else {
      console.log("No schedule found with ID:", scheduleId);
      return {
        status: 404,
        body: {
          success: false,
          message: "No schedule found with the specified ID",
        },
      };
    }
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return {
      status: 500,
      body: {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}