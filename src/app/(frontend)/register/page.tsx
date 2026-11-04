import { AuthShell } from '@/app/(frontend)/components/AuthShell'
import { RegisterForm } from '@/app/(frontend)/components/AuthForm'

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Join the family"
      title="Create your account"
      description="Register once and receive your first loyalty point automatically."
    >
      <RegisterForm />
    </AuthShell>
  )
}
