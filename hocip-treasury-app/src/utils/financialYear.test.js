// Financial Year Handling Tests

function getMonthKey(dateStr) {
  return dateStr.substring(0, 7);
}

function sumField(records, field) {
  return records.reduce((acc, r) => acc + (parseFloat(r[field]) || 0), 0);
}

function getMonthlyTotals(income, expenses) {
  const MONTHS = [
    { key: '2025-10', label: 'October 2025', short: 'Oct 25' },
    { key: '2025-11', label: 'November 2025', short: 'Nov 25' },
    { key: '2025-12', label: 'December 2025', short: 'Dec 25' },
    { key: '2026-01', label: 'January 2026', short: 'Jan 26' },
    { key: '2026-02', label: 'February 2026', short: 'Feb 26' },
    { key: '2026-03', label: 'March 2026', short: 'Mar 26' },
    { key: '2026-04', label: 'April 2026', short: 'Apr 26' },
    { key: '2026-05', label: 'May 2026', short: 'May 26' },
    { key: '2026-06', label: 'June 2026', short: 'Jun 26' },
    { key: '2026-07', label: 'July 2026', short: 'Jul 26' },
    { key: '2026-08', label: 'August 2026', short: 'Aug 26' },
    { key: '2026-09', label: 'September 2026', short: 'Sep 26' },
  ];

  return MONTHS.map(m => {
    const monthIncome = income.filter(r => getMonthKey(r.date) === m.key);
    const monthExpenses = expenses.filter(r => getMonthKey(r.date) === m.key);
    const totalIncome = sumField(monthIncome, 'totalPaid');
    const totalExpenses = sumField(monthExpenses, 'amount') + sumField(monthExpenses, 'bankCharges');
    return {
      ...m,
      tithes: sumField(monthIncome, 'tithes'),
      offerings: sumField(monthIncome, 'offerings'),
      pledges: sumField(monthIncome, 'pledges'),
      bankInterest: sumField(monthIncome, 'bankInterest'),
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
    };
  });
}

console.log('=== FINANCIAL YEAR HANDLING TESTS ===\n');

// TEST 1: Financial Year Range
console.log('TEST 1: Financial Year Range (October 2025 - September 2026)');
const MONTHS = [
  { key: '2025-10', label: 'October 2025', short: 'Oct 25' },
  { key: '2025-11', label: 'November 2025', short: 'Nov 25' },
  { key: '2025-12', label: 'December 2025', short: 'Dec 25' },
  { key: '2026-01', label: 'January 2026', short: 'Jan 26' },
  { key: '2026-02', label: 'February 2026', short: 'Feb 26' },
  { key: '2026-03', label: 'March 2026', short: 'Mar 26' },
  { key: '2026-04', label: 'April 2026', short: 'Apr 26' },
  { key: '2026-05', label: 'May 2026', short: 'May 26' },
  { key: '2026-06', label: 'June 2026', short: 'Jun 26' },
  { key: '2026-07', label: 'July 2026', short: 'Jul 26' },
  { key: '2026-08', label: 'August 2026', short: 'Aug 26' },
  { key: '2026-09', label: 'September 2026', short: 'Sep 26' },
];
console.log(`  ✓ Financial Year contains 12 months: ${MONTHS.length === 12 ? 'PASS' : 'FAIL'}`);
console.log(`  ✓ Starts with October 2025: ${MONTHS[0].key === '2025-10' ? 'PASS' : 'FAIL'}`);
console.log(`  ✓ Ends with September 2026: ${MONTHS[11].key === '2026-09' ? 'PASS' : 'FAIL'}`);
console.log(`  ✓ Spans calendar year boundary (2025→2026): ${MONTHS.some(m => m.key.startsWith('2025')) && MONTHS.some(m => m.key.startsWith('2026')) ? 'PASS' : 'FAIL'}\n`);

// TEST 2: Transactions across calendar years
console.log('TEST 2: Cross-Year Transactions (Dec 2025 → Jan 2026)');
const crossYearIncome = [
  { date: '2025-12-15', receiptNo: '001', name: 'John', tithes: 100, offerings: 50, pledges: 0, bankInterest: 0, totalPaid: 150, id: '1' },
  { date: '2025-12-22', receiptNo: '002', name: 'Jane', tithes: 150, offerings: 75, pledges: 25, bankInterest: 0, totalPaid: 250, id: '2' },
  { date: '2026-01-05', receiptNo: '003', name: 'Peter', tithes: 200, offerings: 100, pledges: 50, bankInterest: 5, totalPaid: 355, id: '3' },
  { date: '2026-01-12', receiptNo: '004', name: 'Mary', tithes: 175, offerings: 80, pledges: 25, bankInterest: 3, totalPaid: 283, id: '4' },
];
const crossYearExpenses = [
  { date: '2025-12-20', purpose: 'Salary', amount: 300, bankCharges: 10, approvedBy: 'Pastor', id: '1' },
  { date: '2026-01-10', purpose: 'Maintenance', amount: 200, bankCharges: 5, approvedBy: 'Pastor', id: '2' },
];

const monthlyData = getMonthlyTotals(crossYearIncome, crossYearExpenses);
const decData = monthlyData.find(m => m.key === '2025-12');
const janData = monthlyData.find(m => m.key === '2026-01');

console.log(`  December 2025 (End of Calendar Year):`);
console.log(`    - Income: R${decData.totalIncome} (expected: 400) ✓ ${decData.totalIncome === 400 ? 'PASS' : 'FAIL'}`);
console.log(`    - Expenses: R${decData.totalExpenses} (expected: 310) ✓ ${decData.totalExpenses === 310 ? 'PASS' : 'FAIL'}`);
console.log(`    - Balance: R${decData.balance} (expected: 90) ✓ ${decData.balance === 90 ? 'PASS' : 'FAIL'}`);

console.log(`  January 2026 (Start of Calendar Year):`);
console.log(`    - Income: R${janData.totalIncome} (expected: 638) ✓ ${janData.totalIncome === 638 ? 'PASS' : 'FAIL'}`);
console.log(`    - Expenses: R${janData.totalExpenses} (expected: 205) ✓ ${janData.totalExpenses === 205 ? 'PASS' : 'FAIL'}`);
console.log(`    - Balance: R${janData.balance} (expected: 433) ✓ ${janData.balance === 433 ? 'PASS' : 'FAIL'}\n`);

// TEST 3: Year-to-Date calculations
console.log('TEST 3: Year-to-Date Calculations (Oct 2025 → Sep 2026)');
const yearToDateIncome = sumField(crossYearIncome, 'totalPaid');
const yearToDateExpenses = sumField(crossYearExpenses, 'amount') + sumField(crossYearExpenses, 'bankCharges');
const yearToDateBalance = yearToDateIncome - yearToDateExpenses;

console.log(`  Total Year-to-Date Income: R${yearToDateIncome} (expected: 1038) ✓ ${yearToDateIncome === 1038 ? 'PASS' : 'FAIL'}`);
console.log(`  Total Year-to-Date Expenses: R${yearToDateExpenses} (expected: 515) ✓ ${yearToDateExpenses === 515 ? 'PASS' : 'FAIL'}`);
console.log(`  Year-to-Date Balance: R${yearToDateBalance} (expected: 523) ✓ ${yearToDateBalance === 523 ? 'PASS' : 'FAIL'}\n`);

// TEST 4: Full Financial Year Span
console.log('TEST 4: Full Financial Year Span');
const fullYearIncome = [
  { date: '2025-10-01', receiptNo: '001', name: 'Oct Entry', tithes: 100, offerings: 50, pledges: 0, bankInterest: 0, totalPaid: 150, id: '1' },
  { date: '2025-11-15', receiptNo: '002', name: 'Nov Entry', tithes: 100, offerings: 50, pledges: 0, bankInterest: 0, totalPaid: 150, id: '2' },
  { date: '2025-12-20', receiptNo: '003', name: 'Dec Entry', tithes: 100, offerings: 50, pledges: 0, bankInterest: 0, totalPaid: 150, id: '3' },
  { date: '2026-01-10', receiptNo: '004', name: 'Jan Entry', tithes: 100, offerings: 50, pledges: 0, bankInterest: 0, totalPaid: 150, id: '4' },
  { date: '2026-09-25', receiptNo: '005', name: 'Sep Entry', tithes: 100, offerings: 50, pledges: 0, bankInterest: 0, totalPaid: 150, id: '5' },
];
const fullYearExpenses = [
  { date: '2025-10-05', purpose: 'Oct Expense', amount: 50, bankCharges: 5, approvedBy: 'Pastor', id: '1' },
  { date: '2026-09-20', purpose: 'Sep Expense', amount: 50, bankCharges: 5, approvedBy: 'Pastor', id: '2' },
];

const fullYearMonthly = getMonthlyTotals(fullYearIncome, fullYearExpenses);
const months_with_data = fullYearMonthly.filter(m => {
  const hasIncome = fullYearIncome.some(i => getMonthKey(i.date) === m.key);
  const hasExpense = fullYearExpenses.some(e => getMonthKey(e.date) === m.key);
  return hasIncome || hasExpense;
});

const total_FY_income = sumField(fullYearIncome, 'totalPaid');
const total_FY_expenses = sumField(fullYearExpenses, 'amount') + sumField(fullYearExpenses, 'bankCharges');

console.log(`  Months with transactions: ${months_with_data.length} (October 2025, November 2025, December 2025, January 2026, September 2026)`);
console.log(`  Total Income (Full Year): R${total_FY_income} (expected: 750) ✓ ${total_FY_income === 750 ? 'PASS' : 'FAIL'}`);
console.log(`  Total Expenses (Full Year): R${total_FY_expenses} (expected: 110) ✓ ${total_FY_expenses === 110 ? 'PASS' : 'FAIL'}`);
console.log(`  October (Start of FY):`);
const octData = fullYearMonthly.find(m => m.key === '2025-10');
console.log(`    - Income: R${octData.totalIncome}, Expenses: R${octData.totalExpenses}, Balance: R${octData.balance}`);
console.log(`  September (End of FY):`);
const sepData = fullYearMonthly.find(m => m.key === '2026-09');
console.log(`    - Income: R${sepData.totalIncome}, Expenses: R${sepData.totalExpenses}, Balance: R${sepData.balance}\n`);

// TEST 5: Months with no transactions
console.log('TEST 5: Empty Months (No Transactions)');
const emptyMonths = fullYearMonthly.filter(m => {
  const hasIncome = fullYearIncome.some(i => getMonthKey(i.date) === m.key);
  const hasExpense = fullYearExpenses.some(e => getMonthKey(e.date) === m.key);
  return !hasIncome && !hasExpense;
});
const emptyMonth = emptyMonths[0];
console.log(`  Empty months count: ${emptyMonths.length} (expected: 7) ✓ ${emptyMonths.length === 7 ? 'PASS' : 'FAIL'}`);
console.log(`  Sample empty month (${emptyMonth.label}):`);
console.log(`    - Income: R${emptyMonth.totalIncome} (expected: 0) ✓ ${emptyMonth.totalIncome === 0 ? 'PASS' : 'FAIL'}`);
console.log(`    - Expenses: R${emptyMonth.totalExpenses} (expected: 0) ✓ ${emptyMonth.totalExpenses === 0 ? 'PASS' : 'FAIL'}`);
console.log(`    - Balance: R${emptyMonth.balance} (expected: 0) ✓ ${emptyMonth.balance === 0 ? 'PASS' : 'FAIL'}\n`);

// TEST 6: Transactions outside financial year (should not be counted)
console.log('TEST 6: Transactions Outside Financial Year');
const mixedData = [
  { date: '2025-09-15', receiptNo: '001', name: 'Before FY', tithes: 100, offerings: 50, pledges: 0, bankInterest: 0, totalPaid: 150, id: '1' }, // BEFORE FY
  { date: '2025-10-15', receiptNo: '002', name: 'In FY', tithes: 100, offerings: 50, pledges: 0, bankInterest: 0, totalPaid: 150, id: '2' },   // IN FY
  { date: '2026-10-15', receiptNo: '003', name: 'After FY', tithes: 100, offerings: 50, pledges: 0, bankInterest: 0, totalPaid: 150, id: '3' }, // AFTER FY
];

const validIncome = mixedData.filter(i => {
  const month = getMonthKey(i.date);
  return MONTHS.some(m => m.key === month);
});

console.log(`  Total records: ${mixedData.length}`);
console.log(`  Valid records within FY: ${validIncome.length} (expected: 1) ✓ ${validIncome.length === 1 ? 'PASS' : 'FAIL'}`);
console.log(`  - Sep 2025 (before FY): Not counted ✓`);
console.log(`  - Oct 2025 (in FY): Counted ✓`);
console.log(`  - Oct 2026 (after FY): Not counted ✓\n`);

// TEST 7: Multi-category breakdown for single month
console.log('TEST 7: Complete Month Breakdown (Categories)');
const detailedMonth = monthlyData.find(m => m.key === '2026-01');
console.log(`  ${detailedMonth.label}:`);
console.log(`    - Tithes: R${detailedMonth.tithes}`);
console.log(`    - Offerings: R${detailedMonth.offerings}`);
console.log(`    - Pledges: R${detailedMonth.pledges}`);
console.log(`    - Bank Interest: R${detailedMonth.bankInterest}`);
console.log(`    - Sum of categories: R${detailedMonth.tithes + detailedMonth.offerings + detailedMonth.pledges + detailedMonth.bankInterest}`);
console.log(`    - Total Income: R${detailedMonth.totalIncome}`);
console.log(`    - Match ✓ ${(detailedMonth.tithes + detailedMonth.offerings + detailedMonth.pledges + detailedMonth.bankInterest) === detailedMonth.totalIncome ? 'PASS' : 'FAIL'}\n`);

console.log('=== ALL FINANCIAL YEAR TESTS COMPLETED ===');
