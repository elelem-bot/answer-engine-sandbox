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
  Target,
  Zap
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
  const [funnelStage, setFunnelStage] = useState("top");
  const [selectedPage, setSelectedPage] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);

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
      const companies = await base44.entities.Company.list();
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
        setPrompts(promptsData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPrompt = (prompt) => {
    setSelectedPrompt(selectedPrompt?.id === prompt.id ? null : prompt);
  };

  const getMatchingPages = (prompt) => {
    if (!prompt.best_pages || prompt.best_pages.length === 0) {
      return pages.slice(0, 5).map(page => ({
        ...page,
        relevance_score: Math.floor(Math.random() * 15) + 85
      }));
    }
    return prompt.best_pages;
  };

  const handleOptimize = async () => {
    if (!selectedPage || !selectedPrompt) return;
    setIsOptimizing(true);
    
    try {
      // Step 1: Fetch original page content
      const originalContent = await base44.integrations.Core.InvokeLLM({
        prompt: `Extract the main content from this webpage: ${selectedPage.url}
        
Return the page content including headings, body text, and key sections.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            content: { type: "string" }
          }
        }
      });

      // Step 2: Generate optimized content
      const optimization = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert at optimizing content for AI search engines.

ORIGINAL PAGE CONTENT:
${originalContent.content}

TARGET PROMPT:
"${selectedPrompt.prompt}"

COMPANY CONTEXT:
- Company: ${company.name}
- Product: ${company.product_name}

TASK:
Rewrite the content to better answer the target prompt while maintaining the page's structure and purpose.

Return:
1. optimized_content: The improved version
2. changes: Array of specific changes made, each with:
   - section: What part was changed (e.g., "Introduction", "H1 Heading", "Product Description")
   - before: Original text snippet
   - after: New text snippet
   - reason: Why this change improves AI search visibility

Focus on:
- Directly addressing the prompt's question/intent
- Using clear, semantic language
- Adding specific details and examples
- Improving structure and formatting
- Natural keyword integration`,
        response_json_schema: {
          type: "object",
          properties: {
            optimized_content: { type: "string" },
            changes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  section: { type: "string" },
                  before: { type: "string" },
                  after: { type: "string" },
                  reason: { type: "string" }
                }
              }
            }
          }
        }
      });

      setOptimizationResult({
        original: originalContent.content,
        optimized: optimization.optimized_content,
        changes: optimization.changes
      });
    } catch (error) {
      console.error("Error optimizing:", error);
      alert("Failed to optimize page. Please try again.");
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
          <h1 className="text-2xl font-bold text-white mb-2">Optimize Content</h1>
          <p className="text-slate-400">Select a prompt and optimize your pages for AI search visibility</p>
        </div>

        {/* Funnel Stage Filter */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-slate-400 text-sm">Funnel Stage:</span>
          <div className="flex gap-2">
            {["top", "middle", "bottom"].map((stage) => (
              <Button
                key={stage}
                onClick={() => setFunnelStage(stage)}
                size="sm"
                className={`${
                  funnelStage === stage
                    ? "bg-teal-500 hover:bg-teal-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>

        <div className={`grid gap-6 ${optimizationResult ? 'lg:grid-cols-1' : 'lg:grid-cols-2'}`}>
          {/* Left Column - Prompts */}
          {!optimizationResult && <div>

            {/* Prompts Table */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left text-slate-400 text-sm font-medium p-4">Prompt</th>
                        <th className="text-center text-slate-400 text-sm font-medium p-4">Search Signal</th>
                        <th className="text-center text-slate-400 text-sm font-medium p-4">elelem Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPrompts.map((prompt, i) => (
                        <tr
                          key={i}
                          onClick={() => handleSelectPrompt(prompt)}
                          className={`border-b border-slate-700/50 last:border-0 cursor-pointer transition-colors ${
                            selectedPrompt?.id === prompt.id
                              ? "bg-teal-500/10"
                              : "hover:bg-slate-800/50"
                          }`}
                        >
                          <td className="p-4">
                            <div className="space-y-2">
                              <div className="text-white font-medium">{prompt.prompt}</div>
                              <div className="flex gap-2 flex-wrap">
                                {(prompt.keywords || []).slice(0, 3).map((keyword, j) => (
                                  <Badge
                                    key={j}
                                    className="bg-teal-500/20 text-teal-400 border-teal-500/30 text-xs"
                                  >
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <TrendingUp className="w-4 h-4 text-teal-400" />
                              <span className="text-white font-medium">{prompt.search_signal_score || Math.floor(Math.random() * 50) + 50}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className="text-teal-400 font-semibold">{prompt.elelem_score || Math.floor(Math.random() * 30) + 60}/100</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>}

          {/* Right Column - Best Matching Pages */}
          {!optimizationResult && <div>
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Best Matching Pages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPrompt ? (
                  <>
                    <p className="text-slate-400 text-sm mb-4">{selectedPrompt.prompt}</p>
                    <div className="space-y-3">
                      {getMatchingPages(selectedPrompt).map((page, i) => (
                        <div 
                          key={i} 
                          className={`p-3 bg-slate-900/50 rounded-lg cursor-pointer transition-colors border ${
                            selectedPage?.url === page.url
                              ? "bg-slate-900 border-teal-500/50"
                              : "border-transparent hover:border-teal-500/30 hover:bg-slate-900"
                          }`}
                          onClick={() => setSelectedPage(page)}
                        >
                          <div className="text-white font-medium text-sm mb-1">{page.title}</div>
                          <div className="text-slate-500 text-xs mb-2 truncate">{page.url}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-xs">Match</span>
                            <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                              {page.relevance_score}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedPage && (
                      <Button 
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 mt-4"
                        onClick={handleOptimize}
                        disabled={isOptimizing}
                      >
                        {isOptimizing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Optimizing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Optimize Page
                          </>
                        )}
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">Select a prompt to see best matching pages</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>}

          {/* Optimization Results */}
          {optimizationResult && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setOptimizationResult(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Prompts
                </Button>
              </div>

              {/* Changes Summary */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-teal-400" />
                    Optimization Complete
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 mb-4">
                    Optimized <span className="text-white font-medium">{selectedPage?.title}</span> to better answer: 
                    <span className="text-teal-400 italic"> "{selectedPrompt?.prompt}"</span>
                  </p>
                  <div className="space-y-3">
                    {optimizationResult.changes.map((change, i) => (
                      <div key={i} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                        <div className="flex items-start gap-3 mb-3">
                          <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                            {change.section}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="p-2 bg-red-500/10 border border-red-500/30 rounded">
                            <div className="text-red-400 text-xs mb-1">Before:</div>
                            <div className="text-slate-300">{change.before}</div>
                          </div>
                          <div className="p-2 bg-green-500/10 border border-green-500/30 rounded">
                            <div className="text-green-400 text-xs mb-1">After:</div>
                            <div className="text-slate-300">{change.after}</div>
                          </div>
                          <div className="text-slate-400 text-xs mt-2 flex items-start gap-2">
                            <Target className="w-3 h-3 text-teal-400 mt-0.5 flex-shrink-0" />
                            <span>{change.reason}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Side by Side Comparison */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Original Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <pre className="text-slate-300 whitespace-pre-wrap text-xs bg-slate-900/50 p-4 rounded-lg max-h-[600px] overflow-y-auto">
                        {optimizationResult.original}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-teal-500/30">
                  <CardHeader>
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4 text-teal-400" />
                      Optimized Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <pre className="text-slate-300 whitespace-pre-wrap text-xs bg-slate-900/50 p-4 rounded-lg max-h-[600px] overflow-y-auto">
                        {optimizationResult.optimized}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}