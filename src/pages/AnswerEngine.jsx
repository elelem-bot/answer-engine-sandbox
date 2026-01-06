import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe,
  Loader2,
  Send,
  Search,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AnswerEngine() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const [isCrawled, setIsCrawled] = useState(false);
  const [crawlError, setCrawlError] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isAsking, setIsAsking] = useState(false);

  const handleCrawl = async () => {
    if (!websiteUrl || !websiteUrl.startsWith('http')) {
      setCrawlError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setIsCrawling(true);
    setCrawlError(null);
    
    try {
      // Fetch and index the website
      await base44.integrations.Core.InvokeLLM({
        prompt: `Crawl and index this website: ${websiteUrl}. Explore all pages and subpages. Confirm when ready.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            status: { type: "string" },
            pages_found: { type: "number" }
          }
        }
      });
      
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
        prompt: `You are an expert assistant answering questions about the website: ${websiteUrl}

Question: ${question}

Search the website and provide a detailed, accurate answer based ONLY on the content found on this website. If the information is not available on the website, say so clearly.

Cite specific pages or sections when relevant.`,
        add_context_from_internet: true
      });

      const assistantMessage = { role: "assistant", content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error asking question:", error);
      const errorMessage = { role: "assistant", content: "Sorry, I encountered an error processing your question. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Answer Engine</h1>
          <p className="text-slate-400">Turn any website into an intelligent Q&A system</p>
        </div>

        {/* Website Input */}
        <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  type="url"
                  placeholder="Enter website URL (e.g., https://example.com)"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  disabled={isCrawling || isCrawled}
                  className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
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
                    Ready
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Index Website
                  </>
                )}
              </Button>
            </div>

            {crawlError && (
              <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {crawlError}
              </div>
            )}

            {isCrawled && (
              <div className="mt-3 flex items-center gap-2">
                <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                  Website indexed and ready for questions
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCrawled(false);
                    setMessages([]);
                    setWebsiteUrl("");
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  Change Website
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Interface */}
        {isCrawled && (
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="pt-6">
              {/* Messages */}
              <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
                <AnimatePresence>
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-teal-400" />
                      </div>
                      <p className="text-slate-400">Ask any question about {new URL(websiteUrl).hostname}</p>
                      <p className="text-slate-500 text-sm mt-2">I'll search the website and provide accurate answers</p>
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
                          className={`max-w-[80%] rounded-lg p-4 ${
                            msg.role === "user"
                              ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                              : "bg-slate-900/50 text-slate-300 border border-slate-700/50"
                          }`}
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
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
                        <span className="text-slate-400">Searching website...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Question Input */}
              <form onSubmit={handleAskQuestion} className="flex gap-3">
                <Input
                  placeholder="Ask a question about this website..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={isAsking}
                  className="flex-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                />
                <Button
                  type="submit"
                  disabled={isAsking || !question.trim()}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}