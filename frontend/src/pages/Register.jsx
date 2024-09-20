import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setCredentials } from "../redux/authSlice";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { username, email, password }
      );
      dispatch(setCredentials(response.data));
      navigate("/books");
    } catch (error) {
      alert("Erreur d'inscription: " + error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <h2 className="text-2xl font-medium text-center mb-6">Inscription</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nom d'utilisateur"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none
            focus:ring-2 focus:ring-border"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none
            focus:ring-2 focus:ring-border"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
            focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-button text-white rounded-lg hover:bg-border transition 
            duration-300"
          >
            S&apos;inscrire
          </button>
        </form>
        <p className="mt-4 text-center">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
