"use client"

import * as React from "react"
import { IncomeForm, type IncomeFormData } from "./income-form"
import { createIncome, updateIncome, type Income } from "@/lib/income-api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface IncomeFormExampleProps {
  userId: string
  income?: Income
  onSuccess?: () => void
}

export function IncomeFormExample({ userId, income, onSuccess }: IncomeFormExampleProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (data: IncomeFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      if (income) {
        // Update existing income
        await updateIncome(income.id, data, userId)
      } else {
        // Create new income
        await createIncome(data, userId)
      }

      setIsOpen(false)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setError(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={income ? "outline" : "default"}>
          {income ? "Edit Income" : "Add Income"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {income ? "Edit Income Source" : "Add Income Source"}
          </DialogTitle>
          <DialogDescription>
            {income 
              ? "Update your income source details below."
              : "Add a new income source to track your earnings."
            }
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <IncomeForm
          income={income}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}