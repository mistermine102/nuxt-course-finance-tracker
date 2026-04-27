import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { createClient } from '@supabase/supabase-js'

const rootDir = process.cwd()

async function loadEnvFile() {
  const envPath = path.join(rootDir, '.env')
  const contents = await readFile(envPath, 'utf8')

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const separatorIndex = trimmed.indexOf('=')

    if (separatorIndex === -1) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '')

    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

function requireEnv(name) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomAmount() {
  return randomInt(10, 500)
}

function randomItem(items) {
  return items[randomInt(0, items.length - 1)]
}

function randomDateWithinLastDays(days) {
  const date = new Date()
  date.setDate(date.getDate() - randomInt(0, days))
  date.setHours(randomInt(0, 23), randomInt(0, 59), randomInt(0, 59), 0)
  return date.toISOString()
}

function createTransaction(userId) {
  const type = randomItem(['Income', 'Expense', 'Saving', 'Investment'])
  const description = randomItem([
    'Monthly salary payment from primary full-time job',
    'Freelance website redesign project milestone payment',
    'Weekly grocery shopping for home and household supplies',
    'Apartment rent payment for the current month',
    'Fuel refill and small car wash before weekend trip',
    'Coffee and lunch with friends in the city center',
    'Automatic ETF contribution to long-term investment account',
    'Emergency fund top-up transferred to separate savings account',
    'Electricity and internet utility bill for this month',
    'Restaurant dinner for a family birthday celebration',
    'Sold a few old electronics and received bank transfer',
    'Pharmacy purchase with vitamins and basic medical supplies',
    'Bought books and a notebook for personal learning goals',
    'Subscription renewal for design tools and cloud storage',
    'Bonus payment from employer after project delivery'
  ])

  return {
    amount: randomAmount(),
    category: type === 'Expense' ? randomItem(['Food', 'Housing', 'Car', 'Entertaiment']) : null,
    created_at: randomDateWithinLastDays(120),
    description,
    type,
    user_id: userId
  }
}

async function listUserIds(supabase) {
  const users = []
  const perPage = 1000
  let page = 1

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage
    })

    if (error) {
      throw error
    }

    const pageUsers = data.users
    users.push(...pageUsers)

    if (pageUsers.length < perPage) {
      break
    }

    page += 1
  }

  return users
    .map(user => user.id)
    .filter(userId => typeof userId === 'string' && userId.length > 0)
}

async function main() {
  await loadEnvFile()

  const supabaseUrl = requireEnv('NUXT_PUBLIC_SUPABASE_URL')
  const supabaseKey = requireEnv('SUPABASE_SECRET')
  const count = Number(process.argv[2] ?? 50)
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  if (!Number.isInteger(count) || count <= 0) {
    throw new Error('Seed count must be a positive integer.')
  }

  const userIds = await listUserIds(supabase)

  if (userIds.length === 0) {
    throw new Error('No Supabase auth users found. Create at least one user before seeding transactions.')
  }

  const transactions = Array.from({ length: count }, (_, index) =>
    createTransaction(userIds[index % userIds.length])
  )

  const { error: deleteError } = await supabase
    .from('Transactions')
    .delete()
    .not('id', 'is', null)

  if (deleteError) {
    throw deleteError
  }

  const { error: insertError } = await supabase
    .from('Transactions')
    .insert(transactions)

  if (insertError) {
    throw insertError
  }

  console.log(`Seeded ${count} transactions for ${userIds.length} users.`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
