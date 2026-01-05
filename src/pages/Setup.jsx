import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Package,
  Users,
  Target,
  MessageSquare,
  HelpCircle,
  Eye,
  Globe,
  Shield,
  ChevronDown,
  ChevronUp,
  Plus,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function Setup() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState([0]);
  
  const [isAutoPopulating, setIsAutoPopulating] = useState(false);
  const [formData, setFormData] = useState({
    // Contact info
    contact_name: "",
    email: "",
    job_title: "",
    name: "",
    website_url: "",
    
    // Section 1: Product Basics
    product_name: "",
    product_description: "",
    primary_category: "",
    secondary_categories: [],
    top_competitors: [],
    
    // Section 2: Who Asks
    primary_buyer_role: "",
    secondary_buyer_roles: [],
    typical_company_size: "",
    primary_industries: [],
    
    // Section 3: Why Customers Choose You
    top_use_cases: [],
    misunderstood_use_case: "",
    not_good_fit_for: "",
    
    // Section 4: Messaging Anchors
    positioning_statement: "",
    key_claims: [],
    preferred_terms: [],
    avoid_terms: [],
    
    // Section 5: Real Customer Questions
    question_sources: [],
    customer_confusion_points: "",
    
    // Section 6: Visibility Priorities
    visibility_priorities: [],
    biggest_concern: "",
    
    // Section 7: Markets and Language
    primary_market: "",
    secondary_markets: [],
    primary_languages: [],
    
    // Section 8: Guardrails
    excluded_audiences: [],
    irrelevant_competitors: [],
    legacy_terms: []
  });

  const [tempInputs, setTempInputs] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field) => {
    const value = tempInputs[field];
    if (value && value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()]
      }));
      setTempInputs(prev => ({ ...prev, [field]: "" }));
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const toggleCheckbox = (field, value) => {
    setFormData(prev => {
      const current = prev[field] || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const toggleSection = (index) => {
    setExpandedSections(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const autoPopulateFromUrl = async (url) => {
    if (!url || !url.startsWith('http')) return;
    
    setIsAutoPopulating(true);
    
    try {
      // Fetch website content and search results
      const websiteData = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this website: ${url}
        
        Extract and provide the following information in JSON format:
        - product_name: Main product/service name
        - product_description: One-sentence description
        - primary_category: Main category/industry
        - top_use_cases: Array of 3 main use cases (strings)
        - positioning_statement: Key value proposition
        - primary_market: Main geographic market
        - primary_languages: Array of languages (strings)`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            product_name: { type: "string" },
            product_description: { type: "string" },
            primary_category: { type: "string" },
            top_use_cases: { type: "array", items: { type: "string" } },
            positioning_statement: { type: "string" },
            primary_market: { type: "string" },
            primary_languages: { type: "array", items: { type: "string" } }
          }
        }
      });

      // Update form with extracted data
      setFormData(prev => ({
        ...prev,
        product_name: websiteData.product_name || prev.product_name,
        product_description: websiteData.product_description || prev.product_description,
        primary_category: websiteData.primary_category || prev.primary_category,
        top_use_cases: websiteData.top_use_cases || prev.top_use_cases,
        positioning_statement: websiteData.positioning_statement || prev.positioning_statement,
        primary_market: websiteData.primary_market || prev.primary_market,
        primary_languages: websiteData.primary_languages || prev.primary_languages
      }));
    } catch (error) {
      console.error("Error auto-populating:", error);
    } finally {
      setIsAutoPopulating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const company = await base44.entities.Company.create(formData);
      navigate(createPageUrl(`Approvals?companyId=${company.id}`));
    } catch (error) {
      console.error("Error creating company:", error);
      setIsSaving(false);
    }
  };

  const sections = [
    {
      icon: Package,
      title: "Product Basics",
      helper: "This ensures prompts reflect how your product is actually positioned and compared.",
      fields: (
        <>
          <div className="space-y-2">
            <Label className="text-slate-300">Product Name *</Label>
            <Input
              placeholder="e.g., Acme Analytics Platform"
              value={formData.product_name}
              onChange={(e) => handleChange("product_name", e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">One-sentence description in your own words *</Label>
            <Input
              placeholder="e.g., We help B2B SaaS companies track and improve customer engagement"
              value={formData.product_description}
              onChange={(e) => handleChange("product_description", e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Primary Category *</Label>
            <Input
              placeholder="e.g., Customer Analytics"
              value={formData.primary_category}
              onChange={(e) => handleChange("primary_category", e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Secondary or adjacent categories (optional)</Label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {formData.secondary_categories.map((cat, i) => (
                <span key={i} className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {cat}
                  <button onClick={() => removeArrayItem("secondary_categories", i)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Product Analytics"
                value={tempInputs.secondary_categories || ""}
                onChange={(e) => setTempInputs(prev => ({ ...prev, secondary_categories: e.target.value }))}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("secondary_categories"))}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <Button type="button" onClick={() => addArrayItem("secondary_categories")} variant="outline" className="border-slate-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Top three competitors you care about *</Label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {formData.top_competitors.map((comp, i) => (
                <span key={i} className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {comp}
                  <button onClick={() => removeArrayItem("top_competitors", i)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Competitor Inc"
                value={tempInputs.top_competitors || ""}
                onChange={(e) => setTempInputs(prev => ({ ...prev, top_competitors: e.target.value }))}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("top_competitors"))}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <Button type="button" onClick={() => addArrayItem("top_competitors")} variant="outline" className="border-slate-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )
    },
    {
      icon: Users,
      title: "Who Asks About Your Product",
      helper: "Different roles ask AI very different questions. This helps us match that reality.",
      fields: (
        <>
          <div className="space-y-2">
            <Label className="text-slate-300">Primary buyer role *</Label>
            <Input
              placeholder="e.g., Head of Product"
              value={formData.primary_buyer_role}
              onChange={(e) => handleChange("primary_buyer_role", e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Secondary buyer roles</Label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {formData.secondary_buyer_roles.map((role, i) => (
                <span key={i} className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {role}
                  <button onClick={() => removeArrayItem("secondary_buyer_roles", i)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., VP Marketing"
                value={tempInputs.secondary_buyer_roles || ""}
                onChange={(e) => setTempInputs(prev => ({ ...prev, secondary_buyer_roles: e.target.value }))}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("secondary_buyer_roles"))}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <Button type="button" onClick={() => addArrayItem("secondary_buyer_roles")} variant="outline" className="border-slate-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Typical company size you sell to *</Label>
            <Input
              placeholder="e.g., 50-500 employees"
              value={formData.typical_company_size}
              onChange={(e) => handleChange("typical_company_size", e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Primary industries (optional)</Label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {formData.primary_industries.map((ind, i) => (
                <span key={i} className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {ind}
                  <button onClick={() => removeArrayItem("primary_industries", i)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., SaaS"
                value={tempInputs.primary_industries || ""}
                onChange={(e) => setTempInputs(prev => ({ ...prev, primary_industries: e.target.value }))}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("primary_industries"))}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <Button type="button" onClick={() => addArrayItem("primary_industries")} variant="outline" className="border-slate-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )
    },
    {
      icon: Target,
      title: "Why Customers Choose You",
      helper: "AI often misrepresents scope. This helps detect and correct that.",
      fields: (
        <>
          <div className="space-y-2">
            <Label className="text-slate-300">Top three use cases customers buy for *</Label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {formData.top_use_cases.map((uc, i) => (
                <span key={i} className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {uc}
                  <button onClick={() => removeArrayItem("top_use_cases", i)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Track feature adoption"
                value={tempInputs.top_use_cases || ""}
                onChange={(e) => setTempInputs(prev => ({ ...prev, top_use_cases: e.target.value }))}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("top_use_cases"))}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <Button type="button" onClick={() => addArrayItem("top_use_cases")} variant="outline" className="border-slate-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">One use case that is often misunderstood *</Label>
            <Input
              placeholder="e.g., We're not a full CRM replacement"
              value={formData.misunderstood_use_case}
              onChange={(e) => handleChange("misunderstood_use_case", e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">One thing you are not a good fit for *</Label>
            <Input
              placeholder="e.g., Companies under 10 employees"
              value={formData.not_good_fit_for}
              onChange={(e) => handleChange("not_good_fit_for", e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
              required
            />
          </div>
        </>
      )
    },
    {
      icon: MessageSquare,
      title: "Messaging Anchors",
      helper: "This helps us evaluate accuracy, not just visibility.",
      fields: (
        <>
          <div className="space-y-2">
            <Label className="text-slate-300">Key positioning statement *</Label>
            <Textarea
              placeholder="e.g., The only analytics platform built specifically for product teams"
              value={formData.positioning_statement}
              onChange={(e) => handleChange("positioning_statement", e.target.value)}
              className="bg-slate-900 border-slate-700 text-white min-h-[80px]"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Three to five claims you stand behind *</Label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {formData.key_claims.map((claim, i) => (
                <span key={i} className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {claim}
                  <button onClick={() => removeArrayItem("key_claims", i)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., 10x faster implementation than competitors"
                value={tempInputs.key_claims || ""}
                onChange={(e) => setTempInputs(prev => ({ ...prev, key_claims: e.target.value }))}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("key_claims"))}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <Button type="button" onClick={() => addArrayItem("key_claims")} variant="outline" className="border-slate-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Terms you want AI to use</Label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {formData.preferred_terms.map((term, i) => (
                  <span key={i} className="bg-teal-900/50 text-teal-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {term}
                    <button onClick={() => removeArrayItem("preferred_terms", i)} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., product analytics"
                  value={tempInputs.preferred_terms || ""}
                  onChange={(e) => setTempInputs(prev => ({ ...prev, preferred_terms: e.target.value }))}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("preferred_terms"))}
                  className="bg-slate-900 border-slate-700 text-white"
                />
                <Button type="button" onClick={() => addArrayItem("preferred_terms")} variant="outline" className="border-slate-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Terms you want AI to avoid</Label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {formData.avoid_terms.map((term, i) => (
                  <span key={i} className="bg-red-900/50 text-red-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {term}
                    <button onClick={() => removeArrayItem("avoid_terms", i)} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., simple"
                  value={tempInputs.avoid_terms || ""}
                  onChange={(e) => setTempInputs(prev => ({ ...prev, avoid_terms: e.target.value }))}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("avoid_terms"))}
                  className="bg-slate-900 border-slate-700 text-white"
                />
                <Button type="button" onClick={() => addArrayItem("avoid_terms")} variant="outline" className="border-slate-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      icon: HelpCircle,
      title: "Real Customer Questions",
      helper: "Real questions lead to better AI evaluation than simulated guesses.",
      fields: (
        <>
          <div className="space-y-2">
            <Label className="text-slate-300">Sources of customer questions</Label>
            <p className="text-slate-500 text-sm">Select all that apply</p>
            <div className="space-y-2">
              {[
                "Website chatbot",
                "Support chat or tickets",
                "Sales calls",
                "Site search",
                "FAQs",
                "Reddit",
                "Quora"
              ].map((source) => (
                <div key={source} className="flex items-center gap-2">
                  <Checkbox
                    id={source}
                    checked={formData.question_sources.includes(source)}
                    onCheckedChange={() => toggleCheckbox("question_sources", source)}
                  />
                  <label htmlFor={source} className="text-slate-300 cursor-pointer">{source}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">What customers get confused about most</Label>
            <Textarea
              placeholder="e.g., They often think we integrate with Salesforce out of the box, but that's a custom add-on"
              value={formData.customer_confusion_points}
              onChange={(e) => handleChange("customer_confusion_points", e.target.value)}
              className="bg-slate-900 border-slate-700 text-white min-h-[100px]"
            />
          </div>
        </>
      )
    },
    {
      icon: Eye,
      title: "Visibility Priorities",
      helper: "We'll start where impact is highest.",
      fields: (
        <>
          <div className="space-y-2">
            <Label className="text-slate-300">Where AI visibility matters most right now *</Label>
            <p className="text-slate-500 text-sm">Select all that apply</p>
            <div className="space-y-2">
              {[
                "Public AI answers",
                "Product comparisons",
                "Customer support AI"
              ].map((priority) => (
                <div key={priority} className="flex items-center gap-2">
                  <Checkbox
                    id={priority}
                    checked={formData.visibility_priorities.includes(priority)}
                    onCheckedChange={() => toggleCheckbox("visibility_priorities", priority)}
                  />
                  <label htmlFor={priority} className="text-slate-300 cursor-pointer">{priority}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Biggest concern *</Label>
            <div className="space-y-2">
              {[
                "Not appearing in AI answers",
                "Being misrepresented",
                "Losing to competitors",
                "Inaccurate answers"
              ].map((concern) => (
                <div key={concern} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={concern}
                    name="biggest_concern"
                    checked={formData.biggest_concern === concern}
                    onChange={() => handleChange("biggest_concern", concern)}
                    className="text-teal-500"
                  />
                  <label htmlFor={concern} className="text-slate-300 cursor-pointer">{concern}</label>
                </div>
              ))}
            </div>
          </div>
        </>
      )
    },
    {
      icon: Globe,
      title: "Markets and Language",
      helper: "AI answers vary by region and language.",
      fields: (
        <>
          <div className="space-y-2">
            <Label className="text-slate-300">Primary market or region *</Label>
            <Input
              placeholder="e.g., United States"
              value={formData.primary_market}
              onChange={(e) => handleChange("primary_market", e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Secondary markets</Label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {formData.secondary_markets.map((market, i) => (
                <span key={i} className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {market}
                  <button onClick={() => removeArrayItem("secondary_markets", i)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., United Kingdom"
                value={tempInputs.secondary_markets || ""}
                onChange={(e) => setTempInputs(prev => ({ ...prev, secondary_markets: e.target.value }))}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("secondary_markets"))}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <Button type="button" onClick={() => addArrayItem("secondary_markets")} variant="outline" className="border-slate-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Primary languages *</Label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {formData.primary_languages.map((lang, i) => (
                <span key={i} className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {lang}
                  <button onClick={() => removeArrayItem("primary_languages", i)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., English"
                value={tempInputs.primary_languages || ""}
                onChange={(e) => setTempInputs(prev => ({ ...prev, primary_languages: e.target.value }))}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("primary_languages"))}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <Button type="button" onClick={() => addArrayItem("primary_languages")} variant="outline" className="border-slate-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )
    },
    {
      icon: Shield,
      title: "Guardrails",
      helper: "This keeps prompts focused.",
      fields: (
        <>
          <div className="space-y-2">
            <Label className="text-slate-300">Audiences you don't sell to</Label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {formData.excluded_audiences.map((aud, i) => (
                <span key={i} className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {aud}
                  <button onClick={() => removeArrayItem("excluded_audiences", i)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., B2C companies"
                value={tempInputs.excluded_audiences || ""}
                onChange={(e) => setTempInputs(prev => ({ ...prev, excluded_audiences: e.target.value }))}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("excluded_audiences"))}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <Button type="button" onClick={() => addArrayItem("excluded_audiences")} variant="outline" className="border-slate-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Competitors you don't care about</Label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {formData.irrelevant_competitors.map((comp, i) => (
                <span key={i} className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {comp}
                  <button onClick={() => removeArrayItem("irrelevant_competitors", i)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Outdated Company"
                value={tempInputs.irrelevant_competitors || ""}
                onChange={(e) => setTempInputs(prev => ({ ...prev, irrelevant_competitors: e.target.value }))}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("irrelevant_competitors"))}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <Button type="button" onClick={() => addArrayItem("irrelevant_competitors")} variant="outline" className="border-slate-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Legacy names or outdated terms</Label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {formData.legacy_terms.map((term, i) => (
                <span key={i} className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {term}
                  <button onClick={() => removeArrayItem("legacy_terms", i)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., OldBrand (pre-2020)"
                value={tempInputs.legacy_terms || ""}
                onChange={(e) => setTempInputs(prev => ({ ...prev, legacy_terms: e.target.value }))}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("legacy_terms"))}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <Button type="button" onClick={() => addArrayItem("legacy_terms")} variant="outline" className="border-slate-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center mb-4">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6943f2bf67610e14801b112b/de87d19e0_elelem2025logoPrimary.png"
              alt="elelem"
              className="h-8 brightness-0 invert"
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-3">Help Us Model How Customers Actually Ask AI About Your Product</h1>
            <p className="text-slate-400 max-w-3xl mx-auto">
              This information helps elelem generate realistic prompts and evaluate how your content performs in AI answers. No assumptions. No synthetic personas.
            </p>
          </div>

          {/* Contact Info Card */}
          <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Your Name *</Label>
                <Input
                  value={formData.contact_name}
                  onChange={(e) => handleChange("contact_name", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
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
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Job Title</Label>
                <Input
                  value={formData.job_title}
                  onChange={(e) => handleChange("job_title", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Company Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-300">Website URL *</Label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => handleChange("website_url", e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white flex-1"
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => autoPopulateFromUrl(formData.website_url)}
                    disabled={isAutoPopulating || !formData.website_url}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    {isAutoPopulating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Auto-fill"
                    )}
                  </Button>
                </div>
                {isAutoPopulating && (
                  <p className="text-teal-400 text-sm">Analyzing website and gathering information...</p>
                )}
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit}>
            {/* Progressive Sections */}
            <div className="space-y-4 mb-8">
              {sections.map((section, index) => {
                const Icon = section.icon;
                const isExpanded = expandedSections.includes(index);
                
                return (
                  <Card key={index} className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader 
                      className="cursor-pointer hover:bg-slate-800/30 transition-colors"
                      onClick={() => toggleSection(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-teal-400" />
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg">{section.title}</CardTitle>
                            <CardDescription className="text-slate-400 text-sm">{section.helper}</CardDescription>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </CardHeader>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="space-y-6 pt-0">
                            {section.fields}
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <Button 
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate(createPageUrl("Home"))}
                className="border-slate-700 text-slate-300"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back
              </Button>
              <Button 
                type="submit"
                size="lg"
                disabled={isSaving}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
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