import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, ExternalLink, Tag, TrendingUp } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function PromptResearch() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('elelem-theme') || 'dark';
  });

  const isDark = theme === 'dark';

  const analyzePrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this marketing prompt and provide a detailed response. Also extract:
1. All URLs/links mentioned or referenced
2. All brand names mentioned
3. Key topics and themes
4. Marketing insights (target audience, intent, positioning opportunities)
5. Competitive landscape insights

Prompt: ${prompt}

Provide a comprehensive answer that would help a marketer understand the landscape.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            answer: { type: "string" },
            links: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  url: { type: "string" },
                  title: { type: "string" },
                  relevance: { type: "string" }
                }
              }
            },
            brands_mentioned: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  brand: { type: "string" },
                  context: { type: "string" },
                  sentiment: { type: "string" }
                }
              }
            },
            key_topics: {
              type: "array",
              items: { type: "string" }
            },
            marketing_insights: {
              type: "object",
              properties: {
                target_audience: { type: "string" },
                buyer_intent: { type: "string" },
                positioning_opportunities: {
                  type: "array",
                  items: { type: "string" }
                },
                content_gaps: {
                  type: "array",
                  items: { type: "string" }
                }
              }
            },
            competitive_insights: {
              type: "object",
              properties: {
                market_leaders: {
                  type: "array",
                  items: { type: "string" }
                },
                differentiation_opportunities: {
                  type: "array",
                  items: { type: "string" }
                }
              }
            }
          }
        }
      });

      setResult(response);
    } catch (error) {
      console.error("Error analyzing prompt:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Prompt Research
          </h1>
          <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            Research how AI responds to prompts and discover marketing insights
          </p>
        </div>

        {/* Input Section */}
        <Card className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}>
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
              Enter Your Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., What are the best project management tools for remote teams?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className={`min-h-[120px] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
            />
            <Button
              onClick={analyzePrompt}
              disabled={loading || !prompt.trim()}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Prompt
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="grid gap-6">
            {/* Answer */}
            <Card className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}>
              <CardHeader>
                <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                  AI Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''}`}>
                  <ReactMarkdown>{result.answer}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {/* Links Found */}
            {result.links && result.links.length > 0 && (
              <Card className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <ExternalLink className="w-5 h-5" />
                    Links Found ({result.links.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.links.map((link, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2"
                        >
                          {link.title || link.url}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        {link.relevance && (
                          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                            {link.relevance}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Brands Mentioned */}
            {result.brands_mentioned && result.brands_mentioned.length > 0 && (
              <Card className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <Tag className="w-5 h-5" />
                    Brands Mentioned ({result.brands_mentioned.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {result.brands_mentioned.map((item, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {item.brand}
                          </h3>
                          {item.sentiment && (
                            <Badge
                              className={
                                item.sentiment.toLowerCase().includes('positive')
                                  ? 'bg-green-100 text-green-800'
                                  : item.sentiment.toLowerCase().includes('negative')
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {item.sentiment}
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                          {item.context}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Topics */}
            {result.key_topics && result.key_topics.length > 0 && (
              <Card className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}>
                <CardHeader>
                  <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                    Key Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.key_topics.map((topic, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={isDark ? 'border-slate-700 text-slate-300' : ''}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Marketing Insights */}
            {result.marketing_insights && (
              <Card className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <TrendingUp className="w-5 h-5" />
                    Marketing Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.marketing_insights.target_audience && (
                    <div>
                      <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Target Audience
                      </h4>
                      <p className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                        {result.marketing_insights.target_audience}
                      </p>
                    </div>
                  )}

                  {result.marketing_insights.buyer_intent && (
                    <div>
                      <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Buyer Intent
                      </h4>
                      <p className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                        {result.marketing_insights.buyer_intent}
                      </p>
                    </div>
                  )}

                  {result.marketing_insights.positioning_opportunities &&
                    result.marketing_insights.positioning_opportunities.length > 0 && (
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Positioning Opportunities
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {result.marketing_insights.positioning_opportunities.map((opp, index) => (
                            <li key={index} className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                              {opp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {result.marketing_insights.content_gaps &&
                    result.marketing_insights.content_gaps.length > 0 && (
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Content Gaps
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {result.marketing_insights.content_gaps.map((gap, index) => (
                            <li key={index} className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                              {gap}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}

            {/* Competitive Insights */}
            {result.competitive_insights && (
              <Card className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}>
                <CardHeader>
                  <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                    Competitive Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.competitive_insights.market_leaders &&
                    result.competitive_insights.market_leaders.length > 0 && (
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Market Leaders
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.competitive_insights.market_leaders.map((leader, index) => (
                            <Badge
                              key={index}
                              className="bg-purple-100 text-purple-800"
                            >
                              {leader}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {result.competitive_insights.differentiation_opportunities &&
                    result.competitive_insights.differentiation_opportunities.length > 0 && (
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Differentiation Opportunities
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {result.competitive_insights.differentiation_opportunities.map((opp, index) => (
                            <li key={index} className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                              {opp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}