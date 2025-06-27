async function handler({ templateId }) {
  try {
    if (!templateId) {
      return {
        success: false,
        error: "Template ID is required",
      };
    }

    const result = await sql.transaction([
      sql`DELETE FROM template_entries WHERE template_id = ${templateId}`,
      sql`DELETE FROM schedule_templates WHERE id = ${templateId}`,
    ]);

    const templateDeleted = result[1].count > 0;

    if (templateDeleted) {
      return {
        success: true,
        message: "Template deleted successfully",
      };
    } else {
      return {
        success: false,
        error: "Template not found",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to delete template: ${error.message}`,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}