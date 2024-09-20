import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCredentials } from "../redux/authSlice";
import logo from "../assets/logo.png";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/");
  };

  return (
    <div>
      <nav className="flex items-center justify-between w-full bg-primary px-32 py-4">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-8" />
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-white hover:text-gray-200">
            Accueil
          </Link>
          {user ? (
            <>
              <Link to="/books" className="text-white hover:text-gray-200">
                Ma Bibliothèque
              </Link>
              <Link to="/stats" className="text-white hover:text-gray-200">
                Tableau De Bord
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-gray-200">
                Connexion
              </Link>
              <Link to="/register" className="text-white hover:text-gray-200">
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
        {user && (
          <div
            className="flex items-center cursor-pointer text-white hover:underline"
            onClick={handleLogout}
          >
            <ArrowLeftEndOnRectangleIcon className="h-5 w-5 mr-1" />
            Déconnexion
          </div>
        )}
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
