import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  TrendingUp, 
  FileText,
  ExternalLink,
  Loader2,
  ChevronRight,
  Zap,
  CheckCircle,
  ArrowRight,
  Target,
  BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OptimizeContent() {
  const [prompts, setPrompts] = useState([]);
  const [allPrompts, setAllPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimization, setOptimization] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [funnelStage, setFunnelStage] = useState("top");

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const companies = await base44.entities.Company.filter({ setup_complete: true });
      if (companies.length > 0) {
        const promptsData = await base44.entities.PromptAnalysis.filter({ company_id: companies[0].id });
        
        // Generate mock data for prompts
        const enrichedPrompts = promptsData.map(p => ({
          ...p,
          search_signal_score: p.search_signal_score || Math.floor(Math.random() * 100),
          elelem_score: p.elelem_score || Math.floor(Math.random() * 100),
          best_pages: p.best_pages || [
            { url: `${companies[0].website_url}/blog/article-1`, title: "Understanding Modern Solutions", relevance_score: 87 },
            { url: `${companies[0].website_url}/resources/guide`, title: "Complete Guide to Best Practices", relevance_score: 72 },
            { url: `${companies[0].website_url}/features`, title: "Product Features Overview", relevance_score: 65 }
          ]
        }));
        
        setAllPrompts(enrichedPrompts);
        setPrompts(enrichedPrompts.filter(p => p.funnel_stage === "top"));
      }
    } catch (error) {
      console.error("Error loading prompts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (allPrompts.length > 0) {
      setPrompts(allPrompts.filter(p => p.funnel_stage === funnelStage));
      setSelectedPrompt(null);
      setSelectedPage(null);
      setOptimization(null);
    }
  }, [funnelStage]);

  const handleOptimize = async () => {
    if (!selectedPage) return;
    
    setIsOptimizing(true);
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an AI Search Optimization expert. Analyze and optimize content for the following:

Target Prompt: "${selectedPrompt.prompt}"
Target Keywords: ${selectedPrompt.keywords?.join(", ")}
Page URL: ${selectedPage.url}
Page Title: ${selectedPage.title}

Create an optimization brief based on elelem's 5 pillars of AI Search Visibility:

1. Freshness, Metadata & Technical Accessibility (10% weight)
2. Semantic Clarity & Intent Alignment (15% weight)
3. Structured Data & Semantic Markup (15% weight)
4. Structure & Formatting (25% weight)
5. Content Quality, Authority & Trust (35% weight)

Provide:
1. Current estimated scores for each pillar (0-100)
2. Optimized scores after recommendations
3. Specific changes to make for each pillar
4. Before/after content examples

Format as JSON with:
- pillar_scores: {freshness, semantic_clarity, structured_data, formatting, content_quality} each with {before, after}
- total_score_before: number
- total_score_after: number
- optimization_brief: string summarizing key improvements
- changes: array of {pillar, element, before, after} objects`,
        response_json_schema: {
          type: "object",
          properties: {
            pillar_scores: {
              type: "object",
              properties: {
                freshness: { type: "object", properties: { before: { type: "number" }, after: { type: "number" } } },
                semantic_clarity: { type: "object", properties: { before: { type: "number" }, after: { type: "number" } } },
                structured_data: { type: "object", properties: { before: { type: "number" }, after: { type: "number" } } },
                formatting: { type: "object", properties: { before: { type: "number" }, after: { type: "number" } } },
                content_quality: { type: "object", properties: { before: { type: "number" }, after: { type: "number" } } }
              }
            },
            total_score_before: { type: "number" },
            total_score_after: { type: "number" },
            optimization_brief: { type: "string" },
            changes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  pillar: { type: "string" },
                  element: { type: "string" },
                  before: { type: "string" },
                  after: { type: "string" }
                }
              }
            }
          }
        }
      });

      setOptimization(response);
    } catch (error) {
      console.error("Error optimizing:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const filteredPrompts = prompts.filter(p => 
    p.prompt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pillars = [
    { key: "freshness", label: "Freshness & Technical", weight: "10%", color: "bg-green-500" },
    { key: "semantic_clarity", label: "Semantic Clarity", weight: "15%", color: "bg-cyan-500" },
    { key: "structured_data", label: "Structured Data", weight: "15%", color: "bg-emerald-500" },
    { key: "formatting", label: "Structure & Formatting", weight: "25%", color: "bg-teal-500" },
    { key: "content_quality", label: "Content Quality & Trust", weight: "35%", color: "bg-lime-500" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading content data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Optimize Content</h1>
              <p className="text-slate-400">Select a prompt and optimize your pages for AI search visibility</p>
            </div>
          </div>

          {/* Funnel Stage Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-slate-400 text-sm">Funnel Stage:</span>
            <div className="flex gap-2 flex-wrap">
              {["top", "middle", "bottom"].map((stage) => (
                <Button
                  key={stage}
                  onClick={() => setFunnelStage(stage)}
                  size="sm"
                  className={`flex-1 sm:flex-none ${
                    funnelStage === stage
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prompts List */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <Card className="bg-slate-800/50 border-slate-700/50 max-h-[600px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-transparent">
                    <TableHead className="text-slate-400">Prompt</TableHead>
                    <TableHead className="text-slate-400 text-center w-24">Search Signal</TableHead>
                    <TableHead className="text-slate-400 text-center w-24">elelem Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrompts.map((prompt, i) => (
                    <TableRow 
                      key={i}
                      className={`border-slate-700/50 cursor-pointer transition-colors ${
                        selectedPrompt?.id === prompt.id 
                          ? "bg-teal-500/10 border-l-2 border-l-teal-500" 
                          : "hover:bg-slate-700/30"
                      }`}
                      onClick={() => {
                        setSelectedPrompt(prompt);
                        setSelectedPage(null);
                        setOptimization(null);
                      }}
                    >
                      <TableCell>
                        <p className="text-white text-sm line-clamp-2">{prompt.prompt}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {prompt.keywords?.slice(0, 3).map((kw, j) => (
                            <Badge key={j} variant="outline" className="text-xs text-teal-400 border-teal-500/30">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <TrendingUp className="w-4 h-4 text-cyan-400" />
                          <span className="text-cyan-400 font-medium">{prompt.search_signal_score}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${
                          prompt.elelem_score >= 70 ? "bg-emerald-500/20 text-emerald-400" :
                          prompt.elelem_score >= 40 ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>
                          {prompt.elelem_score}/100
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Best Pages / Optimization */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {selectedPrompt && !optimization ? (
                <motion.div
                  key="pages"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-teal-400" />
                        Best Matching Pages
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        Pages that best answer: "{selectedPrompt.prompt.slice(0, 60)}..."
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedPrompt.best_pages?.map((page, i) => (
                          <div
                            key={i}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              selectedPage?.url === page.url
                                ? "bg-teal-500/10 border-teal-500/50"
                                : "bg-slate-900/50 border-slate-700/50 hover:border-slate-600"
                            }`}
                            onClick={() => setSelectedPage(page)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="text-white font-medium">{page.title}</p>
                                <p className="text-slate-500 text-sm truncate">{page.url}</p>
                              </div>
                              <Badge className="bg-slate-700 text-slate-300">
                                {page.relevance_score}% match
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>

                      {selectedPage && (
                        <Button
                          className="w-full mt-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                          onClick={handleOptimize}
                          disabled={isOptimizing}
                        >
                          {isOptimizing ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Analyzing & Optimizing...
                            </>
                          ) : (
                            <>
                              <Zap className="w-5 h-5 mr-2" />
                              Optimize for AI Search
                            </>
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : optimization ? (
                <motion.div
                  key="optimization"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {/* Score Comparison */}
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-white">Optimization Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="text-center p-6 bg-slate-900/50 rounded-xl">
                          <p className="text-slate-400 text-sm mb-2">Before</p>
                          <p className="text-4xl font-bold text-slate-400">{optimization.total_score_before}</p>
                        </div>
                        <div className="text-center p-6 bg-teal-500/10 rounded-xl border border-teal-500/30">
                          <p className="text-teal-400 text-sm mb-2">After</p>
                          <p className="text-4xl font-bold text-teal-400">{optimization.total_score_after}</p>
                        </div>
                      </div>

                      {/* Pillar Scores */}
                      <div className="space-y-4">
                        {pillars.map((pillar) => {
                          const scores = optimization.pillar_scores?.[pillar.key];
                          return (
                            <div key={pillar.key} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-300">{pillar.label}</span>
                                <span className="text-slate-500">{pillar.weight}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <Progress 
                                    value={scores?.before || 50} 
                                    className="h-2 bg-slate-700"
                                  />
                                </div>
                                <span className="text-slate-500 text-sm w-8">{scores?.before || 50}</span>
                                <ArrowRight className="w-4 h-4 text-slate-500" />
                                <div className="flex-1">
                                  <Progress 
                                    value={scores?.after || 75} 
                                    className="h-2 bg-slate-700 [&>div]:bg-teal-500"
                                  />
                                </div>
                                <span className="text-teal-400 text-sm w-8">{scores?.after || 75}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Brief */}
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-white">Optimization Brief</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 leading-relaxed">{optimization.optimization_brief}</p>
                    </CardContent>
                  </Card>

                  {/* Changes */}
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-white">Recommended Changes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {optimization.changes?.map((change, i) => (
                          <div key={i} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                            <Badge className="mb-3 bg-teal-500/20 text-teal-400">{change.pillar}</Badge>
                            <p className="text-slate-400 text-sm mb-3">{change.element}</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-slate-500 mb-1">Before</p>
                                <p className="text-sm text-slate-400 bg-red-500/10 p-2 rounded border border-red-500/20">{change.before}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 mb-1">After</p>
                                <p className="text-sm text-teal-300 bg-teal-500/10 p-2 rounded border border-teal-500/20">{change.after}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    variant="outline"
                    className="w-full border-slate-700"
                    onClick={() => {
                      setOptimization(null);
                      setSelectedPage(null);
                    }}
                  >
                    ← Back to Page Selection
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-96"
                >
                  <div className="text-center">
                    <Target className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">Select a prompt to see matching pages</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}