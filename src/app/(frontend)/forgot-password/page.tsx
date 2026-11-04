import Link from 'next/link'
import { AuthShell } from '@/app/(frontend)/components/AuthShell'

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Password help"
      title="Reset your password"
      description="Enter the email address registered to your Tuncafe account."
    >
      <form className="mt-8 space-y-5">
        <div>
          <label className="text-sm font-bold text-[#29473f]" htmlFor="resetEmail">
            Email address
          </label>
          <input
            className="auth-input"
            id="resetEmail"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <p className="rounded-xl bg-[#eaf2e5] p-4 text-sm leading-6 text-[#29473f]">
          Password-reset email delivery will be connected after the Tuncafe email service is
          configured.
        </p>
        <button className="primary-button w-full opacity-60" disabled type="button">
          Send reset link
        </button>
        <Link
          className="block text-center text-sm font-bold text-[#2f7d32] hover:underline"
          href="/login"
        >
          Back to login
        </Link>
      </form>
    </AuthShell>
  )
}
