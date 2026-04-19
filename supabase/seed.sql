truncate table public."Transactions" restart identity;

insert into public."Transactions" (
  amount,
  category,
  created_at,
  description,
  type
)
select
  round((10 + random() * 490)::numeric, 2) as amount,
  case
    when transaction_type = 'Expense' then (
      array['Food', 'Housing', 'Car', 'Entertaiment']
    )[1 + floor(random() * 4)::int]
    else null
  end as category,
  (
    now()
    - ((floor(random() * 120)::int || ' days')::interval)
    - ((floor(random() * 24)::int || ' hours')::interval)
    - ((floor(random() * 60)::int || ' minutes')::interval)
  ) as created_at,
  (
    array[
      'Salary payment',
      'Freelance project',
      'Grocery shopping',
      'Rent payment',
      'Fuel refill',
      'Coffee with friends',
      'ETF contribution',
      'Emergency fund top-up',
      'Utility bill',
      'Restaurant dinner'
    ]
  )[1 + floor(random() * 10)::int] as description,
  transaction_type as type
from (
  select
    (
      array['Income', 'Expense', 'Saving', 'Investment']
    )[1 + floor(random() * 4)::int] as transaction_type
  from generate_series(1, 250)
) generated_transactions;
