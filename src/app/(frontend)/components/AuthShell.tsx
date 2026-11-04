import Link from 'next/link'

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-[#eaf2e5] px-5 py-10 text-[#14352d]">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="inline-flex" aria-label="Back to Tuncafe home">
          <img src="/tuncafe-logo.png" alt="Tuncafe" className="h-24 w-44 object-contain" />
        </Link>
        <section className="mt-6 rounded-[30px] border border-[#14352d]/10 bg-[#fffdf8] p-7 shadow-[0_20px_70px_rgba(20,53,45,.09)] sm:p-10">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-.04em]">{title}</h1>
          <p className="mt-3 leading-7 text-[#5a706a]">{description}</p>
          {children}
        </section>
      </div>
    </main>
  )
}
