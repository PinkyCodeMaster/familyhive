import type { IncomeFormData } from "@/components/dashboard/income-form"

// API response types
export interface Income {
  id: string
  userId: string
  source: "job" | "benefits" | "gift" | "side_hustle" | "other"
  from: string
  amount: string
  date: string
  isRecurring: boolean
  frequency?: "once" | "weekly" | "biweekly" | "monthly" | "quarterly" | "annually" | null
  endDate?: string | null
  createdAt: string
  updatedAt: string
}

export interface ApiError {
  message: string
  status: number
  field?: string
}

// Transform form data to API format
export const transformFormToApi = (formData: IncomeFormData, userId: string): Partial<Income> => ({
  userId,
  source: formData.source,
  from: formData.from,
  amount: formData.amount.toString(),
  date: formData.date.toISOString(),
  isRecurring: formData.isRecurring,
  frequency: formData.isRecurring ? formData.frequency : "once",
  endDate: formData.endDate?.toISOString() || null,
})

// Transform API data to form format
export const transformApiToForm = (income: Income): IncomeFormData => ({
  source: income.source,
  from: income.from,
  amount: parseFloat(income.amount),
  date: new Date(income.date),
  isRecurring: income.isRecurring,
  frequency: income.frequency || undefined,
  endDate: income.endDate ? new Date(income.endDate) : undefined,
})

// API error handler
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Response) {
    return {
      message: error.statusText || "An error occurred",
      status: error.status,
    }
  }
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
    }
  }
  return {
    message: "An unexpected error occurred",
    status: 500,
  }
}

// Create income
export const createIncome = async (formData: IncomeFormData, userId: string): Promise<Income> => {
  const apiData = transformFormToApi(formData, userId)
  
  const response = await fetch("/api/income", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify(apiData),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || "Failed to create income")
  }

  return response.json()
}

// Update income
export const updateIncome = async (
  incomeId: string,
  formData: IncomeFormData,
  userId: string
): Promise<Income> => {
  const apiData = transformFormToApi(formData, userId)
  
  const response = await fetch(`/api/income/${incomeId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify(apiData),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || "Failed to update income")
  }

  return response.json()
}

// Delete income
export const deleteIncome = async (incomeId: string, userId: string): Promise<void> => {
  const response = await fetch(`/api/income/${incomeId}`, {
    method: "DELETE",
    headers: {
      "x-user-id": userId,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || "Failed to delete income")
  }
}

// Get all incomes
export const getIncomes = async (userId: string): Promise<Income[]> => {
  const response = await fetch("/api/income", {
    headers: {
      "x-user-id": userId,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || "Failed to fetch incomes")
  }

  return response.json()
}