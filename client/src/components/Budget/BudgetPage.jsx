import React, { useEffect, useState, useRef  } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';

const ExpensesPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1.0/expenses/');
                setExpenses(response.data);
                console.log(response.data)
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось загрузить расходы', life: 3000 });
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, []);

    return (
        <div className="p-m-4">
            <Toast ref={toast} />
            <h2>Мои расходы</h2>
            <DataTable value={expenses} loading={loading} paginator rows={10} header="Список расходов">
                <Column field="category" header="Категория" sortable />
                <Column field="value" header="Сумма" sortable />
                <Column field="date" header="Дата" sortable />
            </DataTable>
        </div>
    );
};

export default ExpensesPage;