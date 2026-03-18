import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

const BRAND = {
  blue: "#2DC6FE",
  mint: "#81FBEF",
  dark: "#082D35",
};

const faqs = [
  {
    q: "What exactly is elelem?",
    a: "elelem turns your website into a ChatGPT-style Answer Engine. Your visitors can ask real questions in their own words and get instant, accurate answers based on your content and data.",
  },
  {
    q: "How is this different from a normal chatbot?",
    a: "Most chatbots follow scripts or push people to a form. With elelem, buyers ask real questions and get helpful, specific answers that move them toward a decision. You see which questions matter and which ones lead to revenue, not just 'engagement.'",
  },
  {
    q: "What results can I expect?",
    a: "On sites like yours, we see more demo bookings, higher conversion on key pages, and better use of existing content. In early tests, Answer Engine users convert up to 5x more than non users on the same pages.",
  },
  {
    q: "How does it work with my current website and tools?",
    a: "You add elelem to your site like you would add any script or widget. It runs on top of your current CMS and analytics stack, and you can connect it to the tools you already use for reporting and revenue tracking.",
  },
  {
    q: "Will it make things up or hurt my brand?",
    a: "No. elelem is set up to avoid hallucinations and stick to your approved sources. You control the content it uses, how it speaks, and what it should never say, so answers stay on brand and safe.",
  },
  {
    q: "How do we get started?",
    a: "Book a demo, pick a few high-intent pages, and we'll help you set up your first Answer Engine experience. You start seeing real buyer questions within days, and you can track impact on pipeline from there.",
  },
];

const brands = [
  {
    name: "Alibaba",
    desc: "Alibaba introduced an 'AI Mode' feature that integrates Answer Engine capabilities directly into the user journey, enabling instant questions and answers.",
    img: "https://d2txn9w4uujjus.cloudfront.net/images/019b4019-8642-7b7a-b8ed-ef839bfc4eec/1c79efee79b7d32367ecee665a72304a81684dea--960w.jpg",
  },
  {
    name: "Huble",
    desc: "Huble (HubSpot Global Partner of the Year) launched 'Ask AI' – a new feature which allows buyers to ask questions and gain instant answers. Powered by elelem.",
    img: "https://d2txn9w4uujjus.cloudfront.net/images/019b4019-8642-7b7a-b8ed-ef839bfc4eec/622d94eb38c649b6931f8bb6c5841eaa6d7aa1e5--960w.jpg",
  },
  {
    name: "Amazon",
    desc: "Rufus is an AI shopping answer engine on the Amazon app and website that helps customers research products through natural conversation and instant answers.",
    img: "https://d2txn9w4uujjus.cloudfront.net/images/019b4019-8642-7b7a-b8ed-ef839bfc4eec/55701767b01c493b3df892a9e753ce0fcb1de9bd--960w.jpg",
  },
  {
    name: "Hoxton AI",
    desc: "Hoxton AI's \"Ask AI\" mode enables buyers to ask questions and receive instant replies, increasing conversion rates and identifying gaps to improve closing effectiveness. Powered by elelem.",
    img: "https://d2txn9w4uujjus.cloudfront.net/images/019b4019-8642-7b7a-b8ed-ef839bfc4eec/8d68df5216a52a982fde610a6347555dca27fa19--960w.jpg",
  },
  {
    name: "Netflix",
    desc: "Netflix is pioneering a natural language search to help viewers find relevant content on demand, increasing engagement, discoverability and customer satisfaction.",
    img: "https://d2txn9w4uujjus.cloudfront.net/images/019b4019-8642-7b7a-b8ed-ef839bfc4eec/8f8eda927263be93cf7fb3c966f88d857e89bb50--960w.png",
  },
  {
    name: "Rated People",
    desc: "Rated People has launched an Answer Engine that instantly assists customers while helping them better understand their needs, gaps, and opportunities. Powered by elelem.",
    img: "https://d2txn9w4uujjus.cloudfront.net/images/019b4019-8642-7b7a-b8ed-ef839bfc4eec/8e574be444734876a96302e24bb16764097566f9--960w.png",
  },
];

const features = [
  {
    title: "Branded AI Answer Engine (On-Site)",
    desc: "Buyers gain instant answers to their pre-sale questions and are 6x more likely to convert or buy",
    img: "https://d2txn9w4uujjus.cloudfront.net/images/019b4019-8642-7b7a-b8ed-ef839bfc4eec/a6b4cb687ea36981f87eebcd74f6a33e28629c6d--960w.png",
  },
  {
    title: "Content/Buyer Gap Detection",
    desc: "Identifies gaps in buyers' content needs and auto-generates the content needed to fill and further increase conversion",
    img: "https://d2txn9w4uujjus.cloudfront.net/images/019b4019-8642-7b7a-b8ed-ef839bfc4eec/15b659962d629456dcacbababffc73aa66accd25--960w.png",
  },
  {
    title: "Real Buyer Question Capture",
    desc: "Captures first-party demand intelligence by revealing REAL pipeline-shaping questions (prompts) that drive GEO, pipeline and revenue.",
    img: "https://d2txn9w4uujjus.cloudfront.net/images/019b4019-8642-7b7a-b8ed-ef839bfc4eec/b5bc6785a205a847895d6f75431415421a341fcf--960w.png",
  },
  {
    title: "Demand Intelligence Analytics",
    desc: "Proves ROI by connecting AI engagement directly to revenue impact. Creates a closed-loop optimisation system from buyer question to revenue outcome.",
    img: null,
  },
];

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b border-gray-200 py-5 cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-gray-900 text-base">{q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 flex-shrink-0 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 flex-shrink-0 text-gray-400" />
        )}
      </div>
      {open && <p className="mt-3 text-gray-600 text-sm leading-relaxed">{a}</p>}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "'Google Sans', sans-serif" }}>

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6943f2bf67610e14801b112b/de87d19e0_elelem2025logoPrimary.png"
            alt="elelem"
            className="h-7"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(createPageUrl("Setup"))}
              className="px-5 py-2 rounded-full border-2 text-sm font-semibold transition-colors"
              style={{ borderColor: BRAND.dark, color: BRAND.dark }}
            >
              Login
            </button>
            <button
              onClick={() => navigate(createPageUrl("Setup"))}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: `linear-gradient(to right, ${BRAND.blue}, ${BRAND.mint})`, color: BRAND.dark }}
            >
              See Demo
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div
          className="inline-block text-xs font-semibold px-4 py-1.5 rounded-full mb-6"
          style={{ background: `linear-gradient(to right, ${BRAND.blue}22, ${BRAND.mint}33)`, color: BRAND.dark }}
        >
          1st Party Answer Engine that converts AI‑driven buyers for Demand Gen, Growth &amp; Performance Teams
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 max-w-3xl mx-auto" style={{ color: BRAND.dark }}>
          Turn <span style={{ color: BRAND.blue }}>REAL</span> customer questions<br />
          into more signups, demos, and revenue
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          <strong>elelem turns your website into a ChatGPT-style Answer Engine.</strong> Visitors get instant, accurate answers on your key pages, so they stop bouncing, understand your product faster, and convert at up to 6x the rate.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(createPageUrl("Setup"))}
            className="px-8 py-3.5 rounded-full text-base font-bold transition-opacity hover:opacity-90 shadow-lg"
            style={{ background: `linear-gradient(to right, ${BRAND.blue}, ${BRAND.mint})`, color: BRAND.dark }}
          >
            See it in Action
          </button>
          <button
            onClick={() => navigate(createPageUrl("Setup"))}
            className="px-8 py-3.5 rounded-full text-base font-bold transition-colors"
            style={{ background: BRAND.dark, color: "#fff" }}
          >
            Contact Us
          </button>
        </div>

        {/* Hero image */}
        <div className="mt-14 rounded-2xl overflow-hidden shadow-2xl max-w-3xl mx-auto">
          <img
            src="https://d2txn9w4uujjus.cloudfront.net/images/019b4019-8642-7b7a-b8ed-ef839bfc4eec/f6a5b8ecb28e1aa57d0a98b8a221fda76969ac9c--960w.jpg"
            alt="elelem Answer Engine in action"
            className="w-full object-cover"
          />
        </div>
      </section>

      {/* ── Brand Examples ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3" style={{ color: BRAND.dark }}>
            Join the World's Leading Brands like Netflix, Amazon, Sony,<br className="hidden md:block" /> Alibaba and more
          </h2>
          <p className="text-center text-gray-500 mb-3 font-medium">in providing a ChatGPT-style Answer Engine</p>
          <p className="text-center font-bold mb-12" style={{ color: BRAND.blue }}>See REAL examples below</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brands.map((b) => (
              <div key={b.name} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <img src={b.img} alt={b.name} className="w-full h-44 object-cover" />
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2" style={{ color: BRAND.dark }}>{b.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust logos ── */}
      <section className="py-16 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500 font-medium mb-8 uppercase tracking-widest">Trusted by leading demand generation, growth, and marketing teams</p>
          <img
            src="https://d2txn9w4uujjus.cloudfront.net/images/019b4019-8642-7b7a-b8ed-ef839bfc4eec/3a70a51ce4739e0408e194600daf7d4d66f83df0--960w.png"
            alt="Trusted brands"
            className="mx-auto max-w-3xl w-full opacity-80"
          />
        </div>
      </section>

      {/* ── Demand Intelligence ── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.dark }}>
              Demand Intelligence — Your Competitive Advantage
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Capture real buyer prompts, answer instantly with context, and use every conversation to grow revenue instead of losing it to external AI.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                {f.img && (
                  <img src={f.img} alt={f.title} className="w-full h-52 object-cover" />
                )}
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2" style={{ color: BRAND.dark }}>{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Measurement Framework ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: BRAND.dark }}>
                Build a New Measurement Framework for the AI Era
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Clicks are declining, but influence is not. elelem helps you track AI-assisted engagement, measure the conversion lift from Answer Engine users, and connect buyer questions directly to revenue outcomes. Instead of reporting on traffic and hoping for conversions, you can finally see the real path: demand to answer to decision to revenue.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://d2txn9w4uujjus.cloudfront.net/images/019b4019-8642-7b7a-b8ed-ef839bfc4eec/f25840f27fa3c3daa980a48ef42b60cf54d857b5--960w.jpg"
                alt="Measurement framework"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: BRAND.dark }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((f) => <FAQ key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── SEO/Pipeline callout ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: BRAND.dark }}>
            If You Rely On SEO, Paid Search or Content for Pipeline
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-lg leading-relaxed">
            You must understand what buyers want before they convert. AI has transformed how demand is generated. Brands that adapt will convert more existing demand, while those that don't will notice it in their pipeline.
          </p>
        </div>
      </section>

      {/* ── CTA Footer ── */}
      <section className="py-24" style={{ background: BRAND.dark }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stop Losing High-Intent Buyers to AI.
          </h2>
          <p className="text-lg mb-2" style={{ color: BRAND.mint }}>Capture the questions shaping your pipeline.</p>
          <p className="text-lg mb-2" style={{ color: BRAND.mint }}>Turn your website into an AI Answer Engine.</p>
          <p className="text-lg mb-10" style={{ color: BRAND.mint }}>Make AI visibility measurable.</p>
          <button
            onClick={() => navigate(createPageUrl("Setup"))}
            className="px-10 py-4 rounded-full text-base font-bold transition-opacity hover:opacity-90 shadow-xl"
            style={{ background: `linear-gradient(to right, ${BRAND.blue}, ${BRAND.mint})`, color: BRAND.dark }}
          >
            See it in Action
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6943f2bf67610e14801b112b/de87d19e0_elelem2025logoPrimary.png"
            alt="elelem"
            className="h-6"
          />
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} elelem. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}