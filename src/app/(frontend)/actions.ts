'use server'

import { redirect } from 'next/navigation'
import { appAuth, type AppUser } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'
import { findProduct } from '@/lib/products'

export type FormState = {
  error?: string
  success?: string
  fieldErrors?: Record<string, string>
}

export type CheckoutLine = {
  productId: string
  quantity: number
}

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? '').trim()
}

function safeDestination(value: string) {
  return value.startsWith('/') && !value.startsWith('//') ? value : '/'
}

function validDate(day: number, month: number, year: number) {
  const date = new Date(Date.UTC(year, month - 1, day))
  if (
    date.getUTCDate() !== day ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCFullYear() !== year ||
    date > new Date()
  ) {
    return null
  }
  return date.toISOString()
}

export async function loginAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = text(formData, 'email').toLowerCase()
  const password = text(formData, 'password')
  const next = safeDestination(text(formData, 'next') || '/account')

  if (!email || !password) {
    return { error: 'Enter your email address and password.' }
  }

  try {
    await appAuth.login(email, password)
  } catch {
    return { error: 'The email address or password is incorrect.' }
  }

  redirect(next)
}

export async function registerAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const firstName = text(formData, 'firstName')
  const lastName = text(formData, 'lastName')
  const email = text(formData, 'email').toLowerCase()
  const password = text(formData, 'password')
  const day = Number(text(formData, 'dobDay'))
  const month = Number(text(formData, 'dobMonth'))
  const year = Number(text(formData, 'dobYear'))
  const dateOfBirth = validDate(day, month, year)
  const fieldErrors: Record<string, string> = {}

  if (!firstName || firstName.length > 80) fieldErrors.firstName = 'Enter your first name.'
  if (!lastName || lastName.length > 80) fieldErrors.lastName = 'Enter your last name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = 'Enter a valid email address.'
  if (password.length < 8) fieldErrors.password = 'Use at least 8 characters.'
  if (!dateOfBirth) fieldErrors.dateOfBirth = 'Enter a valid date of birth.'

  if (Object.keys(fieldErrors).length) return { fieldErrors }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'users',
      overrideAccess: false,
      data: {
        firstName,
        lastName,
        email,
        password,
        dateOfBirth: dateOfBirth!,
        cardNumber: 'generated',
        points: 1,
        role: 'customer',
      },
    })
    await appAuth.login(email, password)
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : ''
    if (message.includes('unique') || message.includes('registered')) {
      return { fieldErrors: { email: 'An account already exists for this email address.' } }
    }
    return { error: 'We could not create your account. Please try again.' }
  }

  redirect('/account')
}

export async function logoutAction() {
  await appAuth.logout()
  redirect('/')
}

export async function checkoutAction(
  lines: CheckoutLine[],
  paymentMethod: 'apple-pay' | 'google-pay',
): Promise<{ error?: string; success?: string; pointsEarned?: number; needsLogin?: boolean }> {
  const user = await appAuth.currentUser()
  if (!user) return { needsLogin: true }
  if (!Array.isArray(lines) || !lines.length || lines.length > 20) {
    return { error: 'Your basket is empty or too large.' }
  }

  const items = lines.map((line) => {
    const productId = String(line.productId)
    const quantity = Number(line.quantity)
    return {
      productId,
      quantity,
      product: findProduct(productId),
    }
  })

  if (
    items.some(
      (line) =>
        !line.product ||
        !Number.isInteger(line.quantity) ||
        line.quantity < 1 ||
        line.quantity > 20,
    )
  ) {
    return { error: 'Your basket contains an invalid product or quantity.' }
  }

  try {
    const payload = await getPayloadClient()
    const orderItems = items.map(({ product, productId, quantity }) => {
      const resolved = product!
      return {
        productId,
        productName: resolved.name,
        category: resolved.category,
        quantity,
        unitPrice: resolved.price,
        lineTotal: resolved.price * quantity,
        isDrink: ['Thai favourites', 'Coffee', 'Coolers'].includes(resolved.category),
      }
    })
    const order = await payload.create({
      collection: 'orders',
      overrideAccess: false,
      user,
      data: {
        owner: user.id,
        items: orderItems,
        paymentMethod,
        total: 0,
        pointsEarned: 0,
        status: 'completed',
      },
    })

    return {
      success: 'Order received. Your loyalty account has been updated.',
      pointsEarned: Number(order.pointsEarned ?? 0),
    }
  } catch {
    return { error: 'We could not complete this demo payment. Please try again.' }
  }
}

export async function redeemRewardAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const customer = await appAuth.currentUser()
  if (!customer) return { error: 'The customer must be logged in.' }
  if (customer.points < 10) return { error: 'This account has not reached 10 points.' }

  const staffEmail = text(formData, 'staffEmail').toLowerCase()
  const staffPassword = text(formData, 'staffPassword')
  if (!staffEmail || !staffPassword) {
    return { error: 'Staff must enter their email and password.' }
  }

  try {
    const payload = await getPayloadClient()
    const staffLogin = await payload.login({
      collection: 'users',
      overrideAccess: false,
      data: { email: staffEmail, password: staffPassword },
    })
    const staff = staffLogin.user as AppUser

    if (staff.collection !== 'users' || staff.role !== 'staff') {
      return { error: 'These credentials do not belong to a staff account.' }
    }

    await payload.create({
      collection: 'reward-redemptions',
      overrideAccess: false,
      user: staff,
      data: {
        customer: customer.id,
        staff: staff.id,
        pointsRedeemed: customer.points,
        drinkCount: 0,
        redeemedAt: new Date().toISOString(),
      },
    })

    return { success: 'Free drink confirmed. Points and current drink history were reset.' }
  } catch {
    return { error: 'The reward could not be confirmed. Check the staff credentials.' }
  }
}
