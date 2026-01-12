import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe,
  Loader2,
  Send,
  Search,
  CheckCircle,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  List,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnswerEngine() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const [isCrawled, setIsCrawled] = useState(false);
  const [crawlError, setCrawlError] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isAsking, setIsAsking] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [brandColor, setBrandColor] = useState("#14b8a6");
  const [companyName, setCompanyName] = useState("");
  const [indexedContent, setIndexedContent] = useState("");
  const [crawlProgress, setCrawlProgress] = useState("");
  const [isInputCollapsed, setIsInputCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [askedQuestions, setAskedQuestions] = useState([]);
  const [company, setCompany] = useState(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('elelem-theme') || 'dark';
  });

  React.useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem('elelem-theme') || 'dark');
    };
    window.addEventListener('storage', handleThemeChange);
    const interval = setInterval(handleThemeChange, 100);
    return () => {
      window.removeEventListener('storage', handleThemeChange);
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    const loadCompanyUrl = async () => {
      try {
        const companies = await base44.entities.Company.list();
        if (companies.length > 0) {
          setCompany(companies[0]);
          if (companies[0].website_url) {
            setWebsiteUrl(companies[0].website_url);
          }
          loadQuestions(companies[0].id);
        }
      } catch (error) {
        console.error("Error loading company URL:", error);
      }
    };
    loadCompanyUrl();
  }, []);

  const loadQuestions = async (companyId) => {
    setIsLoadingQuestions(true);
    try {
      const questions = await base44.entities.AnswerEngineQuestion.filter({ 
        company_id: companyId 
      });
      setAskedQuestions(questions);
    } catch (error) {
      console.error("Error loading questions:", error);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setLogoUrl(file_url);
    }
  };

  const handleCrawl = async () => {
    if (!websiteUrl || !websiteUrl.startsWith('http')) {
      setCrawlError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setIsCrawling(true);
    setCrawlError(null);
    setCrawlProgress("Discovering pages...");
    
    try {
      // Crawl and index up to 100 pages
      const crawlResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `CRITICAL: You must comprehensively crawl and index this entire website: ${websiteUrl}

CRAWLING REQUIREMENTS:
1. Start from homepage: ${websiteUrl}
2. Systematically discover and visit ALL internal pages by following links
3. Visit UP TO 100 PAGES (or all pages if fewer than 100)
4. Include: /about, /products, /services, /blog, /resources, /pricing, /contact, etc.
5. Extract ALL text content from every page visited

For each page you visit:
- Extract the full page content (paragraphs, headings, lists)
- Remove only navigation menus, footers, and scripts
- Keep all valuable information: product descriptions, features, FAQs, blog posts, etc.

IMPORTANT: The content_summary must be COMPREHENSIVE and include content from ALL pages you crawled. This will be used to answer user questions, so more content = better answers.

Return JSON with:
- company_name: Brand/company name from website
- pages_crawled: ACTUAL number of pages you visited and indexed (should be close to 100 or all available pages)
- content_summary: EXTENSIVE combined text from ALL crawled pages (should be very long with lots of details)`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            company_name: { type: "string" },
            pages_crawled: { type: "number" },
            content_summary: { type: "string" }
          }
        }
      });
      
      setCompanyName(crawlResponse.company_name || new URL(websiteUrl).hostname);
      setIndexedContent(crawlResponse.content_summary || "");
      setCrawlProgress(`Indexed ${crawlResponse.pages_crawled || 0} pages`);
      setIsCrawled(true);
    } catch (error) {
      console.error("Error crawling website:", error);
      setCrawlError("Failed to crawl website. Please check the URL and try again.");
    } finally {
      setIsCrawling(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim() || !isCrawled) return;

    const userMessage = { role: "user", content: question };
    setMessages(prev => [...prev, userMessage]);
    setQuestion("");
    setIsAsking(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are the official customer support assistant for ${companyName}. Answer questions as if you ARE ${companyName}.

Website content knowledge:
${indexedContent}

User question: ${question}

GUARDRAILS:
- Answer naturally as ${companyName}, using "we" and "our" (not "they" or "the company")
- DO NOT mention "indexed content", "website content", or any data sources
- DO NOT include URLs, links, or source references
- DO NOT use markdown formatting (**, __, etc.) - use plain text only
- If you don't have the information, respond: "I'm afraid I can't answer that question at present. Would you like to speak with one of our sales representatives who can help?"
- Be helpful, friendly, and professional

Answer the question directly and conversationally.`,
      });

      // Clean up response - remove any remaining markdown and URLs
      const cleanedResponse = response
        .replace(/\*\*/g, '')
        .replace(/__|~~|`/g, '')
        .replace(/https?:\/\/[^\s]+/g, '')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

      const assistantMessage = { role: "assistant", content: cleanedResponse };
      setMessages(prev => [...prev, assistantMessage]);

      // Analyze and store the question
      if (company) {
        const analysis = await base44.integrations.Core.InvokeLLM({
          prompt: `Analyze this customer question and extract metadata:

Question: "${userMessage.content}"

Extract:
1. funnel_stage: "top" (awareness), "middle" (consideration), or "bottom" (decision)
2. keywords: 3-5 relevant keywords

Consider buyer intent when determining funnel stage.`,
          response_json_schema: {
            type: "object",
            properties: {
              funnel_stage: { type: "string", enum: ["top", "middle", "bottom"] },
              keywords: { type: "array", items: { type: "string" } }
            }
          }
        });

        const savedQuestion = await base44.entities.AnswerEngineQuestion.create({
          company_id: company.id,
          question: userMessage.content,
          answer: cleanedResponse,
          funnel_stage: analysis.funnel_stage,
          keywords: analysis.keywords || [],
          moved_to_prompts: false,
          source_tag: "REAL"
        });

        setAskedQuestions(prev => [savedQuestion, ...prev]);
      }
    } catch (error) {
      console.error("Error asking question:", error);
      const errorMessage = { role: "assistant", content: "Sorry, I encountered an error processing your question. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAsking(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen p-6 lg:p-8 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Answer Engine</h1>
          <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>Turn any website into an intelligent Q&A system</p>
        </div>

        {/* Website Input */}
        <Card className={isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-200'} mb-6>
          {isCrawled && (
            <div className="px-6 pt-4 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsInputCollapsed(!isInputCollapsed)}
                className={isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
              >
                {isInputCollapsed ? (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show Setup
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Hide Setup
                  </>
                )}
              </Button>
            </div>
          )}
          <AnimatePresence>
            {!isInputCollapsed && (
              <motion.div
                initial={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
                transition={{ duration: 0.3 }}
              >
          <CardContent className="pt-6 space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  type="url"
                  placeholder="Enter website URL (e.g., https://example.com)"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  disabled={isCrawling || isCrawled}
                  className={`pl-10 ${isDark ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'}`}
                />
              </div>
              <Button
                onClick={handleCrawl}
                disabled={isCrawling || isCrawled || !websiteUrl}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
              >
                {isCrawling ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Crawling...
                  </>
                ) : isCrawled ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Indexed
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Crawl & Index
                  </>
                )}
              </Button>
            </div>

            {isCrawling && crawlProgress && (
              <div className="text-teal-400 text-sm">{crawlProgress}</div>
            )}

            {crawlError && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {crawlError}
              </div>
            )}

            {isCrawled && (
              <>
                <div className="flex items-center gap-2">
                  <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                    {crawlProgress}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsCrawled(false);
                      setMessages([]);
                      setWebsiteUrl("");
                      setIndexedContent("");
                      setLogoUrl("");
                      setBrandColor("#14b8a6");
                    }}
                    className={isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                  >
                    Change Website
                  </Button>
                </div>

                {/* Brand Customization */}
                <div className="border-t border-slate-700 pt-4 grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Upload Logo</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className={`h-auto py-2 file:mr-4 file:px-4 file:py-2 file:rounded file:border-0 file:bg-teal-500 file:text-white file:cursor-pointer ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Brand Color</label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className={`w-20 h-10 cursor-pointer ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-300'}`}
                      />
                      <Input
                        type="text"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        placeholder="#14b8a6"
                        className={`flex-1 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Tabs for Chat and Questions */}
        {isCrawled && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className={isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-gray-200'}>
              <TabsTrigger value="chat" className={isDark ? 'data-[state=active]:bg-slate-700' : 'data-[state=active]:bg-gray-100'}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="questions" className={isDark ? 'data-[state=active]:bg-slate-700' : 'data-[state=active]:bg-gray-100'}>
                <List className="w-4 h-4 mr-2" />
                Questions ({askedQuestions.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* Branded Chat Interface */}
        {isCrawled && activeTab === "chat" && (
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-white">
            {/* Branded Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={companyName}
                    className="h-10 max-w-[200px] object-contain"
                  />
                ) : (
                  <span className="text-lg font-semibold text-slate-900">
                    {companyName}
                  </span>
                )}
              </div>
              <Badge className="text-xs bg-slate-100 text-slate-600 border-slate-200">
                {companyName} AI Answer Engine
              </Badge>
            </div>

            {/* Messages Container */}
            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto bg-white">
              <AnimatePresence>
                {messages.length === 0 ? (
                  <div className="text-center py-16">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{
                        backgroundColor: `${brandColor}15`
                      }}
                    >
                      <Search 
                        className="w-10 h-10"
                        style={{ color: brandColor }}
                      />
                    </div>
                    <h3 
                      className="text-xl font-semibold mb-2"
                      style={{ color: brandColor }}
                    >
                      How can I help you today?
                    </h3>
                    <p className="text-slate-600">Ask me anything about {companyName}</p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                          msg.role === "user"
                            ? "shadow-sm"
                            : "shadow-sm"
                        }`}
                        style={{
                          backgroundColor: msg.role === "user" 
                            ? brandColor
                            : '#f1f5f9',
                          color: msg.role === "user" ? '#ffffff' : '#1e293b'
                        }}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>

              {isAsking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-100 rounded-2xl px-5 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 
                        className="w-4 h-4 animate-spin"
                        style={{ color: brandColor }}
                      />
                      <span className="text-slate-600">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-white">
              <form onSubmit={handleAskQuestion} className="flex gap-3">
                <Input
                  placeholder={`Ask ${companyName} anything...`}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={isAsking}
                  className="flex-1 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 rounded-xl"
                  style={{
                    borderColor: '#cbd5e1',
                    '--tw-ring-color': brandColor
                  }}
                />
                <Button
                  type="submit"
                  disabled={isAsking || !question.trim()}
                  className="rounded-xl shadow-sm"
                  style={{
                    backgroundColor: brandColor,
                    color: '#ffffff'
                  }}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Questions List */}
        {isCrawled && activeTab === "questions" && (
          <Card className={isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-200'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingQuestions ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-teal-500 animate-spin mx-auto mb-2" />
                  <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>Loading questions...</p>
                </div>
              ) : askedQuestions.length === 0 ? (
                <p className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>No questions asked yet</p>
              ) : (
                <div className="space-y-3">
                  {askedQuestions.map((q, i) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`border rounded-lg p-4 ${isDark ? 'border-slate-700/50 bg-slate-900/50' : 'border-gray-200 bg-gray-50'}`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <p className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{q.question}</p>
                          <div className="flex gap-2 flex-wrap">
                            <Badge 
                              variant="outline"
                              className={`${
                                q.funnel_stage === "top"
                                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                  : q.funnel_stage === "middle"
                                  ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                                  : "bg-pink-500/20 text-pink-400 border-pink-500/30"
                              }`}
                            >
                              {q.funnel_stage.charAt(0).toUpperCase() + q.funnel_stage.slice(1)} Funnel
                            </Badge>
                            {q.keywords && q.keywords.slice(0, 3).map((keyword, j) => (
                              <Badge key={j} variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600/30">
                                {keyword}
                              </Badge>
                            ))}
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              REAL
                            </Badge>
                            {q.moved_to_prompts && (
                              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                                Added to Prompts
                              </Badge>
                            )}
                          </div>
                        </div>
                        {!q.moved_to_prompts && (
                          <Button
                            size="sm"
                            onClick={async () => {
                              try {
                                await base44.entities.PromptAnalysis.create({
                                  company_id: q.company_id,
                                  prompt: q.question,
                                  view_type: "prospect",
                                  funnel_stage: q.funnel_stage,
                                  keywords: q.keywords || [],
                                  search_signal_score: 0,
                                  elelem_score: 0,
                                  citations_count: 0,
                                  brand_mentions_count: 0,
                                  is_optimized: false,
                                  source_tag: "REAL"
                                });
                                
                                await base44.entities.AnswerEngineQuestion.update(q.id, {
                                  moved_to_prompts: true
                                });
                                
                                setAskedQuestions(prev => 
                                  prev.map(question => 
                                    question.id === q.id 
                                      ? { ...question, moved_to_prompts: true }
                                      : question
                                  )
                                );
                              } catch (error) {
                                console.error("Error moving to prompts:", error);
                              }
                            }}
                            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                          >
                            <ArrowRight className="w-4 h-4 mr-1" />
                            Move to Prompts
                          </Button>
                        )}
                      </div>
                      <div className={`text-sm pl-4 border-l-2 ${isDark ? 'text-slate-400 border-slate-700' : 'text-gray-600 border-gray-300'}`}>
                        {q.answer}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}