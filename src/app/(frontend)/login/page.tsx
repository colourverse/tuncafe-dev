import { AuthShell } from '@/app/(frontend)/components/AuthShell'
import { LoginForm } from '@/app/(frontend)/components/AuthForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to Tuncafe"
      description="Access your loyalty card, points and drink history."
    >
      <LoginForm next={next} />
    </AuthShell>
  )
}
