import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Send, MessageSquare, ThumbsUp, ThumbsDown,
  Flag, CheckCircle, BarChart3, Eye, ChevronDown, ChevronUp,
  AlertCircle, Target, Clock, TrendingUp, Users, FileText, Zap,
  ArrowUp, ArrowDown, X, Edit3, Save, Settings, RefreshCw
} from "lucide-react";
import AnswerEngineChat from "@/components/AnswerEngineChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, Area, AreaChart
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ── Feedback Panel ────────────────────────────────────────────────────────────
function FeedbackPanel({ questions, onFeedbackSaved }) {
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(null); // "good" | "bad" | "flag"
  const [correction, setCorrection] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState({}); // id -> true

  const handleSelect = (q) => {
    if (selected?.id === q.id) { setSelected(null); return; }
    setSelected(q);
    setComment("");
    setRating(null);
    setCorrection("");
  };

  const handleSave = async () => {
    if (!selected) return;
    setIsSaving(true);
    try {
      // Store feedback as a note in the question keywords field (lightweight)
      const feedbackNote = `[FEEDBACK] rating:${rating || "none"} comment:${comment} correction:${correction}`;
      await base44.entities.AnswerEngineQuestion.update(selected.id, {
        keywords: [...(selected.keywords || []), feedbackNote]
      });
      setSaved(prev => ({ ...prev, [selected.id]: { rating, comment, correction } }));
      if (onFeedbackSaved) onFeedbackSaved();
      setSelected(null);
    } catch (e) {
      console.error("Error saving feedback:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <h2 className="font-semibold text-gray-900 text-sm">Feedback & Training</h2>
        <p className="text-xs text-gray-500 mt-0.5">Rate answers to improve the AI</p>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {questions.length === 0 && (
          <div className="text-center py-12 px-4">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-500">No interactions yet.<br />Ask questions in the engine to see them here.</p>
          </div>
        )}
        {questions.map((q) => {
          const fb = saved[q.id];
          const isOpen = selected?.id === q.id;
          return (
            <div key={q.id} className="bg-white">
              <button
                onClick={() => handleSelect(q)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-gray-800 line-clamp-2 flex-1">{q.question}</p>
                  <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                    {fb && (
                      fb.rating === "good" ? <ThumbsUp className="w-3.5 h-3.5 text-green-500" /> :
                      fb.rating === "bad" ? <ThumbsDown className="w-3.5 h-3.5 text-red-500" /> :
                      fb.rating === "flag" ? <Flag className="w-3.5 h-3.5 text-amber-500" /> :
                      <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                    )}
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                  </div>
                </div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  <Badge className={`text-xs px-1.5 py-0 ${
                    q.funnel_stage === "bottom" ? "bg-pink-500/15 text-pink-600" :
                    q.funnel_stage === "middle" ? "bg-purple-500/15 text-purple-600" :
                    "bg-blue-500/15 text-blue-600"
                  }`}>{q.funnel_stage}</Badge>
                  <span className="text-xs text-gray-400">{new Date(q.created_date).toLocaleDateString()}</span>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3 bg-gray-50 border-t border-gray-100">
                      {/* AI Answer preview */}
                      {q.answer && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">AI Answer</p>
                          <p className="text-xs text-gray-700 leading-relaxed line-clamp-4 bg-white rounded border border-gray-200 p-2">{q.answer}</p>
                        </div>
                      )}

                      {/* Rating buttons */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Rate this answer</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setRating(rating === "good" ? null : "good")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              rating === "good" ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" /> Good
                          </button>
                          <button
                            onClick={() => setRating(rating === "bad" ? null : "bad")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              rating === "bad" ? "bg-red-500 text-white border-red-500" : "bg-white text-gray-600 border-gray-300 hover:border-red-400"
                            }`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" /> Poor
                          </button>
                          <button
                            onClick={() => setRating(rating === "flag" ? null : "flag")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              rating === "flag" ? "bg-amber-500 text-white border-amber-500" : "bg-white text-gray-600 border-gray-300 hover:border-amber-400"
                            }`}
                          >
                            <Flag className="w-3.5 h-3.5" /> Flag
                          </button>
                        </div>
                      </div>

                      {/* Comment */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Comment</p>
                        <Textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="What could be improved?"
                          className="text-xs min-h-[60px] resize-none bg-white border-gray-200"
                        />
                      </div>

                      {/* Suggested correction */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          <Edit3 className="w-3 h-3 inline mr-1" />Suggested Correction
                        </p>
                        <Textarea
                          value={correction}
                          onChange={(e) => setCorrection(e.target.value)}
                          placeholder="How should the AI have answered?"
                          className="text-xs min-h-[60px] resize-none bg-white border-gray-200"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleSave}
                          disabled={isSaving || (!rating && !comment && !correction)}
                          className="flex-1 text-xs h-8"
                          style={{ background: "linear-gradient(to right, #2DC6FE, #81FBEF)", color: "#082D35", border: "none" }}
                        >
                          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Save className="w-3.5 h-3.5 mr-1" />Save Feedback</>}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelected(null)}
                          className="text-xs h-8 text-gray-500"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Mini Analytics (clone of Analytics page logic) ────────────────────────────
function SandboxAnalytics({ questions }) {
  const totalQuestions = questions.length;
  const totalAnswers = questions.filter(q => q.answer).length;
  const demoBookings = questions.filter(q => q.booked_demo).length;
  const conversionRate = totalQuestions > 0 ? ((demoBookings / totalQuestions) * 100).toFixed(1) : 0;
  const pageViews = Math.round(totalQuestions * 2.3);
  const uniqueVisitors = Math.floor(totalQuestions * 0.7);

  const funnelBreakdown = {
    top: questions.filter(q => q.funnel_stage === "top").length,
    middle: questions.filter(q => q.funnel_stage === "middle").length,
    bottom: questions.filter(q => q.funnel_stage === "bottom").length
  };

  const topicsMap = {};
  questions.forEach(q => (q.keywords || []).forEach(k => {
    if (!k.startsWith("[FEEDBACK]")) topicsMap[k] = (topicsMap[k] || 0) + 1;
  }));
  const topTopics = Object.entries(topicsMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([topic, count]) => ({ topic, count }));

  const dailyData = {};
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    dailyData[d.toISOString().split('T')[0]] = { questions: 0, conversions: 0 };
  }
  questions.forEach(q => {
    const ds = new Date(q.created_date).toISOString().split('T')[0];
    if (dailyData[ds]) { dailyData[ds].questions++; if (q.booked_demo) dailyData[ds].conversions++; }
  });
  const trendData = Object.entries(dailyData).map(([date, d]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    questions: d.questions, conversions: d.conversions
  }));

  const funnelChartData = [
    { stage: "Top", count: funnelBreakdown.top, color: "#3b82f6" },
    { stage: "Middle", count: funnelBreakdown.middle, color: "#a855f7" },
    { stage: "Bottom", count: funnelBreakdown.bottom, color: "#ec4899" }
  ];
  const tooltipStyle = { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#000' };

  const failedAnswers = questions.filter(q =>
    !q.answer || q.answer.includes("I'm afraid I can't answer") || q.answer.includes("Sorry, I encountered an error")
  );

  const StatCard = ({ icon: Icon, title, value, subtitle }) => (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-4 h-4 text-teal-600" />
          <p className="text-xs font-medium text-gray-600">{title}</p>
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs mt-0.5 text-gray-500">{subtitle}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <StatCard icon={MessageSquare} title="Total Questions" value={totalQuestions} subtitle="Unique inquiries" />
        <StatCard icon={FileText} title="Answers Provided" value={totalAnswers} subtitle={`${totalQuestions > 0 ? Math.round((totalAnswers/totalQuestions)*100) : 0}% response rate`} />
        <StatCard icon={Target} title="Conversion Rate" value={`${conversionRate}%`} subtitle="Demo bookings" />
        <StatCard icon={AlertCircle} title="Failed Answers" value={failedAnswers.length} subtitle={`${totalQuestions > 0 ? Math.round((failedAnswers.length/totalQuestions)*100) : 0}% failure rate`} />
        <StatCard icon={Clock} title="Avg Session" value="3:45" subtitle="Time on engine" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader><CardTitle className="text-gray-900 text-sm">Questions & Conversions Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Area type="monotone" dataKey="questions" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.3} name="Questions" />
                <Area type="monotone" dataKey="conversions" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} name="Conversions" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader><CardTitle className="text-gray-900 text-sm">Funnel Stage Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={funnelChartData} cx="50%" cy="50%" outerRadius={90}
                  labelLine={false} label={({ stage, count }) => `${stage}: ${count}`}
                  fill="#8884d8" dataKey="count">
                  {funnelChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {topTopics.length > 0 && (
        <Card className="bg-white border-gray-200">
          <CardHeader><CardTitle className="text-gray-900 text-sm">Top Topics</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topTopics} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" fontSize={11} />
                <YAxis type="category" dataKey="topic" stroke="#6b7280" fontSize={11} width={110} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#14b8a6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Main Sandbox Page ─────────────────────────────────────────────────────────
export default function Sandbox() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("engine");
  const [sessionKey, setSessionKey] = useState(0);

  const handleNewSession = () => {
    setSessionKey(k => k + 1);
    setQuestions([]);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const companies = await base44.entities.Company.list();
        if (companies.length > 0) {
          setCompany(companies[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const refreshQuestions = () => {};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Sandbox</h1>
          <p className="text-sm text-gray-500">Live preview with feedback & training tools</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveTab("engine")}
            size="sm"
            style={activeTab === "engine"
              ? { background: "linear-gradient(to right, #2DC6FE, #81FBEF)", color: "#082D35", border: "none", borderRadius: "9999px" }
              : { background: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: "9999px" }
            }
          >
            <Eye className="w-4 h-4 mr-1.5" />
            Live Engine
          </Button>
          <Button
            onClick={() => setActiveTab("analytics")}
            size="sm"
            style={activeTab === "analytics"
              ? { background: "linear-gradient(to right, #2DC6FE, #81FBEF)", color: "#082D35", border: "none", borderRadius: "9999px" }
              : { background: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: "9999px" }
            }
          >
            <BarChart3 className="w-4 h-4 mr-1.5" />
            Analytics
          </Button>
          <Button
            onClick={() => navigate(createPageUrl("AnswerEngine"))}
            size="sm"
            style={{ background: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: "9999px" }}
          >
            <Settings className="w-4 h-4 mr-1.5" />
            Setup
          </Button>
        </div>
      </div>

      {activeTab === "engine" ? (
        /* ── Engine + Feedback Side-by-side ── */
        <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 73px)" }}>
          {/* iframe background + floating button */}
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=1600&h=900&fit=crop"
                alt="Website preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-white/10" />
            </div>

            {/* Floating Ask AI Button */}
            {!showPopup && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-4 right-4 z-10"
              >
                <Button
                  onClick={() => setShowPopup(true)}
                  className="shadow-lg"
                  style={{ background: "linear-gradient(to right,#2DC6FE,#81FBEF)", color: "#082D35", border: "none", borderRadius: "9999px" }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask AI
                </Button>
              </motion.div>
            )}

            {/* Popup Modal — always mounted to preserve session */}
            <div
              className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-black/30"
              style={{ display: showPopup ? "flex" : "none" }}
              onClick={() => setShowPopup(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full h-full max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl bg-white flex flex-col"
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white flex-shrink-0">
                  <span className="text-lg font-semibold text-gray-900">
                    {company?.name || "Answer Engine"}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleNewSession}
                      className="text-xs border-gray-300 text-gray-600"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                      New Session
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPopup(false)}
                      className="text-gray-400 hover:text-gray-900"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                {/* Chat */}
                <div className="flex-1 overflow-hidden">
                  <AnswerEngineChat key={sessionKey} onQuestionSaved={(q) => setQuestions(prev => [q, ...prev])} />
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Panel */}
          <div className="w-80 flex-shrink-0 bg-white overflow-hidden flex flex-col border-l border-gray-200">
            <FeedbackPanel questions={questions} onFeedbackSaved={refreshQuestions} />
          </div>
        </div>
      ) : (
        /* ── Analytics Tab ── */
        <div className="flex-1 overflow-y-auto">
          <SandboxAnalytics questions={questions} />
        </div>
      )}
    </div>
  );
}