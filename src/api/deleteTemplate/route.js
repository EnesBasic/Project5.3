async function handler({ templateId }) {
  try {
    if (!templateId) {
      return {
        success: false,
        error: "Template ID is required",
      };
    }

    const templateCheck = await sql`
      SELECT id FROM schedule_templates WHERE id = ${templateId}
    `;

    if (templateCheck.length === 0) {
      return {
        success: false,
        error: "Template not found",
      };
    }

    await sql.transaction([
      sql`DELETE FROM template_entries WHERE template_id = ${templateId}`,
      sql`DELETE FROM schedule_templates WHERE id = ${templateId}`,
    ]);

    return {
      success: true,
      message: "Template and all associated entries deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting template:", error);
    return {
      success: false,
      error: "Failed to delete template",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}