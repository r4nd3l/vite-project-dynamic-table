// src/example/users.schema.ts
import type { TableSchema } from '../table/table.types'

export const usersSchema: TableSchema = {
  id: 'users-table',
  rowKey: 'id',
  selection: 'multi',
  pageSize: 20,
  columns: [
    { key: 'name', label: 'Name', type: 'text', sortable: true, width: '20ch' },
    { key: 'email', label: 'Email', type: 'text', sortable: true, width: '28ch' },
    { key: 'role', label: 'Role', type: 'badge', filterable: true },
    { key: 'active', label: 'Active', type: 'boolean',
      editor: { type: 'switch', instant: true } },
    { key: 'quota', label: 'Quota (GB)', type: 'number', align: 'right',
      editor: { type: 'number', props: { min: 0 } } },
    { key: 'plan', label: 'Plan', type: 'text',
      editor: { type: 'select', options: [
        { label: 'Free', value: 'free' },
        { label: 'Pro', value: 'pro' },
        { label: 'Team', value: 'team' }
      ] } },
  ],
  rowActions: [
    { key: 'impersonate', label: 'Impersonate' },
    { key: 'delete', label: 'Delete', confirm: 'Delete this user?' }
  ]
}

export const seedUsers = Array.from({ length: 37 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ['admin','manager','agent'][i % 3],
  active: i % 2 === 0,
  quota: (i % 7) * 10,
  plan: ['free','pro','team'][i % 3],
}))
