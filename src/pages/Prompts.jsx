import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { 
  Loader2,
  Search,
  Filter,
  Settings,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function Prompts() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [company, setCompany] = useState(null);
  const [funnelStage, setFunnelStage] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPromptText, setNewPromptText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (prompts.length > 0) {
      filterPrompts();
    }
  }, [funnelStage, searchTerm]);

  const loadData = async () => {
    try {
      const companies = await base44.entities.Company.list();
      if (companies.length > 0) {
        setCompany(companies[0]);
        const promptsData = await base44.entities.PromptAnalysis.filter({ company_id: companies[0].id });
        setPrompts(promptsData);
        setFilteredPrompts(promptsData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPrompts = () => {
    let filtered = [...prompts];

    // Filter by funnel stage
    if (funnelStage !== "all") {
      filtered = filtered.filter(p => p.funnel_stage === funnelStage);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.prompt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPrompts(filtered);
  };

  const handleAddPrompt = async () => {
    if (!newPromptText.trim() || !company) return;
    
    setIsProcessing(true);
    try {
      // Use LLM to analyze the prompt
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this buyer prompt and extract metadata:

Prompt: "${newPromptText}"

Extract:
1. funnel_stage: Determine if this is "top" (awareness), "middle" (consideration), or "bottom" (decision) of funnel
2. keywords: Extract 3-5 relevant keywords from the prompt
3. topics: Identify 2-4 main topics discussed

Consider the buyer journey and intent level when determining funnel stage.`,
        response_json_schema: {
          type: "object",
          properties: {
            funnel_stage: { type: "string", enum: ["top", "middle", "bottom"] },
            keywords: { type: "array", items: { type: "string" } },
            topics: { type: "array", items: { type: "string" } }
          }
        }
      });

      // Create the prompt analysis record
      const newPrompt = await base44.entities.PromptAnalysis.create({
        company_id: company.id,
        prompt: newPromptText.trim(),
        view_type: "prospect",
        funnel_stage: analysis.funnel_stage,
        keywords: analysis.keywords || [],
        topics: analysis.topics || [],
        search_signal_score: 0,
        elelem_score: 0,
        citations_count: 0,
        brand_mentions_count: 0,
        is_optimized: false
      });

      // Update local state
      setPrompts([newPrompt, ...prompts]);
      setFilteredPrompts([newPrompt, ...filteredPrompts]);
      
      // Reset form
      setNewPromptText("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding prompt:", error);
      alert("Failed to add prompt. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading prompts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Generated Prompts
            </h1>
            <p className="text-slate-400">
              Review and manage all generated prompts
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Prompt
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-slate-800"
              onClick={() => navigate(createPageUrl("Setup"))}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search prompts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <Select value={funnelStage} onValueChange={setFunnelStage}>
            <SelectTrigger className="w-full sm:w-48 bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Funnel stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="top">Top of Funnel</SelectItem>
              <SelectItem value="middle">Middle of Funnel</SelectItem>
              <SelectItem value="bottom">Bottom of Funnel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="pt-6">
              <div className="text-slate-400 text-sm mb-1">Total Prompts</div>
              <div className="text-3xl font-bold text-white">{filteredPrompts.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="pt-6">
              <div className="text-slate-400 text-sm mb-1">Top of Funnel</div>
              <div className="text-3xl font-bold text-white">
                {filteredPrompts.filter(p => p.funnel_stage === "top").length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="pt-6">
              <div className="text-slate-400 text-sm mb-1">Bottom of Funnel</div>
              <div className="text-3xl font-bold text-white">
                {filteredPrompts.filter(p => p.funnel_stage === "bottom").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prompts List */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">All Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPrompts.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No prompts found</p>
              ) : (
                filteredPrompts.map((prompt, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border border-slate-700/50 rounded-lg p-4 bg-slate-900/50 hover:bg-slate-900/80 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-white font-medium mb-2">{prompt.prompt}</p>
                        <div className="flex gap-2 flex-wrap">
                          <Badge 
                            variant="outline"
                            className={`${
                              prompt.funnel_stage === "top"
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                : prompt.funnel_stage === "middle"
                                ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                                : "bg-pink-500/20 text-pink-400 border-pink-500/30"
                            }`}
                          >
                            {prompt.funnel_stage.charAt(0).toUpperCase() + prompt.funnel_stage.slice(1)} Funnel
                          </Badge>
                          {prompt.keywords && prompt.keywords.slice(0, 3).map((keyword, j) => (
                            <Badge key={j} variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600/30">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {prompt.citations_count !== undefined && (
                        <div className="text-right">
                          <div className="text-slate-400 text-xs mb-1">Citations</div>
                          <div className="text-teal-400 font-semibold">{prompt.citations_count}</div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add Prompt Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Add Custom Prompt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm mb-3">
                  Enter a buyer question or prompt. We'll automatically analyze it to determine the funnel stage, keywords, and topics.
                </p>
                <Textarea
                  placeholder="e.g., What are the best CRM tools for small businesses?"
                  value={newPromptText}
                  onChange={(e) => setNewPromptText(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white min-h-[120px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setNewPromptText("");
                }}
                className="border-slate-700 text-slate-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPrompt}
                disabled={!newPromptText.trim() || isProcessing}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Add Prompt"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}