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
  ArrowRight,
  X,
  Plus,
  Mic,
  Paperclip,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AnswerEngine() {
  const navigate = useNavigate();
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendedPages, setRecommendedPages] = useState([]);
  const [showBookingPanel, setShowBookingPanel] = useState(false);
  const [crawledPages, setCrawledPages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [bookingCta, setBookingCta] = useState("Talk to our team");
  const [showAnswerEngine, setShowAnswerEngine] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [buttonText, setButtonText] = useState("Book Demo");
  const [buttonSize, setButtonSize] = useState("sm");
  const [buttonShape, setButtonShape] = useState("rounded");

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

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [];

    for (const file of files) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploadedUrls.push({ name: file.name, url: file_url, type: file.type });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    setUploadedFiles(prev => [...prev, ...uploadedUrls]);
  };

  const handleVoiceInput = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const audioChunks = [];

        recorder.ondataavailable = (e) => {
          audioChunks.push(e.data);
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          const audioFile = new File([audioBlob], 'voice.webm', { type: 'audio/webm' });

          try {
            const { file_url } = await base44.integrations.Core.UploadFile({ file: audioFile });
            const transcription = await base44.integrations.Core.InvokeLLM({
              prompt: "Transcribe this audio to text. Return only the transcription, no other text.",
              file_urls: [file_url]
            });
            setQuestion(prev => prev + (prev ? ' ' : '') + transcription);
          } catch (error) {
            console.error("Error transcribing audio:", error);
          }

          stream.getTracks().forEach(track => track.stop());
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      if (mediaRecorder) {
        mediaRecorder.stop();
        setIsRecording(false);
        setMediaRecorder(null);
      }
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

  const handleScreenshotUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setScreenshotUrl(file_url);
    }
  };

  const handleCrawl = async () => {
    if (!websiteUrl || !websiteUrl.startsWith('http')) {
      setCrawlError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setIsCrawling(true);
    setCrawlError(null);
    setCrawlProgress("Step 1/3: Discovering URLs from sitemap and search...");

    try {
      // Step 1: Discover all URLs - Simplified approach
      const urlDiscovery = await base44.integrations.Core.InvokeLLM({
        prompt: `You need to find as many page URLs as possible from the website: ${websiteUrl}

INSTRUCTIONS:
1. Use Google search with "site:${websiteUrl}" to find ALL pages indexed by Google
2. Try to access ${websiteUrl}/sitemap.xml and extract URLs from it
3. Visit the homepage ${websiteUrl} and extract all internal navigation links
4. Look for common pages like /about, /pricing, /contact, /blog, /products, /features, /solutions
5. Find blog posts, case studies, documentation pages

IMPORTANT:
- You MUST return at least 20 URLs minimum
- Include the full absolute URL starting with http:// or https://
- Only include pages from the same domain (${websiteUrl})
- Extract the company name from the website

Return this exact JSON format:
{
  "company_name": "Company Name Here",
  "urls": ["https://example.com/page1", "https://example.com/page2", ...]
}

Make sure urls is an array with at least 20 full URLs.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            company_name: { type: "string" },
            urls: { 
              type: "array", 
              items: { type: "string" },
              minItems: 1
            }
          },
          required: ["company_name", "urls"]
        }
      });

      console.log("URL Discovery Response:", urlDiscovery);

      if (!urlDiscovery?.urls || urlDiscovery.urls.length === 0) {
        throw new Error(`Failed to discover URLs. Please check if the website is accessible. Website: ${websiteUrl}`);
      }

      setCompanyName(urlDiscovery.company_name || new URL(websiteUrl).hostname);
      setCrawlProgress(`Step 2/3: Found ${urlDiscovery.urls.length} URLs. Extracting content from pages...`);

      // Step 2: Process URLs in batches of 5
      const allPages = [];
      const batchSize = 5;
      const urlsToProcess = urlDiscovery.urls.slice(0, 50); // Limit to 50 total

      for (let i = 0; i < urlsToProcess.length; i += batchSize) {
        const batch = urlsToProcess.slice(i, i + batchSize);
        setCrawlProgress(`Step 2/3: Processing pages ${i + 1}-${Math.min(i + batchSize, urlsToProcess.length)} of ${urlsToProcess.length}...`);

        const batchResponse = await base44.integrations.Core.InvokeLLM({
          prompt: `Extract data from these ${batch.length} URLs. Use internet access.

      URLs:
      ${batch.map((url, idx) => `${idx + 1}. ${url}`).join('\n')}

      For each URL, extract:
      - title (from <title> tag)
      - description (1-2 sentences, max 200 chars)
      - image_url (from og:image meta tag or first img, must be absolute URL starting with http)
      - content (main text, max 500 chars)

      Return valid JSON only:
      {
      "pages": [
      {"title": "...", "url": "...", "description": "...", "image_url": "...", "content": "..."}
      ]
      }`,
          add_context_from_internet: true,
          response_json_schema: {
            type: "object",
            properties: {
              pages: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    url: { type: "string" },
                    description: { type: "string" },
                    image_url: { type: "string" },
                    content: { type: "string" }
                  }
                }
              }
            }
          }
        });

        if (batchResponse?.pages) {
          allPages.push(...batchResponse.pages);
        }
      }

      if (allPages.length === 0) {
        throw new Error("No pages could be processed");
      }

      setCrawlProgress(`Step 3/3: Finalizing ${allPages.length} pages...`);

      // Combine all content
      const combinedContent = allPages.map(p => p.content || '').join('\n\n');

      setIndexedContent(combinedContent);
      setCrawledPages(allPages);
      setCrawlProgress(`Successfully indexed ${allPages.length} pages`);
      setIsCrawled(true);
    } catch (error) {
      console.error("Error crawling website:", error);
      setCrawlError(error.message || "Crawling failed. The website may be blocking automated access or the URL is invalid.");
    } finally {
      setIsCrawling(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim() || !isCrawled) return;

    const userMessage = { role: "user", content: question, files: uploadedFiles };
    setMessages(prev => [...prev, userMessage]);
    setQuestion("");
    const filesForContext = uploadedFiles;
    setUploadedFiles([]);
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
        file_urls: filesForContext.length > 0 ? filesForContext.map(f => f.url) : undefined
      });

      // Clean up response - remove any remaining markdown and URLs
      const cleanedResponse = response
        .replace(/\*\*/g, '')
        .replace(/__|~~|`/g, '')
        .replace(/https?:\/\/[^\s]+/g, '')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

      const assistantMessage = { role: "assistant", content: cleanedResponse };
      setMessages(prev => [...prev, assistantMessage]);

      // Generate contextual booking CTA
      try {
        const ctaResponse = await base44.integrations.Core.InvokeLLM({
          prompt: `Based on this question: "${question}"

      Generate a short, compelling call-to-action message (max 6 words) that encourages the user to book a demo.

      Examples:
      - "How much does it cost?" → "Talk to our team about pricing"
      - "Can it integrate with Salesforce?" → "Discuss integrations with our team"
      - "What features do you have?" → "See a personalized demo"
      - "Is there a free trial?" → "Explore trial options with us"

      Return only the CTA text, nothing else.`
        });
        setBookingCta(ctaResponse);
      } catch (err) {
        console.error("Failed to generate CTA:", err);
      }

      // Extract recommended pages based on conversation
      if (messages.length >= 0 && crawledPages.length > 0) {
        try {
          const pageRecs = await base44.integrations.Core.InvokeLLM({
            prompt: `Based on this conversation, recommend exactly 2 most relevant pages from the crawled pages.

        Available pages:
        ${crawledPages.map((p, i) => `${i}. ${p.title} - ${p.url}`).join('\n')}

        Recent conversation:
        ${messages.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}
        User: ${question}
        Assistant: ${cleanedResponse}

        Return exactly 2 page indices (0-${crawledPages.length - 1}). Example: [0, 5]`,
            response_json_schema: {
              type: "object",
              properties: {
                page_indices: {
                  type: "array",
                  items: { type: "number" },
                  minItems: 2,
                  maxItems: 2
                }
              }
            }
          });

          let selectedPages = (pageRecs.page_indices || [])
            .slice(0, 2)
            .map(idx => crawledPages[idx])
            .filter(Boolean);

          // Ensure we always have 2 pages if available
          if (selectedPages.length < 2 && crawledPages.length >= 2) {
            const usedIndices = new Set(pageRecs.page_indices || []);
            for (let i = 0; i < crawledPages.length && selectedPages.length < 2; i++) {
              if (!usedIndices.has(i)) {
                selectedPages.push(crawledPages[i]);
              }
            }
          }

          setRecommendedPages(selectedPages.slice(0, 2));
          setShowRecommendations(true);
        } catch (err) {
          console.error("Failed to get recommendations:", err);
        }
      }

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

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ];

  const handleBookDemo = async () => {
    if (!bookingName || !bookingEmail || !selectedTime) return;
    
    setIsBooking(true);
    try {
      // Mark the last question as having booked a demo
      if (messages.length > 0 && askedQuestions.length > 0) {
        const lastQuestion = askedQuestions[0];
        await base44.entities.AnswerEngineQuestion.update(lastQuestion.id, {
          booked_demo: true
        });
      }
      
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Demo booked for ${bookingName} on ${selectedDate.toLocaleDateString()} at ${selectedTime}`);
      setBookingName("");
      setBookingEmail("");
      setSelectedTime(null);
      setShowBookingPanel(false);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className={`min-h-screen p-6 lg:p-8 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Answer Engine</h1>
            <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>Turn any website into an intelligent Q&A system</p>
          </div>
          <Button
            onClick={() => navigate(createPageUrl("Analytics"))}
            variant="outline"
            className={isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
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
                  disabled={isCrawling}
                  className={`pl-10 ${isDark ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'}`}
                />
              </div>
              <Button
                onClick={handleCrawl}
                disabled={isCrawling || !websiteUrl}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
              >
                {isCrawling ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Crawling...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    {isCrawled ? 'Re-Index' : 'Crawl & Index'}
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
                <div className="border-t border-slate-700 pt-4 space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
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
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Upload Screenshot</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className={`h-auto py-2 file:mr-4 file:px-4 file:py-2 file:rounded file:border-0 file:bg-teal-500 file:text-white file:cursor-pointer ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                    {screenshotUrl && (
                      <p className="text-xs text-teal-400">Screenshot uploaded ✓</p>
                    )}
                  </div>
                </div>

                {/* Button Customization */}
                <div className="grid md:grid-cols-3 gap-4 pt-4">
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>CTA Button Text</label>
                    <Input
                      type="text"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      placeholder="Book Demo"
                      className={isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>CTA Button Size</label>
                    <select
                      value={buttonSize}
                      onChange={(e) => setButtonSize(e.target.value)}
                      className={`w-full h-10 px-3 rounded-md border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    >
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>CTA Button Shape</label>
                    <select
                      value={buttonShape}
                      onChange={(e) => setButtonShape(e.target.value)}
                      className={`w-full h-10 px-3 rounded-md border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    >
                      <option value="square">Square</option>
                      <option value="rounded">Rounded</option>
                      <option value="pill">Pill</option>
                    </select>
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

        {/* Website Preview */}
        {isCrawled && activeTab === "chat" && (
          <div className={`w-full overflow-hidden ${showAnswerEngine ? 'fixed inset-0 z-30' : 'relative h-[800px] rounded-2xl border border-slate-700'}`}>
            {/* Website iframe or screenshot */}
            {screenshotUrl ? (
              <img
                src={screenshotUrl}
                alt="Website Screenshot"
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <iframe
                src={websiteUrl}
                className="w-full h-full"
                title="Website Preview"
              />
            )}

            {/* Floating Ask AI Button */}
            {!showAnswerEngine && (
              <motion.div
                drag
                dragMomentum={false}
                dragElastic={0.1}
                initial={{ x: 0, y: 0 }}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
                className="absolute top-4 right-4 cursor-move z-10"
              >
                <Button
                  onClick={() => {
                    if (!isDragging) setShowAnswerEngine(true);
                  }}
                  className="shadow-lg pointer-events-auto"
                  size="sm"
                  style={{ 
                    backgroundColor: brandColor, 
                    color: '#ffffff'
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask AI
                </Button>
              </motion.div>
            )}
          </div>
        )}

        {/* Fullscreen Answer Engine Popup */}
        <AnimatePresence>
          {showAnswerEngine && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setShowAnswerEngine(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full h-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl bg-white flex flex-col"
              >
                {/* Branded Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    {logoUrl && (
                      <img 
                        src={logoUrl} 
                        alt={companyName}
                        className="h-8 max-w-[40px] object-contain"
                      />
                    )}
                    <span className="text-lg font-semibold text-slate-900">
                      {companyName} Answer Engine
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAnswerEngine(false)}
                    className="text-slate-400 hover:text-slate-900"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Chat Section with Booking Panel */}
                <div className="flex flex-1 overflow-hidden relative">
                  <div className={`flex flex-col transition-all ${showBookingPanel ? 'w-[70%]' : 'w-full'}`}>
                    {/* Messages Container */}
                    <div className="p-6 space-y-4 flex-1 overflow-y-auto bg-white">
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
                    <div className="border-t border-slate-200 bg-white">
                      <div className="px-6 py-4">
                        {uploadedFiles.length > 0 && (
                          <div className="flex gap-2 mb-3 flex-wrap">
                            {uploadedFiles.map((file, i) => (
                              <div key={i} className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 text-xs">
                                <Paperclip className="w-3 h-3 text-slate-500" />
                                <span className="text-slate-700">{file.name}</span>
                                <button
                                  onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                                  className="text-slate-400 hover:text-slate-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <form onSubmit={handleAskQuestion} className="relative">
                          <input
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx,.txt"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                          />
                          <div className="relative flex items-center bg-white border border-slate-300 rounded-full shadow-sm hover:shadow-md transition-shadow">
                            <label htmlFor="file-upload" className="pl-4">
                              <button
                                type="button"
                                className="text-slate-400 hover:text-slate-900 transition-colors"
                                onClick={() => document.getElementById('file-upload').click()}
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                            </label>
                            <Input
                              placeholder={`Ask ${companyName} anything...`}
                              value={question}
                              onChange={(e) => setQuestion(e.target.value)}
                              disabled={isAsking}
                              className="flex-1 border-0 bg-transparent text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-3"
                            />
                            <button
                              type="button"
                              onClick={handleVoiceInput}
                              className={`pr-4 transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-slate-900'}`}
                            >
                              <Mic className="w-5 h-5" />
                            </button>
                            {question.trim() && (
                              <button
                                type="submit"
                                disabled={isAsking}
                                className="pr-4 transition-colors"
                                style={{ color: brandColor }}
                              >
                                <Send className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </form>
                      </div>

                      {/* Recommendations Bar */}
                      <AnimatePresence>
                        {showRecommendations && recommendedPages.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-slate-200 bg-white overflow-hidden"
                          >
                            <div className="px-6 py-3 flex items-start gap-3">
                              <span className="text-xs text-slate-600 font-medium pt-3 whitespace-nowrap">You might also like:</span>

                              <div className="flex-1 grid grid-cols-3 gap-3">
                                {recommendedPages.slice(0, 2).map((page, i) => (
                                  <a
                                    key={i}
                                    href={page.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group"
                                  >
                                    <p className="text-xs font-semibold text-slate-900 line-clamp-1 group-hover:text-teal-600 transition-colors mb-1">
                                      {page.title}
                                    </p>
                                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                      {page.description}
                                    </p>
                                  </a>
                                ))}

                                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-1.5">
                                  <span className="text-xs text-slate-700 font-medium text-center leading-snug line-clamp-2">{bookingCta}</span>
                                  <Button
                                    size={buttonSize}
                                    onClick={() => setShowBookingPanel(true)}
                                    className="whitespace-nowrap text-xs px-3 py-1 h-auto"
                                    style={{ 
                                      backgroundColor: brandColor, 
                                      color: '#ffffff',
                                      borderRadius: buttonShape === 'square' ? '0' : buttonShape === 'pill' ? '9999px' : '0.5rem'
                                    }}
                                  >
                                    {buttonText}
                                  </Button>
                                </div>
                              </div>

                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setShowRecommendations(false)}
                                className="h-7 w-7 flex-shrink-0"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Toggle Button */}
                      {!showRecommendations && recommendedPages.length > 0 && (
                        <div className="px-6 py-2 border-t border-slate-200 bg-slate-50">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowRecommendations(true)}
                            className="w-full text-xs text-slate-600 hover:text-slate-900"
                          >
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Show Recommendations
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking Side Panel */}
                  <AnimatePresence>
                    {showBookingPanel && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "30%", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="border-l border-slate-200 bg-slate-50 flex flex-col overflow-hidden"
                      >
                        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-slate-900">Book a Demo with {companyName}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowBookingPanel(false)}
                            className="text-slate-400 hover:text-slate-900"
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                          {/* Calendar */}
                          <div className="flex justify-center">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              disabled={(date) => date < new Date()}
                              className="rounded-md border border-slate-200 bg-white"
                            />
                          </div>

                          {/* Time Slots */}
                          <div>
                            <Label className="text-sm font-medium text-slate-700 mb-2 block">Select Time</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {timeSlots.map((time) => (
                                <Button
                                  key={time}
                                  variant={selectedTime === time ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setSelectedTime(time)}
                                  className={selectedTime === time ? "" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"}
                                  style={selectedTime === time ? {
                                    backgroundColor: brandColor,
                                    borderColor: brandColor
                                  } : {}}
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Booking Form */}
                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm font-medium text-slate-700 mb-1 block">Name</Label>
                              <Input
                                placeholder="Your name"
                                value={bookingName}
                                onChange={(e) => setBookingName(e.target.value)}
                                className="bg-white border-slate-300"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-slate-700 mb-1 block">Email</Label>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                value={bookingEmail}
                                onChange={(e) => setBookingEmail(e.target.value)}
                                className="bg-white border-slate-300"
                              />
                            </div>
                            <Button
                              onClick={handleBookDemo}
                              disabled={!bookingName || !bookingEmail || !selectedTime || isBooking}
                              className="w-full"
                              style={{
                                backgroundColor: brandColor,
                                color: '#ffffff'
                              }}
                            >
                              {isBooking ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Booking...
                                </>
                              ) : (
                                "Book Demo"
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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