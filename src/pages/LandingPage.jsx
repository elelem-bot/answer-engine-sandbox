import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Eye,
  MessageSquare,
  Bot,
  Sparkles,
  Shield,
  Check,
  Users,
  Briefcase,
  HeadphonesIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  const surfaces = [
    {
      icon: Eye,
      title: "Public LLM Visibility",
      subtitle: "Where awareness, trust, and reputation are formed.",
      color: "from-teal-500 to-cyan-500",
      items: [
        "ChatGPT, Perplexity, AI search, copilots",
        "Mentions, citations, share of AI answers",
        "Competitive visibility intelligence"
      ],
      tagline: "Be seen — and represented correctly — where people ask questions."
    },
    {
      icon: MessageSquare,
      title: "Customer LLM Visibility",
      subtitle: "Where experience, efficiency, and cost are decided.",
      color: "from-amber-500 to-orange-500",
      items: [
        "Website and support chatbots",
        "Real customer question analysis",
        "Answer gaps, hallucinations, escalation drivers"
      ],
      tagline: "Understand what customers actually ask — and where answers break."
    },
    {
      icon: Bot,
      title: "Agentic LLM Visibility",
      subtitle: "Where systems choose on behalf of users.",
      color: "from-orange-500 to-red-500",
      items: [
        "AI agents and task-based copilots",
        "Inclusion and exclusion signals",
        "Decision eligibility and readiness"
      ],
      tagline: "Public LLMs influence perception. Agentic LLMs influence outcomes."
    }
  ];

  const intelligenceFeatures = [
    {
      title: "Vector embeddings",
      description: "so your content is selected even when wording changes"
    },
    {
      title: "Natural Language Processing (NLP)",
      description: "so answers stay accurate and on-brand"
    },
    {
      title: "Passage-level analysis",
      description: "so you optimize what actually matters"
    },
    {
      title: "Question–answer modeling",
      description: "so prompts reflect real demand, not assumptions"
    }
  ];

  const teams = [
    { icon: Users, title: "Marketing teams", subtitle: "protecting brand visibility" },
    { icon: HeadphonesIcon, title: "CX and Support teams", subtitle: "improving answer quality" },
    { icon: Briefcase, title: "Product and Platform teams", subtitle: "preparing for agentic AI" }
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
          <div className="hidden md:flex items-center gap-8">
            <a href="#surfaces" className="text-slate-400 hover:text-white transition-colors text-sm">Platform</a>
            <a href="#intelligence" className="text-slate-400 hover:text-white transition-colors text-sm">Technology</a>
            <a href="#teams" className="text-slate-400 hover:text-white transition-colors text-sm">Who We Serve</a>
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
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="text-teal-400 text-sm font-medium">LLM Visibility Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Be Visible Where LLMs
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Answer — and Decide
              </span>
            </h1>

            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-4 leading-relaxed">
              Manage your brand's visibility across public AI, customer chatbots, and agentic systems.
            </p>

            <p className="text-lg text-slate-300 max-w-4xl mx-auto mb-10 leading-relaxed">
              elelem is the LLM Visibility Platform that helps brands monitor, understand, and improve how they appear in LLM-powered answers and decisions — using real customer questions and deep content intelligence, with full human control over publishing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-lg px-8 py-6 shadow-xl shadow-teal-500/30">
                Request a Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LLMs Are the New Discovery Layer */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            LLMs Are the New Discovery Layer
          </h2>
          <div className="text-lg text-slate-400 space-y-4 mb-8">
            <p>LLMs don't rank pages.<br/>They select answers, shape understanding, and make decisions.</p>
            <p className="text-slate-300 mt-6">If your brand isn't:</p>
            <ul className="text-left max-w-md mx-auto space-y-2">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                <span>visible in public AI answers</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                <span>accurate in customer chatbots</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                <span>considered by agentic systems</span>
              </li>
            </ul>
            <p className="text-white font-semibold mt-6">…it effectively doesn't exist.</p>
          </div>
        </div>
      </section>

      {/* Three Surfaces Section */}
      <section id="surfaces" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              One Platform. Three LLM Visibility Surfaces.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {surfaces.map((surface, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-slate-800/50 border-slate-700/50 h-full">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${surface.color} flex items-center justify-center mb-6`}>
                      <surface.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{surface.title}</h3>
                    <p className="text-slate-400 italic mb-6">{surface.subtitle}</p>
                    <ul className="space-y-3 mb-6">
                      {surface.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-slate-300">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${surface.color} mt-2 flex-shrink-0`} />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-teal-400 font-medium text-sm">{surface.tagline}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Intelligence Section */}
      <section id="intelligence" className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Content Intelligence at the Core
            </h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              elelem is powered by a Content Intelligence Engine — not guesswork, prompts, or static rules.
            </p>
          </div>

          <p className="text-slate-300 text-center mb-12 max-w-4xl mx-auto">
            Under the hood, elelem uses advanced language understanding to analyze content the way LLMs actually consume it:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {intelligenceFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">→ {feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-teal-400 font-medium text-lg">
            This intelligence powers visibility across all three LLM surfaces.
          </p>
        </div>
      </section>

      {/* Real Questions Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Built on Real Customer Questions — Not Synthetic Prompts
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Most AI optimization tools rely on assumed prompts.
          </p>
          <p className="text-slate-300 mb-8">
            elelem is built on real questions customers actually ask, gathered from:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-12 text-left max-w-2xl mx-auto">
            {[
              "Customer service chats",
              "Website and support chatbots",
              "Help desks and ticketing systems",
              "FAQs and search logs"
            ].map((source, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <Check className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <span className="text-slate-300">{source}</span>
              </div>
            ))}
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 mb-8">
            <p className="text-white font-semibold mb-4">These real-world questions:</p>
            <ul className="space-y-3 text-slate-300 text-left max-w-xl mx-auto">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span>Improve prompt accuracy</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span>Reveal missing or broken answers</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span>Reduce hallucinations</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span>Strengthen public, customer, and agentic LLM performance</span>
              </li>
            </ul>
          </div>
          <p className="text-teal-400 font-medium text-lg">
            Better LLM performance starts with real customer language.
          </p>
        </div>
      </section>

      {/* Automate + Control Section */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Optimize Automatically. Publish Deliberately.
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-slate-800/50 border-teal-500/30">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-white mb-6">elelem automates the hard parts:</h3>
                <ul className="space-y-4">
                  {[
                    "Continuous LLM visibility monitoring",
                    "Gap and risk detection",
                    "Prioritized optimization recommendations",
                    "Ongoing learning as models change"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-cyan-500/30">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-white mb-6">You stay in control:</h3>
                <ul className="space-y-4">
                  {[
                    "Review, edit, and approve every change",
                    "No auto-publishing",
                    "Enterprise-safe governance"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-teal-400 font-medium text-lg mt-8">
            Automation without loss of control.
          </p>
        </div>
      </section>

      {/* Not SEO Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Not SEO. Not GEO. LLM Visibility.
          </h2>
          <div className="space-y-4 text-slate-400 text-lg mb-8">
            <p>SEO optimizes for ranking.<br/>GEO formats content.</p>
            <p className="text-white font-semibold">elelem manages visibility inside LLM outputs and decisions.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <span className="text-slate-400">Across:</span>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-400">Public AI assistants</span>
              <span className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400">Customer chatbots</span>
              <span className="px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400">Agentic systems</span>
            </div>
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section id="teams" className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built for Modern Teams
            </h2>
            <p className="text-slate-400 text-lg">elelem is used by:</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {teams.map((team, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-slate-800/50 border-slate-700/50 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                      <team.icon className="w-8 h-8 text-teal-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{team.title}</h3>
                    <p className="text-slate-400 text-sm">{team.subtitle}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-slate-300 text-lg">
            If LLMs answer, assist, or act in your ecosystem — elelem helps you stay visible.
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.1),_transparent_50%)]" />
            <CardContent className="p-12 text-center relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Stay Visible Where It Matters
              </h2>
              <div className="space-y-4 mb-10">
                <p className="text-slate-300 text-lg">Be:</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="flex items-center gap-2 px-6 py-3 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                    <Check className="w-5 h-5 text-teal-400" />
                    <span className="text-white">Seen in public AI</span>
                  </div>
                  <div className="flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <Check className="w-5 h-5 text-amber-400" />
                    <span className="text-white">Correct in customer chatbots</span>
                  </div>
                  <div className="flex items-center gap-2 px-6 py-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <Check className="w-5 h-5 text-orange-400" />
                    <span className="text-white">Chosen by agentic systems</span>
                  </div>
                </div>
              </div>
              <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-lg px-10 py-6 shadow-xl shadow-teal-500/30">
                Request a Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
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