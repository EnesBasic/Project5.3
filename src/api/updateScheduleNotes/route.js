async function handler({ scheduleId, day, shift, machine, notes }) {
  try {
    if (!scheduleId || !day || !shift || !machine) {
      return {
        success: false,
        error:
          "Missing required fields: scheduleId, day, shift, and machine are required",
      };
    }

    const result = await sql(
      "UPDATE schedule_entries SET notes = $1, updated_at = CURRENT_TIMESTAMP WHERE schedule_id = $2 AND day = $3 AND shift = $4 AND machine = $5 RETURNING *",
      [notes, scheduleId, day, shift, machine]
    );

    if (result.length === 0) {
      return {
        success: false,
        error: "Schedule entry not found",
      };
    }

    return {
      success: true,
      entry: result[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}