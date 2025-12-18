import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { 
  LineChart, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Loader2,
  Search,
  Filter,
  ToggleLeft,
  ToggleRight,
  Eye,
  Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

export default function Tracking() {
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptimized, setFilterOptimized] = useState("all");
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const companies = await base44.entities.Company.filter({ setup_complete: true });
      if (companies.length > 0) {
        const promptsData = await base44.entities.PromptAnalysis.filter({ company_id: companies[0].id });
        
        // Generate mock visibility data
        const enrichedPrompts = promptsData.map(p => ({
          ...p,
          visibility_data: generateMockVisibilityData(),
          current_score: Math.floor(Math.random() * 100),
          trend: Math.floor(Math.random() * 40) - 15,
          citations_count: p.citations_count || Math.floor(Math.random() * 50),
          brand_mentions_count: p.brand_mentions_count || Math.floor(Math.random() * 30)
        }));
        
        setPrompts(enrichedPrompts);
      }
    } catch (error) {
      console.error("Error loading prompts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockVisibilityData = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: Math.floor(Math.random() * 40) + 30 + Math.floor(i * 0.5)
    }));
  };

  const toggleOptimized = async (promptId, currentValue) => {
    try {
      await base44.entities.PromptAnalysis.update(promptId, { is_optimized: !currentValue });
      setPrompts(prompts.map(p => 
        p.id === promptId ? { ...p, is_optimized: !currentValue } : p
      ));
    } catch (error) {
      console.error("Error updating prompt:", error);
    }
  };

  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.prompt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterOptimized === "all" || 
      (filterOptimized === "optimized" && p.is_optimized) ||
      (filterOptimized === "not_optimized" && !p.is_optimized);
    return matchesSearch && matchesFilter;
  });

  const overallStats = {
    avgVisibility: Math.round(prompts.reduce((acc, p) => acc + (p.current_score || 0), 0) / (prompts.length || 1)),
    totalCitations: prompts.reduce((acc, p) => acc + (p.citations_count || 0), 0),
    totalMentions: prompts.reduce((acc, p) => acc + (p.brand_mentions_count || 0), 0),
    optimizedCount: prompts.filter(p => p.is_optimized).length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading tracking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Tracking</h1>
          <p className="text-slate-400">Monitor visibility trends and track optimization impact</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Avg. Visibility Score</p>
                  <p className="text-2xl font-bold text-white mt-1">{overallStats.avgVisibility}</p>
                </div>
                <div className="p-3 rounded-xl bg-teal-500/20">
                  <Eye className="w-5 h-5 text-teal-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Citations</p>
                  <p className="text-2xl font-bold text-white mt-1">{overallStats.totalCitations}</p>
                </div>
                <div className="p-3 rounded-xl bg-cyan-500/20">
                  <Quote className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Brand Mentions</p>
                  <p className="text-2xl font-bold text-white mt-1">{overallStats.totalMentions}</p>
                </div>
                <div className="p-3 rounded-xl bg-lime-500/20">
                  <TrendingUp className="w-5 h-5 text-lime-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Optimized Prompts</p>
                  <p className="text-2xl font-bold text-white mt-1">{overallStats.optimizedCount}/{prompts.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/20">
                  <ToggleRight className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prompts Table */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  placeholder="Search prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              <Select value={filterOptimized} onValueChange={setFilterOptimized}>
                <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prompts</SelectItem>
                  <SelectItem value="optimized">Optimized</SelectItem>
                  <SelectItem value="not_optimized">Not Optimized</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-transparent">
                      <TableHead className="text-slate-400">Prompt</TableHead>
                      <TableHead className="text-slate-400 text-center w-24">Score</TableHead>
                      <TableHead className="text-slate-400 text-center w-24">Trend</TableHead>
                      <TableHead className="text-slate-400 text-center w-32">Optimized</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrompts.map((prompt, i) => (
                      <TableRow 
                        key={i}
                        className={`border-slate-700/50 cursor-pointer transition-colors ${
                          selectedPrompt?.id === prompt.id 
                            ? "bg-teal-500/10 border-l-2 border-l-teal-500" 
                            : "hover:bg-slate-700/30"
                        }`}
                        onClick={() => setSelectedPrompt(prompt)}
                      >
                        <TableCell>
                          <p className="text-white text-sm line-clamp-2">{prompt.prompt}</p>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={`${
                            prompt.current_score >= 70 ? "bg-emerald-500/20 text-emerald-400" :
                            prompt.current_score >= 40 ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-red-500/20 text-red-400"
                          }`}>
                            {prompt.current_score}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className={`flex items-center justify-center gap-1 ${
                            prompt.trend > 0 ? "text-emerald-400" : 
                            prompt.trend < 0 ? "text-red-400" : "text-slate-400"
                          }`}>
                            {prompt.trend > 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : prompt.trend < 0 ? (
                              <TrendingDown className="w-4 h-4" />
                            ) : (
                              <Minus className="w-4 h-4" />
                            )}
                            <span>{prompt.trend > 0 ? "+" : ""}{prompt.trend}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <Switch
                              checked={prompt.is_optimized}
                              onCheckedChange={() => toggleOptimized(prompt.id, prompt.is_optimized)}
                              className="data-[state=checked]:bg-teal-500"
                            />
                            <span className={`text-xs ${prompt.is_optimized ? "text-teal-400" : "text-slate-500"}`}>
                              {prompt.is_optimized ? "Yes" : "No"}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          {/* Trend Chart */}
          <div className="space-y-4">
            {selectedPrompt ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Visibility Trend</CardTitle>
                    <p className="text-slate-400 text-sm line-clamp-2">{selectedPrompt.prompt}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={selectedPrompt.visibility_data}>
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                          <YAxis stroke="#94a3b8" domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              border: '1px solid #334155',
                              borderRadius: '8px',
                              color: '#fff'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#14b8a6" 
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorScore)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-700">
                      <div>
                        <p className="text-slate-400 text-sm">Citations</p>
                        <p className="text-xl font-bold text-white">{selectedPrompt.citations_count}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Brand Mentions</p>
                        <p className="text-xl font-bold text-white">{selectedPrompt.brand_mentions_count}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50 mt-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Optimization Status</p>
                        <p className={`text-lg font-semibold ${selectedPrompt.is_optimized ? "text-teal-400" : "text-slate-500"}`}>
                          {selectedPrompt.is_optimized ? "Optimized" : "Not Optimized"}
                        </p>
                      </div>
                      <Switch
                        checked={selectedPrompt.is_optimized}
                        onCheckedChange={() => toggleOptimized(selectedPrompt.id, selectedPrompt.is_optimized)}
                        className="data-[state=checked]:bg-teal-500"
                      />
                    </div>
                    <p className="text-slate-500 text-xs mt-2">
                      Toggle to track visibility changes after updating content
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-12 text-center">
                  <LineChart className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500">Select a prompt to view its visibility trend</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}