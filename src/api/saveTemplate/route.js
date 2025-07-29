async function handler({ name, description, scheduleId }) {
  try {
    if (!name || !scheduleId) {
      return {
        success: false,
        error: "Name and scheduleId are required",
      };
    }

    const scheduleCheck = await sql`
      SELECT id FROM schedules WHERE id = ${scheduleId}
    `;

    if (scheduleCheck.length === 0) {
      return {
        success: false,
        error: "Schedule not found",
      };
    }

    const scheduleEntries = await sql`
      SELECT * FROM schedule_entries WHERE schedule_id = ${scheduleId}
    `;

    if (scheduleEntries.length === 0) {
      return {
        success: false,
        error: "No entries found in the schedule",
      };
    }

    const result = await sql.transaction(async (txn) => {
      const templateResult = await txn`
        INSERT INTO schedule_templates (name, description)
        VALUES (${name}, ${description})
        RETURNING id
      `;

      if (!templateResult || templateResult.length === 0) {
        throw new Error("Failed to create template");
      }

      const templateId = templateResult[0].id;

      for (const entry of scheduleEntries) {
        await txn`
          INSERT INTO template_entries 
          (template_id, day, shift, machine, operator)
          VALUES 
          (${templateId}, ${entry.day}, ${entry.shift}, ${entry.machine}, ${entry.operator})
        `;
      }

      return {
        success: true,
        templateId,
        entriesCount: scheduleEntries.length,
        message: "Template saved successfully",
      };
    });

    return result;
  } catch (error) {
    console.error("Error saving template:", error);
    return {
      success: false,
      error: "Failed to save template",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}