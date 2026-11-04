import type { Access, CollectionBeforeValidateHook, CollectionConfig } from 'payload'

type AppIdentity = {
  id: number | string
  collection: string
  role?: 'customer' | 'staff'
}

const isAdmin = (user: AppIdentity | null | undefined) => user?.collection === 'admins'

const isStaff = (user: AppIdentity | null | undefined) =>
  user?.collection === 'users' && user.role === 'staff'

const readUsers: Access = ({ req }) => {
  const user = req.user as AppIdentity | null
  if (isAdmin(user) || isStaff(user)) return true
  if (user?.collection === 'users') return { id: { equals: user.id } }
  return false
}

const updateUsers: Access = ({ req }) => {
  const user = req.user as AppIdentity | null
  if (isAdmin(user) || isStaff(user)) return true
  if (user?.collection === 'users') return { id: { equals: user.id } }
  return false
}

const protectServerFields: CollectionBeforeValidateHook = ({ data, operation }) => {
  const nextData = data ?? {}
  if (operation === 'create') {
    nextData.role = 'customer'
    nextData.points = 1
    nextData.cardNumber = `TC${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 7).toUpperCase()}`
  }
  return nextData
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Customer',
    plural: 'Customers',
  },
  admin: {
    useAsTitle: 'email',
    group: 'Customer loyalty',
    defaultColumns: ['email', 'firstName', 'lastName', 'cardNumber', 'points', 'role'],
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  access: {
    create: () => true,
    read: readUsers,
    update: updateUsers,
    delete: ({ req }) => isAdmin(req.user as AppIdentity | null),
    admin: ({ req }) => isAdmin(req.user as AppIdentity | null),
  },
  hooks: {
    beforeValidate: [protectServerFields],
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      maxLength: 80,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      maxLength: 80,
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'cardNumber',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      access: {
        create: () => true,
        update: () => false,
      },
    },
    {
      name: 'points',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 0,
      access: {
        create: () => true,
        update: ({ req }) => {
          const user = req.user as AppIdentity | null
          return (
            isAdmin(user) ||
            isStaff(user) ||
            req.context.loyaltySystem === true ||
            req.context.rewardRedemption === true
          )
        },
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'customer',
      saveToJWT: true,
      options: [
        { label: 'Customer', value: 'customer' },
        { label: 'Staff', value: 'staff' },
      ],
      access: {
        create: () => true,
        update: ({ req }) => isAdmin(req.user as AppIdentity | null),
      },
    },
  ],
  versions: false,
}
