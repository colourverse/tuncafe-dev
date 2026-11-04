import Link from 'next/link'
import { redirect } from 'next/navigation'
import { logoutAction } from '@/app/(frontend)/actions'
import { RewardRedemptionForm } from '@/app/(frontend)/components/RewardRedemptionForm'
import { appAuth } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

export default async function AccountPage() {
  const user = await appAuth.currentUser()
  if (!user) redirect('/login?next=/account')

  const payload = await getPayloadClient()
  const orders = await payload.find({
    collection: 'orders',
    overrideAccess: false,
    user,
    depth: 0,
    limit: 100,
    sort: '-createdAt',
    where: {
      redeemedAt: { exists: false },
    },
  })

  return (
    <div className="min-h-screen bg-[#f8faf6] text-[#14352d]">
      <header className="border-b border-[#14352d]/10 bg-[#eaf2e5] px-5">
        <div className="mx-auto flex min-h-24 max-w-[1280px] items-center justify-between gap-5">
          <Link href="/" aria-label="Tuncafe home">
            <img src="/tuncafe-logo.png" alt="Tuncafe" className="h-20 w-40 object-contain" />
          </Link>
          <form action={logoutAction}>
            <button className="secondary-button" type="submit">
              Log out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1280px] gap-8 px-5 py-10 lg:grid-cols-[240px_1fr] lg:px-10 lg:py-14">
        <aside className="h-fit rounded-2xl bg-[#123c35] p-4 text-white lg:sticky lg:top-5">
          <p className="px-3 pb-3 text-xs font-bold uppercase tracking-[.15em] text-[#cfea6a]">
            My Tuncafe
          </p>
          <nav className="grid gap-1">
            <a className="account-nav-link" href="#details">
              Your Detail
            </a>
            <a className="account-nav-link" href="#points">
              Your Point
            </a>
            <a className="account-nav-link" href="#history">
              Drink History
            </a>
          </nav>
        </aside>

        <div className="min-w-0 space-y-7">
          <section id="details" className="account-card scroll-mt-6">
            <p className="eyebrow">Your Detail</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="account-label">Card number</p>
                <p className="mt-1 font-display text-3xl font-semibold text-[#2f7d32]">
                  {user.cardNumber}
                </p>
              </div>
              <div>
                <p className="account-label">Customer name</p>
                <p className="mt-1 text-lg font-bold">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <p className="account-label">Email address</p>
                <p className="mt-1 break-all font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="account-label">Date of birth</p>
                <p className="mt-1 font-semibold">{formatDate(user.dateOfBirth)}</p>
              </div>
            </div>
          </section>

          <section id="points" className="account-card scroll-mt-6">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="eyebrow">Your Point</p>
                <p className="mt-3 font-display text-6xl font-semibold text-[#2f7d32]">
                  {user.points}
                </p>
                <p className="mt-2 text-sm text-[#687b76]">1 point for every drink purchased.</p>
              </div>
              <div className="w-full max-w-xs rounded-2xl bg-[#eaf2e5] p-5">
                <div className="flex justify-between text-sm font-bold">
                  <span>Reward progress</span>
                  <span>{Math.min(user.points, 10)}/10</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-[#2f7d32]"
                    style={{ width: `${Math.min(user.points * 10, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {user.points >= 10 && (
              <div className="mt-7 rounded-2xl border border-[#2f7d32]/20 bg-[#dcebd3] p-5">
                <h2 className="font-display text-2xl font-semibold">
                  Congratulations, you can now get 1 free drink.
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#4c665e]">
                  Ask a Tuncafe staff member to enter their credentials and confirm the reward.
                </p>
                <RewardRedemptionForm />
              </div>
            )}
          </section>

          <section id="history" className="account-card scroll-mt-6">
            <p className="eyebrow">Drink History</p>
            {orders.docs.length ? (
              <div className="mt-5 divide-y divide-[#14352d]/10">
                {orders.docs.map((order) => (
                  <article key={String(order.id)} className="py-5 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap justify-between gap-3">
                      <div>
                        <p className="font-bold">{formatDate(order.createdAt)}</p>
                        <p className="mt-1 text-sm text-[#687b76]">
                          {order.paymentMethod === 'apple-pay' ? 'Apple Pay' : 'Google Pay'} · ฿
                          {order.total}
                        </p>
                      </div>
                      <span className="h-fit rounded-full bg-[#eaf2e5] px-3 py-1 text-sm font-bold text-[#2f7d32]">
                        +{order.pointsEarned} points
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1 text-sm text-[#4c665e]">
                      {order.items
                        ?.filter((item) => item.isDrink)
                        .map((item) => (
                          <li key={item.id ?? `${item.productId}-${item.quantity}`}>
                            {item.quantity} × {item.productName}
                          </li>
                        ))}
                    </ul>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-[#f3f6f1] p-6 text-sm text-[#687b76]">
                No drinks in your current reward cycle yet.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
