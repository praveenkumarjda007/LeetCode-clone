import { Navbar } from "@/components/navbar";
import { useProblems } from "@/hooks/use-problems";
import { Link } from "wouter";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Trophy, Calendar, Zap } from "lucide-react";

export default function Home() {
  const { data: problems, isLoading } = useProblems();

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Problem List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Pick One</h1>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search problems..." className="pl-9 bg-secondary/50 border-white/5" />
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-zinc-900/40 backdrop-blur overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-sm font-medium text-muted-foreground">
                <div className="col-span-1">Status</div>
                <div className="col-span-7">Title</div>
                <div className="col-span-2">Difficulty</div>
                <div className="col-span-2">Acceptance</div>
              </div>

              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 border-b border-white/5">
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))
              ) : problems?.map((problem) => (
                <div key={problem.id} className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center group">
                  <div className="col-span-1">
                    {/* Placeholder for status icon (solved/attempted) */}
                  </div>
                  <div className="col-span-7">
                    <Link href={`/problems/${problem.slug}`} className="font-medium group-hover:text-primary transition-colors cursor-pointer block">
                      {problem.order}. {problem.title}
                    </Link>
                  </div>
                  <div className="col-span-2">
                    <DifficultyBadge difficulty={problem.difficulty} />
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground">
                    {/* Random acceptance for demo */}
                    {Math.floor(Math.random() * 40 + 30)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-white/5 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-bold">Daily Challenge</h3>
                  <p className="text-sm text-muted-foreground">Keep your streak alive!</p>
                </div>
              </div>
              <p className="text-sm font-medium mb-4">Invert Binary Tree</p>
              <div className="flex justify-between items-center">
                 <DifficultyBadge difficulty="Easy" />
                 <Link href="/problems/two-sum" className="text-sm text-primary hover:underline">Solve Now &rarr;</Link>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-zinc-900/50 p-6">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-yellow-500" /> 
                Trending Companies
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Google", "Facebook", "Amazon", "Microsoft", "Apple", "Bloomberg", "Uber"].map(company => (
                  <span key={company} className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground hover:bg-secondary/80 cursor-pointer transition-colors">
                    {company}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-zinc-900/50 p-6">
               <h3 className="font-bold flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-blue-500" />
                Study Plan
               </h3>
               <p className="text-sm text-muted-foreground mb-4">Start your interview preparation with our curated list.</p>
               <button className="w-full py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                  View Top 100 Liked Questions
               </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
