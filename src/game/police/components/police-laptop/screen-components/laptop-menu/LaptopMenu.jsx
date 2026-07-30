import {
    FaDatabase,
    FaHouse,
    FaPowerOff,
    FaShieldHalved
} from "react-icons/fa6";

import { MenuListElement } from "./MenuListElement.jsx";

const menuItems = [
    {
        id: "home",
        title: "Startseite",
        icon: FaHouse
    },
    {
        id: "database",
        title: "Datenbank",
        icon: FaDatabase
    }
];

// ##### Laptop Navigation
// -----> Enthält ausschließlich verfügbare Anwendungen und den Rückweg ins Spiel.
// ---> Die aktive Ansicht wird zentral im LaptopScreen verwaltet.
export function LaptopMenu({ activeView, onSelect, onClose }) {
    return (
        <aside className="flex w-20 shrink-0 flex-col border-r border-zinc-700 bg-zinc-900 text-zinc-100 md:w-60">
            <div className="flex h-20 items-center gap-3 border-b border-zinc-700 px-4 md:px-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-700">
                    <FaShieldHalved aria-hidden="true" />
                </div>
                <div className="hidden min-w-0 md:block">
                    <p className="truncate text-sm font-semibold">Polizei-System</p>
                    <p className="truncate text-xs text-zinc-400">Dienstterminal</p>
                </div>
            </div>

            <nav className="flex-1 space-y-1 p-3" aria-label="Laptop-Navigation">
                {menuItems.map((menuItem) => (
                    <MenuListElement
                        key={menuItem.id}
                        active={activeView === menuItem.id}
                        icon={menuItem.icon}
                        title={menuItem.title}
                        onClick={() => onSelect(menuItem.id)}
                    />
                ))}
            </nav>

            <div className="border-t border-zinc-700 p-3">
                <MenuListElement
                    icon={FaPowerOff}
                    title="Laptop schließen"
                    onClick={onClose}
                />
            </div>
        </aside>
    );
}
