import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { 
  ArrowRight,
  ArrowLeft, 
  Loader2,
  Building2,
  Users,
  Target,
  Tag,
  MessageSquare,
  Plus,
  X,
  CheckCircle,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Approvals() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const companyId = urlParams.get("companyId");

  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [brandMentions, setBrandMentions] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [icpInsights, setIcpInsights] = useState({ buyer_persona: "", intent_signals: [], challenges: [] });
  const [targetKeywords, setTargetKeywords] = useState([]);
  const [buyerPrompts, setBuyerPrompts] = useState([]);
  
  const [newItem, setNewItem] = useState({ brandMention: "", competitor: "", keyword: "", prompt: "" });

  useEffect(() => {
    loadCompanyAndGenerate();
  }, [companyId]);

  const loadCompanyAndGenerate = async () => {
    if (!companyId) return;
    
    try {
      const companies = await base44.entities.Company.filter({ id: companyId });
      if (companies.length > 0) {
        setCompany(companies[0]);
        await generateAISuggestions(companies[0]);
      }
    } catch (error) {
      console.error("Error loading company:", error);
    }
  };

  const generateAISuggestions = async (companyData) => {
    setIsGenerating(true);
    
    try {
      const countryContext = companyData.location ? `\nCountry: ${companyData.location}` : "";
      const prompt = `Based on the following company information, generate comprehensive AI search optimization suggestions:

      Company: ${companyData.name}
      Website: ${companyData.website_url}
      Industry: ${companyData.company_type}
      ICP Description: ${companyData.icp_description}${countryContext}

      IMPORTANT: Consider the country/location context when generating:
      - Use local competitors and brands relevant to ${companyData.location || "the region"}
      - Include region-specific search patterns and buyer behaviors
      - Adapt keywords and prompts to local market terminology and preferences

      Generate the following in JSON format:
      1. brand_mentions: Array of 5-8 different ways this brand might be mentioned or searched for (variations of name, common misspellings, product names, etc.)
      2. competitors: Array of 5-8 likely business competitors in the same space
      3. icp_insights: Object with:
      - buyer_persona: Detailed description of the ideal buyer
      - intent_signals: Array of 5-7 buying intent signals
      - challenges: Array of 5-7 key challenges the customer solves
      4. target_keywords: Array of 15-20 high-intent keywords relevant to the business
      5. prospect_prompts_branded: Array of EXACTLY 10 buyer-centric prompts that explicitly mention the brand name ${companyData.name}
      6. prospect_prompts_unbranded: Array of EXACTLY 10 buyer-centric prompts that DO NOT mention any brand names (generic category questions)
      7. customer_service_prompts: Array of EXACTLY 20 customer service/support questions existing customers would ask AI about using the product
      8. agent_prompts_branded: Array of EXACTLY 10 prompts an AI agent researching this company would use (mentioning ${companyData.name})
      9. agent_prompts_unbranded: Array of EXACTLY 10 prompts an AI agent would use for category research (no brand names)

      CRITICAL - BUYER-INTENT PSYCHOGRAPHIC ANALYSIS FOR PROSPECT PROMPTS:
      You are a buyer-intent psychographic analyst. Think like a real decision-maker, not a marketer.

      First, build a Psychographic Buyer Model:
      - Identify the buyer's core job-to-be-done, career risks, emotional anxieties
      - Internal pressures (board, leadership, budget, time)
      - Fear of choosing the wrong solution
      - Assume they are already aware of the category, but unsure who or what to trust

      Surface Real-Life Pain Scenarios where:
      - Something is not working
      - A previous approach failed
      - Results are unclear or declining
      - They are being asked to justify decisions internally

      Generate prompts that are:
      - Written in natural, human language (as questions or first-person statements)
      - Sound like something typed late at night, before a meeting, or under pressure
      - Reflect diagnosis, comparison, risk, and validation, not feature shopping
      - NO marketing buzzwords, NO SEO phrasing, NO vendor names unless realistic
      - Map to distinct pain, doubt, or decision moments
      - Think "What would I ask if my job depended on getting this right?"

      QUALITY BAR: If a prompt sounds like a blog post title or vendor landing page headline, it is WRONG.
      It must sound like a real person thinking out loud.

      For prospect_prompts_branded and prospect_prompts_unbranded:
      - prompt: The buyer-style AI prompt (natural, human, under pressure)
      - underlying_pain: The core pain or fear behind this question
      - decision_stage: One of: "Awareness", "Diagnosis", "Comparison", "Validation", "Pre-Purchase"
      - keywords: Array of keywords from target_keywords that appear in this prompt
      - estimated_search_volume: Your estimate (low/medium/high) based on how common this pain point is

      For customer_service_prompts (existing customers asking about product usage):
      - prompt: Natural question about how to do something, troubleshoot, or understand a feature
      - category: One of: "How-To", "Troubleshooting", "Feature Understanding", "Best Practices", "Integration"
      - keywords: Array of relevant keywords

      For agent_prompts (branded and unbranded - AI agents gathering information):
      - prompt: Analytical question an AI agent would ask to gather data or compare solutions
      - research_intent: What the agent is trying to learn or compare
      - keywords: Array of relevant keywords`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            brand_mentions: { type: "array", items: { type: "string" } },
            competitors: { type: "array", items: { type: "string" } },
            icp_insights: {
              type: "object",
              properties: {
                buyer_persona: { type: "string" },
                intent_signals: { type: "array", items: { type: "string" } },
                challenges: { type: "array", items: { type: "string" } }
              }
            },
            target_keywords: { type: "array", items: { type: "string" } },
            prospect_prompts_branded: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  prompt: { type: "string" },
                  underlying_pain: { type: "string" },
                  decision_stage: { type: "string" },
                  keywords: { type: "array", items: { type: "string" } },
                  estimated_search_volume: { type: "string" }
                }
              }
            },
            prospect_prompts_unbranded: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  prompt: { type: "string" },
                  underlying_pain: { type: "string" },
                  decision_stage: { type: "string" },
                  keywords: { type: "array", items: { type: "string" } },
                  estimated_search_volume: { type: "string" }
                }
              }
            },
            customer_service_prompts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  prompt: { type: "string" },
                  category: { type: "string" },
                  keywords: { type: "array", items: { type: "string" } }
                }
              }
            },
            agent_prompts_branded: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  prompt: { type: "string" },
                  research_intent: { type: "string" },
                  keywords: { type: "array", items: { type: "string" } }
                }
              }
            },
            agent_prompts_unbranded: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  prompt: { type: "string" },
                  research_intent: { type: "string" },
                  keywords: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      });

      setBrandMentions(response.brand_mentions || []);
      setCompetitors(response.competitors || []);
      setIcpInsights(response.icp_insights || { buyer_persona: "", intent_signals: [], challenges: [] });
      setTargetKeywords(response.target_keywords || []);
      
      // Combine all prompts with their view type
      const allPrompts = [
        ...(response.prospect_prompts_branded || []).map(p => ({ ...p, view_type: 'prospect', is_branded: true })),
        ...(response.prospect_prompts_unbranded || []).map(p => ({ ...p, view_type: 'prospect', is_branded: false })),
        ...(response.customer_service_prompts || []).map(p => ({ ...p, view_type: 'customer' })),
        ...(response.agent_prompts_branded || []).map(p => ({ ...p, view_type: 'agent', is_branded: true })),
        ...(response.agent_prompts_unbranded || []).map(p => ({ ...p, view_type: 'agent', is_branded: false }))
      ];
      setBuyerPrompts(allPrompts);
    } catch (error) {
      console.error("Error generating suggestions:", error);
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  const addItem = (type) => {
    switch(type) {
      case "brandMention":
        if (newItem.brandMention) {
          setBrandMentions([...brandMentions, newItem.brandMention]);
          setNewItem({ ...newItem, brandMention: "" });
        }
        break;
      case "competitor":
        if (newItem.competitor) {
          setCompetitors([...competitors, newItem.competitor]);
          setNewItem({ ...newItem, competitor: "" });
        }
        break;
      case "keyword":
        if (newItem.keyword) {
          setTargetKeywords([...targetKeywords, newItem.keyword]);
          setNewItem({ ...newItem, keyword: "" });
        }
        break;
      case "prompt":
        if (newItem.prompt) {
          setBuyerPrompts([...buyerPrompts, { prompt: newItem.prompt, keywords: [] }]);
          setNewItem({ ...newItem, prompt: "" });
        }
        break;
    }
  };

  const removeItem = (type, index) => {
    switch(type) {
      case "brandMention":
        setBrandMentions(brandMentions.filter((_, i) => i !== index));
        break;
      case "competitor":
        setCompetitors(competitors.filter((_, i) => i !== index));
        break;
      case "keyword":
        setTargetKeywords(targetKeywords.filter((_, i) => i !== index));
        break;
      case "prompt":
        setBuyerPrompts(buyerPrompts.filter((_, i) => i !== index));
        break;
      case "intent":
        setIcpInsights({ ...icpInsights, intent_signals: icpInsights.intent_signals.filter((_, i) => i !== index) });
        break;
      case "challenge":
        setIcpInsights({ ...icpInsights, challenges: icpInsights.challenges.filter((_, i) => i !== index) });
        break;
    }
  };

  const handleApprove = async () => {
    setIsSaving(true);
    
    try {
      await base44.entities.Company.update(companyId, {
        brand_mentions: brandMentions,
        competitors: competitors,
        icp_insights: icpInsights,
        target_keywords: targetKeywords,
        buyer_prompts: buyerPrompts,
        setup_complete: true
      });
      
      // Create prompt analyses
      for (const bp of buyerPrompts) {
        // Categorize by decision stage for prospect prompts
        let funnel_stage = "middle";
        if (bp.view_type === 'prospect') {
          if (bp.decision_stage === "Awareness" || bp.decision_stage === "Diagnosis") {
            funnel_stage = "top";
          } else if (bp.decision_stage === "Validation" || bp.decision_stage === "Pre-Purchase") {
            funnel_stage = "bottom";
          }
        } else if (bp.view_type === 'customer') {
          // Customer service prompts are mostly middle/bottom funnel
          funnel_stage = bp.category === "How-To" ? "middle" : "bottom";
        } else if (bp.view_type === 'agent') {
          // Agent prompts are research-focused
          funnel_stage = "top";
        }

        await base44.entities.PromptAnalysis.create({
          company_id: companyId,
          prompt: bp.prompt,
          view_type: bp.view_type,
          funnel_stage: funnel_stage,
          keywords: bp.keywords,
          search_signal_score: Math.floor(Math.random() * 100),
          elelem_score: Math.floor(Math.random() * 100),
          is_optimized: false
        });
      }
      
      navigate(createPageUrl("VisibilityHQ"));
    } catch (error) {
      console.error("Error saving approvals:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const steps = [
    { num: 1, label: "Setup", active: false },
    { num: 2, label: "Approvals", active: true },
    { num: 3, label: "Dashboard", active: false }
  ];

  if (isLoading && !company) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center mb-6">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6943f2bf67610e14801b112b/de87d19e0_elelem2025logoPrimary.png"
              alt="elelem"
              className="h-8 brightness-0 invert"
            />
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4">
            {steps.map((step, i) => (
              <React.Fragment key={step.num}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.active 
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white" 
                      : step.num < 2 
                        ? "bg-teal-500/20 text-teal-400 border border-teal-500/50"
                        : "bg-slate-800 text-slate-500"
                  }`}>
                    {step.num < 2 ? <CheckCircle className="w-4 h-4" /> : step.num}
                  </div>
                  <span className={step.active ? "text-white" : "text-slate-500"}>{step.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-px bg-slate-800" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="text-teal-400 text-sm font-medium">AI-Generated Suggestions</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Review & Approve AI Interpretations</h1>
            <p className="text-slate-400">We've analyzed your business and generated these suggestions. Review, edit, and approve to proceed.</p>
          </div>

          {isGenerating ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map(i => (
                <Card key={i} className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <Skeleton className="h-6 w-48 bg-slate-700" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map(j => (
                        <Skeleton key={j} className="h-8 w-24 bg-slate-700 rounded-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Brand Mentions */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-teal-400" />
                    Brand Mentions
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Ways your brand might be mentioned or searched for
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {brandMentions.map((item, i) => (
                      <Badge key={i} variant="secondary" className="bg-slate-700 text-slate-200 py-1.5 px-3 text-sm">
                        {item}
                        <button onClick={() => removeItem("brandMention", i)} className="ml-2 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add brand mention..."
                      value={newItem.brandMention}
                      onChange={(e) => setNewItem({ ...newItem, brandMention: e.target.value })}
                      className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                      onKeyPress={(e) => e.key === "Enter" && addItem("brandMention")}
                    />
                    <Button onClick={() => addItem("brandMention")} variant="outline" className="border-slate-700">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Competitors */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-teal-400" />
                    Business Competitors
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Companies competing in your space
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {competitors.map((item, i) => (
                      <Badge key={i} variant="secondary" className="bg-slate-700 text-slate-200 py-1.5 px-3 text-sm">
                        {item}
                        <button onClick={() => removeItem("competitor", i)} className="ml-2 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add competitor..."
                      value={newItem.competitor}
                      onChange={(e) => setNewItem({ ...newItem, competitor: e.target.value })}
                      className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                      onKeyPress={(e) => e.key === "Enter" && addItem("competitor")}
                    />
                    <Button onClick={() => addItem("competitor")} variant="outline" className="border-slate-700">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* ICP Insights */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-teal-400" />
                    ICP & Buyer Intent Insights
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Understanding of your ideal customer and their challenges
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-slate-300 mb-2 block">Buyer Persona</Label>
                    <Textarea
                      value={icpInsights.buyer_persona}
                      onChange={(e) => setIcpInsights({ ...icpInsights, buyer_persona: e.target.value })}
                      className="bg-slate-900 border-slate-700 text-white min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-slate-300 mb-2 block">Intent Signals</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {icpInsights.intent_signals?.map((item, i) => (
                        <Badge key={i} variant="secondary" className="bg-cyan-900/50 text-cyan-200 py-1.5 px-3 text-sm">
                          {item}
                          <button onClick={() => removeItem("intent", i)} className="ml-2 hover:text-red-400">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-slate-300 mb-2 block">Challenges You Solve</Label>
                    <div className="flex flex-wrap gap-2">
                      {icpInsights.challenges?.map((item, i) => (
                        <Badge key={i} variant="secondary" className="bg-emerald-900/50 text-emerald-200 py-1.5 px-3 text-sm">
                          {item}
                          <button onClick={() => removeItem("challenge", i)} className="ml-2 hover:text-red-400">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Target Keywords */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Tag className="w-5 h-5 text-teal-400" />
                    Target Keywords
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Keywords extracted from your website for optimization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {targetKeywords.map((item, i) => (
                      <Badge key={i} variant="secondary" className="bg-lime-900/50 text-lime-200 py-1.5 px-3 text-sm">
                        {item}
                        <button onClick={() => removeItem("keyword", i)} className="ml-2 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add keyword..."
                      value={newItem.keyword}
                      onChange={(e) => setNewItem({ ...newItem, keyword: e.target.value })}
                      className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                      onKeyPress={(e) => e.key === "Enter" && addItem("keyword")}
                    />
                    <Button onClick={() => addItem("keyword")} variant="outline" className="border-slate-700">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Buyer Prompts */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-teal-400" />
                    Buyer-Centric Prompts
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {buyerPrompts.filter(p => p.view_type === 'prospect').length} prospect prompts, {buyerPrompts.filter(p => p.view_type === 'customer').length} customer service prompts, {buyerPrompts.filter(p => p.view_type === 'agent').length} agent prompts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    {buyerPrompts.map((item, i) => (
                            <div key={i} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge 
                                      variant="outline"
                                      className={`text-xs ${
                                        item.view_type === 'prospect' ? 'text-blue-400 border-blue-500/30' :
                                        item.view_type === 'customer' ? 'text-green-400 border-green-500/30' :
                                        'text-purple-400 border-purple-500/30'
                                      }`}
                                    >
                                      {item.view_type}
                                    </Badge>
                                    {item.is_branded !== undefined && (
                                      <Badge 
                                        variant="outline"
                                        className={`text-xs ${
                                          item.is_branded ? 'text-teal-400 border-teal-500/30' : 'text-slate-400 border-slate-500/30'
                                        }`}
                                      >
                                        {item.is_branded ? 'Branded' : 'Unbranded'}
                                      </Badge>
                                    )}
                                    <p className="text-white flex-1">{item.prompt}</p>
                                    {item.estimated_search_volume && (
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs ${
                                          item.estimated_search_volume === 'high' ? 'text-green-400 border-green-500/30' :
                                          item.estimated_search_volume === 'medium' ? 'text-yellow-400 border-yellow-500/30' :
                                          'text-slate-400 border-slate-500/30'
                                        }`}
                                      >
                                        {item.estimated_search_volume} volume
                                      </Badge>
                                    )}
                                  </div>
                                  {item.underlying_pain && (
                                    <p className="text-slate-400 text-sm mb-2 italic">"{item.underlying_pain}"</p>
                                  )}
                                  <div className="flex flex-wrap gap-1">
                                    {item.decision_stage && (
                                      <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-500/30">
                                        {item.decision_stage}
                                      </Badge>
                                    )}
                                    {item.keywords?.map((kw, j) => (
                                      <Badge key={j} variant="outline" className="text-xs text-teal-400 border-teal-500/30">
                                        {kw}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <button onClick={() => removeItem("prompt", i)} className="text-slate-500 hover:text-red-400">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add buyer prompt..."
                      value={newItem.prompt}
                      onChange={(e) => setNewItem({ ...newItem, prompt: e.target.value })}
                      className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                      onKeyPress={(e) => e.key === "Enter" && addItem("prompt")}
                    />
                    <Button onClick={() => addItem("prompt")} variant="outline" className="border-slate-700">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Approve Button */}
              <div className="flex justify-between items-center pt-6">
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="border-slate-700 text-slate-300"
                    onClick={() => navigate(createPageUrl(`Setup`))}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Setup
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-slate-700 text-slate-300"
                    onClick={() => generateAISuggestions(company)}
                    disabled={isGenerating}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                    Regenerate
                  </Button>
                </div>
                <Button 
                  onClick={handleApprove}
                  disabled={isSaving}
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Approve & Continue
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}