'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { redeemRewardAction, type FormState } from '@/app/(frontend)/actions'

const initialState: FormState = {}

export function RewardRedemptionForm() {
  const router = useRouter()
  const [state, action, pending] = useActionState(redeemRewardAction, initialState)

  useEffect(() => {
    if (state.success) router.refresh()
  }, [router, state.success])

  return (
    <form action={action} className="mt-5 grid gap-3 rounded-2xl bg-white/70 p-4 sm:grid-cols-2">
      <div>
        <label
          className="text-xs font-bold uppercase tracking-[.12em] text-[#4c665e]"
          htmlFor="staffEmail"
        >
          Staff email
        </label>
        <input className="auth-input" id="staffEmail" name="staffEmail" type="email" required />
      </div>
      <div>
        <label
          className="text-xs font-bold uppercase tracking-[.12em] text-[#4c665e]"
          htmlFor="staffPassword"
        >
          Staff password
        </label>
        <input
          className="auth-input"
          id="staffPassword"
          name="staffPassword"
          type="password"
          required
        />
      </div>
      {state.error && (
        <p className="text-sm font-semibold text-red-700 sm:col-span-2">{state.error}</p>
      )}
      {state.success && (
        <p className="text-sm font-semibold text-[#247653] sm:col-span-2">{state.success}</p>
      )}
      <button className="primary-button sm:col-span-2" disabled={pending} type="submit">
        {pending ? 'Confirming…' : 'Confirm free drink'}
      </button>
    </form>
  )
}
