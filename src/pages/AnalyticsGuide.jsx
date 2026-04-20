import React, { useRef } from "react";

export default function AnalyticsGuide() {
  const printRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Print button — hidden when printing */}
      <div className="max-w-4xl mx-auto mb-4 flex justify-end print:hidden">
        <button
          onClick={handlePrint}
          className="px-6 py-2.5 rounded-full text-sm font-semibold text-white shadow"
          style={{ background: "linear-gradient(to right, #2DC6FE, #81FBEF)", color: "#082D35" }}
        >
          ⬇ Download / Print as PDF
        </button>
      </div>

      {/* Document */}
      <div
        ref={printRef}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden print:shadow-none print:rounded-none"
        style={{ fontFamily: "'Google Sans', sans-serif" }}
      >
        {/* Cover */}
        <div className="px-12 py-14 text-white" style={{ background: "linear-gradient(135deg, #082D35 0%, #0a4a5a 60%, #0d6070 100%)" }}>
          <div className="mb-6">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6943f2bf67610e14801b112b/de87d19e0_elelem2025logoPrimary.png"
              alt="elelem"
              className="h-8 mb-8 opacity-90"
            />
          </div>
          <h1 className="text-4xl font-bold mb-3 leading-tight">Answer Engine Analytics</h1>
          <p className="text-xl opacity-80 mb-2">User Guide</p>
          <p className="text-sm opacity-50 mt-8">elelem platform · April 2026</p>
        </div>

        {/* Body */}
        <div className="px-12 py-10 space-y-10 text-gray-800">

          {/* Intro */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 pb-2 border-b-2" style={{ borderColor: "#2DC6FE" }}>
              Overview
            </h2>
            <p className="text-sm leading-relaxed text-gray-600">
              The <strong>Answer Engine Analytics</strong> page gives you a real-time view of how your AI-powered Answer Engine is performing. It tracks every question a visitor asks, how the AI responds, and whether those conversations lead to meaningful outcomes like demo bookings. Use this page to identify content gaps, understand visitor intent, and improve conversion over time.
            </p>
          </section>

          {/* Summary Stats */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 pb-2 border-b-2" style={{ borderColor: "#2DC6FE" }}>
              1. Summary Stats (Top Row)
            </h2>
            <p className="text-sm text-gray-600 mb-4">Five cards give you an instant pulse-check on performance:</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: "#f0fdfe" }}>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200 w-1/3">Metric</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">What it means</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Total Questions", "How many unique questions visitors have asked the AI engine."],
                  ["Answers Provided", "How many questions received a successful AI response, shown as a count and percentage."],
                  ["Conversion Rate", "Percentage of conversations that ended in a demo booking."],
                  ["Failed Answers", "Questions the AI couldn't answer — a direct indicator of content gaps on your website."],
                  ["Avg Session", "How long visitors typically spend chatting with the engine (estimated at 3:45)."],
                ].map(([metric, desc], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 font-semibold text-gray-800 border border-gray-200">{metric}</td>
                    <td className="p-3 text-gray-600 border border-gray-200">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-3 italic">
              💡 A high Failed Answers count means your website content may need to be expanded or re-indexed in the Answer Engine.
            </p>
          </section>

          {/* Conversion Funnel */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 pb-2 border-b-2" style={{ borderColor: "#2DC6FE" }}>
              2. Conversion Funnel
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              This card tracks the visitor journey from arrival to conversion, showing how many people make it through each step. Each row has a count, a progress bar, and a percentage badge showing the rate relative to the step above.
            </p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: "#f0fdfe" }}>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200 w-1/3">Stage</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">What it means</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Page Views", "Total number of times the Answer Engine was loaded or seen by a visitor."],
                  ["Questions Asked", "How many of those viewers typed a question. Shows your engagement rate from views."],
                  ["Answers Provided", "How many questions received a successful AI response. Ideally close to 100%."],
                  ["Demo Bookings", "How many conversations resulted in a demo booking — your ultimate conversion metric."],
                ].map(([stage, desc], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 font-semibold text-gray-800 border border-gray-200">{stage}</td>
                    <td className="p-3 text-gray-600 border border-gray-200">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-3 italic">
              💡 The percentage badge at each stage shows the rate relative to the stage above — not relative to total page views.
            </p>
          </section>

          {/* Engagement Quality */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 pb-2 border-b-2" style={{ borderColor: "#2DC6FE" }}>
              3. Engagement Quality
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              While the Conversion Funnel tracks volume and drop-off, Engagement Quality focuses on the <em>depth and intent</em> of interactions. It uses the same progress bar format but measures different things:
            </p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: "#f0fdfe" }}>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200 w-1/3">Metric</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">What it means</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Bottom Funnel Questions", "Questions that signal strong purchase intent (e.g. pricing, trials, 'how do I buy'). You want this to grow over time."],
                  ["Questions with Answers", "How many questions the AI successfully answered. 100% means your indexed content is working well."],
                  ["Demo Bookings", "Same metric as the Conversion Funnel — shown here as a quality outcome, not just a volume stat."],
                ].map(([metric, desc], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 font-semibold text-gray-800 border border-gray-200">{metric}</td>
                    <td className="p-3 text-gray-600 border border-gray-200">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 p-4 rounded-lg text-sm" style={{ background: "#f0fdfe", border: "1px solid #2DC6FE33" }}>
              <p className="font-semibold text-gray-800 mb-2">Conversion Funnel vs. Engagement Quality — Key Difference</p>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-white">
                    <th className="text-left p-2 border border-gray-200"></th>
                    <th className="text-left p-2 border border-gray-200 font-semibold">Conversion Funnel</th>
                    <th className="text-left p-2 border border-gray-200 font-semibold">Engagement Quality</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Focus", "Volume & drop-off at each stage", "Quality & intent of interactions"],
                    ["Starts from", "Page Views (did they see it?)", "Bottom-funnel questions (were they high-intent?)"],
                    ["Key question", "Where are visitors dropping off?", "Are the right visitors engaging well?"],
                  ].map(([label, a, b], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-2 font-semibold border border-gray-200">{label}</td>
                      <td className="p-2 border border-gray-200 text-gray-600">{a}</td>
                      <td className="p-2 border border-gray-200 text-gray-600">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Key Insights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 pb-2 border-b-2" style={{ borderColor: "#2DC6FE" }}>
              4. Key Insights
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Three auto-generated insight cards surface the most notable patterns from your data. These update automatically as more visitors use your Answer Engine.
            </p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: "#f0fdfe" }}>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200 w-1/3">Insight</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">What it means</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["🎯 High Intent Traffic", "Shows how many bottom-funnel (purchase-ready) questions were asked. Sets a baseline to track as traffic grows."],
                  ["📈 Growing Engagement", "Reports the average session time. A higher number (e.g. 3:45) indicates visitors are genuinely engaged with the AI."],
                  ["💡 Top Topic", "Identifies the most frequently mentioned keyword across all conversations — use this to prioritise your content strategy."],
                ].map(([insight, desc], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 font-semibold text-gray-800 border border-gray-200">{insight}</td>
                    <td className="p-3 text-gray-600 border border-gray-200">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Charts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 pb-2 border-b-2" style={{ borderColor: "#2DC6FE" }}>
              5. Charts
            </h2>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <p className="font-semibold text-gray-800 mb-1">Questions & Conversions Trend (Area Chart)</p>
                <p>Shows daily activity over the last 30 days. The teal area represents total questions; the cyan area shows demo conversions. Look for spikes that correlate with campaigns or content you published.</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <p className="font-semibold text-gray-800 mb-1">Funnel Stage Distribution (Pie Chart)</p>
                <p>Breaks down all questions into <strong>Top</strong> (awareness), <strong>Middle</strong> (consideration), and <strong>Bottom</strong> (decision) funnel stages. A healthy mix skews toward middle and bottom — indicating purchase-intent visitors.</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <p className="font-semibold text-gray-800 mb-1">Top Topics (Bar Chart)</p>
                <p>The keywords most frequently extracted from visitor questions. Use this to identify what your buyers care about most — valuable input for content, FAQs, and prompt engineering.</p>
              </div>
            </div>
          </section>

          {/* Action Guide */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 pb-2 border-b-2" style={{ borderColor: "#2DC6FE" }}>
              6. How to Act on the Data
            </h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: "#f0fdfe" }}>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200 w-1/2">If you see…</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Do this</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["High Failed Answers", "Go to Answer Engine → re-index your site or expand your content"],
                  ["Mostly Top-of-funnel questions", "Visitors are early-stage — consider nurturing content and stronger mid-funnel prompts"],
                  ["Low Demo Booking conversion", "Check your CTA settings in Sandbox Settings and adjust sales intensity"],
                  ["Recurring Top Topics", "Add those as tracked Prompts in the Prompts page for deeper visibility analysis"],
                  ["Low Questions Asked vs Page Views", "Improve your opening message or add suggested questions to the engine"],
                ].map(([trigger, action], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 text-gray-700 border border-gray-200 font-medium">{trigger}</td>
                    <td className="p-3 text-gray-600 border border-gray-200">{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Footer */}
          <div className="pt-6 border-t border-gray-200 text-xs text-gray-400 flex justify-between">
            <span>elelem · Answer Engine Analytics User Guide</span>
            <span>April 2026</span>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
          @page { margin: 0.5in; size: A4; }
        }
      `}</style>
    </div>
  );
}