async function handler() {
  try {
    // Query all templates from the schedule_templates table
    const templates = await sql`
      SELECT id, name, description, created_at, updated_at
      FROM schedule_templates
      ORDER BY name ASC
    `;

    return {
      success: true,
      templates,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

<div className="w-full max-w-[1200px] mx-auto">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
    <div className="flex items-center gap-3">
      <a
        href="/"
        className="bg-[#1D1D1F] hover:bg-[#2A2A2A] text-[#67e8f9] p-2 rounded-lg transition-colors"
        title="Back to Schedule"
      >
        <i className="fas fa-arrow-left"></i>
      </a>
      <h1 className="text-2xl sm:text-3xl font-bold text-white">
        Schedule Templates
      </h1>
    </div>

    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
      <div className="relative flex-grow sm:max-w-[300px]">
        <input
          type="text"
          placeholder="Search templates..."
          className="w-full bg-[#1D1D1F] text-white border border-[#2A2A2A] rounded-lg px-4 py-2 pl-10 focus:outline-none focus:border-[#67e8f9]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#86868B]"></i>
      </div>

      <button
        onClick={handleCreateTemplate}
        className="bg-[#67e8f9] hover:bg-[#4fd1e9] text-[#121214] font-medium px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
      >
        <i className="fas fa-plus mr-2"></i>
        Create Template
      </button>
    </div>
  </div>
</div>;
export async function POST(request) {
  return handler(await request.json());
}