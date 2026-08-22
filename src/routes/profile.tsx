import { createFileRoute } from "@tanstack/react-router";
import { GameShell } from "@/components/Layout";
import { usePlayer } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [{ title: "Player Profile" }],
  }),
  component: ProfilePage,
});

const DUMMY_PLAYERS = [
  { name: "Aarav", xp: 8920, avatar: "🦁" },
  { name: "Anaya", xp: 8450, avatar: "🐰" },
  { name: "Riya", xp: 7980, avatar: "🐼" },
  { name: "Kabir", xp: 6500, avatar: "🐯" },
  { name: "Zara", xp: 5200, avatar: "🦊" },
];

function ProfilePage() {
  const { player, level } = usePlayer();

  const leaderboard = [...DUMMY_PLAYERS, { name: player.name, xp: player.xp, avatar: player.avatar, isMe: true }]
    .sort((a, b) => b.xp - a.xp);

  return (
    <GameShell wide title="👤 Player Profile">
      <div className="grid gap-6 md:grid-cols-2 mt-4">
        <div className="toy-card p-6 flex flex-col items-center">
          <div className="text-6xl bg-gradient-sun w-24 h-24 flex items-center justify-center rounded-full mb-4 shadow-sm">
            {player.avatar}
          </div>
          <h2 className="font-display text-3xl">{player.name}</h2>
          <p className="text-muted-foreground font-bold mb-4">Level {level}</p>
          
          <div className="flex gap-4 mt-4 w-full justify-center">
            <div className="text-center p-3 bg-muted/50 rounded-xl min-w-[80px]">
              <div className="text-2xl mb-1">✨</div>
              <div className="font-bold">{player.xp}</div>
              <div className="text-xs text-muted-foreground font-bold uppercase">XP</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-xl min-w-[80px]">
              <div className="text-2xl mb-1">⭐</div>
              <div className="font-bold">{player.stars}</div>
              <div className="text-xs text-muted-foreground font-bold uppercase">Stars</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-xl min-w-[80px]">
              <div className="text-2xl mb-1">🔥</div>
              <div className="font-bold">{player.streak}</div>
              <div className="text-xs text-muted-foreground font-bold uppercase">Streak</div>
            </div>
          </div>
        </div>

        <div className="toy-card p-6">
          <h3 className="font-display text-xl mb-4 text-primary">🏆 Global Leaderboard</h3>
          <p className="text-sm font-bold text-muted-foreground mb-4">Compete with friends to reach the top!</p>
          <div className="flex flex-col gap-3">
            {leaderboard.map((p, i) => (
              <div 
                key={p.name}
                className={`flex justify-between items-center p-3 rounded-xl transition-all ${
                  (p as any).isMe 
                    ? 'bg-primary/10 border-2 border-primary/20 scale-105 shadow-sm' 
                    : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-display text-lg w-6 text-center ${i === 0 ? 'text-sun' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                    {i + 1}
                  </span>
                  <span className="text-2xl">{p.avatar}</span>
                  <span className={`font-bold ${(p as any).isMe ? 'text-primary' : ''}`}>
                    {p.name} {(p as any).isMe && "(You)"}
                  </span>
                </div>
                <span className={`font-bold ${(p as any).isMe ? 'text-primary' : ''}`}>{p.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
}
