import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { TabMenu } from 'primereact/tabmenu';
import BudgetPage from '../Budget/BudgetPage';
import IncomePage from '../Budget/IncomePage';
import BudgetPageChart from '../Budget/BudgetPageChart';
import IncomePageChart from '../Budget/IncomePageChart';
import axiosInstance from '../../services/axiosInstance';  
import './budget.css';

export default function MainBudgetPage() {  
  const items = [
    { label: 'Расходы', icon: 'pi pi-wallet' },
    { label: 'Доходы', icon: 'pi pi-money-bill' },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [expensesData, setExpensesData] = useState([]);
  const [incomesData, setIncomesData] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [loadingIncomes, setLoadingIncomes] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загрузка данных о расходах
        const expensesResponse = await axiosInstance.get('/expenses'); // Замените на ваш endpoint
        setExpensesData(expensesResponse.data || []);
      } catch (error) {
        console.error('Ошибка при загрузке расходов:', error);
      } finally {
        setLoadingExpenses(false);
      }
    };

    const fetchIncomes = async () => {
      try {
        // Загрузка данных о доходах
        const incomesResponse = await axiosInstance.get('/incomes'); // Замените на ваш endpoint
        setIncomesData(incomesResponse.data || []);
      } catch (error) {
        console.error('Ошибка при загрузке доходов:', error);
      } finally {
        setLoadingIncomes(false);
      }
    };

    fetchData();
    fetchIncomes();
  }, []);

  return (
    <div className="budget">
      <Card className="document-style" style={{ padding: '2rem', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
        <TabMenu 
          model={items} 
          activeIndex={activeIndex} 
          onTabChange={(e) => setActiveIndex(e.index)} 
          style={{ marginBottom: '2rem', fontSize: '1.2rem' }} 
        />

        <div className="content-wrapper">
          <div className="table-container">
            {activeIndex === 0 && <BudgetPage data={expensesData} loading={loadingExpenses} />}  
            {activeIndex === 1 && <IncomePage data={incomesData} loading={loadingIncomes} />}  
          </div>

          <div className="chart-container">
            <Card className="chart-container">
              <h3>{activeIndex === 0 ? 'Распределение расходов' : 'Динамика доходов'}</h3>
              {activeIndex === 0 
                ? <BudgetPageChart data={expensesData} loading={loadingExpenses} /> 
                : <IncomePageChart data={incomesData} loading={loadingIncomes} />}
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}