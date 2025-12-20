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
    "Don't know how their product is described in AI answers",
    "Can't see why competitors are selected instead",
    "Lose control of positioning, accuracy, and differentiation",
    "Discover errors, omissions, or hallucinations too late"
  ];

  const visibilityLoop = [
    {
      number: "1",
      title: "Gather Real Signals",
      description: "elelem continuously collects data from:",
      items: [
        "Public AI answers",
        "Real customer and user questions",
        "Product, documentation, and knowledge sources",
        "Competitive and category-level AI outputs"
      ]
    },
    {
      number: "2",
      title: "Understand with Content Intelligence",
      description: "At the core of elelem is a Content Intelligence Engine. Using advanced language understanding — including vector embeddings and NLP — elelem analyzes:",
      items: [
        "Semantic meaning and relevance",
        "Which product details AI selects, ignores, or distorts",
        "How your technology is framed vs competitors",
        "Where ambiguity or gaps cause exclusion"
      ]
    },
    {
      number: "3",
      title: "Optimize What Actually Matters",
      description: "Based on real AI behavior, elelem:",
      items: [
        "Identifies high-impact visibility gaps",
        "Prioritizes fixes tied to outcomes",
        "Recommends precise, explainable optimizations"
      ]
    },
    {
      number: "4",
      title: "Learn and Adapt Continuously",
      description: "As models, competitors, and questions change, elelem:",
      items: [
        "Re-measures visibility",
        "Detects drift and loss",
        "Refines recommendations"
      ],
      tagline: "Visibility becomes managed, not reactive."
    }
  ];

  const techTeamsGet = [
    { icon: BarChart3, title: "AI Visibility Dashboard", description: "Real-time monitoring of how your technology appears across AI systems" },
    { icon: Users, title: "Competitive Intelligence", description: "See how you stack up against competitors in AI-generated answers" },
    { icon: Shield, title: "Accuracy and Representation Monitoring", description: "Track and correct how your product is described" },
    { icon: Brain, title: "Real Question Intelligence", description: "Understand what customers actually ask about your technology" },
    { icon: Target, title: "Human-in-the-Loop Control", description: "Review and approve every change before publishing" }
  ];

  const comparison = [
    {
      aspect: "Focus",
      traditional: "Optimize content inputs",
      elelem: "Manage AI output visibility"
    },
    {
      aspect: "Approach",
      traditional: "Assume how AI works",
      elelem: "Observe real AI behavior"
    },
    {
      aspect: "Recommendations",
      traditional: "Static recommendations",
      elelem: "Continuous optimization loop"
    },
    {
      aspect: "Perspective",
      traditional: "Marketing-only lens",
      elelem: "Built for technology understanding"
    }
  ];

  const customers = ["Sony", "Neeve AI", "Hoxton Analytics"];

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
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              elelem — LLM Visibility Platform
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                for Technology Companies
              </span>
            </h1>

            <p className="text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Control how your technology is represented when AI generates answers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            The Problem Technology Companies Face
          </h2>
          
          <div className="text-center mb-12">
            <p className="text-xl text-slate-300 mb-4">
              AI assistants are now the first place people go to understand technology.
            </p>
            <div className="space-y-3 text-lg text-slate-400 max-w-2xl mx-auto">
              <p>LLMs don't rank websites.</p>
              <p>They select sources, summarize capabilities, and decide what gets said about your product.</p>
            </div>
          </div>

          <div className="mb-12">
            <p className="text-white font-semibold mb-6 text-center">Today, technology companies often:</p>
            <div className="space-y-4">
              {problems.map((problem, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 bg-slate-800/50 border border-red-500/20 rounded-lg p-4"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{problem}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center bg-slate-800/50 border border-slate-700/50 rounded-xl p-8">
            <p className="text-xl text-white font-semibold mb-2">
              For technology companies, this isn't just marketing risk —
            </p>
            <p className="text-xl text-teal-400 font-semibold">
              it's product understanding, trust, and adoption risk.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            The Solution
          </h2>
          <p className="text-xl text-slate-300 leading-relaxed mb-8">
            <span className="text-white font-semibold">elelem</span> is the LLM Visibility Platform built specifically for technology companies.
          </p>
          <p className="text-lg text-slate-400 leading-relaxed">
            We help teams measure, understand, and improve how their technology appears in LLM-powered answers — starting with public AI systems and expanding into customer and agentic environments.
          </p>
        </div>
      </section>

      {/* What Is LLM Visibility */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            What Is LLM Visibility?
          </h2>
          
          <Card className="bg-slate-800/50 border-slate-700/50 mb-8">
            <CardContent className="p-8">
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                LLM Visibility is how often, how accurately, and how consistently your technology appears in answers generated by LLM-powered AI systems.
              </p>
              
              <p className="text-white font-semibold mb-4">It determines:</p>
              <div className="space-y-3">
                {[
                  "Whether your product is mentioned at all",
                  "How its capabilities are described",
                  "Whether it's compared fairly",
                  "Whether it's included or excluded by default"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-2 text-lg">
            <p className="text-slate-400">This is not SEO.</p>
            <p className="text-slate-400">This is not GEO.</p>
            <p className="text-white font-semibold text-xl">This is outcome-level visibility inside AI outputs.</p>
          </div>
        </div>
      </section>

      {/* How elelem Works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
            How elelem Works
          </h2>
          <p className="text-slate-400 text-center mb-12 text-lg">(The Visibility Loop)</p>
          
          <div className="space-y-8">
            {visibilityLoop.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-white">{step.number}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                        <p className="text-slate-400 mb-4">{step.description}</p>
                        <div className="space-y-2">
                          {step.items.map((item, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 flex-shrink-0" />
                              <span className="text-slate-300">{item}</span>
                            </div>
                          ))}
                        </div>
                        {step.tagline && (
                          <p className="text-teal-400 font-medium mt-4 italic">{step.tagline}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Technology Teams Get */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            What Technology Teams Get
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techTeamsGet.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-slate-800/50 border-slate-700/50 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-teal-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why elelem - Comparison */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Why elelem
          </h2>
          
          <Card className="bg-slate-800/50 border-slate-700/50 overflow-x-auto">
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-6 text-slate-400 font-medium"></th>
                    <th className="text-center p-6 text-slate-400 font-medium">Traditional Tools</th>
                    <th className="text-center p-6 text-teal-400 font-medium">elelem</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <tr key={i} className="border-b border-slate-700/50 last:border-0">
                      <td className="p-6 text-white font-medium">{row.aspect}</td>
                      <td className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                          <span className="text-slate-400">{row.traditional}</span>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
                          <span className="text-slate-300">{row.elelem}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Who Uses elelem */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Who Uses elelem
          </h2>
          <p className="text-slate-400 mb-8">Technology companies including:</p>
          <div className="flex flex-wrap justify-center gap-6">
            {customers.map((customer, i) => (
              <div
                key={i}
                className="px-8 py-4 bg-slate-800/50 border border-slate-700/50 rounded-lg"
              >
                <span className="text-white font-semibold text-lg">{customer}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Matters Now */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Why This Matters Now
          </h2>
          
          <Card className="bg-slate-800/50 border-slate-700/50 mb-8">
            <CardContent className="p-8">
              <p className="text-lg text-slate-300 mb-6">AI systems already shape:</p>
              <div className="space-y-3">
                {[
                  "Product discovery",
                  "Shortlists and comparisons",
                  "Technical understanding"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/30 rounded-xl p-8">
            <p className="text-xl text-white font-semibold">
              If AI doesn't understand your technology, neither will your customers.
            </p>
          </div>
        </div>
      </section>

      {/* One-Line Summary */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl text-slate-300 leading-relaxed">
            <span className="text-white font-semibold">elelem</span> helps technology companies control how their products are represented in LLM-generated answers.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.1),_transparent_50%)]" />
            <CardContent className="p-12 text-center relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Request a Demo
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                See how elelem can help you control your technology's visibility in AI-generated answers.
              </p>
              <Link to={createPageUrl("Setup")}>
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-lg px-10 py-6 shadow-xl shadow-teal-500/30">
                  Request a Demo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
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