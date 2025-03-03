"use client";

const timelineEvents = [
  {
    id: 1,
    title: "Project Kickoff",
    date: "February 15, 2025",
    description: "Initial project planning meeting with stakeholders",
    category: "Meeting",
  },
  {
    id: 2,
    title: "Design Phase Complete",
    date: "February 20, 2025",
    description: "Finalized UI/UX designs and specifications",
    category: "Milestone",
  },
  {
    id: 3,
    title: "Development Sprint 1",
    date: "February 25, 2025",
    description: "Implementation of core features and functionality",
    category: "Development",
  },
  {
    id: 4,
    title: "Client Review",
    date: "March 3, 2025",
    description: "Presenting progress to client for feedback",
    category: "Meeting",
  },
  {
    id: 5,
    title: "QA Testing",
    date: "March 10, 2025",
    description: "Quality assurance testing of implemented features",
    category: "Testing",
  },
];

// Define category colors
const getCategoryColor = (category: string) => {
  switch (category) {
    case "Meeting":
      return "bg-blue-500";
    case "Milestone":
      return "bg-green-500";
    case "Development":
      return "bg-purple-500";
    case "Testing":
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
};

export default function BuildLogPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">Build Log</h1>
            <p className="text-gray-500">
              All the important memories (We were willing to write about)
            </p>
          </div>
        </div>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

          {/* Timeline events */}
          <div className="space-y-6">
            {timelineEvents.map((event) => (
              <div key={event.id} className="relative pl-10">
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 top-1.5 h-8 w-8 rounded-full flex items-center justify-center ${getCategoryColor(event.category)}`}
                >
                  <span className="text-white text-xs font-bold">
                    {event.id}
                  </span>
                </div>

                {/* Event content */}
                <div className="bg-card p-4 rounded-lg border shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {event.date}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {event.description}
                  </p>
                  <div className="mt-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full text-white ${getCategoryColor(event.category)}`}
                    >
                      {event.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
