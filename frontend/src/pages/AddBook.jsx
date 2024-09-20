import { useState } from "react";
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // pour éviter les erreurs de date
    if (
      book.endDate &&
      book.startDate &&
      new Date(book.endDate) < new Date(book.startDate)
    ) {
      setError(
        "La date de fin ne peut pas être antérieure à la date de début."
      );
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
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-medium text-center mb-6">
          Ajouter un livre
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={book.title}
            onChange={handleChange}
            placeholder="Titre"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-border"
          />
          <input
            type="text"
            name="author"
            value={book.author}
            onChange={handleChange}
            placeholder="Auteur"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-border"
          />
          <select
            name="status"
            value={book.status}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-border"
          >
            <option value="À lire">À lire</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
          </select>
          <input
            type="date"
            name="startDate"
            value={book.startDate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-border"
          />
          <input
            type="date"
            name="endDate"
            value={book.endDate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-border"
          />

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-button text-white rounded-lg hover:bg-border transition duration-300"
          >
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
