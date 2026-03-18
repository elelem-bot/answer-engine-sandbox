import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { TrendingUp, Target, Calendar, LineChart as LineChartIcon, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Tracking() {
  const [isLoading, setIsLoading] = useState(true);
  const [trackedPrompts, setTrackedPrompts] = useState([]);
  const [company, setCompany] = useState(null);


  useEffect(() => {
    loadTrackedPrompts();
  }, []);

  const loadTrackedPrompts = async () => {
    try {
      const companies = await base44.entities.Company.list();
      if (companies.length > 0) {
        setCompany(companies[0]);
        const prompts = await base44.entities.PromptAnalysis.filter({
          company_id: companies[0].id,
          is_tracked: true
        });
        setTrackedPrompts(prompts);
      }
    } catch (error) {
      console.error("Error loading tracked prompts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading tracked prompts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold mb-2 ${text-gray-900}`}>Tracked Prompts</h1>
          <p className={text-gray-600}>Monitor the performance and ROI of your engineered content</p>
        </div>

        {trackedPrompts.length === 0 ? (
          <Card className="bg-white border-gray-200">
            <CardContent className="py-12">
              <div className="text-center">
                <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className={`text-lg font-semibold mb-2 ${text-gray-900}`}>
                  No Tracked Prompts Yet
                </h3>
                <p className={text-gray-600}>
                  Start tracking prompts from the Answer Engineering page to monitor their performance over time.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {trackedPrompts.map((prompt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                            Engineered
                          </Badge>
                          <Badge className="bg-slate-700/50 text-slate-300 border-slate-600/30">
                            {prompt.funnel_stage}
                          </Badge>
                          {prompt.source_tag === 'REAL' && (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              REAL
                            </Badge>
                          )}
                        </div>
                        <CardTitle className={`text-lg ${text-gray-900}`}>
                          {prompt.prompt}
                        </CardTitle>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className={`w-4 h-4 ${text-gray-500}`} />
                            <span className={text-gray-600}>
                              Started: {new Date(prompt.tracked_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${text-gray-900}`}>
                            {prompt.brand_mentions_count || 0}
                          </div>
                          <div className={`text-xs ${text-gray-500}`}>
                            Brand Mentions
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {prompt.visibility_trend && prompt.visibility_trend.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={prompt.visibility_trend}>
                            <CartesianGrid strokeDasharray="3 3" stroke={"#e5e7eb"} />
                            <XAxis 
                              dataKey="date" 
                              stroke={"#6b7280"}
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis stroke={"#6b7280"} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#ffffff',
                                                                   border: '1px solid #e5e7eb',
                                                                   borderRadius: '8px',
                                                                   color: '#000'
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="brand_mentions"
                              stroke="#14b8a6"
                              strokeWidth={2}
                              dot={{ fill: '#14b8a6' }}
                              name="Brand Mentions"
                            />
                            <Line
                              type="monotone"
                              dataKey="share_percentage"
                              stroke="#22d3ee"
                              strokeWidth={2}
                              dot={{ fill: '#22d3ee' }}
                              name="Share %"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-lg border-gray-200 bg-gray-50">
                        <LineChartIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Trend data will appear here as we track this prompt over time
                        </p>
                      </div>
                    )}
                    
                    {/* Keywords */}
                    {prompt.keywords && prompt.keywords.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <div className={`text-xs font-semibold mb-2 ${text-gray-600}`}>
                          Target Keywords:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {prompt.keywords.map((keyword, j) => (
                            <Badge
                              key={j}
                              className="bg-teal-500/20 text-teal-400 border-teal-500/30 text-xs"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}