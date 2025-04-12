
import { Button } from "@/components/ui/button";
import { AvatarMenu } from "@/components/ui/avatar-menu";
import { Brain } from "lucide-react";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 md:px-8">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Brain className="w-6 h-6 text-primary" />
          <Link to="/" className="hidden md:block">BlockAgent</Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <nav className="flex items-center space-x-2">
            <Button asChild variant="ghost">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/agents">My Agents</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/templates">Templates</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/community">Community</Link>
            </Button>
          </nav>
          <AvatarMenu username="Demo User" />
        </div>
      </div>
    </div>
  );
}
