import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ title, value, change, changeType, icon: Icon }) {
  const isPositive = changeType === "positive";
  
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            {change && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{change}</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20">
              <Icon className="w-5 h-5 text-teal-400" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}