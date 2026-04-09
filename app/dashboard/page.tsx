import { getAllRegistrations } from "@/lib/db";

export const dynamic = "force-dynamic";

const GAME_COLORS: Record<string, string> = {
  Valorant: "bg-red-900 text-red-300",
  "Mobile Legends": "bg-blue-900 text-blue-300",
  "PUBG Mobile": "bg-yellow-900 text-yellow-300",
  "Free Fire": "bg-orange-900 text-orange-300",
  "EA FC 25": "bg-green-900 text-green-300",
};

export default async function DashboardPage() {
  let registrations: Awaited<ReturnType<typeof getAllRegistrations>> = [];
  try {
    registrations = await getAllRegistrations();
  } catch {
    // DB холболт байхгүй үед хоосон харуулна
  }

  const gameCounts = registrations.reduce<Record<string, number>>((acc, r) => {
    acc[r.game] = (acc[r.game] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-purple-400">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">SSR — live data, no cache</p>
          </div>
          <span className="bg-purple-900 text-purple-300 rounded-full px-4 py-1 text-sm font-semibold">
            {registrations.length} бүртгэл
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {Object.entries(gameCounts).map(([game, count]) => (
            <div key={game} className="bg-gray-900 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{count}</div>
              <div className="text-xs text-gray-400 mt-1">{game}</div>
            </div>
          ))}
        </div>

        {registrations.length === 0 ? (
          <p className="text-center text-gray-500 py-16">Бүртгэл байхгүй байна.</p>
        ) : (
          <div className="space-y-2">
            {registrations.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between bg-gray-900 rounded-xl px-5 py-3"
              >
                <div>
                  <span className="font-semibold text-white">{r.player_name}</span>
                  <span className="text-gray-500 text-sm ml-3">{r.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      GAME_COLORS[r.game] ?? "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {r.game}
                  </span>
                  <span className="text-gray-600 text-xs">
                    {new Date(r.created_at).toLocaleString("mn-MN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-gray-600 text-xs mt-8">
          <a href="/register" className="hover:text-purple-400 underline">
            ← Бүртгэлийн форм
          </a>
        </p>
      </div>
    </div>
  );
}
