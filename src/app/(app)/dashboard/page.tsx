"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, PiggyBank, CreditCard, Target } from "lucide-react";
import FinancialSummaryCard from "@/components/dashboard/financial-summary-card";
import DebtProgressChart from "@/components/dashboard/debt-progress-chart";
// Define types matching your DB schema
type Income = {
  id: string;
  amount: string;
};

type Expense = {
  id: string;
  amount: string;
};

type Debt = {
  id: string;
  balance: string;
  apr?: string | null;
  minPayment?: string | null;
  debt_name?: string; // add if you store name or else creditor
  creditor?: string;
};

export default function Dashboard() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [incomeData, expenseData, debtData] = await Promise.all([
        fetch("/api/income").then((res) => res.json()),
        fetch("/api/expense").then((res) => res.json()),
        fetch("/api/debt").then((res) => res.json()),
      ]);

      setIncomes(incomeData);
      setExpenses(expenseData);
      setDebts(debtData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  // Helper to parse DB numeric strings to numbers safely
  const parseAmount = (value: string | null | undefined): number =>
    value ? parseFloat(value) : 0;

  // Calculate totals dynamically
  const totalIncome = incomes.reduce((sum, income) => sum + parseAmount(income.amount), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseAmount(expense.amount), 0);
  const totalDebt = debts.reduce((sum, debt) => sum + parseAmount(debt.balance), 0);
  const totalMinimumPayments = debts.reduce(
    (sum, debt) => sum + parseAmount(debt.minPayment),
    0
  );
  const surplus = totalIncome - totalExpenses;
  const availableForDebt = Math.max(0, surplus - totalMinimumPayments);

  // Debt snowball calculation (simplified)
  const calculateDebtSnowball = () => {
    if (!debts.length) return { months: 0, payment: 0 };

    // Sort debts by balance ascending
    const sortedDebts = debts
      .map((d) => ({
        ...d,
        balance: parseAmount(d.balance),
        apr: d.apr ? parseFloat(d.apr) : 0,
        minPayment: d.minPayment ? parseFloat(d.minPayment) : 0,
      }))
      .sort((a, b) => a.balance - b.balance);

    const remainingDebts = sortedDebts.map((d) => ({ ...d }));
    let months = 0;
    const totalPayment = totalMinimumPayments + availableForDebt;

    while (remainingDebts.length > 0 && months < 600) {
      months++;
      let extraPayment = availableForDebt;

      for (let i = 0; i < remainingDebts.length; i++) {
        const debt = remainingDebts[i];
        const monthlyInterest = (debt.balance * debt.apr) / 100 / 12;
        let payment = debt.minPayment;

        if (i === 0) {
          payment += extraPayment;
        }

        const principalPayment = payment - monthlyInterest;
        debt.balance -= principalPayment;

        if (debt.balance <= 0) {
          extraPayment += debt.minPayment;
          remainingDebts.splice(i, 1);
          i--;
        }
      }
    }

    return { months, payment: totalPayment };
  };

  const { months: monthsToFreedom, payment: monthlyDebtPayment } = calculateDebtSnowball();

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="animate-pulse">
          <div className="h-8  rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">

        <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Financial Dashboard
              </h1>
              <p className="text-slate-700 text-lg">
                Your journey to financial freedom starts here
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <FinancialSummaryCard
                title="Monthly Income"
                amount={totalIncome}
                trend="All sources combined"
                icon={TrendingUp}
                bgGradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
              />

              <FinancialSummaryCard
                title="Monthly Expenses"
                amount={totalExpenses}
                trend="Essential & non-essential"
                icon={PiggyBank}
                bgGradient="bg-gradient-to-br from-amber-500 to-amber-600"
              />

              <FinancialSummaryCard
                title="Money Left Over"
                amount={surplus}
                trend={surplus > 0 ? "Available for debt payment" : "Review your expenses"}
                trendDirection={surplus > 0 ? "up" : "down"}
                icon={surplus > 0 ? TrendingUp : TrendingDown}
                bgGradient={
                  surplus > 0
                    ? "bg-gradient-to-br from-blue-500 to-blue-600"
                    : "bg-gradient-to-br from-red-500 to-red-600"
                }
              />

              <FinancialSummaryCard
                title="Total Debt"
                amount={totalDebt}
                trend={debts.length > 0 ? `${debts.length} debts to tackle` : "Debt free!"}
                icon={CreditCard}
                bgGradient="bg-gradient-to-br from-slate-600 to-slate-700"
              />
            </div>

            {/* Debt Progress Section */}
            {debts.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <DebtProgressChart
                  totalDebt={totalDebt}
                  totalPaid={0}
                  monthsRemaining={monthsToFreedom}
                  monthlyPayment={monthlyDebtPayment}
                />

                <div className="luxury-card p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    Debt Snowball Plan
                  </h3>
                  <div className="space-y-4">
                    {[...debts]
                      .map((d) => ({
                        ...d,
                        balance: parseAmount(d.balance),
                        apr: d.apr ? parseFloat(d.apr) : 0,
                        minPayment: d.minPayment ? parseFloat(d.minPayment) : 0,
                        debt_name: d.creditor || "Unnamed Debt",
                      }))
                      .sort((a, b) => a.balance - b.balance)
                      .slice(0, 3)
                      .map((debt, index) => (
                        <div
                          key={debt.id}
                          className={`p-4 rounded-lg border-2 ${index === 0
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-slate-100 bg-slate-50"
                            }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-slate-800">
                                {index === 0 && "🎯 "} {debt.debt_name}
                              </h4>
                              <p className="text-sm text-slate-700">{debt.apr}% APR</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-800">
                                £{debt.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </p>
                              <p className="text-sm text-slate-700">
                                £{debt.minPayment.toFixed(2)}/month min
                              </p>
                            </div>
                          </div>
                          {index === 0 && (
                            <div className="mt-2 text-sm text-emerald-700 font-medium">
                              Focus all extra payments here first!
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="luxury-card p-6 text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{incomes.length}</div>
                <div className="text-slate-700 font-medium">Income Sources</div>
              </div>

              <div className="luxury-card p-6 text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">{expenses.length}</div>
                <div className="text-slate-700 font-medium">Monthly Expenses</div>
              </div>

              <div className="luxury-card p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">{debts.length}</div>
                <div className="text-slate-700 font-medium">Active Debts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
