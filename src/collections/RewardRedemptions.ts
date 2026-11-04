import type { CollectionConfig } from 'payload'

type AppIdentity = {
  id: number | string
  collection: string
  role?: 'customer' | 'staff'
}

const isAdmin = (user: AppIdentity | null | undefined) => user?.collection === 'admins'

const isStaff = (user: AppIdentity | null | undefined) =>
  user?.collection === 'users' && user.role === 'staff'

export const RewardRedemptions: CollectionConfig = {
  slug: 'reward-redemptions',
  labels: {
    singular: 'Free drink redemption',
    plural: 'Free drink redemptions',
  },
  admin: {
    useAsTitle: 'id',
    group: 'Customer loyalty',
    defaultColumns: ['customer', 'staff', 'pointsRedeemed', 'createdAt'],
  },
  access: {
    create: ({ req }) => isStaff(req.user as AppIdentity | null),
    read: ({ req }) => {
      const user = req.user as AppIdentity | null
      if (isAdmin(user) || isStaff(user)) return true
      if (user?.collection === 'users') return { customer: { equals: user.id } }
      return false
    },
    update: ({ req }) => isAdmin(req.user as AppIdentity | null),
    delete: ({ req }) => isAdmin(req.user as AppIdentity | null),
    admin: ({ req }) => isAdmin(req.user as AppIdentity | null),
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const staff = req.user as AppIdentity | null
        if (!staff || !isStaff(staff)) throw new Error('Staff authentication is required.')

        const customerId = typeof data?.customer === 'object' ? data.customer?.id : data?.customer
        if (!customerId) throw new Error('A customer is required.')

        const customer = await req.payload.findByID({
          collection: 'users',
          id: customerId,
          overrideAccess: false,
          req,
        })

        const points = Number(customer.points ?? 0)
        if (points < 10) throw new Error('This customer has not reached 10 points.')

        const activeOrders = await req.payload.find({
          collection: 'orders',
          overrideAccess: false,
          req,
          limit: 500,
          depth: 0,
          where: {
            and: [{ owner: { equals: customerId } }, { redeemedAt: { exists: false } }],
          },
        })

        const drinkCount = activeOrders.docs.reduce(
          (sum, order) => sum + Number(order.pointsEarned ?? 0),
          0,
        )
        const redeemedAt = new Date().toISOString()

        req.context.rewardRedemption = true
        if (activeOrders.docs.length) {
          await req.payload.update({
            collection: 'orders',
            overrideAccess: false,
            req,
            where: {
              id: { in: activeOrders.docs.map((order) => order.id) },
            },
            data: { redeemedAt },
          })
        }

        await req.payload.update({
          collection: 'users',
          id: customerId,
          overrideAccess: false,
          req,
          data: { points: 0 },
        })

        return {
          ...data,
          staff: staff.id,
          pointsRedeemed: points,
          drinkCount,
          redeemedAt,
        }
      },
    ],
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'staff',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'pointsRedeemed',
      type: 'number',
      required: true,
      min: 10,
    },
    {
      name: 'drinkCount',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'redeemedAt',
      type: 'date',
      required: true,
    },
  ],
  versions: false,
}
