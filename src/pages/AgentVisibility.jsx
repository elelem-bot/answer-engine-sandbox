import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "@/components/dashboard/StatCard";
import CitationChart from "@/components/dashboard/CitationChart";
import BrandTable from "@/components/dashboard/BrandTable";

const COLORS = ['#14b8a6', '#22d3ee', '#84cc16', '#10b981', '#06b6d4', '#a3e635', '#2dd4bf', '#0ea5e9'];

export default function AgentVisibility() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [company, setCompany] = useState(null);
  const [funnelStage, setFunnelStage] = useState("top");
  const [selectedPrompt, setSelectedPrompt] = useState(null);
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
        
        const filtered = promptsData.filter(p => p.funnel_stage === funnelStage);
        calculateVisibility(filtered, companies[0]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
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

    setVisibilityData({
      totalVisibility: totalBrandCitations,
      shareOfCitations: totalBrandCitations > 0 ? Math.round((ownCitations / totalBrandCitations) * 100) : 0,
      totalBrandMentions: totalBrandCitations,
      brandMentionShare: totalBrandCitations > 0 ? Math.round((ownMentions / totalBrandCitations) * 100) : 0,
      citationsBySource: topBrands.slice(0, 5).map(b => ({ name: b.name, value: b.citations })),
      topCitedBrands: topBrands,
      brandMentionsBreakdown: topBrands.slice(0, 6).map(b => ({ name: b.name, value: b.citations })),
      topTopics,
      trendData: []
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading agent visibility data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* View Type Submenu */}
        <div className="mb-6 border-b border-slate-800">
          <div className="flex gap-1">
            <button
              onClick={() => navigate(createPageUrl("VisibilityHQ"))}
              className="px-6 py-3 text-sm font-medium transition-all text-slate-400 hover:text-slate-300"
            >
              Prospect
            </button>
            <button
              onClick={() => navigate(createPageUrl("CustomerVisibility"))}
              className="px-6 py-3 text-sm font-medium transition-all text-slate-400 hover:text-slate-300"
            >
              Customer
            </button>
            <button
              onClick={() => navigate(createPageUrl("AgentVisibility"))}
              className="px-6 py-3 text-sm font-medium transition-all text-teal-400 border-b-2 border-teal-400"
            >
              Agent
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Agent Visibility Dashboard</h1>
              <p className="text-slate-400">Track how AI agents and automation systems reference your brand</p>
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
                disabled={isAnalyzing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Funnel Stage Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-slate-400 text-sm">Funnel Stage:</span>
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
      </div>
    </div>
  );
}