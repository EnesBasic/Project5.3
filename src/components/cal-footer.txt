"use client";
import React from "react";



export default function Index() {
  return ("use client";


function MainComponent({
  showEvents,
  setShowEvents,
  loading,
  fetchEvents,
  error,
  events,
  handleDeleteEvent,
  categoryColors,
}) {
  return (
    <div className="w-full">
      <div className="relative w-full">
        <button
          onClick={() => setShowEvents((prev) => !prev)}
          className="w-full bg-[#1a1a1a] p-2 rounded-lg text-[#67e8f9] text-sm flex justify-between items-center"
        >
          <span>Događaji</span>
          <i className={`fas fa-chevron-${showEvents ? "up" : "down"}`}></i>
        </button>
        {showEvents && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#2d2d2d] p-2 rounded-lg max-h-[60vh] overflow-y-auto z-10">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[#67e8f9] text-xs font-semibold">
                Svi događaji
              </div>
              {!loading && (
                <button
                  onClick={async () => {
                    await fetchEvents(true);
                  }}
                  className="text-xs text-[#4a9eff] hover:text-[#67e8f9] transition-colors"
                >
                  Učitaj sve
                </button>
              )}
            </div>
            {loading ? (
              <div className="text-gray-400 text-xs flex items-center justify-center p-4">
                <i className="fas fa-spinner fa-spin mr-2"></i> Loading...
              </div>
            ) : error ? (
              <div className="text-red-400 text-xs p-4">{error}</div>
            ) : Object.entries(events).length === 0 ? (
              <div className="text-gray-400 text-xs">Nema događaja</div>
            ) : (
              Object.entries(events)
                .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                .map(([date, eventList]) => {
                  const uniqueEvents = eventList.reduce((acc, event) => {
                    if (
                      event.category.startsWith("odmor") &&
                      event.isVacationDay
                    ) {
                      if (event.isStart && !event._isMarker) {
                        acc.push(event);
                      }
                    } else {
                      acc.push(event);
                    }
                    return acc;
                  }, []);
                  if (uniqueEvents.length === 0) return null;
                  return (
                    <div key={date} className="mb-2">
                      <div className="text-[#4a9eff] mb-1 text-xs">
                        {new Date(date).toLocaleDateString()}
                      </div>
                      {uniqueEvents.map((event) => (
                        <div
                          key={event.id || `${date}-${event.text}`}
                          className={`
                            flex justify-between items-center relative group
                            ${
                              event.category.startsWith("odmor")
                                ? "bg-gradient-to-r"
                                : "bg-[#2a2a2a]"
                            } 
                            p-1 rounded mb-1
                          `}
                          style={
                            event.category.startsWith("odmor")
                              ? {
                                  background: `linear-gradient(to right, ${
                                    categoryColors[event.category]
                                  }60, ${categoryColors[event.category]}80)`,
                                }
                              : {}
                          }
                        >
                          <div className="min-w-0 flex-1">
                            <div
                              className="text-xs truncate cursor-help"
                              style={{
                                color: categoryColors[event.category],
                              }}
                            >
                              {event.text}
                              {event.category.startsWith("odmor") && (
                                <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                  Godišnji
                                </div>
                              )}
                            </div>
                            {event.category.startsWith("odmor") &&
                            event.endDate ? (
                              <div className="text-xs text-gray-400 truncate">
                                {new Date(event.date).toLocaleDateString()} -{" "}
                                {new Date(event.endDate).toLocaleDateString()}
                                {new Date(event.date).getMonth() !==
                                  new Date(event.endDate).getMonth() && (
                                  <span
                                    className={`ml-1 ${
                                      event.category === "odmor2"
                                        ? "text-[#8b5cf6]"
                                        : event.category === "odmor3"
                                          ? "text-[#fbbf24]"
                                          : event.category === "odmor4"
                                            ? "text-[#f43f5e]"
                                            : event.category === "odmor5"
                                              ? "text-[#14b8a6]"
                                              : "text-[#06b6d4]"
                                    }`}
                                  >
                                    (Više mjeseci)
                                  </span>
                                )}
                              </div>
                            ) : event.time ? (
                              <div className="text-xs text-gray-400 truncate">
                                {event.time}
                              </div>
                            ) : null}
                          </div>
                          {event.category !== "islamic" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEvent(event.id);
                              }}
                              className="text-red-500 hover:text-red-400 ml-2 flex-shrink-0"
                            >
                              <i className="fas fa-trash text-xs"></i>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StoryComponent() {
  const [showEvents, setShowEvents] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const categoryColors = {
    "odmor-godisnji": "#ff9966",
    "odmor-bolovanje": "#4a9eff",
    "odmor-slobodan-dan": "#67e8f9",
    work: "#10b981",
    meeting: "#8b5cf6",
    personal: "#f43f5e",
    islamic: "#fbbf24",
  };
  const sampleEvents = {
    [new Date().toDateString()]: [
      { id: "1", text: "Team Meeting", category: "meeting", time: "10:00 AM" },
      {
        id: "2",
        text: "Lunch with Client",
        category: "work",
        time: "12:30 PM",
      },
    ],
    [new Date(Date.now() + 86400000).toDateString()]: [
      {
        id: "3",
        text: "Annual Leave",
        category: "odmor-godisnji",
        isVacationDay: true,
        isStart: true,
        date: new Date(Date.now() + 86400000),
        endDate: new Date(Date.now() + 86400000 * 5),
      },
    ],
    [new Date(Date.now() + 86400000 * 7).toDateString()]: [
      {
        id: "4",
        text: "Doctor Appointment",
        category: "odmor-bolovanje",
        isVacationDay: true,
        isStart: true,
        date: new Date(Date.now() + 86400000 * 7),
      },
      { id: "5", text: "Project Deadline", category: "work", time: "5:00 PM" },
    ],
    [new Date(Date.now() + 86400000 * 14).toDateString()]: [
      { id: "6", text: "Ramadan Start", category: "islamic" },
    ],
  };
  const [events, setEvents] = useState(sampleEvents);
  const fetchEvents = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (forceRefresh) {
        const newDate = new Date(Date.now() + 86400000 * 21).toDateString();
        setEvents((prev) => ({
          ...prev,
          [newDate]: [
            {
              id: "7",
              text: "Conference",
              category: "work",
              time: "9:00 AM - 5:00 PM",
            },
          ],
        }));
      }
    } catch (err) {
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteEvent = (id) => {
    const updatedEvents = {};
    Object.entries(events).forEach(([date, eventList]) => {
      const filteredEvents = eventList.filter((event) => event.id !== id);
      if (filteredEvents.length > 0) {
        updatedEvents[date] = filteredEvents;
      }
    });
    setEvents(updatedEvents);
  };
  return (
    <div className="min-h-screen bg-black p-4 font-inter">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-2xl font-semibold mb-6">
          Calendar Footer Component
        </h1>
        <div className="bg-[#1D1D1F] rounded-lg p-4 mb-8">
          <MainComponent
            showEvents={showEvents}
            setShowEvents={setShowEvents}
            loading={loading}
            fetchEvents={fetchEvents}
            error={error}
            events={events}
            handleDeleteEvent={handleDeleteEvent}
            categoryColors={categoryColors}
          />
        </div>
        <div className="bg-[#1D1D1F] rounded-lg p-4 mb-8">
          <h2 className="text-white text-xl font-semibold mb-4">
            Component Variants
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-[#67e8f9] text-lg mb-2">Loading State</h3>
              <MainComponent
                showEvents={true}
                setShowEvents={() => {}}
                loading={true}
                fetchEvents={() => {}}
                error={null}
                events={{}}
                handleDeleteEvent={() => {}}
                categoryColors={categoryColors}
              />
            </div>
            <div>
              <h3 className="text-[#67e8f9] text-lg mb-2">Error State</h3>
              <MainComponent
                showEvents={true}
                setShowEvents={() => {}}
                loading={false}
                fetchEvents={() => {}}
                error="Failed to load events. Please try again."
                events={{}}
                handleDeleteEvent={() => {}}
                categoryColors={categoryColors}
              />
            </div>
            <div>
              <h3 className="text-[#67e8f9] text-lg mb-2">Empty State</h3>
              <MainComponent
                showEvents={true}
                setShowEvents={() => {}}
                loading={false}
                fetchEvents={() => {}}
                error={null}
                events={{}}
                handleDeleteEvent={() => {}}
                categoryColors={categoryColors}
              />
            </div>
          </div>
        </div>
        <div className="bg-[#1D1D1F] rounded-lg p-4">
          <h2 className="text-white text-xl font-semibold mb-4">
            Component Details
          </h2>
          <div className="text-[#86868B] space-y-2">
            <p>
              This calendar footer component provides a dropdown interface to
              view all events:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Toggle button to show/hide the events panel</li>
              <li>Events grouped by date and sorted chronologically</li>
              <li>Color-coded events based on category</li>
              <li>Special styling for vacation/leave events</li>
              <li>Delete functionality for user-created events</li>
              <li>Loading, error, and empty states</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});
}