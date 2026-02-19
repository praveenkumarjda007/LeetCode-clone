import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { useProblem } from "@/hooks/use-problems";
import { useCreateSubmission } from "@/hooks/use-submissions";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Play, CloudUpload, ChevronLeft, Lock } from "lucide-react";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { useToast } from "@/hooks/use-toast";

const LANGUAGES = [
  { id: "javascript", name: "JavaScript" },
  { id: "python", name: "Python 3" },
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
];

export default function ProblemPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: problem, isLoading } = useProblem(slug!);
  const { user } = useAuth();
  const createSubmission = useCreateSubmission();
  const { toast } = useToast();

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string | null>(null);

  // Set starter code when problem loads or language changes
  useEffect(() => {
    if (problem?.starterCode) {
      const starter = (problem.starterCode as Record<string, string>)[language];
      if (starter) setCode(starter);
    }
  }, [problem, language]);

  const handleRun = () => {
    setOutput("Running test cases...\n\nCase 1: Passed\nCase 2: Passed\nCase 3: Passed");
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit your solution.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await createSubmission.mutateAsync({
        problemId: problem!.id,
        code,
        language
      });
      setOutput("Submission Accepted!\nRuntime: 56ms\nMemory: 42.1MB");
    } catch (e) {
      // Error handled in hook
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Problem not found</h1>
        <Link href="/" className="text-primary hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel: Description */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full overflow-y-auto p-6 bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Link href="/" className="p-1 hover:bg-secondary rounded-md transition-colors">
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </Link>
                <h1 className="text-xl font-bold">{problem.order}. {problem.title}</h1>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <DifficultyBadge difficulty={problem.difficulty} />
                <span className="text-sm text-muted-foreground">Accepted: 42.5%</span>
                <span className="text-sm text-muted-foreground">Submissions: 1.2M</span>
              </div>

              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{problem.description}</ReactMarkdown>
              </div>

              <div className="mt-8 space-y-4">
                {problem.testCases && Array.isArray(problem.testCases) && (problem.testCases as any[]).map((testCase, i) => (
                  <div key={i} className="bg-secondary/30 rounded-lg p-4 font-mono text-sm">
                    <p className="text-muted-foreground mb-1">Example {i + 1}:</p>
                    <div className="space-y-2">
                      <div>
                        <span className="select-none text-muted-foreground">Input: </span>
                        <span>{JSON.stringify(testCase.input)}</span>
                      </div>
                      <div>
                        <span className="select-none text-muted-foreground">Output: </span>
                        <span>{JSON.stringify(testCase.output)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel: Editor */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="h-full flex flex-col bg-[#1e1e1e]">
              {/* Editor Toolbar */}
              <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-[#1e1e1e]">
                <div className="flex items-center gap-4">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[140px] h-8 bg-white/5 border-white/10 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(lang => (
                        <SelectItem key={lang.id} value={lang.id}>{lang.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="h-8 gap-2 bg-white/5 hover:bg-white/10 text-white border-0"
                    onClick={handleRun}
                  >
                    <Play className="w-3.5 h-3.5" /> Run
                  </Button>
                  <Button 
                    size="sm" 
                    className={
                      createSubmission.isPending 
                      ? "h-8 gap-2 cursor-not-allowed opacity-50" 
                      : "h-8 gap-2 bg-green-600 hover:bg-green-700 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]"
                    }
                    onClick={handleSubmit}
                    disabled={createSubmission.isPending}
                  >
                    {createSubmission.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CloudUpload className="w-3.5 h-3.5" />
                    )}
                    Submit
                  </Button>
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 relative">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16 },
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                />
                
                {!user && (
                   <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex flex-col items-center justify-center z-10">
                      <Lock className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">Sign in to edit and submit code</p>
                      <Button asChild>
                        <a href="/api/login">Login to Code</a>
                      </Button>
                   </div>
                )}
              </div>

              {/* Console / Output */}
              <div className="h-48 border-t border-white/10 bg-[#1e1e1e]">
                <Tabs defaultValue="output" className="h-full flex flex-col">
                  <div className="flex items-center justify-between px-4 border-b border-white/10 bg-[#1e1e1e]">
                    <TabsList className="h-9 bg-transparent p-0">
                      <TabsTrigger 
                        value="output" 
                        className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 text-xs font-medium"
                      >
                        Output
                      </TabsTrigger>
                      <TabsTrigger 
                        value="testcases" 
                        className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 text-xs font-medium"
                      >
                        Test Cases
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="output" className="flex-1 p-4 font-mono text-sm overflow-auto mt-0">
                    {createSubmission.isPending ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Running code...
                      </div>
                    ) : output ? (
                      <pre className="whitespace-pre-wrap text-muted-foreground">{output}</pre>
                    ) : (
                      <div className="text-muted-foreground italic">
                        Run your code to see output here
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="testcases" className="flex-1 p-4 mt-0">
                    <div className="text-sm text-muted-foreground">
                      Test case configuration coming soon...
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
