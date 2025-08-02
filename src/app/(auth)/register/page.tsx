'use client'

import React, { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!email || !password || !name) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsLoading(true)

        await authClient.signUp.email(
            {
                email,
                password,
                name,
                callbackURL: '/dashboard',
            },
            {
                onSuccess: () => {
                    toast.success('Registration successful! Check your email to verify.')
                    window.location.href = '/dashboard'
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message)
                    setIsLoading(false)
                },
            }
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <form
                onSubmit={handleSubmit}
                className={cn(
                    'w-full max-w-md space-y-6 rounded-lg border p-8 shadow-sm'
                )}
            >
                <h1 className="text-2xl font-semibold text-center">Register</h1>

                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>


                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Registering...' : 'Register'}
                </Button>
            </form>
        </div>
    )
}
