'use client'

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error('Email and password are required')
            return
        }

        setIsLoading(true)

        await authClient.signIn.email(
            {
                email,
                password,
                callbackURL: '/dashboard',
                rememberMe: false,
            },
            {
                onRequest: () => {
                    // Already in loading state
                },
                onSuccess: () => {
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
                <h1 className="text-2xl font-semibold text-center">Login</h1>

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
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>
            </form>
        </div>
    )
}
