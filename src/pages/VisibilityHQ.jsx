import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { 
  Eye, 
  Quote, 
  MessageSquare, 
  TrendingUp,
  Loader2,
  RefreshCw,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import StatCard from "@/components/dashboard/StatCard";
import CitationChart from "@/components/dashboard/CitationChart";
import BrandTable from "@/components/dashboard/BrandTable";

const COLORS = ['#14b8a6', '#22d3ee', '#84cc16', '#10b981', '#06b6d4', '#a3e635', '#2dd4bf', '#0ea5e9'];

export default function VisibilityHQ() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [company, setCompany] = useState(null);
  const [visibilityData, setVisibilityData] = useState({
    totalVisibility: 0,
    shareOfCitations: 0,
    totalBrandMentions: 0,
    brandMentionShare: 0,
    citationsBySource: [],
    topCitedBrands: [],
    brandMentionsBreakdown: [],
    topTopics: [],
    trendData: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const companies = await base44.entities.Company.filter({ setup_complete: true });
      if (companies.length > 0) {
        setCompany(companies[0]);
        const promptsData = await base44.entities.PromptAnalysis.filter({ company_id: companies[0].id });
        setPrompts(promptsData);
        
        if (promptsData.length > 0 && !promptsData[0].gemini_response) {
          await analyzePrompts(promptsData, companies[0]);
        } else {
          calculateVisibility(promptsData, companies[0]);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzePrompts = async (promptsData, companyData) => {
    setIsAnalyzing(true);
    
    const updatedPrompts = [];
    
    for (const prompt of promptsData.slice(0, 5)) {
      try {
        const response = await base44.integrations.Core.InvokeLLM({
          prompt: `You are simulating an AI search engine response. Answer this question from a user: "${prompt.prompt}"

Provide a helpful, detailed answer that would cite relevant sources and mention brands where appropriate. 
Include specific brand names, websites, and sources in your response.
The company "${companyData.name}" (${companyData.website_url}) is relevant to this query if it fits the context.

After the response, provide analysis in JSON format:
- cited_brands: Array of {brand: string, mentions: number} for brands mentioned
- topics: Array of top 5 topics discussed
- citations_count: Number of sources/citations in the response
- brand_mentions_count: Total brand mentions`,
          response_json_schema: {
            type: "object",
            properties: {
              response_text: { type: "string" },
              cited_brands: { 
                type: "array", 
                items: { 
                  type: "object", 
                  properties: { 
                    brand: { type: "string" }, 
                    mentions: { type: "number" } 
                  } 
                } 
              },
              topics: { type: "array", items: { type: "string" } },
              citations_count: { type: "number" },
              brand_mentions_count: { type: "number" }
            }
          }
        });

        await base44.entities.PromptAnalysis.update(prompt.id, {
          gemini_response: response.response_text,
          cited_brands: response.cited_brands,
          topics: response.topics,
          citations_count: response.citations_count,
          brand_mentions_count: response.brand_mentions_count
        });

        updatedPrompts.push({
          ...prompt,
          gemini_response: response.response_text,
          cited_brands: response.cited_brands,
          topics: response.topics,
          citations_count: response.citations_count,
          brand_mentions_count: response.brand_mentions_count
        });
      } catch (error) {
        console.error("Error analyzing prompt:", error);
        updatedPrompts.push(prompt);
      }
    }

    setPrompts(updatedPrompts);
    calculateVisibility(updatedPrompts, companyData);
    setIsAnalyzing(false);
  };

  const calculateVisibility = (promptsData, companyData) => {
    let ownCitations = 0;
    let ownMentions = 0;
    const brandCounts = {};
    const topicCounts = {};

    promptsData.forEach(p => {
      (p.cited_brands || []).forEach(cb => {
        brandCounts[cb.brand] = (brandCounts[cb.brand] || 0) + cb.mentions;
        if (cb.brand.toLowerCase().includes(companyData.name.toLowerCase())) {
          ownCitations += cb.mentions;
          ownMentions += cb.mentions;
        }
      });

      (p.topics || []).forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    });

    const totalBrandCitations = Object.values(brandCounts).reduce((sum, count) => sum + count, 0);

    const topBrands = Object.entries(brandCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, citations]) => ({
        name,
        citations,
        share: totalBrandCitations > 0 ? Math.round((citations / totalBrandCitations) * 100) : 0,
        change: 0
      }));

    const topTopics = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));

    // No trend data on day one - only show when we have historical data
    const trendData = [];

    setVisibilityData({
      totalVisibility: totalBrandCitations,
      shareOfCitations: totalBrandCitations > 0 ? Math.round((ownCitations / totalBrandCitations) * 100) : 0,
      totalBrandMentions: totalBrandCitations,
      brandMentionShare: totalBrandCitations > 0 ? Math.round((ownMentions / totalBrandCitations) * 100) : 0,
      citationsBySource: topBrands.slice(0, 5).map(b => ({ name: b.name, value: b.citations })),
      topCitedBrands: topBrands,
      brandMentionsBreakdown: topBrands.slice(0, 6).map(b => ({ name: b.name, value: b.citations })),
      topTopics,
      trendData
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading visibility data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">GEO Dashboard</h1>
            <p className="text-slate-400">Track performance across AI search engines and optimize your content strategy</p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="7d">
              <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              className="border-slate-700 text-slate-300"
              onClick={() => company && analyzePrompts(prompts, company)}
              disabled={isAnalyzing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4 mb-6 flex items-center gap-3"
          >
            <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
            <span className="text-teal-400">Analyzing prompts through AI... This may take a minute.</span>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Visibility" 
            value={visibilityData.totalVisibility.toLocaleString()} 
            icon={Eye}
          />
          <StatCard 
            title="Share of Citations" 
            value={`${visibilityData.shareOfCitations}%`} 
            icon={Quote}
          />
          <StatCard 
            title="Total Brand Mentions" 
            value={visibilityData.totalBrandMentions.toLocaleString()} 
            icon={MessageSquare}
          />
          <StatCard 
            title="Brand Mention Share" 
            value={`${visibilityData.brandMentionShare}%`} 
            icon={TrendingUp}
          />
        </div>

        {/* Citation Insights */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Citation Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CitationChart 
              data={visibilityData.citationsBySource} 
              title="Citation Distribution by Source"
            />
            <BrandTable 
              data={visibilityData.topCitedBrands}
              title="Top Cited Competitive Domains"
              companyName={company?.name}
            />
          </div>
        </div>

        {/* Mention Insights */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Mention Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CitationChart 
              data={visibilityData.brandMentionsBreakdown} 
              title="Brand Mention Distribution"
            />
            <BrandTable 
              data={visibilityData.topCitedBrands}
              title="Top Performing Brands by Mentions"
              companyName={company?.name}
            />
          </div>
        </div>

        {/* Trend Charts - Only show when we have trend data */}
        {visibilityData.trendData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Citation Trend Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={visibilityData.trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="citations" 
                        stroke="#14b8a6" 
                        strokeWidth={2}
                        dot={{ fill: '#14b8a6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Mention Trend Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={visibilityData.trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="mentions" 
                        stroke="#22d3ee" 
                        strokeWidth={2}
                        dot={{ fill: '#22d3ee' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Topics */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-lg">Top Topics in Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {visibilityData.topTopics.map((topic, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="py-2 px-4 text-sm border-slate-600 text-slate-300"
                >
                  {topic.name}
                  <span className="ml-2 text-teal-400">{topic.value}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}