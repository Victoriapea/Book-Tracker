import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBooks, updateBook, deleteBook } from "../redux/bookSlice";

const BookList = () => {
  const dispatch = useDispatch();
  const { books, status, error } = useSelector((state) => state.books);
  const user = useSelector((state) => state.auth.user);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    if (status === "idle" && user) {
      dispatch(fetchBooks());
    }
  }, [status, dispatch, user]);

  const handleEdit = (book) => {
    setEditingBook({ ...book });
  };

  const handleSave = () => {
    dispatch(updateBook({ id: editingBook._id, bookData: editingBook }));
    setEditingBook(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) {
      dispatch(deleteBook(id));
    }
  };

  if (status === "loading") {
    return <div className="text-center">Chargement...</div>;
  }

  if (status === "failed") {
    return <div className="text-red-500 text-center">Erreur: {error}</div>;
  }

  if (!user) {
    return (
      <div className="text-center">
        Veuillez vous connecter pour voir vos livres.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-5xl mt-4 mb-20 text-center">Bibliothèque</h2>
      <Link
        to="/add-book"
        className="mb-4 inline-block text-white bg-button hover:bg-border transition duration-300 rounded-lg px-4 py-2"
      >
        Ajouter un livre
      </Link>
      <ul className="space-y-4">
        {books.map((book) => (
          <li
            key={book._id}
            className="bg-white shadow-lg rounded-lg p-4 flex flex-col space-y-2"
          >
            {editingBook && editingBook._id === book._id ? (
              <div className="flex flex-col space-y-2 ">
                <input
                  type="text"
                  value={editingBook.title}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, title: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-border"
                  placeholder="Titre"
                />
                <input
                  type="text"
                  value={editingBook.author}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, author: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-border"
                  placeholder="Auteur"
                />
                <select
                  value={editingBook.status}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, status: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-border"
                >
                  <option value="À lire">À lire</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                </select>
                <input
                  type="date"
                  value={
                    editingBook.startDate
                      ? editingBook.startDate.slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      startDate: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-border"
                />
                <input
                  type="date"
                  value={
                    editingBook.endDate ? editingBook.endDate.slice(0, 10) : ""
                  }
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, endDate: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-border"
                />
                <button
                  onClick={handleSave}
                  className="text-white bg-green-600 hover:bg-green-500 transition duration-300 rounded-lg py-2"
                >
                  Enregistrer
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-1">
                <span className="font-bold">
                  {book.title} par {book.author}
                </span>
                <span>Statut: {book.status}</span>
                <p>
                  Date de début :{" "}
                  {book.startDate
                    ? new Date(book.startDate).toLocaleDateString()
                    : "Non spécifiée"}
                </p>
                <p>
                  Date de fin :{" "}
                  {book.endDate
                    ? new Date(book.endDate).toLocaleDateString()
                    : "Non spécifiée"}
                </p>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(book)}
                    className="text-white bg-yellow-500 hover:bg-yellow-400 transition duration-300 rounded-lg px-4 py-1"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="text-white bg-red-600 hover:bg-red-500  transition duration-300 rounded-lg px-4 py-1"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
