import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Loader2,
  FileText,
  ArrowRight,
  Copy,
  Check,
  Target,
  BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NewContent() {
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [copied, setCopied] = useState(false);
  const [funnelStage, setFunnelStage] = useState("top");

  const pillars = [
    { key: "freshness", label: "Freshness & Technical", weight: "10%", color: "bg-green-500" },
    { key: "semantic_clarity", label: "Semantic Clarity", weight: "15%", color: "bg-cyan-500" },
    { key: "structured_data", label: "Structured Data", weight: "15%", color: "bg-emerald-500" },
    { key: "formatting", label: "Structure & Formatting", weight: "25%", color: "bg-teal-500" },
    { key: "content_quality", label: "Content Quality & Trust", weight: "35%", color: "bg-lime-500" }
  ];

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an AI Search Optimization expert creating content optimized for AI search visibility.

Create a comprehensive article for this target prompt/query: "${prompt}"
${title ? `Article title: "${title}"` : ""}
Target Funnel Stage: ${funnelStage} of funnel (adjust depth and intent accordingly)

The content must be optimized based on elelem's 5 pillars of AI Search Visibility:

1. Freshness, Metadata & Technical Accessibility (10%)
- Include current year references
- Use clear, descriptive headers
- Ensure mobile-friendly structure

2. Semantic Clarity & Intent Alignment (15%)
- Match search intent precisely
- Use related semantic keywords
- Clear topic coverage

3. Structured Data & Semantic Markup (15%)
- Include FAQ section
- Use definition-style explanations
- Include list formats for key points

4. Structure & Formatting (25%)
- Clear H1, H2, H3 hierarchy
- Bullet points and numbered lists
- Short paragraphs (2-3 sentences)
- Bold key terms

5. Content Quality, Authority & Trust (35%)
- Include statistics and data
- Reference authoritative sources
- Expert insights and quotes
- Comprehensive coverage

Provide:
1. The optimized article content in markdown format
2. A baseline version (what typical content would look like)
3. Pillar scores for both versions
4. Key optimization elements highlighted

Format as JSON with:
- optimized_content: string (markdown)
- baseline_content: string (markdown)
- pillar_scores: object with each pillar having {before, after}
- total_score_before: number
- total_score_after: number
- key_optimizations: array of strings explaining what makes it optimized`,
        response_json_schema: {
          type: "object",
          properties: {
            optimized_content: { type: "string" },
            baseline_content: { type: "string" },
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
            key_optimizations: { type: "array", items: { type: "string" } }
          }
        }
      });

      setGeneratedContent(response);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent?.optimized_content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">New Content</h1>
              <p className="text-slate-400">Generate AI-optimized content from scratch</p>
            </div>
          </div>

          {/* Funnel Stage Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-slate-400 text-sm">Target Funnel Stage:</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <Card className="bg-slate-800/50 border-slate-700/50 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                Content Generator
              </CardTitle>
              <CardDescription className="text-slate-400">
                Enter a prompt you want to optimize for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Target Prompt/Query</Label>
                <Textarea
                  placeholder="e.g., What is the best HR software for remote teams?"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 min-h-[120px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Article Title (Optional)</Label>
                <Input
                  placeholder="e.g., Complete Guide to HR Software for Remote Teams"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <Button
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Optimized Content
                  </>
                )}
              </Button>

              {/* 5 Pillars Info */}
              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400 mb-3">Optimized based on 5 pillars:</p>
                <div className="space-y-2">
                  {pillars.map((pillar) => (
                    <div key={pillar.key} className="flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${pillar.color}`} />
                      <span className="text-slate-400 flex-1">{pillar.label}</span>
                      <span className="text-slate-500">{pillar.weight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="wait">
              {generatedContent ? (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Score Comparison */}
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-white">elelem Score Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="text-center p-6 bg-slate-900/50 rounded-xl">
                          <p className="text-slate-400 text-sm mb-2">Baseline Content</p>
                          <p className="text-4xl font-bold text-slate-400">{generatedContent.total_score_before}</p>
                        </div>
                        <div className="text-center p-6 bg-teal-500/10 rounded-xl border border-teal-500/30">
                          <p className="text-teal-400 text-sm mb-2">Optimized Content</p>
                          <p className="text-4xl font-bold text-teal-400">{generatedContent.total_score_after}</p>
                        </div>
                      </div>

                      {/* Pillar Scores */}
                      <div className="space-y-3">
                        {pillars.map((pillar) => {
                          const scores = generatedContent.pillar_scores?.[pillar.key];
                          return (
                            <div key={pillar.key} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-300">{pillar.label}</span>
                                <span className="text-slate-500">{scores?.before || 0} → <span className="text-teal-400">{scores?.after || 0}</span></span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={scores?.after || 0} 
                                  className="h-2 bg-slate-700 [&>div]:bg-teal-500"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Optimizations */}
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-white">Key Optimizations Applied</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.key_optimizations?.map((opt, i) => (
                          <Badge key={i} variant="outline" className="py-2 px-3 text-teal-400 border-teal-500/30">
                            {opt}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Content Comparison */}
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-white">Content Preview</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700"
                        onClick={copyToClipboard}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2 text-emerald-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Optimized
                          </>
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="optimized">
                        <TabsList className="bg-slate-900">
                          <TabsTrigger value="optimized" className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400">
                            Optimized
                          </TabsTrigger>
                          <TabsTrigger value="baseline" className="data-[state=active]:bg-slate-700">
                            Baseline
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="optimized">
                          <div className="mt-4 p-6 bg-slate-900/50 rounded-lg border border-teal-500/30 max-h-[500px] overflow-auto">
                            <div className="prose prose-invert prose-sm max-w-none">
                              <pre className="whitespace-pre-wrap text-slate-300 font-sans text-sm leading-relaxed">
                                {generatedContent.optimized_content}
                              </pre>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="baseline">
                          <div className="mt-4 p-6 bg-slate-900/50 rounded-lg border border-slate-700/50 max-h-[500px] overflow-auto">
                            <div className="prose prose-invert prose-sm max-w-none">
                              <pre className="whitespace-pre-wrap text-slate-400 font-sans text-sm leading-relaxed">
                                {generatedContent.baseline_content}
                              </pre>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-96"
                >
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">Enter a prompt and generate optimized content</p>
                    <p className="text-slate-600 text-sm mt-2">Content will be scored against elelem's 5 pillars</p>
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