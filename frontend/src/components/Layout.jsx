import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCredentials } from "../redux/authSlice";
import logo from "../assets/logo.png";
import {
  ArrowLeftEndOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navLinks = [
    { to: "/", label: "Accueil" },
    ...(user
      ? [
          { to: "/books", label: "Ma Bibliothèque" },
          { to: "/stats", label: "Tableau De Bord" },
        ]
      : [
          { to: "/login", label: "Connexion" },
          { to: "/register", label: "S'inscrire" },
        ]),
  ];

  const renderNavLinks = (isMobile = false) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="text-white hover:text-gray-200"
          onClick={() => isMobile && setMenuOpen(false)}
        >
          {link.label}
        </Link>
      ))}
      {user && (
        <div
          className="flex items-center cursor-pointer text-white hover:underline"
          onClick={() => {
            handleLogout();
            isMobile && setMenuOpen(false);
          }}
        >
          <ArrowLeftEndOnRectangleIcon className="h-5 w-5 mr-1" />
          Déconnexion
        </div>
      )}
    </>
  );

  return (
    <div>
      <nav className="flex items-center justify-between w-full bg-primary px-6 py-4 lg:px-32">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-8" />
          </Link>
        </div>

        {/* Menu desktop */}
        <div className="hidden lg:flex items-center space-x-4">
          {renderNavLinks()}
        </div>

        <div className="flex lg:hidden">
          <Bars3Icon
            className="h-6 w-6 text-white cursor-pointer"
            onClick={toggleMenu}
          />
        </div>
      </nav>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="lg:hidden bg-primary p-4 flex flex-col items-end space-y-4">
          {renderNavLinks(true)}
        </div>
      )}

      <main className="p-4">{children}</main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;