"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Income source options matching the database enum
const incomeSourceOptions = [
  { value: "job", label: "Job" },
  { value: "benefits", label: "Benefits" },
  { value: "gift", label: "Gift" },
  { value: "side_hustle", label: "Side Hustle" },
  { value: "other", label: "Other" },
] as const

// Frequency options matching the database enum
const frequencyOptions = [
  { value: "once", label: "One-time" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annually" },
] as const

// Zod validation schema
const incomeFormSchema = z.object({
  source: z.enum(["job", "benefits", "gift", "side_hustle", "other"], {
    message: "Please select an income source",
  }),
  from: z.string().min(1, "Source name is required").max(100, "Source name must be less than 100 characters"),
  amount: z.number({
    message: "Amount must be a number",
  }).positive("Amount must be positive").max(999999.99, "Amount must be less than $1,000,000"),
  date: z.date({
    message: "Date is required",
  }),
  isRecurring: z.boolean(),
  frequency: z.enum(["once", "weekly", "biweekly", "monthly", "quarterly", "annually"]).optional(),
  endDate: z.date().optional(),
}).refine((data) => {
  // If recurring is true, frequency is required
  if (data.isRecurring && !data.frequency) {
    return false
  }
  // If not recurring, frequency should be "once" or undefined
  if (!data.isRecurring && data.frequency && data.frequency !== "once") {
    return false
  }
  return true
}, {
  message: "Frequency is required for recurring income",
  path: ["frequency"],
}).refine((data) => {
  // End date should be after start date if provided
  if (data.endDate && data.endDate <= data.date) {
    return false
  }
  return true
}, {
  message: "End date must be after the start date",
  path: ["endDate"],
})

export type IncomeFormData = z.infer<typeof incomeFormSchema>

interface IncomeFormProps {
  income?: {
    id: string
    source: "job" | "benefits" | "gift" | "side_hustle" | "other"
    from: string
    amount: string
    date: string
    isRecurring: boolean
    frequency?: "once" | "weekly" | "biweekly" | "monthly" | "quarterly" | "annually" | null
    endDate?: string | null
  }
  onSubmit: (data: IncomeFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function IncomeForm({ income, onSubmit, onCancel, isLoading = false }: IncomeFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Transform existing income data for form
  const defaultValues: IncomeFormData = income ? {
    source: income.source,
    from: income.from,
    amount: parseFloat(income.amount),
    date: new Date(income.date),
    isRecurring: income.isRecurring,
    frequency: income.frequency || undefined,
    endDate: income.endDate ? new Date(income.endDate) : undefined,
  } : {
    source: "job",
    from: "",
    amount: 0,
    date: new Date(),
    isRecurring: false,
    frequency: undefined,
    endDate: undefined,
  }

  const form = useForm<IncomeFormData>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues,
  })

  const isRecurring = form.watch("isRecurring")

  const handleSubmit = async (data: IncomeFormData) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
    } catch (error) {
      console.error("Form submission error:", error)
      // Error handling is managed by the parent component
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty string for clearing
    if (value === "") {
      form.setValue("amount", 0)
      return
    }
    
    // Parse as float and validate
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      form.setValue("amount", numValue)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Income Source */}
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Income Source</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select income source" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {incomeSourceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Source Name */}
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Acme Corp, Social Security" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  The name of your employer, benefit provider, or income source
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="999999.99"
                      placeholder="0.00"
                      className="pl-8"
                      value={field.value || ""}
                      onChange={handleAmountChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When you received or expect to receive this income
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Recurring Income Toggle */}
        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  This is recurring income
                </FormLabel>
                <FormDescription>
                  Check this if you receive this income regularly (e.g., salary, benefits)
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Conditional Recurring Fields */}
        {isRecurring && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
            {/* Frequency */}
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {frequencyOptions.filter(option => option.value !== "once").map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date (Optional) */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>No end date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || (form.getValues("date") && date <= form.getValues("date"))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When this recurring income will stop (leave empty if ongoing)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? "Saving..." : income ? "Update Income" : "Add Income"}
          </Button>
        </div>
      </form>
    </Form>
  )
}