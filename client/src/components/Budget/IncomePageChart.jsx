import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import axios from 'axios';

export default function IncomePageChart({ userId }) {
  const [incomeData, setIncomeData] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [categoryIncomes, setCategoryIncomes] = useState([]);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1.0/incomes/?userId=${userId}`);
        const monthlyIncomeByCategory = {};
        let total = 0;

        response.data.forEach(income => {
          const monthIndex = (new Date(income.date)).getUTCMonth();
          const category = income.category;

          if (!monthlyIncomeByCategory[category]) {
            monthlyIncomeByCategory[category] = new Array(12).fill(0);
          }

          monthlyIncomeByCategory[category][monthIndex] += income.value;
          total += income.value;
        });

        const monthNames = [
          'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
          'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];

        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#FFA726', '#42A5F5', '#7E57C2'];

        const datasets = Object.keys(monthlyIncomeByCategory).map((category, index) => ({
          label: category,
          data: monthlyIncomeByCategory[category],
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length],
          fill: true,
        }));

        setTotalIncome(total);
        setCategoryIncomes(Object.entries(monthlyIncomeByCategory).map(([category, incomes]) => ({
          category,
          total: incomes.reduce((sum, value) => sum + value, 0)
        })));

        setIncomeData({
          labels: monthNames,
          datasets: datasets,
        });
      } catch (error) {
        console.error('Ошибка загрузки доходов', error);
      }
    };

    fetchIncomes();
  }, [userId]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Динамика доходов по категориям',
      },
    },
  };

  return incomeData ? (
    <div>
      <Chart type="bar" data={incomeData} options={options} style={{ width: '40rem', height: '22rem' }} />
      <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '1rem' }}>
        Общий доход: {totalIncome} руб.
      </p>
      <h3 style={{ marginTop: '1rem' }}>Доходы по категориям:</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {categoryIncomes.map(({ category, total }) => (
          <li key={category} style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
            {category}: {total} руб.
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p>Загрузка данных...</p>
  );
}