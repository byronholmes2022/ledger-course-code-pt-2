const db = require("./index");

// This script wipes both tables. Never let it run against production.
// process.exit is fine here: nothing has connected yet, so there's
// nothing to clean up.
if (process.env.NODE_ENV === "production") {
  console.error("Refusing to seed: NODE_ENV is production");
  process.exit(1);
}

async function seed() {
  console.log("Seeding database...");

  // One client for the whole seed, so every statement runs in the
  // same transaction. Pool queries (db.query) can each land on a
  // different connection, which would put them outside the transaction.
  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    // TRUNCATE instead of DELETE:
    // - RESTART IDENTITY resets the serial counters, so ids start at 1
    //   on every run (DELETE leaves them counting up from where they were)
    // - Listing both tables in one statement means the foreign key from
    //   accounts to categories doesn't block it
    await client.query("TRUNCATE accounts, categories RESTART IDENTITY");

    // Seed categories
    const categoryData = [
      {
        name: "Housing",
        description: "Rent, mortgage, property tax, home insurance",
      },
      {
        name: "Food & Dining",
        description: "Groceries, restaurants, coffee, delivery",
      },
      {
        name: "Transportation",
        description: "Gas, car payment, insurance, transit, parking",
      },
      {
        name: "Utilities",
        description: "Electric, water, gas, internet, phone",
      },
      {
        name: "Entertainment",
        description: "Streaming, events, hobbies, subscriptions",
      },
      {
        name: "Healthcare",
        description: "Insurance premiums, copays, pharmacy, dental",
      },
      {
        name: "Shopping",
        description: "Clothing, electronics, household goods",
      },
      { name: "Income", description: "Salary, freelance, dividends, interest" },
      { name: "Transfers", description: "Transfers between own accounts" },
    ];

    const categories = {};
    for (const cat of categoryData) {
      const { rows } = await client.query(
        "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
        [cat.name, cat.description],
      );
      categories[cat.name] = rows[0].id;
    }
    console.log(`Seeded ${categoryData.length} categories`);

    // Seed accounts — linking some to default categories via the IDs we just created
    const accounts = [
      {
        name: "Main Checking",
        account_type: "checking",
        institution: "Chase",
        currency: "USD",
        default_category: null,
      },
      {
        name: "Emergency Fund",
        account_type: "savings",
        institution: "Marcus by Goldman Sachs",
        currency: "USD",
        default_category: null,
      },
      {
        name: "Visa Signature",
        account_type: "credit_card",
        institution: "Chase",
        currency: "USD",
        default_category: null,
      },
      {
        name: "Travel Rewards Card",
        account_type: "credit_card",
        institution: "Capital One",
        currency: "USD",
        default_category: null,
      },
      {
        name: "Roth IRA",
        account_type: "investment",
        institution: "Vanguard",
        currency: "USD",
        default_category: null,
      },
      {
        name: "Brokerage",
        account_type: "investment",
        institution: "Fidelity",
        currency: "USD",
        default_category: null,
      },
      {
        name: "High-Yield Savings",
        account_type: "savings",
        institution: "Ally",
        currency: "USD",
        default_category: null,
      },
      {
        name: "Auto Loan",
        account_type: "loan",
        institution: "Local Credit Union",
        currency: "USD",
        default_category: "Transportation",
      },
      {
        name: "Cash / Wallet",
        account_type: "cash",
        institution: null,
        currency: "USD",
        default_category: null,
      },
      {
        name: "Venmo Balance",
        account_type: "other",
        institution: "Venmo",
        currency: "USD",
        default_category: null,
      },
    ];

    for (const acct of accounts) {
      await client.query(
        `INSERT INTO accounts (name, account_type, institution, currency, default_category_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          acct.name,
          acct.account_type,
          acct.institution,
          acct.currency,
          acct.default_category ? categories[acct.default_category] : null,
        ],
      );
    }
    console.log(`Seeded ${accounts.length} accounts`);

    await client.query("COMMIT");
    console.log("Seed complete");
  } catch (err) {
    // Undo everything, including the TRUNCATE. A failed seed leaves
    // the database exactly as it was before you ran it.
    await client.query("ROLLBACK");
    console.error("Seed failed:", err);
    // exitCode, not process.exit(): process.exit() kills the process
    // immediately and the finally block below would never run.
    process.exitCode = 1;
  } finally {
    client.release();
    await db.pool.end();
  }
}

seed();
