import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  const navItems = isAuthenticated
    ? [
        { name: "Cadastro", path: "/cadastro" },
        { name: "Agendamentos", path: "/agendamentos" },
        { name: "Buscar", path: "/buscar" },
      ]
    : [{ name: "Login", path: "/login" }];

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-4">
          <NavLink
            to="/"
            className="text-2xl font-bold mb-4 md:mb-0 hover:text-blue-300 transition-colors"
          >
            ADEFI
          </NavLink>

          <ul className="flex flex-wrap gap-2 md:gap-6 items-center">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2 rounded-md transition-colors",
                      isActive
                        ? "bg-white text-blue-700 font-medium"
                        : "hover:bg-blue-600"
                    )
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
            {isAuthenticated && (
              <li>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors"
                >
                  Sair
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
