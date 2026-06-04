export default function ActivityFeed() {
  const activities = [
    "QuestionPaper.pdf uploaded",
    "LabManual.pdf shared with Students",
    "ResearchPaper.pdf viewed",
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h2 className="text-2xl font-bold text-white mb-5">
        Recent Activity
      </h2>

      <div className="space-y-4">

        {activities.map((item, index) => (
          <div
            key={index}
            className="p-4 bg-slate-800 rounded-xl text-slate-300"
          >
            {item}
          </div>
        ))}

      </div>

    </div>
  );
}