'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Recycle, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Role = 'citizen' | 'admin'
type Mode = 'signin' | 'signup'

const SECTORS = [
  { value: 'Downtown Sector', label: 'Downtown Sector' },
  { value: 'Sector 4 Market', label: 'Sector 4 Market (Ward 4)' },
  { value: 'Station Road', label: 'Station Road (Ward 7)' },
  { value: 'Riverside Walk', label: 'Riverside Walk (Ward 9)' },
  { value: 'Industrial Area Ph. 2', label: 'Industrial Area Phase 2 (Ward 12)' },
  { value: 'Old Town', label: 'Old Town (Ward 3)' },
]

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [role, setRole] = useState<Role>('citizen')
  const [mode, setMode] = useState<Mode>('signin')

  // Form inputs
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(true)

  // Sign up inputs
  const [fullName, setFullName] = useState('')
  const [sector, setSector] = useState(SECTORS[0].value)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Support pre-selection via URL query parameter ?role=admin or default to citizen
  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (roleParam === 'admin') {
      setRole('admin')
    } else if (roleParam === 'citizen') {
      setRole('citizen')
    }
  }, [searchParams])

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole)
    setError(null)
    setSuccessMessage(null)
  }

  const handleAutofillDemo = () => {
    setIdentifier('admin')
    setPassword('admin123')
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsLoading(true)

    try {
      // 1. Check for Demo Admin bypass
      const isDemoAdmin =
        (role === 'admin' || identifier.trim() === 'admin') &&
        identifier.trim() === 'admin' &&
        password.trim() === 'admin123'

      if (isDemoAdmin) {
        await new Promise((r) => setTimeout(r, 400))
        router.push('/admin')
        return
      }

      if (mode === 'signin') {
        // Sign-in mode
        if (!identifier.trim() || !password.trim()) {
          setError('Please provide both credentials to sign in.')
          setIsLoading(false)
          return
        }

        const { error: authError } = await supabase.auth.signInWithPassword({
          email: identifier.trim(),
          password: password.trim(),
        })

        if (authError) {
          setError(authError.message || 'Invalid credentials. Please verify and try again.')
          setIsLoading(false)
          return
        }

        // On success: route appropriately
        if (role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/citizen')
        }
      } else {
        // Sign-up mode
        if (!fullName.trim()) {
          setError('Please enter your full name.')
          setIsLoading(false)
          return
        }

        if (!identifier.trim()) {
          setError('Please provide an email or phone number.')
          setIsLoading(false)
          return
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters long.')
          setIsLoading(false)
          return
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match. Please re-enter.')
          setIsLoading(false)
          return
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email: identifier.trim(),
          password: password.trim(),
          options: {
            data: {
              full_name: fullName.trim(),
              sector,
              role,
            },
          },
        })

        if (signUpError) {
          setError(signUpError.message || 'Failed to create account. Please try again.')
          setIsLoading(false)
          return
        }

        setSuccessMessage('Account created successfully! Redirecting…')
        await new Promise((r) => setTimeout(r, 600))

        if (role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/citizen')
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col gap-6">
      {/* Logo / Brand Header */}
      <div>
        <Link
          href="/"
          className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold mx-auto mb-2 shadow-xs hover:bg-emerald-700 transition-colors"
          aria-label="CleanSync Home"
        >
          <Recycle className="size-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight text-center">
          {mode === 'signin' ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="mt-1 text-sm text-slate-500 text-center">
          {mode === 'signup'
            ? role === 'citizen'
              ? 'Join your neighbourhood to report and track local waste issues.'
              : 'Register an authority account for sanitation management.'
            : role === 'citizen'
              ? 'Sign in to report issues and track your complaints.'
              : 'Sign in to manage municipal dispatches and crews.'}
        </p>
      </div>

      {/* Role Toggle (Segmented Pill) */}
      <div className="p-1 bg-slate-100 rounded-xl border border-slate-200 flex" role="tablist" aria-label="User role">
        <button
          type="button"
          role="tab"
          aria-selected={role === 'citizen'}
          onClick={() => handleRoleChange('citizen')}
          className={`py-2 flex-1 text-center text-sm font-medium rounded-lg transition-all ${
            role === 'citizen'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Citizen
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={role === 'admin'}
          onClick={() => handleRoleChange('admin')}
          className={`py-2 flex-1 text-center text-sm font-medium rounded-lg transition-all ${
            role === 'admin'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Admin
        </button>
      </div>

      {/* Error / Success Notifications */}
      {error && (
        <div
          role="alert"
          className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3 flex items-start gap-2 animate-in fade-in duration-150"
        >
          <AlertCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl p-3 flex items-start gap-2 animate-in fade-in duration-150"
        >
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
          <span className="leading-relaxed">{successMessage}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === 'signup' && (
          <>
            <div>
              <label htmlFor="full-name" className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
              />
            </div>

            <div>
              <label htmlFor="sector-select" className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">
                Sector / Ward
              </label>
              <select
                id="sector-select"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
              >
                {SECTORS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label htmlFor="identifier" className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">
            {role === 'citizen' ? 'Email or phone' : 'Admin ID or work email'}
          </label>
          <input
            id="identifier"
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={role === 'citizen' ? 'citizen@cleansync.city' : 'admin@cleansync.city or admin'}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 pr-10 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {mode === 'signup' && (
          <div>
            <label htmlFor="confirm-password" className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 block">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Helper Row (Sign In Only) */}
        {mode === 'signin' && (
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <span>Keep me signed in</span>
            </label>
            <button
              type="button"
              onClick={() => setError('Password reset instructions will be sent to your registered address.')}
              className="text-slate-500 hover:text-slate-700 font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Demo Credentials Callout (For Admin tab only in signin mode) */}
        {role === 'admin' && mode === 'signin' && (
          <button
            type="button"
            onClick={handleAutofillDemo}
            title="Click to auto-fill demo credentials"
            className="text-xs text-slate-500 bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-center font-mono hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer"
          >
            Demo admin: ID admin, password admin123
            <span className="block text-[10px] text-emerald-600 font-sans mt-0.5">Click to auto-fill</span>
          </button>
        )}

        {/* Primary Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-sm transition-all text-sm flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              <span>{mode === 'signin' ? 'Signing in…' : 'Creating account…'}</span>
            </>
          ) : (
            <span>
              {mode === 'signin'
                ? role === 'citizen'
                  ? 'Sign in as citizen'
                  : 'Sign in as admin'
                : role === 'citizen'
                  ? 'Sign up as citizen'
                  : 'Sign up as admin'}
            </span>
          )}
        </button>
      </form>

      {/* Bottom Switcher */}
      <div className="border-t border-slate-100 pt-4 text-center">
        {mode === 'signin' ? (
          <p className="text-xs text-slate-500">
            New here?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('signup')
                setError(null)
                setSuccessMessage(null)
              }}
              className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
            >
              Create an account
            </button>
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('signin')
                setError(null)
                setSuccessMessage(null)
              }}
              className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex items-center justify-center min-h-[400px]">
            <Loader2 className="size-6 text-emerald-600 animate-spin" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>

      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        Back to CleanSync Home
      </Link>
    </main>
  )
}
