async function handler({ templateId, scheduleId }) {
  try {
    if (!templateId || !scheduleId) {
      return {
        success: false,
        error: "Template ID and Schedule ID are required",
      };
    }

    const templateResult = await sql`
      SELECT * FROM schedule_templates WHERE id = ${templateId}
    `;

    if (templateResult.length === 0) {
      return {
        success: false,
        error: "Template not found",
      };
    }

    const scheduleResult = await sql`
      SELECT * FROM schedules WHERE id = ${scheduleId}
    `;

    if (scheduleResult.length === 0) {
      return {
        success: false,
        error: "Schedule not found",
      };
    }

    const templateEntries = await sql`
      SELECT * FROM template_entries WHERE template_id = ${templateId}
    `;

    const result = await sql.transaction(async (txn) => {
      await txn`
        DELETE FROM schedule_entries WHERE schedule_id = ${scheduleId}
      `;

      for (const entry of templateEntries) {
        await txn`
          INSERT INTO schedule_entries 
          (schedule_id, day, shift, machine, operator, notes)
          VALUES 
          (${scheduleId}, ${entry.day}, ${entry.shift}, ${entry.machine}, ${entry.operator}, NULL)
        `;
      }

      return {
        success: true,
        message: "Template applied successfully",
        scheduleId,
        templateId,
        entriesCount: templateEntries.length,
      };
    });

    return result;
  } catch (error) {
    console.error("Error applying template:", error);
    return {
      success: false,
      error: "Failed to apply template",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}