import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

export default function NavBar( {user, logoutHandler} ) {
    const navigate = useNavigate();

    const items = [
        {
            label: 'Бухгалтерия',
            icon: 'pi pi-star',
            command: () => {
                navigate('/budget');
            }
        },
        {
            label: 'Платежи',
            icon: 'pi pi-search',
            command: () => {
                navigate('/');
            }
        },
        {
            label: 'Календарь',
            icon: 'pi pi-envelope',
            command: () => {
                navigate('/');
            }
        }
    ];

    const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="50" className="mr-2" />;
    const end = (
        <div className="flex align-items-center gap-2">
            {user ? (
                <>
                    <Button
                        label="Аккаунт"
                        onClick={() => navigate('/account')}
                        className="p-button"
                    />
                    <Button
                        label="Выйти"
                        onClick={async () => { console.log('logoutHandler:', logoutHandler);
                            await logoutHandler();
                            navigate('/login');
                        }}
                        className="p-button"
                    />
                </>
            ) : (
                <>
                    <Button
                        label="Войти"
                        onClick={() => navigate('/login')}
                        className="p-button"
                    />
                    <Button
                        label="Зарегистрироваться"
                        onClick={() => navigate('/signup')}
                        className="p-button"
                    />
                </>
            )}
            
        </div>
    );

    return (
            <Menubar model={items} start={start} end={end}  />

    );
}