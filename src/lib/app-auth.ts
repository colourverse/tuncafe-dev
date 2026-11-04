import 'server-only'

import { cookies } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import type { User } from '@/payload-types'

export type AppUser = User

const sessionCookie = 'app-session'

export function createAppAuth(collection: 'users') {
  return {
    async login(email: string, password: string) {
      const payload = await getPayloadClient()
      const result = await payload.login({
        collection,
        overrideAccess: false,
        data: { email, password },
      })

      if (!result.token || !result.user || result.user.collection !== collection) {
        throw new Error('Invalid email or password.')
      }

      const cookieStore = await cookies()
      cookieStore.set(sessionCookie, result.token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })

      return result.user as User
    },

    async logout() {
      const cookieStore = await cookies()
      cookieStore.delete(sessionCookie)
    },

    async currentUser(): Promise<AppUser | null> {
      const token = (await cookies()).get(sessionCookie)?.value
      if (!token) return null

      const payload = await getPayloadClient()
      const authHeaders = new Headers({ Authorization: `JWT ${token}` })
      const { user } = await payload.auth({ headers: authHeaders })

      if (!user || user.collection !== collection) return null
      return user as User
    },
  }
}

export const appAuth = createAppAuth('users')
