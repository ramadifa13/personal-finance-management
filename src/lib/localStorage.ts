import { Transaction } from "./slices/transactionSlice";
import { BudgetSettings } from "./types";

const STORAGE_KEY = "finance_transactions";
const BUDGET_KEY = "budget-settings";

export function loadTransactions(): Transaction[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load from localStorage", error);
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error("Failed to save to localStorage", error);
  }
}

export function loadBudget(): BudgetSettings | null {
  try {
    const data = localStorage.getItem(BUDGET_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data) as BudgetSettings;

    if (parsed.dateRange?.from) {
      parsed.dateRange.from = new Date(parsed.dateRange.from);
    }
    if (parsed.dateRange?.to) {
      parsed.dateRange.to = new Date(parsed.dateRange.to);
    }

    return parsed;
  } catch (error) {
    console.error("Failed to load budget from localStorage", error);
    return null;
  }
}

export function saveBudget(settings: BudgetSettings) {
  try {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save budget to localStorage", error);
  }
}
export function resetBudget() {
  localStorage.removeItem("budget-settings");
}

