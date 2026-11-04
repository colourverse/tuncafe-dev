import type { Access, CollectionConfig } from 'payload'
import { drinkCategories, findProduct } from '@/lib/products'

type AppIdentity = {
  id: number | string
  collection: string
  role?: 'customer' | 'staff'
}

const isAdmin = (user: AppIdentity | null | undefined) => user?.collection === 'admins'

const isStaff = (user: AppIdentity | null | undefined) =>
  user?.collection === 'users' && user.role === 'staff'

const readOrders: Access = ({ req }) => {
  const user = req.user as AppIdentity | null
  if (isAdmin(user) || isStaff(user)) return true
  if (user?.collection === 'users') return { owner: { equals: user.id } }
  return false
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Drink order',
    plural: 'Drink history',
  },
  admin: {
    useAsTitle: 'id',
    group: 'Customer loyalty',
    defaultColumns: ['owner', 'total', 'pointsEarned', 'paymentMethod', 'createdAt'],
  },
  access: {
    create: ({ req }) => req.user?.collection === 'users',
    read: readOrders,
    update: ({ req }) => {
      const user = req.user as AppIdentity | null
      return isAdmin(user) || isStaff(user)
    },
    delete: ({ req }) => isAdmin(req.user as AppIdentity | null),
    admin: ({ req }) => isAdmin(req.user as AppIdentity | null),
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, req }) => {
        if (operation !== 'create') return data
        if (!req.user || req.user.collection !== 'users') {
          throw new Error('You must be logged in to place an order.')
        }

        const submittedItems = Array.isArray(data?.items) ? data.items : []
        if (!submittedItems.length || submittedItems.length > 20) {
          throw new Error('Your basket must contain between 1 and 20 products.')
        }

        let total = 0
        let pointsEarned = 0
        const items = submittedItems.map((line: { productId?: unknown; quantity?: unknown }) => {
          const productId = typeof line.productId === 'string' ? line.productId : ''
          const quantity = Number(line.quantity)
          const product = findProduct(productId)
          if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
            throw new Error('Your basket contains an invalid product or quantity.')
          }

          const lineTotal = product.price * quantity
          const isDrink = drinkCategories.has(product.category)
          total += lineTotal
          if (isDrink) pointsEarned += quantity

          return {
            productId: product.id,
            productName: product.name,
            category: product.category,
            quantity,
            unitPrice: product.price,
            lineTotal,
            isDrink,
          }
        })

        return {
          ...data,
          owner: req.user.id,
          items,
          total,
          pointsEarned,
          status: 'completed',
        }
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create' || !req.user || req.user.collection !== 'users') {
          return doc
        }

        const currentUser = await req.payload.findByID({
          collection: 'users',
          id: req.user.id,
          overrideAccess: false,
          req,
        })

        req.context.loyaltySystem = true
        await req.payload.update({
          collection: 'users',
          id: req.user.id,
          data: { points: Number(currentUser.points ?? 0) + Number(doc.pointsEarned ?? 0) },
          overrideAccess: false,
          req,
        })

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'productId', type: 'text', required: true },
        { name: 'productName', type: 'text', required: true },
        { name: 'category', type: 'text', required: true },
        { name: 'quantity', type: 'number', required: true, min: 1, max: 20 },
        { name: 'unitPrice', type: 'number', required: true, min: 0 },
        { name: 'lineTotal', type: 'number', required: true, min: 0 },
        { name: 'isDrink', type: 'checkbox', required: true },
      ],
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'pointsEarned',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      options: [
        { label: 'Apple Pay', value: 'apple-pay' },
        { label: 'Google Pay', value: 'google-pay' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'completed',
      options: [{ label: 'Completed', value: 'completed' }],
    },
    {
      name: 'redeemedAt',
      type: 'date',
    },
  ],
  versions: false,
}
