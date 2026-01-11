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
  
  const [formData, setFormData] = useState({
    contact_name: "",
    name: "",
    website_url: "",
    email: "",
    product_name: "",
    top_competitors: "",
    icp_description: "",
    region: "",
    keywords_file: null,
    sales_logs_file: null,
    chatbot_file: null
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    setIsGenerating(true);
    
    try {
      // Create company first
      const company = await base44.entities.Company.create({
        name: formData.name,
        contact_name: formData.contact_name,
        email: formData.email,
        website_url: formData.website_url,
        product_name: formData.product_name,
        top_competitors: formData.top_competitors.split(',').map(c => c.trim()),
        primary_market: formData.region,
        setup_complete: false
      });

      // Extract keywords from CSV if provided
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

      // Generate prompts using LLM
      const promptsResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert at understanding customer intent and how they search for solutions using AI Answer Engines.

Given the following information about a company and their product, generate 10 compelling questions that their Ideal Customer Profile (ICP) would likely ask an AI Answer Engine when researching solutions.

COMPANY INFORMATION:
- Company: ${formData.name}
- Product: ${formData.product_name}
- Website: ${formData.website_url}
- Main Competitors: ${formData.top_competitors}
- ICP Description: ${formData.icp_description}
- Region: ${formData.region}
${extractedKeywords.length > 0 ? `- SEO Keywords: ${extractedKeywords.join(', ')}` : ''}

INSTRUCTIONS:
1. Create 10 questions that the ICP would naturally ask an AI Answer Engine (like ChatGPT, Perplexity, Gemini)
2. Questions should be specific, practical, and reflect real buyer intent
3. Categorize each question by funnel stage:
   - "top": Awareness/Problem Recognition (e.g., "What are the best tools for X?")
   - "middle": Consideration/Evaluation (e.g., "How does Product A compare to Product B?")
   - "bottom": Decision/Purchase Intent (e.g., "Is Product X right for companies like mine?")
4. Questions should sound natural and conversational, as someone would ask an AI
5. Ensure questions align with the ICP's role, industry, and needs

Return the prompts in JSON format with the following structure:
{
  "prompts": [
    {
      "prompt": "The actual question",
      "funnel_stage": "top/middle/bottom",
      "keywords": ["relevant", "keywords"],
      "reasoning": "Brief explanation of why this question matters to the ICP"
    }
  ]
}`,
        add_context_from_internet: true,
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
                  keywords: { type: "array", items: { type: "string" } },
                  reasoning: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Store prompts for approval
      const generatedPrompts = promptsResponse.prompts || [];
      
      // Update company with generated prompts
      await base44.entities.Company.update(company.id, {
        buyer_prompts: generatedPrompts
      });

      // Navigate to approval page
      navigate(createPageUrl(`Approvals?companyId=${company.id}`));
    } catch (error) {
      console.error("Error generating prompts:", error);
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
            <h1 className="text-3xl font-bold text-white mb-3">Let's Generate Your Customer Questions</h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Tell us about your product and ideal customers. We'll generate the most compelling questions they ask AI Answer Engines.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Company & Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Name (First and Last) *</Label>
                    <Input
                      value={formData.contact_name}
                      onChange={(e) => handleChange("contact_name", e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white"
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-300">Company Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white"
                      placeholder="Acme Corp"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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
                  
                  <div className="space-y-2">
                    <Label className="text-slate-300">Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white"
                      placeholder="john@acme.com"
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
                      className="bg-slate-900 border-slate-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-teal-500 file:text-white file:cursor-pointer hover:file:bg-teal-600"
                    />
                    {formData.keywords_file && (
                      <FileUp className="w-5 h-5 text-teal-400" />
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
                      className="bg-slate-900 border-slate-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-teal-500 file:text-white file:cursor-pointer hover:file:bg-teal-600"
                    />
                    {formData.sales_logs_file && (
                      <FileUp className="w-5 h-5 text-teal-400" />
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
                      className="bg-slate-900 border-slate-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-teal-500 file:text-white file:cursor-pointer hover:file:bg-teal-600"
                    />
                    {formData.chatbot_file && (
                      <FileUp className="w-5 h-5 text-teal-400" />
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