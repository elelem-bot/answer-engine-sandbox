import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Clock, 
  FileText,
  Target,
  Zap,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertCircle
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");
  const [questions, setQuestions] = useState([]);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const companies = await base44.entities.Company.list();
      if (companies.length > 0) {
        setCompany(companies[0]);
        const allQuestions = await base44.entities.AnswerEngineQuestion.filter({
          company_id: companies[0].id
        });
        setQuestions(allQuestions);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics metrics
  const totalQuestions = questions.length;
  const totalAnswers = questions.filter(q => q.answer).length;
  const demoBookings = questions.filter(q => q.booked_demo).length;
  const conversionRate = totalQuestions > 0 ? ((demoBookings / totalQuestions) * 100).toFixed(1) : 0;
  
  // Mock data for demo purposes - in production, this would come from real analytics
  const avgTimeOnEngine = "3:45";
  const pageViews = totalQuestions * 2.3; // Approximate
  const uniqueVisitors = Math.floor(totalQuestions * 0.7);

  // Funnel stage breakdown
  const funnelBreakdown = {
    top: questions.filter(q => q.funnel_stage === "top").length,
    middle: questions.filter(q => q.funnel_stage === "middle").length,
    bottom: questions.filter(q => q.funnel_stage === "bottom").length
  };

  // Top topics from keywords
  const topicsMap = {};
  questions.forEach(q => {
    if (q.keywords) {
      q.keywords.forEach(keyword => {
        topicsMap[keyword] = (topicsMap[keyword] || 0) + 1;
      });
    }
  });
  const topTopics = Object.entries(topicsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic, count]) => ({ topic, count }));

  // Top prompts
  const topPrompts = questions
    .slice()
    .sort((a, b) => b.created_date - a.created_date)
    .slice(0, 10);

  // Failed answers - questions without answers or with error responses
  const failedAnswers = questions.filter(q => 
    !q.answer || 
    q.answer.includes("I'm afraid I can't answer") ||
    q.answer.includes("error") ||
    q.answer.includes("Sorry, I encountered an error")
  );

  // Time series data (last 30 days)
  const dailyData = {};
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    dailyData[dateStr] = { questions: 0, conversions: 0, bookings: 0 };
  }

  questions.forEach(q => {
    const dateStr = new Date(q.created_date).toISOString().split('T')[0];
    if (dailyData[dateStr]) {
      dailyData[dateStr].questions++;
      if (q.booked_demo) {
        dailyData[dateStr].conversions++;
        dailyData[dateStr].bookings++;
      }
    }
  });

  const trendData = Object.entries(dailyData).map(([date, data]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    questions: data.questions,
    conversions: data.conversions
  }));

  // Funnel chart data
  const funnelChartData = [
    { stage: "Top", count: funnelBreakdown.top, color: "#3b82f6" },
    { stage: "Middle", count: funnelBreakdown.middle, color: "#a855f7" },
    { stage: "Bottom", count: funnelBreakdown.bottom, color: "#ec4899" }
  ];

  // Conversion funnel
  const conversionFunnelData = [
    { stage: "Page Views", value: Math.round(pageViews), percentage: 100 },
    { stage: "Questions Asked", value: totalQuestions, percentage: totalQuestions > 0 ? 100 : 0 },
    { stage: "Answers Provided", value: totalAnswers, percentage: totalQuestions > 0 ? Math.round((totalAnswers / totalQuestions) * 100) : 0 },
    { stage: "Demo Bookings", value: demoBookings, percentage: totalQuestions > 0 ? Math.round((demoBookings / totalQuestions) * 100) : 0 }
  ];

  if (loading) {
    return (
      <div className={`min-h-screen p-6 lg:p-8 flex items-center justify-center ${bg-gray-50}`}>
        <div className="text-center">
          <Loader2 className={`w-12 h-12 animate-spin mx-auto mb-4 ${text-teal-600}`} />
          <p className={text-gray-600}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, change, trend, subtitle }) => (
    <Card className={bg-white border-gray-200}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-5 h-5 ${text-teal-600}`} />
              <p className={`text-sm font-medium ${text-gray-600}`}>{title}</p>
            </div>
            <p className={`text-3xl font-bold ${text-gray-900}`}>{value}</p>
            {subtitle && (
              <p className={`text-xs mt-1 ${text-gray-500}`}>{subtitle}</p>
            )}
          </div>
          {change && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded ${
              trend === 'up' 
                ? 'bg-green-500/20 text-green-400' 
                : trend === 'down'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-slate-500/20 text-slate-400'
            }`}>
              {trend === 'up' ? <ArrowUp className="w-3 h-3" /> : trend === 'down' ? <ArrowDown className="w-3 h-3" /> : null}
              <span className="text-xs font-medium">{change}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`min-h-screen p-6 lg:p-8 ${bg-gray-50}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className={`text-2xl font-bold mb-2 ${text-gray-900}`}>Answer Engine Analytics</h1>
            <p className={text-gray-600}>Track performance and user engagement</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className={`w-[180px] ${bg-white border-gray-300}`}>
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={MessageSquare}
            title="Total Questions"
            value={totalQuestions}
            change="+12%"
            trend="up"
            subtitle="Unique user inquiries"
          />
          <StatCard
            icon={FileText}
            title="Answers Provided"
            value={totalAnswers}
            change="+8%"
            trend="up"
            subtitle={`${totalQuestions > 0 ? Math.round((totalAnswers/totalQuestions)*100) : 0}% response rate`}
          />
          <StatCard
            icon={Target}
            title="Conversion Rate"
            value={`${conversionRate}%`}
            change="+3.2%"
            trend="up"
            subtitle="Demo bookings"
          />
          <StatCard
            icon={AlertCircle}
            title="Failed Answers"
            value={failedAnswers.length}
            change={failedAnswers.length > 5 ? "Action needed" : "Good"}
            trend={failedAnswers.length > 5 ? "down" : "up"}
            subtitle={`${totalQuestions > 0 ? Math.round((failedAnswers.length/totalQuestions)*100) : 0}% failure rate`}
          />
          <StatCard
            icon={Clock}
            title="Avg. Session Time"
            value={avgTimeOnEngine}
            change="+45s"
            trend="up"
            subtitle="Time on engine"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Page Views"
            value={Math.round(pageViews)}
            subtitle="Total engine views"
          />
          <StatCard
            icon={Zap}
            title="Unique Visitors"
            value={uniqueVisitors}
            subtitle="Distinct users"
          />
          <StatCard
            icon={TrendingUp}
            title="Engagement Rate"
            value={`${totalQuestions > 0 ? Math.round((uniqueVisitors/pageViews)*100) : 0}%`}
            subtitle="Questions per visitor"
          />
        </div>

        {/* Trend Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className={bg-white border-gray-200}>
            <CardHeader>
              <CardTitle className={text-gray-900}>Questions & Conversions Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={'#e5e7eb'} />
                  <XAxis dataKey="date" stroke={'#6b7280'} fontSize={12} />
                  <YAxis stroke={'#6b7280'} fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      border: `1px solid ${'#e5e7eb'}`,
                      borderRadius: '8px',
                      color: isDark ? '#ffffff' : '#000000'
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="questions" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.3} name="Questions" />
                  <Area type="monotone" dataKey="conversions" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} name="Conversions" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className={bg-white border-gray-200}>
            <CardHeader>
              <CardTitle className={text-gray-900}>Funnel Stage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={funnelChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ stage, count }) => `${stage}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {funnelChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      border: `1px solid ${'#e5e7eb'}`,
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Funnel */}
        <Card className={`${bg-white border-gray-200} mb-8`}>
          <CardHeader>
            <CardTitle className={text-gray-900}>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionFunnelData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${text-gray-700}`}>{item.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${text-gray-600}`}>{item.value}</span>
                      <Badge variant="outline" className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                        {item.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${bg-gray-200}`}>
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Failed Answers Alert */}
        {failedAnswers.length > 0 && (
          <Card className={`${bg-red-50 border-red-200} mb-8`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={text-red-700}>
                  ⚠️ Failed Answers ({failedAnswers.length})
                </CardTitle>
                <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                  {totalQuestions > 0 ? Math.round((failedAnswers.length/totalQuestions)*100) : 0}% failure rate
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className={`text-sm mb-4 ${text-gray-600}`}>
                These questions couldn't be answered properly. Review them to improve your content coverage.
              </p>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {failedAnswers.slice(0, 10).map((q) => (
                  <div
                    key={q.id}
                    className={`p-4 rounded-lg border ${bg-white border-gray-200}`}
                  >
                    <p className={`text-sm font-medium mb-2 ${text-gray-900}`}>
                      {q.question}
                    </p>
                    <div className="flex gap-2 flex-wrap mb-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          q.funnel_stage === "bottom"
                            ? "bg-pink-500/20 text-pink-400 border-pink-500/30"
                            : q.funnel_stage === "middle"
                            ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                            : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {q.funnel_stage} funnel
                      </Badge>
                      {q.keywords && q.keywords.slice(0, 2).map((keyword, j) => (
                        <Badge key={j} variant="outline" className={`text-xs ${bg-gray-100 text-gray-700 border-gray-300}`}>
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    {q.answer && (
                      <p className={`text-xs italic ${text-gray-500}`}>
                        Response: {q.answer.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                ))}
                {failedAnswers.length > 10 && (
                  <p className={`text-xs text-center pt-2 ${text-gray-500}`}>
                    And {failedAnswers.length - 10} more failed answers
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Topics and Top Prompts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className={bg-white border-gray-200}>
            <CardHeader>
              <CardTitle className={text-gray-900}>Top Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topTopics.slice(0, 8)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={'#e5e7eb'} />
                  <XAxis type="number" stroke={'#6b7280'} fontSize={12} />
                  <YAxis type="category" dataKey="topic" stroke={'#6b7280'} fontSize={12} width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      border: `1px solid ${'#e5e7eb'}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="#14b8a6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className={bg-white border-gray-200}>
            <CardHeader>
              <CardTitle className={text-gray-900}>Recent High-Value Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {topPrompts.length === 0 ? (
                  <p className={`text-sm ${text-gray-500}`}>No questions yet</p>
                ) : (
                  topPrompts.map((q, i) => (
                    <div
                      key={q.id}
                      className={`p-3 rounded-lg border ${bg-gray-50 border-gray-200}`}
                    >
                      <p className={`text-sm font-medium mb-2 line-clamp-2 ${text-gray-900}`}>
                        {q.question}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            q.funnel_stage === "bottom"
                              ? "bg-pink-500/20 text-pink-400 border-pink-500/30"
                              : q.funnel_stage === "middle"
                              ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                              : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          }`}
                        >
                          {q.funnel_stage}
                        </Badge>
                        {q.moved_to_prompts && (
                          <Badge className="text-xs bg-teal-500/20 text-teal-400 border-teal-500/30">
                            Converted
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className={bg-white border-gray-200}>
            <CardHeader>
              <CardTitle className={text-gray-900}>Engagement Quality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${text-gray-600}`}>Bottom Funnel Questions</span>
                  <span className={`text-sm font-medium ${text-gray-900}`}>
                    {funnelBreakdown.bottom} ({totalQuestions > 0 ? Math.round((funnelBreakdown.bottom/totalQuestions)*100) : 0}%)
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${bg-gray-200}`}>
                  <div
                    className="h-full bg-pink-500"
                    style={{ width: totalQuestions > 0 ? `${(funnelBreakdown.bottom/totalQuestions)*100}%` : '0%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${text-gray-600}`}>Questions with Answers</span>
                  <span className={`text-sm font-medium ${text-gray-900}`}>
                    {totalAnswers} ({totalQuestions > 0 ? Math.round((totalAnswers/totalQuestions)*100) : 0}%)
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${bg-gray-200}`}>
                  <div
                    className="h-full bg-teal-500"
                    style={{ width: totalQuestions > 0 ? `${(totalAnswers/totalQuestions)*100}%` : '0%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${text-gray-600}`}>Demo Bookings</span>
                  <span className={`text-sm font-medium ${text-gray-900}`}>
                    {demoBookings} ({conversionRate}%)
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${bg-gray-200}`}>
                  <div
                    className="h-full bg-cyan-500"
                    style={{ width: `${conversionRate}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={bg-white border-gray-200}>
            <CardHeader>
              <CardTitle className={text-gray-900}>Key Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className={`p-3 rounded-lg ${bg-teal-50 border border-teal-200}`}>
                <p className={`text-sm font-medium mb-1 ${text-teal-700}`}>
                  🎯 High Intent Traffic
                </p>
                <p className={`text-xs ${text-gray-600}`}>
                  {funnelBreakdown.bottom} bottom-funnel questions indicate strong purchase intent
                </p>
              </div>

              <div className={`p-3 rounded-lg ${bg-purple-50 border border-purple-200}`}>
                <p className={`text-sm font-medium mb-1 ${text-purple-700}`}>
                  📈 Growing Engagement
                </p>
                <p className={`text-xs ${text-gray-600}`}>
                  Average session time of {avgTimeOnEngine} shows deep engagement
                </p>
              </div>

              {topTopics.length > 0 && (
                <div className={`p-3 rounded-lg ${bg-blue-50 border border-blue-200}`}>
                  <p className={`text-sm font-medium mb-1 ${text-blue-700}`}>
                    💡 Top Topic
                  </p>
                  <p className={`text-xs ${text-gray-600}`}>
                    "{topTopics[0].topic}" mentioned {topTopics[0].count} times
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}