import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import './navbar.css'; // Добавьте стили в отдельный файл

export default function NavBar({ user, logoutHandler }) {
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
            label: 'Календарь',
            icon: 'pi pi-calendar',
            command: () => {
                navigate('/calendar');
            }
        }
    ];

    const start = (
        <img
            height="50"
            className="mr-2"
        />
    );

    const end = (
        <div className="flex align-items-center gap-2">
            {user ? (
                <>
                    <Button
                        label="Выйти"
                        onClick={async () => {
                            await logoutHandler();
                            navigate('/login');
                        }}
                        className="logout-button"
                    />
                </>
            ) : (
                <>
                    <Button
                        label="Войти"
                        onClick={() => navigate('/login')}
                        className="login-button"
                    />
                    <Button
                        label="Зарегистрироваться"
                        onClick={() => navigate('/signup')}
                        className="signup-button"
                    />
                </>
            )}
        </div>
    );

    return (
        <Menubar model={items} start={start} end={end} className="navbar" />
    );
}