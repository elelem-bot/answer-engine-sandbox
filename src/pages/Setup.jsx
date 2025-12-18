import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { 
  ArrowRight, 
  Building2, 
  User, 
  Mail, 
  Briefcase, 
  Users, 
  MapPin,
  Globe,
  Target,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Setup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    contact_name: "",
    name: "",
    email: "",
    job_title: "",
    company_size: "",
    company_type: "",
    location: "",
    website_url: "",
    icp_description: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const company = await base44.entities.Company.create(formData);
      navigate(createPageUrl(`Approvals?companyId=${company.id}`));
    } catch (error) {
      console.error("Error creating company:", error);
      setIsLoading(false);
    }
  };

  const steps = [
    { num: 1, label: "Setup", active: true },
    { num: 2, label: "Approvals", active: false },
    { num: 3, label: "Dashboard", active: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">e</span>
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">elelem</span>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4">
            {steps.map((step, i) => (
              <React.Fragment key={step.num}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.active 
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white" 
                      : "bg-slate-800 text-slate-500"
                  }`}>
                    {step.num}
                  </div>
                  <span className={step.active ? "text-white" : "text-slate-500"}>{step.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-px bg-slate-800" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-3">Let's Set Up Your Account</h1>
            <p className="text-slate-400">Tell us about your business so we can analyze your AI search visibility</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-400" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Full Name</Label>
                  <Input
                    placeholder="John Smith"
                    value={formData.contact_name}
                    onChange={(e) => handleChange("contact_name", e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Job Title</Label>
                  <Input
                    placeholder="Marketing Director"
                    value={formData.job_title}
                    onChange={(e) => handleChange("job_title", e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Location</Label>
                  <Input
                    placeholder="London, UK"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-400" />
                  Company Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Company Name</Label>
                  <Input
                    placeholder="Acme Inc"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Company Size</Label>
                  <Select value={formData.company_size} onValueChange={(v) => handleChange("company_size", v)}>
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Company Type</Label>
                  <Select value={formData.company_type} onValueChange={(v) => handleChange("company_type", v)}>
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B2B">B2B</SelectItem>
                      <SelectItem value="B2C">B2C</SelectItem>
                      <SelectItem value="B2B2C">B2B2C</SelectItem>
                      <SelectItem value="Marketplace">Marketplace</SelectItem>
                      <SelectItem value="SaaS">SaaS</SelectItem>
                      <SelectItem value="Agency">Agency</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Website URL</Label>
                  <Input
                    type="url"
                    placeholder="https://www.company.com"
                    value={formData.website_url}
                    onChange={(e) => handleChange("website_url", e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-teal-400" />
                  Ideal Customer Profile (ICP)
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Describe your ideal customer, their challenges, and what problems you solve for them
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., Our ideal customer is an HR manager in B2B tech that is struggling to manage remote teams, payment and management. They typically have 50-200 employees and are looking for solutions to streamline their HR processes..."
                  value={formData.icp_description}
                  onChange={(e) => handleChange("icp_description", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 min-h-[150px]"
                  required
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                type="submit"
                size="lg"
                disabled={isLoading}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Next Step
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}