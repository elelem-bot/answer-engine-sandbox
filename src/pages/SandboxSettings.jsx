import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Save, Loader2, RefreshCw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

const DEFAULT_SETTINGS = {
  tone_of_voice: "professional",
  sales_intensity: 3,
  answer_length: "medium",
  target_audience: "",
  language_style: "clear",
  use_emojis: false,
  include_cta: true,
  cta_style: "soft",
  objection_handling: true,
  competitor_mentions: "avoid",
  show_pricing: "on_request",
  fallback_message: "I'm afraid I can't answer that at present. Would you like to speak with one of our sales representatives?",
  custom_instructions: "",
  feedback_overlay: "",
};

export default function SandboxSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [company, setCompany] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const companies = await base44.entities.Company.list();
        if (companies.length > 0) {
          setCompany(companies[0]);
          if (companies[0].sandbox_settings) {
            setSettings({ ...DEFAULT_SETTINGS, ...companies[0].sandbox_settings });
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const set = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!company) return;
    setIsSaving(true);
    try {
      await base44.entities.Company.update(company.id, { sandbox_settings: settings });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => setSettings(DEFAULT_SETTINGS);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#2DC6FE]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sandbox Settings</h1>
            <p className="text-gray-500 mt-1 text-sm">Configure the behaviour of your Answer Engine system prompt</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} className="border-gray-300 text-gray-600">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              style={{ background: "linear-gradient(to right,#2DC6FE,#81FBEF)", color: "#082D35", border: "none" }}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
              {saved ? "Saved!" : "Save Settings"}
            </Button>
          </div>
        </div>

        {/* Persona & Tone */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 text-base">Persona & Tone</CardTitle>
            <CardDescription>Shape how the AI communicates with visitors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-gray-700">Tone of Voice</Label>
                <Select value={settings.tone_of_voice} onValueChange={v => set("tone_of_voice", v)}>
                  <SelectTrigger className="bg-white border-gray-300"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly & Conversational</SelectItem>
                    <SelectItem value="formal">Formal & Corporate</SelectItem>
                    <SelectItem value="casual">Casual & Relaxed</SelectItem>
                    <SelectItem value="expert">Expert & Technical</SelectItem>
                    <SelectItem value="empathetic">Empathetic & Supportive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Language Style</Label>
                <Select value={settings.language_style} onValueChange={v => set("language_style", v)}>
                  <SelectTrigger className="bg-white border-gray-300"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clear">Clear & Simple</SelectItem>
                    <SelectItem value="jargon_free">Jargon-Free</SelectItem>
                    <SelectItem value="technical">Technical / Domain-Specific</SelectItem>
                    <SelectItem value="storytelling">Storytelling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Target Audience</Label>
              <Textarea
                value={settings.target_audience}
                onChange={e => set("target_audience", e.target.value)}
                placeholder="e.g., Marketing managers at mid-size SaaS companies, or technical decision-makers in financial services..."
                className="bg-white border-gray-300 text-gray-900 min-h-[80px] resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-700">Use Emojis</Label>
                <p className="text-xs text-gray-400 mt-0.5">Allow emojis in responses</p>
              </div>
              <Switch checked={settings.use_emojis} onCheckedChange={v => set("use_emojis", v)} />
            </div>
          </CardContent>
        </Card>

        {/* Sales Behaviour */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 text-base">Sales Behaviour</CardTitle>
            <CardDescription>Control how proactively the AI drives commercial outcomes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-gray-700">Sales Intensity</Label>
                <span className="text-sm font-semibold text-[#082D35] bg-[#2DC6FE]/10 px-2 py-0.5 rounded-full">
                  {["Off", "Subtle", "Moderate", "Active", "Aggressive"][settings.sales_intensity - 1] || settings.sales_intensity}
                </span>
              </div>
              <Slider
                min={1} max={5} step={1}
                value={[settings.sales_intensity]}
                onValueChange={([v]) => set("sales_intensity", v)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Informational only</span>
                <span>Highly sales-led</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-gray-700">CTA Style</Label>
                <Select value={settings.cta_style} onValueChange={v => set("cta_style", v)}>
                  <SelectTrigger className="bg-white border-gray-300"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No CTA</SelectItem>
                    <SelectItem value="soft">Soft Suggestion</SelectItem>
                    <SelectItem value="direct">Direct Ask</SelectItem>
                    <SelectItem value="urgent">Urgency-Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Competitor Mentions</Label>
                <Select value={settings.competitor_mentions} onValueChange={v => set("competitor_mentions", v)}>
                  <SelectTrigger className="bg-white border-gray-300"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="avoid">Avoid Entirely</SelectItem>
                    <SelectItem value="neutral">Neutral Acknowledgement</SelectItem>
                    <SelectItem value="compare_positive">Positive Comparison</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700">Include CTA in answers</Label>
                  <p className="text-xs text-gray-400 mt-0.5">Append a call-to-action</p>
                </div>
                <Switch checked={settings.include_cta} onCheckedChange={v => set("include_cta", v)} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700">Handle Objections</Label>
                  <p className="text-xs text-gray-400 mt-0.5">Proactively address concerns</p>
                </div>
                <Switch checked={settings.objection_handling} onCheckedChange={v => set("objection_handling", v)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Pricing Transparency</Label>
              <Select value={settings.show_pricing} onValueChange={v => set("show_pricing", v)}>
                <SelectTrigger className="bg-white border-gray-300"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="always">Always share pricing info</SelectItem>
                  <SelectItem value="on_request">Only when directly asked</SelectItem>
                  <SelectItem value="never">Never — direct to sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Answer Format */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 text-base">Answer Format</CardTitle>
            <CardDescription>Control how responses are structured and sized</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-gray-700">Answer Length</Label>
              <Select value={settings.answer_length} onValueChange={v => set("answer_length", v)}>
                <SelectTrigger className="bg-white border-gray-300"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">Brief (1–2 sentences)</SelectItem>
                  <SelectItem value="medium">Medium (short paragraph)</SelectItem>
                  <SelectItem value="detailed">Detailed (multi-paragraph)</SelectItem>
                  <SelectItem value="adaptive">Adaptive (match question complexity)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Fallback / Unknown Answer Message</Label>
              <Textarea
                value={settings.fallback_message}
                onChange={e => set("fallback_message", e.target.value)}
                className="bg-white border-gray-300 text-gray-900 min-h-[80px] resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Custom Instructions */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 text-base">Custom System Instructions</CardTitle>
            <CardDescription>Free-form instructions appended to the system prompt</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={settings.custom_instructions}
              onChange={e => set("custom_instructions", e.target.value)}
              placeholder="e.g., Always emphasise our 24/7 support. Never discuss our acquisition history. Mention our free trial when relevant..."
              className="bg-white border-gray-300 text-gray-900 min-h-[120px] resize-none"
            />
          </CardContent>
        </Card>

        {/* Feedback Overlay */}
        <Card className="bg-white border-gray-200 border-l-4" style={{ borderLeftColor: "#2DC6FE" }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-gray-900 text-base">Feedback Overlay</CardTitle>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#2DC6FE20", color: "#082D35" }}>Visible in engine</span>
            </div>
            <CardDescription>This message appears as a banner overlay on top of the Answer Engine for testers / reviewers</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={settings.feedback_overlay}
              onChange={e => set("feedback_overlay", e.target.value)}
              placeholder="e.g., 🧪 You are testing this engine. Please note any incorrect or off-brand responses using the feedback panel."
              className="bg-white border-gray-300 text-gray-900 min-h-[80px] resize-none"
            />
            {settings.feedback_overlay && (
              <div className="mt-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white flex items-center gap-2"
                style={{ background: "linear-gradient(to right,#2DC6FE,#81FBEF)", color: "#082D35" }}>
                <Info className="w-4 h-4 flex-shrink-0" />
                {settings.feedback_overlay}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bottom Save */}
        <div className="flex justify-end pb-8">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            style={{ background: "linear-gradient(to right,#2DC6FE,#81FBEF)", color: "#082D35", border: "none" }}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saved ? "Saved!" : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}