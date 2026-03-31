import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Loader2, Send, Search, CheckCircle, AlertCircle,
  ChevronUp, ChevronDown, MessageSquare, X, Plus, Paperclip,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

/**
 * Self-contained Answer Engine chat widget.
 * Props:
 *   onQuestionSaved(question) – called after each Q&A is persisted
 */
export default function AnswerEngineChat({ onQuestionSaved }) {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const [isCrawled, setIsCrawled] = useState(false);
  const [crawlError, setCrawlError] = useState(null);
  const [crawlProgress, setCrawlProgress] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isAsking, setIsAsking] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [indexedContent, setIndexedContent] = useState("");
  const [crawledPages, setCrawledPages] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [company, setCompany] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [brandColor, setBrandColor] = useState("#14b8a6");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendedPages, setRecommendedPages] = useState([]);
  const [bookingCta, setBookingCta] = useState("Talk to our team");
  const [showBookingPanel, setShowBookingPanel] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [ctaButtonText, setCtaButtonText] = useState("Book Demo");
  const [isSetupCollapsed, setIsSetupCollapsed] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [showPromptDropdown, setShowPromptDropdown] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const companies = await base44.entities.Company.list();
        if (companies.length > 0) {
          const c = companies[0];
          setCompany(c);
          if (c.website_url) setWebsiteUrl(c.website_url);
          if (c.name) setCompanyName(c.name);
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const companies = await base44.entities.Company.list();
        if (companies.length > 0) {
          const ps = await base44.entities.PromptAnalysis.filter({ company_id: companies[0].id });
          setPrompts(ps);
        }
      } catch (e) {}
    };
    loadPrompts();
  }, []);

  const handleCrawl = async () => {
    if (!websiteUrl || !websiteUrl.startsWith("http")) {
      setCrawlError("Please enter a valid URL starting with http:// or https://");
      return;
    }
    setIsCrawling(true);
    setCrawlError(null);
    setCrawlProgress("Step 1/3: Discovering URLs...");
    try {
      const urlDiscovery = await base44.integrations.Core.InvokeLLM({
        prompt: `Find as many page URLs as possible from: ${websiteUrl}
Use Google "site:${websiteUrl}", check sitemap.xml, homepage nav links, /about, /pricing, /contact, /blog, /products pages.
Return at least 20 absolute URLs from the same domain.
JSON: { "company_name": "...", "urls": ["..."] }`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            company_name: { type: "string" },
            urls: { type: "array", items: { type: "string" } }
          },
          required: ["company_name", "urls"]
        }
      });

      if (!urlDiscovery?.urls?.length) throw new Error("Failed to discover URLs.");
      setCompanyName(urlDiscovery.company_name || new URL(websiteUrl).hostname);
      setCrawlProgress(`Step 2/3: Found ${urlDiscovery.urls.length} URLs. Extracting content...`);

      const allPages = [];
      const batchSize = 5;
      const urlsToProcess = urlDiscovery.urls.slice(0, 50);
      for (let i = 0; i < urlsToProcess.length; i += batchSize) {
        const batch = urlsToProcess.slice(i, i + batchSize);
        setCrawlProgress(`Step 2/3: Processing pages ${i + 1}–${Math.min(i + batchSize, urlsToProcess.length)} of ${urlsToProcess.length}...`);
        const batchResp = await base44.integrations.Core.InvokeLLM({
          prompt: `Extract data from these URLs:\n${batch.map((u, idx) => `${idx + 1}. ${u}`).join("\n")}
For each: title, description (≤200 chars), image_url (absolute), content (≤500 chars).
JSON: { "pages": [{ "title":"","url":"","description":"","image_url":"","content":"" }] }`,
          add_context_from_internet: true,
          response_json_schema: {
            type: "object",
            properties: {
              pages: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" }, url: { type: "string" },
                    description: { type: "string" }, image_url: { type: "string" },
                    content: { type: "string" }
                  }
                }
              }
            }
          }
        });
        if (batchResp?.pages) allPages.push(...batchResp.pages);
      }

      if (!allPages.length) throw new Error("No pages could be processed.");
      setCrawlProgress(`Successfully indexed ${allPages.length} pages`);
      setIndexedContent(allPages.map(p => p.content || "").join("\n\n"));
      setCrawledPages(allPages);
      setIsCrawled(true);
      setIsSetupCollapsed(true);
    } catch (err) {
      setCrawlError(err.message || "Crawling failed.");
    } finally {
      setIsCrawling(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim() || !isCrawled) return;
    const userMessage = { role: "user", content: question, files: uploadedFiles };
    setMessages(prev => [...prev, userMessage]);
    const q = question;
    setQuestion("");
    const filesForCtx = uploadedFiles;
    setUploadedFiles([]);
    setIsAsking(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are the official customer support assistant for ${companyName}. Answer as if you ARE ${companyName}.
Website content: ${indexedContent}
User question: ${q}
GUARDRAILS: Use "we"/"our". No markdown. No URLs. If unknown, say "I'm afraid I can't answer that at present. Would you like to speak with one of our sales representatives?"`,
        file_urls: filesForCtx.length > 0 ? filesForCtx.map(f => f.url) : undefined
      });

      const cleaned = response.replace(/\*\*/g, "").replace(/__|~~|`/g, "").replace(/https?:\/\/[^\s]+/g, "").replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
      setStreamingText("");
      const words = cleaned.split(" ");
      let displayed = "";
      for (let i = 0; i < words.length; i++) {
        displayed += (i === 0 ? "" : " ") + words[i];
        setStreamingText(displayed);
        await new Promise(r => setTimeout(r, 30));
      }
      setStreamingText("");
      const assistantMessage = { role: "assistant", content: cleaned };
      setMessages(prev => [...prev, assistantMessage]);

      // CTA
      try {
        const ctaResp = await base44.integrations.Core.InvokeLLM({
          prompt: `Question: "${q}". Generate a short CTA (max 6 words) to book a demo. Return only the CTA text.`
        });
        setBookingCta(ctaResp);
      } catch {}

      // Recommendations
      if (crawledPages.length > 0) {
        try {
          const pageRecs = await base44.integrations.Core.InvokeLLM({
            prompt: `Recommend 2 most relevant pages for this question: "${q}"
Available: ${crawledPages.map((p, i) => `${i}. ${p.title} - ${p.url}`).join("\n")}
Return exactly 2 indices. JSON: { "page_indices": [n, n] }`,
            response_json_schema: {
              type: "object",
              properties: { page_indices: { type: "array", items: { type: "number" } } }
            }
          });
          let selected = (pageRecs.page_indices || []).slice(0, 2).map(idx => crawledPages[idx]).filter(Boolean);
          if (selected.length < 2 && crawledPages.length >= 2) {
            const used = new Set(pageRecs.page_indices || []);
            for (let i = 0; i < crawledPages.length && selected.length < 2; i++) {
              if (!used.has(i)) selected.push(crawledPages[i]);
            }
          }
          setRecommendedPages(selected.slice(0, 2));
          setShowRecommendations(true);
        } catch {}
      }

      // Save question
      if (company) {
        const analysis = await base44.integrations.Core.InvokeLLM({
          prompt: `Analyze this question and extract: funnel_stage ("top"/"middle"/"bottom") and 3-5 keywords. Question: "${q}"`,
          response_json_schema: {
            type: "object",
            properties: {
              funnel_stage: { type: "string", enum: ["top", "middle", "bottom"] },
              keywords: { type: "array", items: { type: "string" } }
            }
          }
        });
        const saved = await base44.entities.AnswerEngineQuestion.create({
          company_id: company.id,
          question: q,
          answer: cleaned,
          funnel_stage: analysis.funnel_stage,
          keywords: analysis.keywords || [],
          moved_to_prompts: false,
          source_tag: "REAL"
        });
        if (onQuestionSaved) onQuestionSaved(saved);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleVoiceInput = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];
        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const file = new File([blob], "voice.webm", { type: "audio/webm" });
          try {
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            const text = await base44.integrations.Core.InvokeLLM({ prompt: "Transcribe this audio. Return only the transcription.", file_urls: [file_url] });
            setQuestion(prev => prev + (prev ? " " : "") + text);
          } catch {}
          stream.getTracks().forEach(t => t.stop());
        };
        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch {}
    } else {
      mediaRecorder?.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setUploadedFiles(prev => [...prev, { name: file.name, url: file_url }]);
      } catch {}
    }
  };

  const handleBookDemo = async () => {
    if (!bookingName || !bookingEmail || !selectedTime) return;
    setIsBooking(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      alert(`Demo booked for ${bookingName} on ${selectedDate.toLocaleDateString()} at ${selectedTime}`);
      setBookingName(""); setBookingEmail(""); setSelectedTime(null); setShowBookingPanel(false);
    } catch {}
    setIsBooking(false);
  };

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Setup Bar */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 px-4 py-2">
          <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <Input
            type="url"
            placeholder="https://your-website.com"
            value={websiteUrl}
            onChange={e => setWebsiteUrl(e.target.value)}
            disabled={isCrawling}
            className="flex-1 h-8 text-sm bg-white border-gray-300"
          />
          <Button
            onClick={handleCrawl}
            disabled={isCrawling || !websiteUrl}
            size="sm"
            style={{ background: "linear-gradient(to right,#2DC6FE,#81FBEF)", color: "#082D35", border: "none", borderRadius: "9999px" }}
          >
            {isCrawling ? <Loader2 className="w-4 h-4 animate-spin" /> : isCrawled ? "Re-Index" : "Index"}
          </Button>
          {isCrawled && (
            <Badge className="bg-green-500/15 text-green-700 border-green-300 text-xs whitespace-nowrap">
              <CheckCircle className="w-3 h-3 mr-1" />{crawlProgress.replace("Successfully indexed ", "").replace(" pages", "p")}
            </Badge>
          )}
        </div>
        {isCrawling && <div className="px-4 pb-2 text-xs text-teal-600">{crawlProgress}</div>}
        {crawlError && <div className="px-4 pb-2 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{crawlError}</div>}
      </div>

      {/* Chat Area */}
      {!isCrawled ? (
        <div className="flex-1 flex items-center justify-center text-center p-8">
          <div>
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium text-gray-600">Index your website to start chatting</p>
            <p className="text-sm text-gray-400 mt-1">Enter your URL above and click Index</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Messages */}
          <div className={`flex flex-col transition-all ${showBookingPanel ? "w-[65%]" : "w-full"}`}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${brandColor}15` }}>
                    <MessageSquare className="w-8 h-8" style={{ color: brandColor }} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">How can I help you today?</h3>
                  <p className="text-sm text-gray-500 mt-1">Ask me anything about {companyName}</p>
                </div>
              )}
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "user" ? (
                      <div className="max-w-[75%] rounded-2xl px-4 py-2.5 bg-gray-100 text-gray-900">
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    ) : (
                      <div className="w-full">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isAsking && !streamingText && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: brandColor }} />Thinking...
                </div>
              )}
              {streamingText && (
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {streamingText}<span className="inline-block w-0.5 h-4 bg-gray-400 ml-0.5 animate-pulse" />
                </p>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-3">
              {uploadedFiles.length > 0 && (
                <div className="flex gap-2 mb-2 flex-wrap">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1 text-xs text-gray-700">
                      <Paperclip className="w-3 h-3" />{f.name}
                      <button onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))}><X className="w-3 h-3 ml-1 text-gray-400" /></button>
                    </div>
                  ))}
                </div>
              )}
              {/* Prompts Dropdown */}
              {showPromptDropdown && prompts.length > 0 && (
                <div className="mb-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-52 overflow-y-auto">
                  {prompts.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setQuestion(p.prompt); setShowPromptDropdown(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center gap-2"
                    >
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 flex-shrink-0">{p.funnel_stage || 'top'}</span>
                      <span className="line-clamp-1">{p.prompt}</span>
                    </button>
                  ))}
                </div>
              )}
              <form onSubmit={handleAskQuestion}>
              <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 gap-2 shadow-sm mb-2">
                  <button
                    type="button"
                    onClick={() => setShowPromptDropdown(v => !v)}
                    title="Browse prompts"
                    className="text-gray-400 hover:text-gray-700 text-xs font-medium px-1"
                  >
                    Prompts ▾
                  </button>
                  <Input
                    placeholder="Search prompts..."
                    value=""
                    readOnly
                    onClick={() => setShowPromptDropdown(v => !v)}
                    className="flex-1 border-0 bg-transparent text-xs text-gray-400 cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0 px-1"
                  />
              </div>
                <div className="flex items-center bg-white border border-gray-300 rounded-full px-3 gap-2 shadow-sm">
                  <button type="button" onClick={() => document.getElementById("ae-file-upload").click()} className="text-gray-400 hover:text-gray-700">
                    <Plus className="w-4 h-4" />
                  </button>
                  <Input
                    placeholder={`Ask ${companyName} anything...`}
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    disabled={isAsking}
                    className="flex-1 border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-1"
                  />

                  {question.trim() && (
                    <button type="submit" disabled={isAsking} style={{ color: brandColor }}>
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Recommendations */}
            <AnimatePresence>
              {showRecommendations && recommendedPages.length > 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-200 bg-white overflow-hidden">
                  <div className="px-4 py-3 flex items-start gap-3">
                    <span className="text-xs text-gray-600 font-medium pt-3 whitespace-nowrap">You might also like:</span>
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      {recommendedPages.slice(0, 2).map((page, i) => (
                        <a key={i} href={page.url} target="_blank" rel="noopener noreferrer"
                          className="rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group overflow-hidden flex flex-row">
                          <div className="w-16 self-stretch flex-shrink-0 overflow-hidden bg-gray-100">
                            <img
                              src={page.image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&h=80&fit=crop"}
                              alt={page.title}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&h=80&fit=crop"; }}
                            />
                          </div>
                          <div className="p-2 flex flex-col justify-center">
                            <p className="text-xs font-semibold text-gray-900 line-clamp-1 group-hover:text-teal-600 transition-colors mb-1">{page.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{page.description}</p>
                          </div>
                        </a>
                      ))}
                      <div className="p-2 rounded-lg bg-gray-50 border border-gray-200 flex flex-col items-center justify-center gap-1.5">
                        <span className="text-xs text-gray-700 font-medium text-center leading-snug line-clamp-2">{bookingCta}</span>
                        <button
                          onClick={() => setShowBookingPanel(true)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap text-white"
                          style={{ backgroundColor: brandColor }}
                        >
                          {ctaButtonText}
                        </button>
                      </div>
                    </div>
                    <button onClick={() => setShowRecommendations(false)} className="flex-shrink-0 mt-1"><X className="w-3.5 h-3.5 text-gray-400" /></button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {!showRecommendations && recommendedPages.length > 0 && (
              <div className="px-4 py-1.5 border-t border-gray-200 bg-gray-50">
                <button onClick={() => setShowRecommendations(true)} className="w-full text-xs text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1">
                  <ChevronUp className="w-3.5 h-3.5" /> Show Recommendations
                </button>
              </div>
            )}
          </div>

          {/* Booking Panel */}
          <AnimatePresence>
            {showBookingPanel && (
              <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: "35%", opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                className="border-l border-gray-200 bg-gray-50 flex flex-col overflow-hidden flex-shrink-0">
                <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Book a Demo</h3>
                  <button onClick={() => setShowBookingPanel(false)}><X className="w-4 h-4 text-gray-400" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate}
                    disabled={date => date < new Date()} className="rounded border border-gray-200 bg-white text-xs scale-90 origin-top" />
                  <div className="grid grid-cols-2 gap-1.5">
                    {timeSlots.map(t => (
                      <Button key={t} size="sm" variant={selectedTime === t ? "default" : "outline"} onClick={() => setSelectedTime(t)}
                        className="text-xs h-7"
                        style={selectedTime === t ? { backgroundColor: brandColor, borderColor: brandColor, color: "#fff" } : {}}>
                        {t}
                      </Button>
                    ))}
                  </div>
                  <Input placeholder="Your name" value={bookingName} onChange={e => setBookingName(e.target.value)} className="text-sm" />
                  <Input type="email" placeholder="your@email.com" value={bookingEmail} onChange={e => setBookingEmail(e.target.value)} className="text-sm" />
                  <Button onClick={handleBookDemo} disabled={!bookingName || !bookingEmail || !selectedTime || isBooking}
                    className="w-full text-sm" style={{ backgroundColor: brandColor, color: "#fff" }}>
                    {isBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Book Demo"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}