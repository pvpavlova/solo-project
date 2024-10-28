import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

export default function Income() {
    const emptyIncome = { id: null, date: new Date(), category: null, value: 0 };
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const [incomes, setIncomes] = useState([]);
    const [incomeDialog, setIncomeDialog] = useState(false);
    const [deleteIncomeDialog, setDeleteIncomeDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [income, setIncome] = useState(emptyIncome);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const categories = [
        { name: 'Зарплата' },
        { name: 'Премия' },
        { name: 'Аванс' },
        { name: 'Кэшбек' },
        { name: 'Подработка' },
    ];

    useEffect(() => {
        const fetchIncomes = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1.0/incomes'); // Замените на ваш endpoint
                setIncomes(response.data || []);
            } catch (error) {
                console.error('Ошибка при загрузке доходов:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIncomes();
    }, []);

    const openNew = () => {
        setIncome(emptyIncome);
        setSelectedCategory(null);
        setSubmitted(false);
        setIncomeDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setIncomeDialog(false);
    };

    const hideDeleteDialog = () => {
        setDeleteIncomeDialog(false);
    };

    const saveIncome = async () => {
        setSubmitted(true);

        if (selectedCategory) {
            let _incomes = [...incomes];
            let _income = { ...income, category: selectedCategory.name };

            try {
                if (income.id) {
                    const index = findIndexById(income.id);
                    const response = await axios.put(`http://localhost:3000/api/v1.0/incomes/${income.id}`, _income);
                    _incomes[index] = response.data;
                    toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Доход обновлен', life: 3000 });
                } else {
                    const response = await axios.post('http://localhost:3000/api/v1.0/incomes/new', _income);
                    _incomes.push(response.data);
                    toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Доход создан', life: 3000 });
                }

                setIncomes(_incomes);
                setIncomeDialog(false);
                setIncome(emptyIncome);
                setSelectedCategory(null);
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось сохранить доход', life: 3000 });
            }
        }
    };

    const openDeleteDialog = (income) => {
        setIncome(income);
        setDeleteIncomeDialog(true);
    };

    const deleteIncome = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/v1.0/incomes/${income.id}`);
            const _incomes = incomes.filter((i) => i.id !== income.id);
            setIncomes(_incomes);
            toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Доход удалён', life: 3000 });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить доход', life: 3000 });
        } finally {
            setDeleteIncomeDialog(false);
            setIncome(emptyIncome);
        }
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _income = { ...income };
        _income[`${name}`] = val;
        setIncome(_income);
    };

    const findIndexById = (id) => {
        return incomes.findIndex(income => income.id === id);
    };

    if (loading) {
        return <p>Загрузка...</p>;
    }

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={<Button label="Новый" icon="pi pi-plus" severity="success" onClick={openNew} />} />
                <DataTable value={incomes} scrollable scrollHeight="48rem">
                    <Column field="category" header="Категория" />
                    <Column field="value" header="Сумма" />
                    <Column field="date" header="Дата" />
                    <Column
                        body={(rowData) => (
                            <Button 
                                icon="pi pi-trash" 
                                className="p-button-danger" 
                                onClick={() => openDeleteDialog(rowData)} 
                            />
                        )}
                    />
                </DataTable>
            </div>

            <Dialog visible={incomeDialog} style={{ width: '32rem' }} header="Детали дохода" modal className="p-fluid" footer={
                <React.Fragment>
                    <Button label="Отмена" icon="pi pi-times" outlined onClick={hideDialog} />
                    <Button label="Сохранить" icon="pi pi-check" onClick={saveIncome} />
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
                        value={income.value} 
                        onValueChange={(e) => onInputNumberChange(e, 'value')} 
                        mode="currency" 
                        currency="RUB"  
                    />
                </div>
            </Dialog>

            <Dialog 
                visible={deleteIncomeDialog} 
                style={{ width: '32rem' }} 
                header="Подтвердите" 
                modal 
                footer={
                    <React.Fragment>
                        <Button label="Отмена" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
                        <Button label="Удалить" icon="pi pi-check" onClick={deleteIncome} />
                    </React.Fragment>
                } 
                onHide={hideDeleteDialog}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {income && <span>Вы уверены, что хотите удалить этот доход?</span>}
                </div>
            </Dialog>
        </div>
    );
}