'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { loginAction, registerAction, type FormState } from '@/app/(frontend)/actions'

const initialState: FormState = {}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm font-semibold text-red-700">{message}</p>
}

export function LoginForm({ next = '/account' }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, initialState)

  return (
    <form action={action} className="mt-8 space-y-5">
      <input type="hidden" name="next" value={next} />
      <div>
        <label className="text-sm font-bold text-[#29473f]" htmlFor="email">
          Email address
        </label>
        <input
          className="auth-input"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label className="text-sm font-bold text-[#29473f]" htmlFor="password">
          Password
        </label>
        <input
          className="auth-input"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {state.error && (
        <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{state.error}</p>
      )}
      <div className="flex items-center justify-between gap-4 text-sm">
        <Link className="font-semibold text-[#2f7d32] hover:underline" href="/forgot-password">
          I forgot my password
        </Link>
        <span className="text-[#687b76]">
          Not registered?{' '}
          <Link className="font-bold text-[#14352d] hover:underline" href="/register">
            Register
          </Link>
        </span>
      </div>
      <button className="primary-button w-full" disabled={pending} type="submit">
        {pending ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  )
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initialState)

  return (
    <form action={action} className="mt-8 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold text-[#29473f]" htmlFor="firstName">
            First name
          </label>
          <input
            className="auth-input"
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            required
          />
          <FieldError message={state.fieldErrors?.firstName} />
        </div>
        <div>
          <label className="text-sm font-bold text-[#29473f]" htmlFor="lastName">
            Last name
          </label>
          <input
            className="auth-input"
            id="lastName"
            name="lastName"
            autoComplete="family-name"
            required
          />
          <FieldError message={state.fieldErrors?.lastName} />
        </div>
      </div>
      <div>
        <label className="text-sm font-bold text-[#29473f]" htmlFor="registerEmail">
          Email address
        </label>
        <input
          className="auth-input"
          id="registerEmail"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <FieldError message={state.fieldErrors?.email} />
      </div>
      <div>
        <label className="text-sm font-bold text-[#29473f]" htmlFor="registerPassword">
          Password
        </label>
        <input
          className="auth-input"
          id="registerPassword"
          name="password"
          type="password"
          minLength={8}
          autoComplete="new-password"
          required
        />
        <FieldError message={state.fieldErrors?.password} />
      </div>
      <fieldset>
        <legend className="text-sm font-bold text-[#29473f]">Date of birth</legend>
        <div className="mt-2 grid grid-cols-3 gap-3">
          <input
            className="auth-input mt-0"
            aria-label="Day"
            name="dobDay"
            type="number"
            min="1"
            max="31"
            placeholder="DD"
            required
          />
          <input
            className="auth-input mt-0"
            aria-label="Month"
            name="dobMonth"
            type="number"
            min="1"
            max="12"
            placeholder="MM"
            required
          />
          <input
            className="auth-input mt-0"
            aria-label="Year"
            name="dobYear"
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            placeholder="YYYY"
            required
          />
        </div>
        <FieldError message={state.fieldErrors?.dateOfBirth} />
      </fieldset>
      {state.error && (
        <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{state.error}</p>
      )}
      <button className="primary-button w-full" disabled={pending} type="submit">
        {pending ? 'Creating account…' : 'Register'}
      </button>
      <p className="text-center text-sm text-[#687b76]">
        Already registered?{' '}
        <Link className="font-bold text-[#14352d] hover:underline" href="/login">
          Log in
        </Link>
      </p>
    </form>
  )
}
