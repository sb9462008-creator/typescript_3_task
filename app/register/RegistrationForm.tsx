"use client";

import { useActionState, useOptimistic, useState } from "react";
import { registerAction, FormState } from "@/lib/actions";

const GAMES = ["Valorant", "Mobile Legends", "PUBG Mobile", "Free Fire", "EA FC 25"];

type OptimisticEntry = { player_name: string; game: string; pending: boolean };

export default function RegistrationForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    registerAction,
    { success: false, message: "" }
  );

  const [optimisticList, addOptimistic] = useOptimistic<OptimisticEntry[], OptimisticEntry>(
    [],
    (prev, entry) => [entry, ...prev]
  );

  const [submitted, setSubmitted] = useState<OptimisticEntry[]>([]);

  async function handleSubmit(formData: FormData) {
    const player_name = formData.get("player_name")?.toString() ?? "";
    const game = formData.get("game")?.toString() ?? "";
    // Optimistic: instantly show in list before server responds
    addOptimistic({ player_name, game, pending: true });
    await formAction(formData);
    if (player_name && game) {
      setSubmitted((prev) => [{ player_name, game, pending: false }, ...prev]);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-purple-400">
          🎮 E-Sport Tournament
        </h1>
        <p className="text-center text-gray-400 mb-8 text-sm">
          Indra Cyber School — Бүртгэл
        </p>

        <form action={handleSubmit} className="bg-gray-900 rounded-2xl p-6 space-y-4 shadow-xl">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Тоглогчийн нэр</label>
            <input
              name="player_name"
              required
              placeholder="GamerTag"
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">И-мэйл</label>
            <input
              name="email"
              type="email"
              required
              placeholder="player@email.com"
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Тоглоом</label>
            <select
              name="game"
              required
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">— Сонгоно уу —</option>
              {GAMES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg py-2 font-semibold transition-colors"
          >
            {isPending ? "Бүртгэж байна..." : "Бүртгүүлэх"}
          </button>

          {/* Feedback toast */}
          {state.message && (
            <div
              className={`rounded-lg px-4 py-2 text-sm text-center font-medium ${
                state.success
                  ? "bg-green-900 text-green-300"
                  : "bg-red-900 text-red-300"
              }`}
            >
              {state.message}
            </div>
          )}
        </form>

        {/* Optimistic list — instant feedback */}
        {optimisticList.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm text-gray-400 mb-3 uppercase tracking-wider">
              Таны бүртгэл (optimistic preview)
            </h2>
            <ul className="space-y-2">
              {optimisticList.map((entry, i) => (
                <li
                  key={i}
                  className={`flex justify-between items-center bg-gray-900 rounded-lg px-4 py-2 text-sm transition-opacity ${
                    entry.pending ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <span className="font-medium text-purple-300">{entry.player_name}</span>
                  <span className="text-gray-400">{entry.game}</span>
                  {entry.pending && (
                    <span className="text-xs text-yellow-400 animate-pulse">saving…</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-center text-gray-600 text-xs mt-6">
          <a href="/dashboard" className="hover:text-purple-400 underline">
            Admin Dashboard →
          </a>
        </p>
      </div>
    </div>
  );
}
