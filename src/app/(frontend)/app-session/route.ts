import { appAuth } from '@/lib/app-auth'

export async function GET() {
  const user = await appAuth.currentUser()
  return Response.json(
    { authenticated: Boolean(user) },
    {
      headers: {
        'Cache-Control': 'private, no-store',
      },
    },
  )
}
