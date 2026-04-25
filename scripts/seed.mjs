import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

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

function createTransaction() {
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
    type
  }
}

async function request(url, init) {
  const response = await fetch(url, init)

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`${response.status} ${response.statusText}: ${body}`)
  }

  return response
}

async function main() {
  await loadEnvFile()

  const supabaseUrl = requireEnv('NUXT_PUBLIC_SUPABASE_URL')
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? requireEnv('NUXT_PUBLIC_SUPABASE_KEY')
  const count = Number(process.argv[2] ?? 50)

  if (!Number.isInteger(count) || count <= 0) {
    throw new Error('Seed count must be a positive integer.')
  }

  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`
  }

  const transactions = Array.from({ length: count }, createTransaction)
  const endpoint = new URL('/rest/v1/Transactions', supabaseUrl)

  await request(`${endpoint}?id=not.is.null`, {
    method: 'DELETE',
    headers: {
      ...headers,
      Prefer: 'return=minimal'
    }
  })

  await request(endpoint, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(transactions)
  })

  console.log(`Seeded ${count} transactions.`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
