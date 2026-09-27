import { Outlet } from "react-router-dom";

export default function AppLayout() {
    return (
        <div className="flex flex-col">
            <main className="flex-1 w-full">
                <section className="mx-auto w-full max-w-7xl px-4 py-4">
                    <Outlet />
                </section>
            </main>
        </div>
    );
}