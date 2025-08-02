import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

type FinancialSummaryCardProps = {
  title: string;
  amount: number | string;
  trend?: string;
  trendDirection?: "up" | "down";
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  bgGradient?: string;
  textColor?: string;
};

export default function FinancialSummaryCard({
  title,
  amount,
  trend,
  trendDirection = "up",
  icon: Icon,
  bgGradient = "bg-gradient-to-br from-slate-600 to-slate-700",
  textColor = "text-white",
}: FinancialSummaryCardProps) {
  return (
    <Card
      className={`overflow-hidden border-0 ${bgGradient} smooth-transition hover:shadow-xl hover:scale-105`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-sm font-semibold ${textColor} opacity-90`}>
            {title}
          </CardTitle>
          {Icon && <Icon className={`w-5 h-5 ${textColor} opacity-80`} />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className={`text-2xl font-bold ${textColor}`}>
            £
            {typeof amount === "number"
              ? amount.toLocaleString()
              : amount}
          </p>
          {trend && (
            <div className="flex items-center gap-1">
              {trendDirection === "up" ? (
                <TrendingUp className={`w-4 h-4 ${textColor} opacity-70`} />
              ) : (
                <TrendingDown className={`w-4 h-4 ${textColor} opacity-70`} />
              )}
              <span className={`text-xs ${textColor} opacity-80`}>{trend}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
