
import { BlockLibrary } from "@/components/blocks/block-library";
import { AgentCanvas } from "@/components/agent/agent-canvas";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Play, ExternalLink, Info } from "lucide-react";

export function AgentBuilder() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-xl font-semibold">Agent Builder</h1>
          <p className="text-sm text-muted-foreground">Create and customize your AI assistant</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Play className="h-4 w-4 mr-2" />
            Test
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Agent
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <BlockLibrary />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <div className="h-full flex flex-col">
            <div className="p-2 border-b">
              <Input 
                placeholder="Agent Name" 
                className="text-lg font-medium" 
                defaultValue="My Custom Assistant" 
              />
            </div>
            <AgentCanvas className="flex-1" />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={20}>
          <div className="h-full">
            <Tabs defaultValue="properties" className="h-full flex flex-col">
              <TabsList className="w-full justify-start px-4 pt-2">
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>
              <TabsContent value="properties" className="flex-1 p-4 overflow-auto">
                <Card className="p-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what your agent does..."
                        className="resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instructions</Label>
                      <Textarea
                        id="instructions"
                        placeholder="Add special instructions for your agent..."
                        className="resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visibility">Visibility</Label>
                      <select
                        id="visibility"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                      </select>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="info" className="flex-1 p-4 overflow-auto">
                <Card className="p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Block Information</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Select a block on the canvas to view and edit its properties.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="link" className="h-auto p-0 text-sm" asChild>
                      <a href="#" className="flex items-center">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        View documentation
                      </a>
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
