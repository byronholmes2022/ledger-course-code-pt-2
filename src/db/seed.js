const db = require("./index");

async function seed() {
  console.log("Seeding database...");

  try {
    // Clear in dependency order: accounts first (has FK to categories), then categories
    // await db.query("DELETE FROM accounts");
    // await db.query("DELETE FROM categories");
    await db.query(
      "TRUNCATE TABLE accounts, categories RESTART IDENTITY CASCADE",
    );
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
      const { rows } = await db.query(
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
        default_category_id: 1,
      },
      {
        name: "Emergency Fund",
        account_type: "savings",
        institution: "Marcus by Goldman Sachs",
        currency: "USD",
        default_category: 2,
      },
      {
        name: "Visa Signature",
        account_type: "credit_card",
        institution: "Chase",
        currency: "USD",
        default_category_id: 1,
      },
      {
        name: "Travel Rewards Card",
        account_type: "credit_card",
        institution: "Capital One",
        currency: "USD",
        default_category_id: 1,
      },
      {
        name: "Roth IRA",
        account_type: "investment",
        institution: "Vanguard",
        currency: "USD",
        default_category_id: null,
      },
      {
        name: "Brokerage",
        account_type: "investment",
        institution: "Fidelity",
        currency: "USD",
        default_category_id: 3,
      },
      {
        name: "High-Yield Savings",
        account_type: "savings",
        institution: "Ally",
        currency: "USD",
        default_category_id: 4,
      },
      {
        name: "Auto Loan",
        account_type: "loan",
        institution: "Local Credit Union",
        currency: "USD",
        default_category_id: 4,
      },
      {
        name: "Cash / Wallet",
        account_type: "cash",
        institution: null,
        currency: "USD",
        default_category_id: 3,
      },
      {
        name: "Venmo Balance",
        account_type: "other",
        institution: "Venmo",
        currency: "USD",
        default_category_id: null,
      },
    ];

    for (const acct of accounts) {
      console.log(acct.default_category_id);
      await db.query(
        `INSERT INTO accounts (name, account_type, institution, currency, default_category_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          acct.name,
          acct.account_type,
          acct.institution,
          acct.currency,
          acct.default_category_id,
        ],
      );
    }
    console.log(`Seeded ${accounts.length} accounts`);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await db.pool.end();
  }
}

seed();
