import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import axios from 'axios';

export default function BudgetPageChart() {
  const [expenseData, setExpenseData] = useState(null);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1.0/expenses'); 
        const data = response.data;

        if (data && data.length > 0) {
          const categoryTotals = data.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.value;
            return acc;
          }, {});

          setExpenseData({
            labels: Object.keys(categoryTotals),
            datasets: [{
              data: Object.values(categoryTotals),
              backgroundColor: [
                '#42A5F5',
                '#66BB6A',
                '#FFA726',
                '#26C6DA',
                '#7E57C2',
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
              ],
              hoverBackgroundColor: [
                '#2196F3',
                '#4CAF50',
                '#FF9800',
                '#00BCD4',
                '#673AB7',
                '#E91E63',
                '#03A9F4',
                '#FFC107',
              ],
            }]
          });

          const total = Object.values(categoryTotals).reduce((acc, value) => acc + value, 0);
          setTotalExpenses(total);
          setMonthlyExpenses(Object.entries(categoryTotals).map(([category, value]) => ({ category, value })));
        }
      } catch (error) {
        console.error('Ошибка при получении данных расходов:', error);
      }
    };

    fetchExpenseData(); 
  }, []);

  return expenseData ? (
    <div style={{ padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', background: '#fff' }}>
      <Chart 
        type="pie" 
        data={expenseData} 
        style={{ width: '42rem', height: '23.5rem' }} 
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 14,
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const label = tooltipItem.label || '';
                  const value = tooltipItem.raw || 0;
                  return `${label}: ${value} руб.`;
                },
              },
            },
          },
        }}
      />
      <h4 style={{ textAlign: 'center', color: '#555' }}>Общий расход за месяц: {totalExpenses} руб.</h4>
      <h4 style={{ textAlign: 'center', color: '#555' }}>Расходы по категориям:</h4>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {monthlyExpenses.map(expense => (
          <li key={expense.category} style={{ margin: '10px 0', color: '#333' }}>
            {expense.category}: {expense.value} руб.
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p>Загрузка данных...</p>
  );
}