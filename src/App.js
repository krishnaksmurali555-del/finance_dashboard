import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { FaPlus, FaTrash } from "react-icons/fa";

function App() {
  const [transactions, setTransactions] = useState([
    { id: 1, date: "2026-03-01", amount: 5000, category: "Salary", type: "income" },
    { id: 2, date: "2026-03-02", amount: 200, category: "Food", type: "expense" },
    { id: 3, date: "2026-03-03", amount: 1000, category: "Shopping", type: "expense" },
  ]);
  const [filter, setFilter] = useState("all");
  const [role, setRole] = useState("admin");
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [form, setForm] = useState({ date: "", amount: "", category: "", type: "expense" });

  const income = transactions.filter(t => t.type === "income");
  const expense = transactions.filter(t => t.type === "expense");

  const totalIncome = income.reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = expense.reduce((s, t) => s + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  const filteredData = filter === "all" ? transactions : transactions.filter(t => t.type === filter);

  const categoryMap = {};
  expense.forEach(e => { categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount; });
  const highestCategory = Object.keys(categoryMap).reduce(
    (a, b) => (categoryMap[a] > categoryMap[b] ? a : b),
    Object.keys(categoryMap)[0]
  );
  const highestAmount = categoryMap[highestCategory] || 0;

  const handleAdd = () => {
    if (!form.date || !form.amount || !form.category || !form.type) return;
    setTransactions([
      ...transactions,
      { ...form, id: Date.now(), amount: Number(form.amount), type: form.type }
    ]);
    setShowModal(false);
    setForm({ date: "", amount: "", category: "", type: "expense" });
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28", "#A569BD", "#FF69B4"];

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, index, name, value
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name}: ₹${value}`}
      </text>
    );
  };

  return (
    <div
      className="flex h-screen font-sans"
      style={{
        background: "linear-gradient(135deg, #f7f0ff 0%, #e0e7ff 100%)",
      }}
    >

      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-10">FinTrack</h2>
          <ul className="space-y-5 text-lg">
            <li onClick={() => setPage("dashboard")} className="cursor-pointer hover:text-blue-400">Dashboard</li>
            <li onClick={() => setPage("transactions")} className="cursor-pointer hover:text-blue-400">Transactions</li>
            <li onClick={() => setPage("reports")} className="cursor-pointer hover:text-blue-400">Reports</li>
          </ul>
        </div>
        <p className="text-gray-400 text-sm mt-10">&copy; 2026 FinTrack</p>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-10 overflow-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-semibold capitalize">{page}</h1>
          <select
            onChange={(e) => setRole(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                <p className="text-gray-700">Balance</p>
                <h2 className="text-2xl font-bold text-blue-600">₹{balance}</h2>
              </div>
              <div className="bg-green-100 p-6 rounded-xl shadow hover:shadow-lg transition">
                <p className="text-gray-700">Income</p>
                <h2 className="text-2xl font-bold text-green-700">₹{totalIncome}</h2>
              </div>
              <div className="bg-red-100 p-6 rounded-xl shadow hover:shadow-lg transition">
                <p className="text-gray-700">Expense</p>
                <h2 className="text-2xl font-bold text-red-600">₹{totalExpense}</h2>
              </div>
            </div>

            {/* SPENDING TREND */}
            <div className="bg-white p-6 rounded-xl shadow mb-10">
              <h2 className="mb-4 text-lg font-semibold">Spending Trend</h2>
              <LineChart width={800} height={300} data={transactions}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" />
              </LineChart>
            </div>

            {/* INSIGHTS */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="mb-6 text-lg font-semibold">Insights</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-purple-100 p-5 rounded-lg hover:bg-purple-200">
                  <p className="text-gray-700 text-sm">Highest Spending Category</p>
                  <h3 className="text-xl font-bold">{highestCategory || "N/A"}</h3>
                  <p className="text-red-500">₹{highestAmount}</p>
                </div>
                <div className="bg-purple-100 p-5 rounded-lg hover:bg-purple-200">
                  <p className="text-gray-700 text-sm">Total Transactions</p>
                  <h3 className="text-xl font-bold">{transactions.length}</h3>
                </div>
                <div className="bg-purple-100 p-5 rounded-lg hover:bg-purple-200">
                  <p className="text-gray-700 text-sm">Savings</p>
                  <h3 className="text-xl font-bold text-green-600">₹{balance}</h3>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TRANSACTIONS */}
        {page === "transactions" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-lg font-semibold">Transactions</h2>
              <div className="flex gap-4 items-center">
                <select
                  onChange={(e) => setFilter(e.target.value)}
                  className="border px-3 py-1 rounded-full text-sm"
                >
                  <option value="all">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                {role === "admin" && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-200 flex items-center gap-1"
                  >
                    <FaPlus /> Add
                  </button>
                )}
              </div>
            </div>
            <table className="w-full text-sm border-collapse border">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="py-2 px-3 border">Date</th>
                  <th className="px-3 border">Amount</th>
                  <th className="px-3 border">Category</th>
                  <th className="px-3 border">Type</th>
                  {role === "admin" && <th className="px-3 border">Action</th>}
                </tr>
              </thead>
              <tbody>
                {filteredData.map(t => (
                  <tr key={t.id} className="hover:bg-gray-100">
                    <td className="py-2 px-3 border">{t.date}</td>
                    <td className="px-3 border">₹{t.amount}</td>
                    <td className="px-3 border">{t.category}</td>
                    <td className="px-3 border">
                      <span className={`px-3 py-1 rounded-full text-white text-sm ${
                        t.type === "income" ? "bg-green-500" : "bg-red-400"
                      }`}>{t.type}</span>
                    </td>
                    {role === "admin" && (
                      <td className="px-3 border">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="bg-red-200 text-red-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-300 flex items-center gap-1"
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORTS */}
        {page === "reports" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-6">Reports</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="bg-gray-100 p-6 rounded-xl flex-1 hover:bg-gray-200">
                <h3 className="font-bold mb-2">Spending by Category</h3>
                <PieChart width={500} height={400}>
                  <Pie
                    data={expense}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={140}
                    label={renderCustomizedLabel}
                  >
                    {expense.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="bg-gray-100 p-6 rounded-xl flex-1 hover:bg-gray-200">
                <h3 className="font-bold mb-2">Summary</h3>
                <p>Total Income: ₹{totalIncome}</p>
                <p>Total Expense: ₹{totalExpense}</p>
                <p>Balance: ₹{balance}</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center" onClick={() => setShowModal(false)}>
          <div className="bg-white p-6 rounded-xl w-96" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 font-semibold">Add Transaction</h2>
            <input type="date" className="w-full mb-2 border p-2 rounded" onChange={e => setForm({ ...form, date: e.target.value })} />
            <input placeholder="Amount" className="w-full mb-2 border p-2 rounded" onChange={e => setForm({ ...form, amount: e.target.value })} />
            <input placeholder="Category" className="w-full mb-2 border p-2 rounded" onChange={e => setForm({ ...form, category: e.target.value })} />
            <select className="w-full mb-4 border p-2 rounded" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="w-1/2 bg-gray-200 py-2 rounded-full text-sm">Cancel</button>
              <button onClick={handleAdd} className="w-1/2 bg-blue-100 text-blue-800 py-2 rounded-full text-sm">Add</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;