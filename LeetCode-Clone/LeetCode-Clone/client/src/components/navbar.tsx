import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Code2, 
  LogOut, 
  User as UserIcon, 
  Trophy, 
  MessageSquare,
  Sparkles
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="h-16 border-b border-white/5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity">
            <div className="p-1.5 bg-gradient-to-br from-orange-400 to-amber-600 rounded-lg shadow-lg shadow-orange-500/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span>LeetClone</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-2">
              Problems
            </Link>
            <Link href="/contest" className="hover:text-foreground transition-colors flex items-center gap-2">
              Contest <Trophy className="w-3.5 h-3.5" />
            </Link>
            <Link href="/discuss" className="hover:text-foreground transition-colors flex items-center gap-2">
              Discuss <MessageSquare className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center">
             <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10">
                <Sparkles className="w-4 h-4 mr-2" /> Premium
             </Button>
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-border transition-all">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.profileImageUrl || ""} alt={user.firstName || "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.firstName?.[0] || <UserIcon className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="hover:bg-white/5">
                <a href="/api/login">Sign In</a>
              </Button>
              <Button asChild className="bg-white text-black hover:bg-white/90">
                <a href="/api/login">Register</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
