import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { 
  ArrowRight, 
  Loader2,
  Upload,
  FileUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Setup() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    website_url: "",
    product_name: "",
    top_competitors: "",
    icp_description: "",
    region: "",
    keywords_file: null,
    sales_logs_file: null,
    chatbot_file: null
  });

  const handleChange = async (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-fill when URL is entered
    if (field === 'website_url' && value && value.startsWith('http')) {
      const name = formData.name || value.replace(/^https?:\/\/(www\.)?/, '').split('/')[0].split('.')[0];
      await autoFillForm(name, value);
    }
  };

  const autoFillForm = async (companyName, websiteUrl) => {
    if (isAutoFilling) return;
    setIsAutoFilling(true);
    
    try {
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `CRITICAL: Comprehensively crawl and analyze this website to extract detailed information.

Company: ${companyName}
Website: ${websiteUrl}

CRAWLING INSTRUCTIONS:
1. Start from the homepage: ${websiteUrl}
2. Follow internal links and crawl UP TO 100 pages across the site
3. Visit key pages like: /about, /products, /services, /pricing, /blog, /resources, /customers, etc.
4. Extract comprehensive information from ALL crawled pages

Based on the content from all crawled pages, extract:

1. product_name: The main product/service name (e.g., "Salesforce CRM", "Gmail", "PlayStation")
2. top_competitors: List 3-5 main commercial competitors (comma-separated, based on industry context and content)
3. icp_description: Describe their ideal customer profile based on case studies, testimonials, and content (e.g., "Content Marketers at Enterprise Insurance companies")
4. region: Primary geographic market(s) mentioned across the site (e.g., "United States", "Europe", "Global")

Be specific and accurate based on actual content found across all crawled pages.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            product_name: { type: "string" },
            top_competitors: { type: "string" },
            icp_description: { type: "string" },
            region: { type: "string" }
          }
        }
      });

      setFormData(prev => ({
        ...prev,
        product_name: analysis.product_name || prev.product_name,
        top_competitors: analysis.top_competitors || prev.top_competitors,
        icp_description: analysis.icp_description || prev.icp_description,
        region: analysis.region || prev.region
      }));
    } catch (error) {
      console.error("Error auto-filling form:", error);
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, [field]: file_url }));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted, starting generation...");
    setIsGenerating(true);
    
    try {
      console.log("Step 1: Crawling website...");
      // Step 1: Crawl website comprehensively
      const crawlResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `CRITICAL: Comprehensively crawl and index this entire website: ${formData.website_url}

CRAWLING REQUIREMENTS:
1. Start from homepage: ${formData.website_url}
2. Follow internal links and visit UP TO 100 PAGES across the site
3. Include key pages: /about, /products, /services, /blog, /pricing, /customers, /resources, etc.
4. Extract ALL relevant content from each page visited

For each page, extract:
- Page content (text, descriptions, features, benefits)
- Customer pain points mentioned
- Use cases and examples
- Product/service details

Return a comprehensive summary of the website content that will be used to generate highly relevant customer prompts.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            website_summary: { type: "string" },
            pages_crawled: { type: "number" },
            key_topics: { type: "array", items: { type: "string" } }
          }
        }
      });

      console.log("Crawl complete:", crawlResponse);
      
      // Step 2: Extract keywords from CSV if provided
      console.log("Step 2: Extracting keywords...");
      let extractedKeywords = [];
      if (formData.keywords_file) {
        const keywordData = await base44.integrations.Core.ExtractDataFromUploadedFile({
          file_url: formData.keywords_file,
          json_schema: {
            type: "object",
            properties: {
              keywords: {
                type: "array",
                items: { type: "string" }
              }
            }
          }
        });
        if (keywordData.status === "success") {
          extractedKeywords = keywordData.output.keywords || [];
        }
      }

      // Step 3: Generate prompts using comprehensive website data
      console.log("Step 3: Generating prompts...");
      const promptsResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert at understanding customer intent and how they search for solutions using AI Answer Engines.

COMPREHENSIVE WEBSITE ANALYSIS:
${crawlResponse.website_summary}

COMPANY INFORMATION:
- Company: ${formData.name}
- Product: ${formData.product_name}
- Website: ${formData.website_url}
- Main Competitors: ${formData.top_competitors}
- ICP Description: ${formData.icp_description}
- Region: ${formData.region}
- Pages Crawled: ${crawlResponse.pages_crawled}
- Key Topics: ${crawlResponse.key_topics.join(', ')}
${extractedKeywords.length > 0 ? `- SEO Keywords: ${extractedKeywords.join(', ')}` : ''}

INSTRUCTIONS:
Generate 10 compelling questions that the ICP would naturally ask an AI Answer Engine when researching solutions.

1. Use the comprehensive website content to create highly relevant, specific questions
2. Questions should reflect real buyer intent and align with what the company actually offers
3. Categorize each question by funnel stage:
   - "top": Awareness/Problem Recognition (3-4 prompts)
   - "middle": Consideration/Evaluation (3-4 prompts)
   - "bottom": Decision/Purchase Intent (2-3 prompts)
4. Questions should sound natural and conversational
5. Ensure questions align with the ICP's role, industry, and specific needs

Return JSON format:
{
  "prompts": [
    {
      "prompt": "The actual question",
      "funnel_stage": "top/middle/bottom",
      "keywords": ["relevant", "keywords"],
      "reasoning": "Why this question matters to the ICP"
    }
  ]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            prompts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  prompt: { type: "string" },
                  funnel_stage: { type: "string" },
                  is_branded: { type: "boolean" },
                  keywords: { type: "array", items: { type: "string" } },
                  reasoning: { type: "string" }
                }
              }
            }
          }
        }
      });

      console.log("Prompts generated:", promptsResponse);
      
      // Step 4: Create company record
      console.log("Step 4: Creating company record...");
      const company = await base44.entities.Company.create({
        name: formData.name,
        website_url: formData.website_url,
        product_name: formData.product_name,
        top_competitors: formData.top_competitors.split(',').map(c => c.trim()),
        primary_market: formData.region,
        setup_complete: false,
        buyer_prompts: promptsResponse.prompts || []
      });

      console.log("Company created:", company);
      
      // Step 5: Create PromptAnalysis records for each generated prompt
      console.log("Step 5: Creating prompt analysis records...");
      const promptAnalysisRecords = (promptsResponse.prompts || []).map(p => ({
        company_id: company.id,
        prompt: p.prompt,
        view_type: p.is_branded ? "customer" : "prospect",
        funnel_stage: p.funnel_stage,
        keywords: p.keywords || [],
        search_signal_score: 0,
        elelem_score: 0,
        citations_count: 0,
        brand_mentions_count: 0,
        is_optimized: false
      }));
      
      await base44.entities.PromptAnalysis.bulkCreate(promptAnalysisRecords);
      console.log("Prompt analysis records created");
      
      // Step 6: Navigate to prompts page for review
      console.log("Step 6: Navigating to prompts...");
      navigate(createPageUrl("Prompts"));
    } catch (error) {
      console.error("Error generating prompts:", error);
      alert(`Error: ${error.message || 'Failed to generate prompts. Please try again.'}`);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6943f2bf67610e14801b112b/de87d19e0_elelem2025logoPrimary.png"
              alt="elelem"
              className="h-8 brightness-0 invert"
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-3">Let's Generate Your Prompts & Dashboard</h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Tell us about your product and ideal customers. We'll generate the most compelling questions they ask AI Answer Engines.
            </p>
            {isAutoFilling && (
              <div className="mt-4 flex items-center justify-center gap-2 text-teal-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing your company and pre-filling the form...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Company & Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Company/Project Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white"
                      placeholder="Acme Corp"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-300">Website URL *</Label>
                    <Input
                      type="url"
                      value={formData.website_url}
                      onChange={(e) => handleChange("website_url", e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white"
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Key Product Name *</Label>
                  <Input
                    value={formData.product_name}
                    onChange={(e) => handleChange("product_name", e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                    placeholder="e.g., PlayStation, Gmail, Salesforce CRM"
                    required
                  />
                  <p className="text-slate-500 text-sm">Your main product or service name</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Main Commercial Competitors *</Label>
                  <Input
                    value={formData.top_competitors}
                    onChange={(e) => handleChange("top_competitors", e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                    placeholder="Competitor A, Competitor B, Competitor C"
                    required
                  />
                  <p className="text-slate-500 text-sm">Separate with commas</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">ICP Description *</Label>
                  <Textarea
                    value={formData.icp_description}
                    onChange={(e) => handleChange("icp_description", e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white min-h-[100px]"
                    placeholder="e.g., Content Marketers at Enterprise Insurance companies, or Tech-savvy millennials interested in gaming"
                    required
                  />
                  <p className="text-slate-500 text-sm">Describe your ideal customer profile</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Region *</Label>
                  <Input
                    value={formData.region}
                    onChange={(e) => handleChange("region", e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                    placeholder="e.g., Ireland, UK, EU, Germany, US, California, Japan"
                    required
                  />
                  <p className="text-slate-500 text-sm">Primary market or region</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Optional Data Upload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Search Engine Keywords (CSV)</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleFileUpload("keywords_file", e.target.files[0])}
                      className="bg-slate-900 border-slate-700 text-white h-auto py-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-teal-500 file:text-white file:font-medium file:cursor-pointer hover:file:bg-teal-600 file:transition-colors"
                    />
                    {formData.keywords_file && (
                      <FileUp className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-slate-500 text-sm">Upload your SEO keywords for better prompt generation</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Sales Call Logs</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept=".pdf,.txt,.csv"
                      onChange={(e) => handleFileUpload("sales_logs_file", e.target.files[0])}
                      className="bg-slate-900 border-slate-700 text-white h-auto py-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-teal-500 file:text-white file:font-medium file:cursor-pointer hover:file:bg-teal-600 file:transition-colors"
                    />
                    {formData.sales_logs_file && (
                      <FileUp className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-slate-500 text-sm">Help us understand real customer questions</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Chatbot Conversations</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept=".pdf,.txt,.csv"
                      onChange={(e) => handleFileUpload("chatbot_file", e.target.files[0])}
                      className="bg-slate-900 border-slate-700 text-white h-auto py-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-teal-500 file:text-white file:font-medium file:cursor-pointer hover:file:bg-teal-600 file:transition-colors"
                    />
                    {formData.chatbot_file && (
                      <FileUp className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-slate-500 text-sm">Upload chatbot logs to improve question accuracy</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                type="submit"
                size="lg"
                disabled={isGenerating}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Prompts...
                  </>
                ) : (
                  <>
                    Generate Prompts
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}