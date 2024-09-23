import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addBook } from "../redux/bookSlice";

const AddBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: "",
    author: "",
    status: "À lire",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (book.endDate && book.startDate) {
      const endDate = new Date(book.endDate);
      const startDate = new Date(book.startDate);
      if (endDate < startDate) {
        setError(
          "La date de fin ne peut pas être antérieure à la date de début."
        );
      } else {
        setError("");
      }
    }
  }, [book.startDate, book.endDate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (error || !book.title || !book.author) {
      return;
    }

    const bookData = {
      ...book,
      startDate: book.startDate ? new Date(book.startDate) : null,
      endDate: book.endDate ? new Date(book.endDate) : null,
    };

    dispatch(addBook(bookData));
    alert("Livre ajouté avec succès!");
    navigate("/books");
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm sm:max-w-md">
        <h2 className="text-2xl font-medium text-center mb-6">
          Ajouter un livre
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm text-gray-500 mb-1">
              Titre
            </label>
            <input
              type="text"
              name="title"
              value={book.title}
              onChange={handleChange}
              placeholder="Entrez le titre du livre"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none
              focus:ring-2 focus:ring-border"
            />
          </div>
          <div>
            <label htmlFor="author" className="text-sm text-gray-500 mb-1">
              Auteur
            </label>
            <input
              type="text"
              name="author"
              value={book.author}
              onChange={handleChange}
              placeholder="Entrez le nom de l'auteur"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none
              focus:ring-2 focus:ring-border"
            />
          </div>
          <div>
            <label htmlFor="status" className="text-sm text-gray-500 mb-1">
              Statut
            </label>
            <select
              id="status"
              name="status"
              value={book.status}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none
              focus:ring-2 focus:ring-border"
            >
              <option value="À lire">À lire</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>
          </div>
          <div>
            <label htmlFor="startDate" className="text-sm text-gray-500 mb-1">
              Date de début
            </label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={book.startDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none
              focus:ring-2 focus:ring-border"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="text-sm text-gray-500 mb-1">
              Date de fin
            </label>
            <input
              id="endDate"
              type="date"
              name="endDate"
              value={book.endDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none
              focus:ring-2 focus:ring-border"
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-button text-white rounded-lg hover:bg-border
            transition duration-300"
          >
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
