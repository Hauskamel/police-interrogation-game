import {
    POLICE_LAPTOP_VIEWS,
    useGameStore,
    usePoliceLaptopStore
} from "@stores";

import { PoliceDatabaseScreen } from "./screen-components/database-screen/PoliceDatabaseScreen.jsx";
import { HomeScreen } from "./screen-components/home-screen/HomeScreen.jsx";
import { LaptopMenu } from "./screen-components/laptop-menu/LaptopMenu.jsx";

// ##### Police Laptop
// -----> Stellt die spielbare Polizei-Anwendung als eigenständige Oberfläche dar.
// ---> Debug-Daten und World Truth werden hier bewusst nicht eingebunden.
export function LaptopScreen() {
    const activeView = usePoliceLaptopStore((state) => state.activeView);
    const setActiveView = usePoliceLaptopStore((state) => state.setActiveView);
    const ingameMode = useGameStore((state) => state.ingameMode);

    return (
        <div className="fixed inset-0 z-[10000] flex min-h-0 bg-zinc-100 text-zinc-900">
            <LaptopMenu
                activeView={activeView}
                onSelect={setActiveView}
                onClose={ingameMode}
            />

            <main className="min-w-0 flex-1 overflow-hidden">
                {activeView === POLICE_LAPTOP_VIEWS.DATABASE ? (
                    <PoliceDatabaseScreen />
                ) : (
                    <HomeScreen
                        onOpenDatabase={() => {
                            setActiveView(POLICE_LAPTOP_VIEWS.DATABASE);
                        }}
                    />
                )}
            </main>
        </div>
    );
}
