import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../common/Avatar";

type Props = {
    children?: React.ReactNode;
};

export default function Navbar({ children }: Props) {
    const { user, isAuthenticated, logout } = useAuth();

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const location = useLocation();

    return (
        <>
            <nav className="sticky top-0 z-50 w-full min-h-20 border-b border-gray-300 bg-white py-3 md:py-0 flex items-center">
                <div className="w-full h-full flex flex-wrap md:flex-nowrap justify-between items-center gap-4 px-8">

                    <div>
                        <Link
                            to="/products/"
                        >
                            <span className="font-extrabold text-xl">
                                OnlineCatalog
                            </span>
                        </Link>

                    </div>

                    <div className="order-last md:order-0 w-full md:flex-1">
                        {children}
                    </div>

                    <div className="flex justify-between items-center">
                        {isAuthenticated && user ? (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsUserMenuOpen((prev) => !prev)
                                    }
                                    className="cursor-pointer rounded-lg"
                                >
                                    <div className="flex gap-2 items-center">
                                        <Avatar name={user.name} />
                                        <span>{user.name}</span>
                                    </div>
                                    
                                </button>

                                {isUserMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() =>
                                                setIsUserMenuOpen(false)
                                            }
                                        />

                                        <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                                            
                                            <div className="border-b border-gray-100 px-4 py-3">
                                                <p className="font-medium text-gray-900">
                                                    {user.name}
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500 truncate">
                                                    {user.email}
                                                </p>
                                            </div>

                                            <div className="p-2">
                                                <Link
                                                    to="/admin"
                                                    onClick={() =>
                                                        setIsUserMenuOpen(false)
                                                    }
                                                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Minha conta
                                                </Link>

                                                <Link
                                                    to="/admin/settings"
                                                    onClick={() =>
                                                        setIsUserMenuOpen(false)
                                                    }
                                                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Configurações
                                                </Link>

                                                <Link
                                                    to="/admin/products"
                                                    onClick={() =>
                                                        setIsUserMenuOpen(false)
                                                    }
                                                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Gerenciar meus produtos
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsUserMenuOpen(false);
                                                        logout();
                                                    }}
                                                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    Sair
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-sm text-gray-600">
                                <Link
                                    to="/admin"
                                    state={{ from: location.pathname + location.search }}
                                    className="font-medium text-black hover:underline"
                                >
                                    Entre
                                </Link>

                                <span className="mx-1 text-gray-400">
                                    ou
                                </span>

                                <Link
                                    to="/register"
                                    className="font-medium text-black hover:underline"
                                >
                                    Cadastre-se
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </nav>

            <Outlet />
        </>
    );
}
