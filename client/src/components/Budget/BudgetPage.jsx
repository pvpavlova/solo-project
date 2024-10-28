import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import 'primeicons/primeicons.css';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

export default function BudgetPage() {
    const emptyExpense = { id: null, date: new Date(), category: null, value: 0 };
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const [expenses, setExpenses] = useState([]);
    const [expenseDialog, setExpenseDialog] = useState(false);
    const [deleteExpenseDialog, setDeleteExpenseDialog] = useState(false); // Исправлено
    const [submitted, setSubmitted] = useState(false);
    const [expense, setExpense] = useState(emptyExpense);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedExpense, setSelectedExpense] = useState(null); // Новая переменная для выбранного расхода

    const categories = [
        { name: 'Питание' },
        { name: 'Проезд' },
        { name: 'Связь' },
        { name: 'Коммунальные платежи' },
        { name: 'Здоровье' },
        { name: 'Развлечения' },
        { name: 'Питомец' },
        { name: 'Красота' },
        { name: 'Прочее' },
    ];

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1.0/expenses');
                setExpenses(response.data);
            } catch (error) {
                console.error('Ошибка при получении расходов:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, []);

    const openNew = () => {
        setExpense(emptyExpense);
        setSelectedCategory(null);
        setSubmitted(false);
        setExpenseDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setExpenseDialog(false);
    };

    const hideDeleteDialog = () => {
        setDeleteExpenseDialog(false);
    };

    const saveExpense = async () => {
        setSubmitted(true);

        if (selectedCategory) {
            let _expenses = [...expenses];
            let _expense = { ...expense, category: selectedCategory.name };

            try {
                if (expense.id) {
                    const index = findIndexById(expense.id);
                    const response = await axios.put(`http://localhost:3000/api/v1.0/expenses/${expense.id}`, _expense);
                    _expenses[index] = response.data;
                    toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Расход обновлен', life: 3000 });
                } else {
                    const response = await axios.post('http://localhost:3000/api/v1.0/expenses/new', _expense);
                    _expenses.push(response.data);
                    toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Расход создан', life: 3000 });
                }

                setExpenses(_expenses);
                setExpenseDialog(false);
                setExpense(emptyExpense);
                setSelectedCategory(null);
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось сохранить расход', life: 3000 });
            }
        }
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _expense = { ...expense };
        _expense[`${name}`] = val;
        setExpense(_expense);
    };

    const findIndexById = (id) => {
        return expenses.findIndex(expense => expense.id === id);
    };

    const confirmDeleteExpense = (expense) => {
        setSelectedExpense(expense); // Установите выбранный расход
        setDeleteExpenseDialog(true);
    };

    const deleteExpense = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/v1.0/expenses/${selectedExpense.id}`);
            setExpenses(expenses.filter(exp => exp.id !== selectedExpense.id));
            toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Расход удален', life: 3000 });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить расход', life: 3000 });
        } finally {
            hideDeleteDialog();
        }
    };

    if (loading) {
        return <p>Загрузка...</p>;
    }

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={<Button label="Новый" icon="pi pi-plus" severity="success" onClick={openNew} />} />
                <DataTable value={expenses} scrollable scrollHeight="52rem">
                    <Column field="category" header="Категория" />
                    <Column field="value" header="Сумма" />
                    <Column field="date" header="Дата" />
                    <Column 
                        body={(rowData) => (
                            <Button 
                                icon="pi pi-trash" 
                                className="p-button-danger" 
                                onClick={() => confirmDeleteExpense(rowData)} 
                            />
                        )} 
                        header="Удалить" 
                    />
                </DataTable>
            </div>

            <Dialog visible={expenseDialog} style={{ width: '32rem' }} header="Детали расхода" modal className="p-fluid" footer={
                <React.Fragment>
                    <Button label="Отмена" icon="pi pi-times" outlined onClick={hideDialog} />
                    <Button label="Сохранить" icon="pi pi-check" onClick={saveExpense} />
                </React.Fragment>
            } onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="category" className="font-bold">Категория</label>
                    <Dropdown
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.value)}
                        options={categories}
                        optionLabel="name"
                        placeholder="Выберите категорию"
                        className="w-full md:w-14rem"
                    />
                </div>

                <div className="field">
                    <label htmlFor="value" className="font-bold">Сумма</label>
                    <InputNumber
                        id="value"
                        value={expense.value}
                        onValueChange={(e) => onInputNumberChange(e, 'value')}
                        mode="currency"
                        currency="RUB"
                    />
                </div>
            </Dialog>

            <Dialog visible={deleteExpenseDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Подтвердите" modal footer={
                <React.Fragment>
                    <Button label="Отмена" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
                    <Button label="Удалить" icon="pi pi-check" onClick={deleteExpense} />
                </React.Fragment>
            } onHide={hideDeleteDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {selectedExpense && <span>Вы уверены, что хотите удалить расход "{selectedExpense.category}"?</span>}
                </div>
            </Dialog>
        </div>
    );
}