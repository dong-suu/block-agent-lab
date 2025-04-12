
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Edit, ExternalLink, MessageSquare, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  lastEdited: string;
  conversationCount: number;
  isPublic: boolean;
}

export function AgentCard({
  id,
  name,
  description,
  lastEdited,
  conversationCount,
  isPublic,
}: AgentCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base">{name}</h3>
            {isPublic ? (
              <Badge variant="outline" className="text-xs">Public</Badge>
            ) : (
              <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">Private</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/editor/${id}`}>
                <Edit className="mr-2 h-4 w-4" /> 
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4" /> 
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash className="mr-2 h-4 w-4" /> 
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="px-4 py-2 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Last edited {lastEdited}</span>
          <div className="flex items-center">
            <MessageSquare className="mr-1 h-3 w-3" />
            <span>{conversationCount} conversations</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 border-t bg-muted/50 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link to={`/chat/${id}`}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to={`/editor/${id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
