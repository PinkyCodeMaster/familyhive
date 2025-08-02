import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Calendar, TrendingDown } from "lucide-react";

type DebtProgressChartProps = {
  totalDebt: number;
  totalPaid: number;
  monthsRemaining: number;
  monthlyPayment?: number;
};

export default function DebtProgressChart({
  totalDebt,
  totalPaid,
  monthsRemaining,
  monthlyPayment = 0,
}: DebtProgressChartProps) {
  const progressPercentage =
    totalDebt > 0 ? (totalPaid / (totalDebt + totalPaid)) * 100 : 0;

  return (
    <Card className="luxury-card smooth-transition hover:shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Target className="w-5 h-5 text-emerald-600" />
          Debt Freedom Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700">
              Progress to Freedom
            </span>
            <span className="text-sm font-bold text-emerald-600">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-3 bg-slate-100"
            style={{
              "--progress-foreground":
                "linear-gradient(90deg, #10b981 0%, #059669 100%)",
            } as React.CSSProperties}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-medium text-slate-600">Time Left</span>
            </div>
            <p className="text-xl font-bold text-slate-800">{monthsRemaining} months</p>
          </div>

          <div className="bg-emerald-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">Monthly Payment</span>
            </div>
            <p className="text-xl font-bold text-emerald-700">
              £{monthlyPayment.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-1">Remaining Debt</p>
            <p className="text-2xl font-bold text-slate-800">
              £{totalDebt.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
