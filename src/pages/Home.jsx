import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Search, 
  BarChart3, 
  FileText, 
  TrendingUp,
  CheckCircle,
  Sparkles,
  Zap,
  Eye,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const features = [
    {
      icon: Eye,
      title: "Visibility HQ",
      description: "Track your brand's visibility across AI-generated responses and compare against competitors in real-time."
    },
    {
      icon: FileText,
      title: "Optimize Content",
      description: "Transform existing content to be selected, trusted, and acted upon by AI search engines."
    },
    {
      icon: Sparkles,
      title: "New Content Creation",
      description: "Generate AI-optimized content from scratch based on buyer-centric prompts and search intent."
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description: "Monitor citation rates, brand mentions, and visibility trends across all your optimized content."
    }
  ];

  const pillars = [
    { name: "Content Quality & Trust", weight: "35%", color: "bg-teal-500" },
    { name: "Structure & Formatting", weight: "25%", color: "bg-cyan-500" },
    { name: "Semantic Clarity", weight: "15%", color: "bg-lime-500" },
    { name: "Structured Data", weight: "15%", color: "bg-emerald-500" },
    { name: "Freshness & Technical", weight: "10%", color: "bg-green-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">e</span>
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">elelem</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-400 hover:text-white transition-colors text-sm">Features</a>
            <a href="#pillars" className="text-slate-400 hover:text-white transition-colors text-sm">Our Approach</a>
            <a href="#pricing" className="text-slate-400 hover:text-white transition-colors text-sm">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("Setup")}>
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-teal-500/25">
                Start Free Trial
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
              <span className="text-teal-400 text-sm font-medium">Generative Engine Optimization Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Intelligently Engineering
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Content to be Visible
              </span>
              <br />
              in the Age of AI
            </h1>
            
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              elelem helps content-rich brands ensure their brand is visible where AI Search now provides answers rather than links. We go beyond standard GEO by applying 10+ years of content intelligence to understand <em className="text-slate-300">why</em> content is or is not surfaced and then engineer it to be selected, trusted and acted on in high consideration moments.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Setup")}>
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-lg px-8 py-6 shadow-xl shadow-teal-500/30">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-slate-800"
          >
            {[
              { value: "89%", label: "Average Visibility Increase" },
              { value: "3.2x", label: "More Citations" },
              { value: "47%", label: "Brand Mention Growth" },
              { value: "24h", label: "To First Insights" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-slate-500 text-sm mt-2">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Complete AI Visibility Platform
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Everything you need to dominate AI search results and ensure your brand is the one being recommended.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-slate-800/50 border-slate-700/50 hover:border-teal-500/50 transition-all duration-300 h-full">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mb-6">
                      <feature.icon className="w-6 h-6 text-teal-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Pillars Section */}
      <section id="pillars" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                The 5 Pillars of
                <span className="block bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  AI Search Visibility
                </span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Our proprietary framework evaluates and optimizes your content across five critical dimensions that AI models use to determine which content to cite and recommend.
              </p>
              <Link to={createPageUrl("Setup")}>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
                  Analyze Your Content
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
                >
                  <div className={`w-14 h-14 rounded-xl ${pillar.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {pillar.weight}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{pillar.name}</div>
                    <div className="h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={`h-full ${pillar.color} rounded-full`} 
                        style={{ width: pillar.weight }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.1),_transparent_50%)]" />
            <CardContent className="p-12 text-center relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Dominate AI Search?
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                Start your free trial today and discover how visible your brand really is in AI-generated responses.
              </p>
              <Link to={createPageUrl("Setup")}>
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-lg px-10 py-6 shadow-xl shadow-teal-500/30">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <p className="text-slate-500 text-sm mt-4">No credit card required • 14-day free trial</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">e</span>
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">elelem</span>
          </div>
          <div className="text-slate-500 text-sm">
            © 2024 elelem. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}