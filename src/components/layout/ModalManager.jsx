import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../../contexts/DataContext";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import { X, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react";
function TransactionForm({ onClose, existingTransaction }) {
  const { categories, addTransaction, updateTransaction } =
    useContext(DataContext);
  const isEditing = !!existingTransaction;
  const [type, setType] = useState(
    isEditing ? existingTransaction.type : "expense"
  );
  const [category, setCategory] = useState(
    isEditing ? existingTransaction.category : categories.expense[0]
  );
  const [amount, setAmount] = useState(
    isEditing ? existingTransaction.amount : ""
  );
  const [description, setDescription] = useState(
    isEditing ? existingTransaction.description : ""
  );
  const [date, setDate] = useState(
    isEditing
      ? existingTransaction.date.split("T")[0]
      : new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    if (!isEditing && categories[type].length > 0) {
      setCategory(categories[type][0]);
    }
  }, [type, categories, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const transactionData = {
      id: isEditing ? existingTransaction.id : undefined,
      amount: parseFloat(amount),
      description,
      type,
      date,
      category,
    };
    if (isEditing) {
      updateTransaction(transactionData);
    } else {
      addTransaction(transactionData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">
          {isEditing ? "Edit Transaction" : "New Transaction"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          <X size={24} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setType("income")}
          className={`p-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
            type === "income"
              ? "bg-green-500 text-white ring-2 ring-offset-2 dark:ring-offset-zinc-800 ring-green-500"
              : "bg-zinc-200 dark:bg-zinc-700"
          }`}
        >
          <ArrowUp size={16} />
          <span>Income</span>
        </button>
        <button
          type="button"
          onClick={() => setType("expense")}
          className={`p-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
            type === "expense"
              ? "bg-red-500 text-white ring-2 ring-offset-2 dark:ring-offset-zinc-800 ring-red-500"
              : "bg-zinc-200 dark:bg-zinc-700"
          }`}
        >
          <ArrowDown size={16} />
          <span>Expense</span>
        </button>
      </div>
      <FormSelect
        id="category"
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories[type].map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </FormSelect>
      <FormInput
        id="description"
        label="Description"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g., Coffee with friends"
        required
      />
      <FormInput
        id="amount"
        label="Amount (Rp)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="e.g., 25000"
        required
      />
      <FormInput
        id="date"
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          className="w-full p-3 rounded-lg font-semibold bg-sky-600 text-white hover:bg-sky-700 transition-colors shadow-md"
        >
          {isEditing ? "Save Changes" : "Add Transaction"}
        </button>
      </div>
    </form>
  );
}

function SavingsGoalForm({ onClose, existingGoal }) {
  const { addSavingsGoal, updateSavingsGoal } = useContext(DataContext);
  const isEditing = !!existingGoal;
  const [name, setName] = useState(isEditing ? existingGoal.name : "");
  const [targetAmount, setTargetAmount] = useState(
    isEditing ? existingGoal.targetAmount : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const goalData = {
      id: isEditing ? existingGoal.id : undefined,
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: isEditing ? existingGoal.currentAmount : 0,
    };
    if (isEditing) {
      updateSavingsGoal(goalData);
    } else {
      addSavingsGoal(goalData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">
          {isEditing ? "Edit Goal" : "New Savings Goal"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          <X size={24} />
        </button>
      </div>
      <FormInput
        id="goalName"
        label="Goal Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., New Laptop"
        required
      />
      <FormInput
        id="targetAmount"
        label="Target Amount (Rp)"
        type="number"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
        placeholder="e.g., 15000000"
        required
      />
      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          className="w-full p-3 rounded-lg font-semibold bg-sky-600 text-white hover:bg-sky-700 transition-colors shadow-md"
        >
          {isEditing ? "Save Changes" : "Create Goal"}
        </button>
      </div>
    </form>
  );
}

function ConfirmationModal({ onClose, itemType, id }) {
  const { handleDeleteConfirm } = useContext(DataContext);
  return (
    <div className="text-center space-y-6">
      <div className="mx-auto bg-red-100 dark:bg-red-500/20 rounded-full h-16 w-16 flex items-center justify-center">
        <AlertTriangle size={32} className="text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">
        Are you sure?
      </h2>
      <p className="text-zinc-500 dark:text-zinc-400">
        {itemType === "allData"
          ? "This action will permanently delete all transactions and savings goals."
          : "This action cannot be undone. This data will be permanently deleted."}
      </p>
      <div className="flex gap-4 pt-4">
        <button
          onClick={onClose}
          className="w-full p-3 rounded-lg font-semibold bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-500 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            handleDeleteConfirm(itemType, id);
            onClose();
          }}
          className="w-full p-3 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  );
}
export default function ModalManager({ content, onClose }) {
  const { type, data } = content;

  const renderContent = () => {
    switch (type) {
      case "transaction":
        return <TransactionForm onClose={onClose} />;
      case "editTransaction":
        return <TransactionForm onClose={onClose} existingTransaction={data} />;
      case "savingsGoal":
        return <SavingsGoalForm onClose={onClose} />;
      case "editSavings":
        return <SavingsGoalForm onClose={onClose} existingGoal={data} />;
      case "confirmDelete":
        return (
          <ConfirmationModal
            onClose={onClose}
            itemType={data.type}
            id={data.id}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md border border-zinc-200 dark:border-zinc-700 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {renderContent()}
      </div>
    </div>
  );
}
