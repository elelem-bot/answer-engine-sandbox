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
  const [brandData, setBrandData] = useState(null);

  const handleCrawl = async () => {
    if (!websiteUrl || !websiteUrl.startsWith('http')) {
      setCrawlError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setIsCrawling(true);
    setCrawlError(null);
    
    try {
      // First, fetch the actual website HTML
      const websiteContent = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(websiteUrl)}`)
        .then(res => res.text());
      
      // Extract brand data from the actual HTML content
      const brandResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this website HTML and extract brand identity:

Website URL: ${websiteUrl}
HTML Content:
${websiteContent.substring(0, 15000)}

Extract the following in JSON format:

1. logo_url: Find the logo image URL from:
   - <img> tags with "logo" in class/id/alt/src
   - <svg> in header (if SVG, return null, we'll use company name)
   - Look in <header>, <nav>, or top of <body>
   - Convert relative URLs to absolute (prepend ${websiteUrl} if URL starts with /)
   - Must be complete URL starting with http:// or https://

2. primary_color: Extract main brand color:
   - Look for style attributes with background-color or color
   - Common in nav, header, primary buttons
   - Extract hex code (e.g., #1e40af)
   - Look for CSS variables like --primary-color
   
3. secondary_color: Secondary color:
   - Accent colors in buttons, links
   - Extract hex code
   
4. font_family: Main font:
   - Look for <link> tags loading Google Fonts
   - font-family in style attributes
   - Common fonts like Inter, Roboto, etc.
   
5. company_name: Brand name from:
   - <title> tag
   - <h1> or logo alt text
   - <meta property="og:site_name">

Return actual extracted data from the HTML provided.`,
        response_json_schema: {
          type: "object",
          properties: {
            logo_url: { type: "string" },
            primary_color: { type: "string" },
            secondary_color: { type: "string" },
            font_family: { type: "string" },
            company_name: { type: "string" }
          }
        }
      });
      
      // Clean up URLs and validate data
      let logoUrl = brandResponse.logo_url;
      if (logoUrl && logoUrl.startsWith('/')) {
        const baseUrl = new URL(websiteUrl);
        logoUrl = `${baseUrl.origin}${logoUrl}`;
      }
      
      const cleanedBrandData = {
        logo_url: logoUrl?.startsWith('http') ? logoUrl : null,
        primary_color: brandResponse.primary_color?.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/)?.[0] || '#0f172a',
        secondary_color: brandResponse.secondary_color?.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/)?.[0] || '#f8fafc',
        font_family: brandResponse.font_family || 'system-ui, -apple-system, sans-serif',
        company_name: brandResponse.company_name || new URL(websiteUrl).hostname
      };
      
      setBrandData(cleanedBrandData);
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
                    setBrandData(null);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  Change Website
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Branded Chat Interface */}
        {isCrawled && brandData && (
          <div 
            className="rounded-2xl overflow-hidden shadow-2xl bg-white"
            style={{
              fontFamily: brandData.font_family || 'inherit'
            }}
          >
            {/* Branded Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                {brandData.logo_url && (
                  <img 
                    src={brandData.logo_url} 
                    alt={brandData.company_name}
                    className="h-10 max-w-[200px] object-contain"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                {!brandData.logo_url && (
                  <span className="text-lg font-semibold text-slate-900">
                    {brandData.company_name || new URL(websiteUrl).hostname}
                  </span>
                )}
              </div>
              <Badge className="text-xs bg-slate-100 text-slate-600 border-slate-200">
                Powered by AI
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
                        backgroundColor: `${brandData.primary_color || '#14b8a6'}15`
                      }}
                    >
                      <Search 
                        className="w-10 h-10"
                        style={{ color: brandData.primary_color || '#14b8a6' }}
                      />
                    </div>
                    <h3 
                      className="text-xl font-semibold mb-2"
                      style={{ color: brandData.primary_color || '#0f172a' }}
                    >
                      How can I help you today?
                    </h3>
                    <p className="text-slate-600">Ask me anything about {brandData.company_name || new URL(websiteUrl).hostname}</p>
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
                            ? brandData.primary_color || '#14b8a6'
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
                        style={{ color: brandData.primary_color || '#14b8a6' }}
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
                  placeholder={`Ask ${brandData.company_name || 'us'} anything...`}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={isAsking}
                  className="flex-1 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 rounded-xl"
                  style={{
                    borderColor: '#cbd5e1',
                    '--tw-ring-color': brandData.primary_color || '#14b8a6'
                  }}
                />
                <Button
                  type="submit"
                  disabled={isAsking || !question.trim()}
                  className="rounded-xl shadow-sm"
                  style={{
                    backgroundColor: brandData.primary_color || '#14b8a6',
                    color: '#ffffff'
                  }}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}