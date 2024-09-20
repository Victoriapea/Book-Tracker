import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ReadingStats = () => {
  const [stats, setStats] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!token) {
          return navigate("/"); // Redirection si l'utilisateur n'est pas connecté
        }
        const response = await axios.get(
          "http://localhost:5000/api/books/stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStats(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des statistiques:",
          error
        );
        navigate("/"); // Redirection si une erreur survient
      }
    };

    fetchStats();
  }, [token, navigate]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center mt-20">
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-20 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-5xl font-medium mb-7">Suivi de Lecture</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md">
        <div className="p-4 bg-blue-100 rounded-lg shadow">
          <h3 className="font-medium">Total de livres</h3>
          <p className="text-2xl font-bold">{stats.totalBooks}</p>
        </div>
        <div className="p-4 bg-green-100 rounded-lg shadow">
          <h3 className="font-medium">Livres lus</h3>
          <p className="text-2xl font-bold">{stats.readBooks}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg shadow">
          <h3 className="font-medium">Livres en cours</h3>
          <p className="text-2xl font-bold">{stats.readingBooks}</p>
        </div>
        <div className="p-4 bg-red-100 rounded-lg shadow">
          <h3 className="font-medium">Livres à lire</h3>
          <p className="text-2xl font-bold">{stats.toReadBooks}</p>
        </div>
      </div>
    </div>
  );
};

export default ReadingStats;
