import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Shield,
  Check,
  X,
  AlertCircle,
  Eye,
  Brain,
  Target,
  TrendingUp,
  Users,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage2() {
  const problems = [
    "which content AI relies on",
    "how it's summarized or reframed",
    "where meaning is lost or distorted",
    "why competitor content is chosen instead"
  ];

  const visibilityQuestions = [
    "Is our content being used at all?",
    "Which parts matter and which are ignored?",
    "Why does AI prefer competitor content?"
  ];

  const contentIntelligence = [
    "understands semantic meaning beyond keywords",
    "analyzes content at the passage level",
    "detects ambiguity that leads to misrepresentation",
    "compares how your content performs against competitors"
  ];

  const visibilitySurfaces = [
    {
      title: "Public LLM Visibility",
      subtitle: "Understand how your content appears in public AI answers.",
      color: "from-teal-500 to-cyan-500",
      items: [
        "whether your content is included in AI answers",
        "how your product is described or compared",
        "where competitor content displaces yours"
      ],
      tagline: "This helps ensure your technology is explained accurately to the market."
    },
    {
      title: "Client LLM Visibility",
      subtitle: "Improve how your content supports AI answers for customers.",
      color: "from-amber-500 to-orange-500",
      items: [
        "how chatbots and assistants use your content",
        "where answers break or hallucinate",
        "which content gaps cause confusion or escalation"
      ],
      tagline: "This improves answer accuracy, reduces support load, and maintains trust."
    },
    {
      title: "Agentic LLM Visibility",
      subtitle: "Prepare your content for AI systems that evaluate technologies.",
      color: "from-orange-500 to-red-500",
      items: [
        "whether your content is usable by agents",
        "where missing clarity or structure causes exclusion",
        "which competitor content agents rely on instead"
      ],
      tagline: "This helps ensure your content is eligible when AI systems assess and filter technologies."
    }
  ];

  const loop = [
    "Observe how AI systems use your content",
    "Understand issues with content intelligence",
    "Identify high-impact gaps and risks",
    "Recommend precise, human-approved improvements",
    "Track visibility as models and competitors change"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6943f2bf67610e14801b112b/de87d19e0_elelem2025logoPrimary.png"
              alt="elelem"
              className="h-8 brightness-0 invert"
            />
          </div>
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("Setup")}>
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-teal-500/25">
                Request a Demo
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(20,184,166,0.15),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(34,211,238,0.1),_transparent_50%)]" />
        
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Own Your
              <br />
              <span className="relative inline-block">
                <motion.span 
                  className="bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% auto" }}
                >
                  LLM Visibility
                </motion.span>
                <motion.div 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
              </span>
            </motion.h1>

            <motion.p 
              className="text-2xl text-slate-300 max-w-3xl mx-auto mb-4 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Make sure your content is used, understood, and trusted by AI systems.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 max-w-4xl mx-auto mt-12"
            >
              <p className="text-lg text-slate-300 leading-relaxed">
                <span className="text-white font-semibold">elelem</span> is the LLM Visibility Platform for technology companies.
                <br />
                We help teams understand how their content is selected and represented by LLMs — and improve it through a continuous, evidence-based optimization loop.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-transparent" />
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
              AI Is Already Using Your Content —
              <br />
              <span className="text-teal-400">You Just Can't See How</span>
            </h2>
          </motion.div>
          
          <motion.div 
            className="text-center mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              LLMs generate answers about your technology every day using product pages, documentation, help content, FAQs, and knowledge bases.
            </p>
          </motion.div>

          <div className="mb-12">
            <motion.p 
              className="text-white font-semibold mb-6 text-center text-xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Most technology companies don't know:
            </motion.p>
            <div className="grid md:grid-cols-2 gap-4">
              {problems.map((problem, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
                  whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm shadow-lg"
                >
                  <Eye className="w-6 h-6 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-lg">{problem}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            className="text-center bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-teal-500/30 rounded-2xl p-10 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-2xl text-white font-semibold">
              When you can't see this, you can't fix it —
              <br />
              <span className="text-teal-400">and visibility erodes quietly.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* What Is LLM Visibility */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(20,184,166,0.1),_transparent_70%)]" />
        
        <div className="max-w-4xl mx-auto relative">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What LLM Visibility Means
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-xl shadow-2xl mb-8">
              <CardContent className="p-10">
                <p className="text-xl text-slate-200 leading-relaxed mb-8 text-center">
                  LLM Visibility is how often, how accurately, and how consistently your content is selected and represented in AI-generated answers.
                </p>
                
                <motion.p 
                  className="text-white font-semibold mb-6 text-lg"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  It answers questions traditional tools can't:
                </motion.p>
                <div className="space-y-4">
                  {visibilityQuestions.map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="flex items-start gap-4 bg-slate-900/50 rounded-xl p-5 border border-slate-700/30"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 8, backgroundColor: "rgba(15, 23, 42, 0.8)" }}
                    >
                      <Check className="w-6 h-6 text-teal-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-lg">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            className="text-center space-y-3 text-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-slate-400 text-lg">Traditional tools focus on formatting.</p>
            <motion.p 
              className="text-white font-bold text-2xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              This is about outcomes.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content Intelligence */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Powered by
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Content Intelligence
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-slate-300 text-center mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            At the core of elelem is a Content Intelligence Engine designed to understand how LLMs interpret content.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-white font-semibold text-center mb-8 text-lg">
              Using vector embeddings and NLP, elelem:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {contentIntelligence.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateY: 2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-xl blur-xl" />
                <Card className="bg-slate-800/80 border-slate-700/50 backdrop-blur-sm relative h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 mt-2 flex-shrink-0"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      />
                      <p className="text-slate-300 text-lg leading-relaxed">{item}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.p 
            className="text-center text-teal-400 font-medium text-xl mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            This allows teams to see <span className="text-white">why</span> AI chooses or skips content — so optimization is precise, not speculative.
          </motion.p>
        </div>
      </section>

      {/* Three Content Areas */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            LLM Visibility Across
            <br />
            <span className="text-teal-400">Three Content Areas</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {visibilitySurfaces.map((surface, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${surface.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`} />
                <Card className="bg-slate-800/80 border-slate-700/50 backdrop-blur-sm h-full relative">
                  <CardContent className="p-8">
                    <motion.h3 
                      className="text-2xl font-bold text-white mb-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      {surface.title}
                    </motion.h3>
                    <p className="text-slate-400 italic mb-6 text-sm">{surface.subtitle}</p>
                    
                    <div className="mb-6">
                      <p className="text-slate-300 font-medium mb-3">elelem shows:</p>
                      <div className="space-y-3">
                        {surface.items.map((item, j) => (
                          <motion.div 
                            key={j} 
                            className="flex items-start gap-2"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + j * 0.1 }}
                            viewport={{ once: true }}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${surface.color} mt-2 flex-shrink-0`} />
                            <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-teal-400 font-medium text-sm leading-relaxed border-t border-slate-700/50 pt-4">
                      {surface.tagline}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visibility Loop */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            A Continuous Visibility and
            <br />
            <span className="text-teal-400">Optimization Loop</span>
          </motion.h2>
          
          <motion.p 
            className="text-slate-400 text-center mb-12 text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            elelem operates as a closed loop:
          </motion.p>

          <div className="space-y-4 mb-12">
            {loop.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ x: 10, scale: 1.02 }}
                className="relative"
              >
                <div className="flex items-center gap-6 bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    {i + 1}
                  </motion.div>
                  <span className="text-slate-300 text-lg">{step}</span>
                </div>
                {i < loop.length - 1 && (
                  <motion.div 
                    className="w-0.5 h-4 bg-gradient-to-b from-teal-400 to-transparent mx-auto my-2"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.1 + 0.2 }}
                    viewport={{ once: true }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/30 rounded-2xl p-8"
          >
            <p className="text-2xl text-white font-semibold">
              LLM visibility becomes a managed process,
              <br />
              <span className="text-teal-400">not a guessing game.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/30 h-full">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Grounded in Real Contexts</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Visibility analysis is aligned to real ICPs, personas, customer questions, and evaluation scenarios.
                  </p>
                  <p className="text-teal-400 font-medium">
                    This ensures insights reflect how your content is actually used, not hypothetical prompts.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30 h-full">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Automation Without Losing Control</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    elelem automates visibility monitoring, gap detection, and prioritization.
                  </p>
                  <p className="text-cyan-400 font-medium">
                    Teams retain full control over what changes are made and when they're published, protecting accuracy and brand integrity.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Built for Technology Companies */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Built for
            <br />
            <span className="text-teal-400">Technology Companies</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            elelem is built for teams that care about accurate product representation, competitive clarity in AI answers, and scalable content performance as AI evolves.
          </motion.p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(20,184,166,0.2),_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(34,211,238,0.15),_transparent_60%)]" />
        
        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-teal-500/30 overflow-hidden relative backdrop-blur-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.1),_transparent_50%)]" />
              <CardContent className="p-16 text-center relative">
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold text-white mb-6"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  Take Control of Your
                  <br />
                  <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    LLM Visibility
                  </span>
                </motion.h2>
                
                <div className="space-y-4 mb-10 max-w-2xl mx-auto">
                  {[
                    "See how AI uses your content.",
                    "Understand why visibility is won or lost.",
                    "Optimize with confidence, not assumptions."
                  ].map((text, i) => (
                    <motion.p
                      key={i}
                      className="text-slate-300 text-xl"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {text}
                    </motion.p>
                  ))}
                </div>
                
                <Link to={createPageUrl("Setup")}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-xl px-12 py-8 shadow-2xl shadow-teal-500/50">
                      Request a Demo
                      <ArrowRight className="ml-3 w-6 h-6" />
                    </Button>
                  </motion.div>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6943f2bf67610e14801b112b/de87d19e0_elelem2025logoPrimary.png"
              alt="elelem"
              className="h-8 brightness-0 invert"
            />
          </div>
          <div className="text-slate-500 text-sm">
            © 2024 elelem. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}