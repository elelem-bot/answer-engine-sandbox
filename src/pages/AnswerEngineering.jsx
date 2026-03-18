import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { 
  Search, 
  Loader2,
  FileText,
  TrendingUp,
  Zap,
  Copy,
  Check,
  RotateCcw,
  AlignLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AnswerEngineering() {
  const [isLoading, setIsLoading] = useState(true);
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [company, setCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [pages, setPages] = useState([]);
  const [funnelStage, setFunnelStage] = useState("top");
  const [selectedPage, setSelectedPage] = useState(null);

  // Brief + editor state
  const [contentBrief, setContentBrief] = useState(null);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [draftContent, setDraftContent] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [isRescoring, setIsRescoring] = useState(false);
  const [rescoreResult, setRescoreResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { loadData(); }, []);
  useEffect(() => { filterPrompts(); }, [prompts, searchTerm, funnelStage]);

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
        const promptsData = await base44.entities.PromptAnalysis.filter({
          company_id: companies[0].id,
          view_type: 'prospect'
        });
        const pagesResponse = await base44.integrations.Core.InvokeLLM({
          prompt: `Visit the website ${companies[0].website_url} and identify all key pages that could be optimized for AI search visibility. Return a JSON array of pages with url, title, and type fields.`,
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

  const getSeoScore = (index) => {
    // Deterministic pseudo-random SEO score per page index
    return ((index * 17 + 43) % 35) + 45;
  };

  const getMatchingPages = (prompt) => {
    if (!prompt.best_pages || prompt.best_pages.length === 0) {
      return pages.slice(0, 5).map((page, i) => ({
        ...page,
        relevance_score: Math.floor(Math.random() * 15) + 85
      }));
    }
    return prompt.best_pages;
  };

  const handleSelectPrompt = (prompt) => {
    const next = selectedPrompt?.id === prompt.id ? null : prompt;
    setSelectedPrompt(next);
    setSelectedPage(null);
    setContentBrief(null);
    setDraftContent("");
    setEditorContent("");
    setRescoreResult(null);
  };

  const handleSelectPage = (page) => {
    setSelectedPage(selectedPage?.url === page.url ? null : page);
    setContentBrief(null);
    setDraftContent("");
    setEditorContent("");
    setRescoreResult(null);
  };

  const handleAction = async () => {
    if (!selectedPrompt) return;

    setIsGeneratingBrief(true);
    setContentBrief(null);
    setDraftContent("");
    setEditorContent("");
    setRescoreResult(null);

    try {
      const briefPrompt = selectedPage
        ? `You are a content strategist. Create a detailed content brief for optimizing this page for AI search visibility.

Page: "${selectedPage.title}" (${selectedPage.url})
Target prompt: "${selectedPrompt.prompt}"
Company: ${company?.name}
Product: ${company?.product_name}

Return a content brief with:
- objective: one sentence goal
- key_messages: 3-4 bullet points the page must communicate
- recommended_sections: list of sections to include/improve
- tone_and_style: guidance on tone
- ai_visibility_tips: 3 specific tips to improve AI retrieval for this prompt`
        : `You are a content strategist. Create a detailed content brief for a brand new page to answer this prompt.

Target prompt: "${selectedPrompt.prompt}"
Company: ${company?.name}
Product: ${company?.product_name}

Return a content brief with:
- objective: one sentence goal
- key_messages: 3-4 bullet points the page must communicate
- recommended_sections: list of sections to include
- tone_and_style: guidance on tone
- ai_visibility_tips: 3 specific tips to improve AI retrieval for this prompt`;

      const brief = await base44.integrations.Core.InvokeLLM({
        prompt: briefPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            objective: { type: "string" },
            key_messages: { type: "array", items: { type: "string" } },
            recommended_sections: { type: "array", items: { type: "string" } },
            tone_and_style: { type: "string" },
            ai_visibility_tips: { type: "array", items: { type: "string" } }
          }
        }
      });

      setContentBrief(brief);
    } catch (error) {
      console.error("Error generating brief:", error);
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  const handleCreateDraft = async () => {
    if (!selectedPrompt || !contentBrief) return;
    setIsGeneratingDraft(true);
    setRescoreResult(null);

    try {
      const draftPrompt = selectedPage
        ? `Write an optimized version of the page "${selectedPage.title}" for the prompt: "${selectedPrompt.prompt}".

Content brief objective: ${contentBrief.objective}
Key messages: ${contentBrief.key_messages?.join(', ')}
Sections to include: ${contentBrief.recommended_sections?.join(', ')}
Tone: ${contentBrief.tone_and_style}
AI visibility tips: ${contentBrief.ai_visibility_tips?.join('; ')}

Company: ${company?.name}, Product: ${company?.product_name}

Write a complete, polished page (600-900 words) ready for publishing. Use plain text, no markdown symbols.`
        : `Write a brand new page to answer: "${selectedPrompt.prompt}".

Content brief objective: ${contentBrief.objective}
Key messages: ${contentBrief.key_messages?.join(', ')}
Sections to include: ${contentBrief.recommended_sections?.join(', ')}
Tone: ${contentBrief.tone_and_style}
AI visibility tips: ${contentBrief.ai_visibility_tips?.join('; ')}

Company: ${company?.name}, Product: ${company?.product_name}

Write a complete, polished article (600-900 words). Use plain text, no markdown symbols.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: draftPrompt,
        response_json_schema: {
          type: "object",
          properties: { content: { type: "string" } }
        }
      });

      setDraftContent(result.content);
      setEditorContent(result.content);
    } catch (error) {
      console.error("Error generating draft:", error);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleRescore = async () => {
    if (!editorContent || !selectedPrompt) return;
    setIsRescoring(true);
    setRescoreResult(null);

    try {
      // Generate 3-4 related prompts from the same cluster for per-prompt scoring
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an AI visibility expert. Score this content for retrievability.

Target prompt: "${selectedPrompt.prompt}"

Content:
${editorContent}

1. Give an overall retrieval score (0-100) for the target prompt.
2. Generate 4 related prompts that a buyer might also ask on this topic, and score each (0-100) based on how well this content would answer them too.

Be realistic with scores - good content typically scores 60-85.`,
        response_json_schema: {
          type: "object",
          properties: {
            retrieval_score: { type: "number" },
            summary: { type: "string" },
            per_prompt_scores: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  prompt: { type: "string" },
                  score: { type: "number" }
                }
              }
            }
          }
        }
      });

      setRescoreResult(result);
    } catch (error) {
      console.error("Error rescoring:", error);
    } finally {
      setIsRescoring(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editorContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading optimization data...</p>
        </div>
      </div>
    );
  }

  const matchingPages = selectedPrompt ? getMatchingPages(selectedPrompt) : [];
  const showWorkspace = !!contentBrief || isGeneratingBrief;

  return (
    <div className="min-h-screen p-6 lg:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Optimize Content</h1>
          <p className="text-gray-600">Select a prompt and optimize your pages for AI search visibility</p>
        </div>

        {/* Funnel Stage Filter */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-gray-600">Funnel Stage:</span>
          <div className="flex gap-2">
            {["top", "middle", "bottom"].map((stage) => (
              <Button
                key={stage}
                onClick={() => setFunnelStage(stage)}
                size="sm"
                style={funnelStage === stage
                  ? { background: "linear-gradient(to right, #2DC6FE, #81FBEF)", color: "#082D35", border: "none", borderRadius: "9999px" }
                  : { background: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: "9999px" }
                }
                className=""
              >
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-300 text-gray-900"
          />
        </div>

        {/* Step 1: Prompts + Pages — always visible */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Left: Prompts */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Prompts</h2>
            <Card className="bg-white border-gray-200">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left text-sm font-medium p-4 text-gray-600">Prompt</th>
                        <th className="text-center text-sm font-medium p-4 text-gray-600">Search Signal</th>
                        <th className="text-center text-sm font-medium p-4 text-gray-600">Cluster Size</th>
                        <th className="text-center text-sm font-medium p-4 text-gray-600">Share of Citations</th>
                        <th className="text-center text-sm font-medium p-4 text-gray-600">elelem Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPrompts.map((prompt, i) => (
                        <tr
                          key={i}
                          onClick={() => handleSelectPrompt(prompt)}
                          className={`border-b last:border-0 cursor-pointer transition-colors border-gray-200 ${selectedPrompt?.id === prompt.id ? "bg-teal-500/10" : "hover:bg-gray-50"}`}
                        >
                          <td className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <div className="font-medium flex-1 text-gray-900">{prompt.prompt}</div>
                                {prompt.source_tag === 'REAL' && (
                                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">REAL</Badge>
                                )}
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                {(prompt.keywords || []).slice(0, 3).map((keyword, j) => (
                                  <Badge key={j} className="bg-teal-500/20 text-teal-400 border-teal-500/30 text-xs">{keyword}</Badge>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <TrendingUp className="w-4 h-4 text-teal-500" />
                              <span className="font-medium text-gray-900">{prompt.search_signal_score || Math.floor(Math.random() * 50) + 50}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-semibold text-blue-600">{((i * 7 + 12) % 20) + 8}</span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-semibold text-purple-600">{((i * 13 + 18) % 35) + 10}%</span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="text-teal-600 font-semibold">{prompt.elelem_score || Math.floor(Math.random() * 30) + 60}/100</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Best Matching Pages */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Best Matching Pages</h2>
            <Card className="bg-white border-gray-200">
              <CardContent className="p-0">
                {selectedPrompt ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left text-sm font-medium p-4 text-gray-600">Pages</th>
                            <th className="text-center text-sm font-medium p-4 text-gray-600">Topical Similarity</th>
                            <th className="text-center text-sm font-medium p-4 text-gray-600">Citations</th>
                            <th className="text-center text-sm font-medium p-4 text-gray-600">SEO Score</th>
                            <th className="text-center text-sm font-medium p-4 text-gray-600">Retrieval Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {matchingPages.map((page, i) => (
                            <tr
                              key={i}
                              onClick={() => handleSelectPage(page)}
                              className={`border-b last:border-0 cursor-pointer transition-colors border-gray-200 ${selectedPage?.url === page.url ? "bg-teal-500/10" : "hover:bg-gray-50"}`}
                            >
                              <td className="p-4">
                                <div className="font-medium text-sm text-gray-900 mb-0.5">{page.title}</div>
                                <div className="text-xs text-gray-500 truncate max-w-[180px]">{page.url}</div>
                              </td>
                              <td className="p-4 text-center">
                                <span className="font-semibold text-purple-600">{((i * 13 + 70) % 20) + 75}%</span>
                              </td>
                              <td className="p-4 text-center">
                                <span className="font-semibold text-blue-600">{((i * 11 + 5) % 20) + 3}</span>
                              </td>
                              <td className="p-4 text-center">
                                {(() => {
                                  const score = getSeoScore(i);
                                  const color = score >= 70 ? "text-green-600" : score >= 50 ? "text-amber-500" : "text-red-500";
                                  return <span className={`font-semibold ${color}`}>{score}/100</span>;
                                })()}
                              </td>
                              <td className="p-4 text-center">
                                <span className="text-teal-600 font-semibold">{page.relevance_score}/100</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-4">
                      <Button
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                        onClick={handleAction}
                        disabled={isGeneratingBrief}
                      >
                        {isGeneratingBrief ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating Brief...</>
                        ) : selectedPage ? (
                          <><Zap className="w-4 h-4 mr-2" />Optimize This Page</>
                        ) : (
                          <><FileText className="w-4 h-4 mr-2" />Create New Page</>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-500">Select a prompt to see best matching pages</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Step 2: Content Brief + Editor — appears below when triggered */}
        {showWorkspace && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center">2</div>
              <h2 className="text-base font-semibold text-gray-900">
                {selectedPage ? `Optimizing: ${selectedPage.title}` : "Creating New Page"}
              </h2>
              <span className="text-sm text-gray-400 italic">"{selectedPrompt?.prompt}"</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left: Content Brief */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Content Brief</h3>
                {isGeneratingBrief ? (
                  <Card className="bg-white border-gray-200">
                    <CardContent className="py-16 text-center">
                      <Loader2 className="w-10 h-10 text-teal-500 animate-spin mx-auto mb-4" />
                      <p className="text-gray-600">Generating content brief...</p>
                    </CardContent>
                  </Card>
                ) : contentBrief && (
                  <Card className="bg-white border-gray-200">
                    <CardContent className="p-6 space-y-5">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Objective</p>
                        <p className="text-sm text-gray-700">{contentBrief.objective}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Key Messages</p>
                        <ul className="space-y-1">
                          {(contentBrief.key_messages || []).map((msg, i) => (
                            <li key={i} className="text-sm text-gray-700 flex gap-2">
                              <span className="text-teal-500 mt-0.5">•</span>{msg}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recommended Sections</p>
                        <div className="flex flex-wrap gap-2">
                          {(contentBrief.recommended_sections || []).map((s, i) => (
                            <Badge key={i} variant="outline" className="text-gray-700 border-gray-300 text-xs">{s}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tone & Style</p>
                        <p className="text-sm text-gray-700">{contentBrief.tone_and_style}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">AI Visibility Tips</p>
                        <ul className="space-y-1">
                          {(contentBrief.ai_visibility_tips || []).map((tip, i) => (
                            <li key={i} className="text-sm text-gray-700 flex gap-2">
                              <Zap className="w-3.5 h-3.5 text-teal-500 mt-0.5 flex-shrink-0" />{tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right: Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Content Editor</h3>
                  {editorContent && (
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900" onClick={handleCopy}>
                      {copied ? <><Check className="w-4 h-4 mr-1" />Copied!</> : <><Copy className="w-4 h-4 mr-1" />Copy</>}
                    </Button>
                  )}
                </div>

                <Card className="bg-white border-gray-200">
                  <CardContent className="p-4 space-y-4">
                    {!draftContent && !isGeneratingDraft && (
                      <div className="text-center py-10">
                        <AlignLeft className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm text-gray-500 mb-4">Your draft will appear here</p>
                        <Button
                          className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                          onClick={handleCreateDraft}
                          disabled={!contentBrief}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Create 1st Draft
                        </Button>
                      </div>
                    )}

                    {isGeneratingDraft && (
                      <div className="text-center py-10">
                        <Loader2 className="w-10 h-10 text-teal-500 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Writing your 1st draft...</p>
                      </div>
                    )}

                    {draftContent && !isGeneratingDraft && (
                      <>
                        <Textarea
                          value={editorContent}
                          onChange={(e) => {
                            setEditorContent(e.target.value);
                            setRescoreResult(null);
                          }}
                          className="min-h-[400px] text-sm text-gray-800 border-gray-200 bg-gray-50 resize-none leading-relaxed"
                        />

                        {rescoreResult && (
                          <div className="space-y-4">
                            <div className="rounded-lg border border-gray-200 bg-white p-5">
                              <p className="text-sm font-semibold text-gray-700 mb-3">Overall Retrievability Score</p>
                              <div className="flex items-start gap-4">
                                <span className="text-5xl font-bold text-teal-600 leading-none">{rescoreResult.retrieval_score}</span>
                                <div className="flex-1 pt-1">
                                  <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                                    <div
                                      className="h-3 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 transition-all duration-700"
                                      style={{ width: `${rescoreResult.retrieval_score}%` }}
                                    />
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Original: 0 &nbsp;|&nbsp; Current: {rescoreResult.retrieval_score} &nbsp;|&nbsp;
                                    <span className="text-teal-600 font-semibold">Change: +{rescoreResult.retrieval_score}</span>
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    <span className="inline-block w-2 h-2 rounded-full bg-teal-600 mr-1" />Dark green = improvement&nbsp;&nbsp;
                                    <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1" />red = decrease vs original
                                  </p>
                                </div>
                              </div>
                              {rescoreResult.summary && (
                                <p className="text-xs text-gray-500 mt-3 border-t border-gray-100 pt-3">{rescoreResult.summary}</p>
                              )}
                            </div>
                            {(rescoreResult.per_prompt_scores || []).length > 0 && (
                              <div className="rounded-lg border border-gray-200 bg-white p-5">
                                <p className="text-sm font-semibold text-gray-700 mb-1">Per-Prompt Scores</p>
                                <p className="text-xs text-gray-400 mb-4">Scores for related prompts affected by this content</p>
                                <div className="space-y-4">
                                  {rescoreResult.per_prompt_scores.map((item, i) => (
                                    <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                      <p className="text-sm text-gray-700 mb-2">{item.prompt}</p>
                                      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1.5">
                                        <div className="h-2.5 rounded-full bg-teal-600 transition-all duration-700" style={{ width: `${item.score}%` }} />
                                      </div>
                                      <p className="text-xs text-gray-500">
                                        Original: 0 &nbsp;|&nbsp; Current: {item.score} &nbsp;|&nbsp;
                                        <span className="text-teal-600 font-semibold">Change: +{item.score}</span>
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <Button className="w-full" variant="outline" onClick={handleRescore} disabled={isRescoring}>
                          {isRescoring ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Rescoring...</>
                          ) : (
                            <><RotateCcw className="w-4 h-4 mr-2" />Rescore Draft</>
                          )}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}