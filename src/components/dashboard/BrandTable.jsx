import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function BrandTable({ data, title, showChange = true, companyName = "" }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 text-sm font-medium pb-3">Brand/Source</th>
                <th className="text-right text-slate-400 text-sm font-medium pb-3">Citations</th>
                <th className="text-right text-slate-400 text-sm font-medium pb-3">Share</th>
                {showChange && (
                  <th className="text-right text-slate-400 text-sm font-medium pb-3">Change</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => {
                const isCompany = companyName && item.name.toLowerCase().includes(companyName.toLowerCase());
                return (
                  <tr key={i} className="border-b border-slate-700/50 last:border-0">
                    <td className="py-3">
                      <span className={`${isCompany ? "text-teal-400 font-semibold" : "text-white"}`}>
                        {item.name}
                      </span>
                      </td>
                    <td className="text-right">
                      <span className="text-slate-300">{item.citations}</span>
                    </td>
                    <td className="text-right">
                      <Badge variant="outline" className="text-teal-400 border-teal-500/30">
                        {item.share}%
                      </Badge>
                    </td>
                    {showChange && (
                      <td className="text-right">
                        <div className={`flex items-center justify-end gap-1 ${
                          item.change > 0 ? "text-emerald-400" : item.change < 0 ? "text-red-400" : "text-slate-400"
                        }`}>
                          {item.change > 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : item.change < 0 ? (
                            <TrendingDown className="w-4 h-4" />
                          ) : (
                            <Minus className="w-4 h-4" />
                          )}
                          <span>{item.change > 0 ? "+" : ""}{item.change}%</span>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}