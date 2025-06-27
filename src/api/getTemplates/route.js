async function handler({ includeEntries = true } = {}) {
  try {
    // Get all templates
    const templates = await sql`
      SELECT * FROM schedule_templates
      ORDER BY name ASC
    `;

    if (!includeEntries) {
      return { templates };
    }

    // Get all template entries for all templates
    const entries = await sql`
      SELECT * FROM template_entries
      ORDER BY template_id, day, shift, machine
    `;

    // Group entries by template_id
    const entriesByTemplate = {};
    for (const entry of entries) {
      if (!entriesByTemplate[entry.template_id]) {
        entriesByTemplate[entry.template_id] = [];
      }
      entriesByTemplate[entry.template_id].push(entry);
    }

    // Add entries to each template
    const templatesWithEntries = templates.map((template) => ({
      ...template,
      entries: entriesByTemplate[template.id] || [],
    }));

    return { templates: templatesWithEntries };
  } catch (error) {
    console.error("Error fetching templates:", error);
    return { error: "Failed to fetch templates", details: error.message };
  }
}
export async function POST(request) {
  return handler(await request.json());
}