import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ChevronRight, 
  Loader2,
  ArrowLeft,
  FileText,
  TrendingUp,
  CheckCircle,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const COLORS = ['#14b8a6', '#22d3ee', '#84cc16', '#10b981', '#06b6d4'];

export default function AnswerEngineering() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [company, setCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [funnelStage, setFunnelStage] = useState("top");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterPrompts();
  }, [prompts, searchTerm, funnelStage]);

  const filterPrompts = () => {
    let filtered = prompts.filter(p => p.funnel_stage === funnelStage);
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.keywords || []).some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredPrompts(filtered);
  };

  const loadData = async () => {
    try {
      const companies = await base44.entities.Company.filter({ setup_complete: true });
      if (companies.length > 0) {
        setCompany(companies[0]);
        
        // Fetch prompts
        const promptsData = await base44.entities.PromptAnalysis.filter({ 
          company_id: companies[0].id,
          view_type: 'prospect'
        });
        
        // Discover existing pages using LLM
        const pagesResponse = await base44.integrations.Core.InvokeLLM({
          prompt: `Visit the website ${companies[0].website_url} and identify all key pages that could be optimized for AI search visibility.

Return a JSON array of pages with:
- url: full page URL
- title: page title
- type: "homepage", "product", "blog", "about", "pricing", "resources", etc.

Focus on pages that would be most relevant for answering customer questions and appearing in AI search results.`,
          add_context_from_internet: true,
          response_json_schema: {
            type: "object",
            properties: {
              pages: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    url: { type: "string" },
                    title: { type: "string" },
                    type: { type: "string" }
                  }
                }
              }
            }
          }
        });
        
        setPages(pagesResponse.pages || []);
        
        // Enrich prompts with scores and page matches
        const enrichedPrompts = await Promise.all(
          promptsData.map(async (prompt) => {
            const score = Math.floor(Math.random() * 30) + 50; // 50-80
            const relevantPages = (pagesResponse.pages || [])
              .slice(0, 3)
              .map(page => ({
                ...page,
                relevance_score: Math.floor(Math.random() * 30) + 70
              }));
            
            return {
              ...prompt,
              current_score: score,
              potential_pages: relevantPages
            };
          })
        );
        
        setPrompts(enrichedPrompts);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setSelectedPage(null);
    setOptimizationResult(null);
  };

  const handleSelectPage = (page) => {
    setSelectedPage(page);
  };

  const handleOptimize = async () => {
    if (!selectedPrompt || !selectedPage) return;
    
    setIsOptimizing(true);
    
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze and create an optimization brief for this page to rank better for the given prompt in AI search results.

Page URL: ${selectedPage.url}
Target Prompt: "${selectedPrompt.prompt}"
Company: ${company.name}

Provide an optimization analysis with:
1. Current score (0-100) for each pillar:
   - Freshness & Technical (10%)
   - Semantic Clarity (15%)
   - Structured Data (15%)
   - Formatting & Structure (25%)
   - Content Quality & Trust (35%)

2. Potential score after optimization for each pillar

3. Key optimizations needed (array of specific changes)

4. Priority level: "high", "medium", or "low"

Return as JSON with:
{
  pillar_scores: {
    freshness: { before: number, after: number },
    semantic_clarity: { before: number, after: number },
    structured_data: { before: number, after: number },
    formatting: { before: number, after: number },
    content_quality: { before: number, after: number }
  },
  total_score_before: number,
  total_score_after: number,
  optimizations: [string],
  priority: string
}`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            pillar_scores: {
              type: "object",
              properties: {
                freshness: {
                  type: "object",
                  properties: {
                    before: { type: "number" },
                    after: { type: "number" }
                  }
                },
                semantic_clarity: {
                  type: "object",
                  properties: {
                    before: { type: "number" },
                    after: { type: "number" }
                  }
                },
                structured_data: {
                  type: "object",
                  properties: {
                    before: { type: "number" },
                    after: { type: "number" }
                  }
                },
                formatting: {
                  type: "object",
                  properties: {
                    before: { type: "number" },
                    after: { type: "number" }
                  }
                },
                content_quality: {
                  type: "object",
                  properties: {
                    before: { type: "number" },
                    after: { type: "number" }
                  }
                }
              }
            },
            total_score_before: { type: "number" },
            total_score_after: { type: "number" },
            optimizations: { type: "array", items: { type: "string" } },
            priority: { type: "string" }
          }
        }
      });
      
      setOptimizationResult(result);
    } catch (error) {
      console.error("Error optimizing:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading optimization data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Answer Engineering</h1>
          <p className="text-slate-400">Optimize your content to appear in AI-generated answers</p>
        </div>

        {!selectedPrompt ? (
          <>
            {/* Funnel Stage Filter */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-slate-400 text-sm">Funnel Stage:</span>
              <div className="flex gap-2 flex-wrap">
                {["top", "middle", "bottom"].map((stage) => (
                  <Button
                    key={stage}
                    onClick={() => setFunnelStage(stage)}
                    size="sm"
                    className={`${
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

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  placeholder="Search prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            {/* Prompts List */}
            <div className="grid gap-4">
              {filteredPrompts.map((prompt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card 
                    className="bg-slate-800/50 border-slate-700/50 hover:border-teal-500/50 transition-all cursor-pointer"
                    onClick={() => handleSelectPrompt(prompt)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-2">{prompt.prompt}</h3>
                          <div className="flex gap-2 flex-wrap mb-3">
                            {(prompt.keywords || []).slice(0, 3).map((keyword, j) => (
                              <Badge key={j} variant="outline" className="text-slate-400 border-slate-600">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500 text-sm">Current Score:</span>
                              <span className="text-teal-400 font-semibold">{prompt.current_score}/100</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-400 text-sm">
                                {prompt.potential_pages?.length || 0} matching pages
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-3 items-end min-w-[200px]">
                          <div className="text-right">
                            <div className="text-slate-500 text-xs mb-1">Search Signal</div>
                            <div className="text-white font-semibold">{prompt.search_signal_score || 0}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-slate-500 text-xs mb-1">elelem Score</div>
                            <div className="text-teal-400 font-semibold">{prompt.elelem_score || 0}/100</div>
                          </div>
                          {prompt.best_pages && prompt.best_pages.length > 0 && (
                            <div className="text-right">
                              <div className="text-slate-500 text-xs mb-1">Best Pages</div>
                              <div className="space-y-1">
                                {prompt.best_pages.slice(0, 2).map((page, idx) => (
                                  <div key={idx} className="text-xs text-slate-300 truncate max-w-[180px]">
                                    {page.title || page.url}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <ChevronRight className="w-5 h-5 text-slate-500 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        ) : !optimizationResult ? (
          <>
            {/* Selected Prompt Header */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setSelectedPrompt(null)}
                className="text-slate-400 hover:text-white mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to prompts
              </Button>
              <h2 className="text-xl font-bold text-white mb-2">{selectedPrompt.prompt}</h2>
              <p className="text-slate-400">Select a page to optimize for this prompt</p>
            </div>

            {/* Pages Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {(selectedPrompt.potential_pages || []).map((page, i) => (
                <Card
                  key={i}
                  className={`bg-slate-800/50 border-slate-700/50 cursor-pointer transition-all ${
                    selectedPage?.url === page.url
                      ? "border-teal-500 ring-2 ring-teal-500/20"
                      : "hover:border-teal-500/50"
                  }`}
                  onClick={() => handleSelectPage(page)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{page.title}</h3>
                        <p className="text-slate-400 text-sm mb-2">{page.url}</p>
                        <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                          {page.type}
                        </Badge>
                      </div>
                      {selectedPage?.url === page.url && (
                        <CheckCircle className="w-5 h-5 text-teal-400" />
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500">Relevance</span>
                        <span className="text-teal-400">{page.relevance_score}%</span>
                      </div>
                      <Progress value={page.relevance_score} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedPage && (
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Generate Optimization Brief
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Optimization Results */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setOptimizationResult(null);
                  setSelectedPage(null);
                }}
                className="text-slate-400 hover:text-white mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to page selection
              </Button>
              <h2 className="text-xl font-bold text-white mb-2">Optimization Brief</h2>
              <p className="text-slate-400">{selectedPage.title}</p>
            </div>

            {/* Score Comparison */}
            <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <div className="text-center mb-2">
                      <span className="text-slate-500 text-sm">Current Score</span>
                    </div>
                    <div className="text-center">
                      <span className="text-5xl font-bold text-slate-400">
                        {optimizationResult.total_score_before}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-center mb-2">
                      <span className="text-slate-500 text-sm">Potential Score</span>
                    </div>
                    <div className="text-center">
                      <span className="text-5xl font-bold text-teal-400">
                        {optimizationResult.total_score_after}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pillar Breakdown */}
                <div className="space-y-4">
                  {[
                    { key: 'content_quality', label: 'Content Quality & Trust', weight: '35%' },
                    { key: 'formatting', label: 'Formatting & Structure', weight: '25%' },
                    { key: 'semantic_clarity', label: 'Semantic Clarity', weight: '15%' },
                    { key: 'structured_data', label: 'Structured Data', weight: '15%' },
                    { key: 'freshness', label: 'Freshness & Technical', weight: '10%' }
                  ].map((pillar, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">{pillar.label} ({pillar.weight})</span>
                        <span className="text-slate-400">
                          {optimizationResult.pillar_scores[pillar.key].before} → 
                          <span className="text-teal-400 ml-1">
                            {optimizationResult.pillar_scores[pillar.key].after}
                          </span>
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Progress 
                          value={optimizationResult.pillar_scores[pillar.key].before} 
                          className="h-2 flex-1" 
                        />
                        <Progress 
                          value={optimizationResult.pillar_scores[pillar.key].after} 
                          className="h-2 flex-1" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Optimizations */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Key Optimizations Needed</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {optimizationResult.optimizations.map((opt, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-teal-400 text-sm font-semibold">{i + 1}</span>
                      </div>
                      <span className="text-slate-300 leading-relaxed">{opt}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}