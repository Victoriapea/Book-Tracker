import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBooks, updateBook, deleteBook } from "../redux/bookSlice";

const BookItem = ({ book, onEdit, onDelete }) => (
  <div className="flex flex-col">
    <span className="font-bold">
      {book.title} par {book.author}
    </span>
    <span>Statut : {book.status}</span>
    <h3 className="font-semibold mt-3">Mon objectif de lecture :</h3>
    <p>
      Date de début :{" "}
      {book.startDate
        ? new Date(book.startDate).toLocaleDateString()
        : "Non spécifiée"}
    </p>
    <p className="mb-3">
      Date de fin :{" "}
      {book.endDate
        ? new Date(book.endDate).toLocaleDateString()
        : "Non spécifiée"}
    </p>
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 space-x-0 sm:space-x-2">
      <button
        onClick={() => onEdit(book)}
        className="text-white bg-yellow-500 hover:bg-yellow-400 
        transition duration-300 rounded-lg px-4 py-1"
      >
        Modifier
      </button>
      <button
        onClick={() => onDelete(book._id)}
        className="text-white bg-red-600 hover:bg-red-500 transition 
        duration-300 rounded-lg px-4 py-1"
      >
        Supprimer
      </button>
    </div>
  </div>
);

const EditBookForm = ({ book, onSave, dateError }) => (
  <div className="flex flex-col space-y-2">
    <input
      type="text"
      value={book.title}
      onChange={(e) => onSave({ ...book, title: e.target.value })}
      className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-border"
      placeholder="Titre"
    />
    <input
      type="text"
      value={book.author}
      onChange={(e) => onSave({ ...book, author: e.target.value })}
      className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-border"
      placeholder="Auteur"
    />
    <select
      value={book.status}
      onChange={(e) => onSave({ ...book, status: e.target.value })}
      className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-border"
    >
      <option value="À lire">À lire</option>
      <option value="En cours">En cours</option>
      <option value="Terminé">Terminé</option>
    </select>
    <input
      type="date"
      value={book.startDate ? book.startDate.slice(0, 10) : ""}
      onChange={(e) => onSave({ ...book, startDate: e.target.value })}
      className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-border"
    />
    <input
      type="date"
      value={book.endDate ? book.endDate.slice(0, 10) : ""}
      onChange={(e) => onSave({ ...book, endDate: e.target.value })}
      className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-border"
    />
    {dateError && <p className="text-red-500">{dateError}</p>}
    <button
      onClick={() => onSave(book)}
      className="text-white bg-green-600 hover:bg-green-500 transition duration-300 rounded-lg py-2"
    >
      Enregistrer
    </button>
  </div>
);

const BookList = () => {
  const dispatch = useDispatch();
  const { books, status, error } = useSelector((state) => state.books);
  const user = useSelector((state) => state.auth.user);
  const [editingBook, setEditingBook] = useState(null);
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (status === "idle" && user) {
      dispatch(fetchBooks());
    }
  }, [status, dispatch, user]);

  const validateDates = (startDate, endDate) => {
    if (endDate && startDate) {
      return new Date(endDate) >= new Date(startDate);
    }
    return true;
  };

  const handleEdit = (book) => {
    setEditingBook({ ...book });
  };

  const handleSave = (updatedBook) => {
    if (!validateDates(updatedBook.startDate, updatedBook.endDate)) {
      setDateError(
        "La date de fin ne peut pas être antérieure à la date de début."
      );
      return;
    }
    setDateError("");
    dispatch(updateBook({ id: updatedBook._id, bookData: updatedBook }));
    setEditingBook(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) {
      dispatch(deleteBook(id));
    }
  };

  if (status === "loading")
    return <div className="text-center">Chargement...</div>;
  if (status === "failed")
    return <div className="text-red-500 text-center">Erreur: {error}</div>;
  if (!user)
    return (
      <div className="text-center">
        Veuillez vous connecter pour voir vos livres.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-5xl mt-4 mb-20 text-center">Bibliothèque</h2>
      <Link
        to="/add-book"
        className="mb-5 inline-block text-white bg-button hover:bg-border transition duration-300 rounded-lg px-4 py-2 ml-auto"
      >
        Ajouter un livre
      </Link>
      <ul className="space-y-4 book-list">
        {books.map((book) => (
          <li
            key={book._id}
            className="bg-white shadow-lg rounded-lg p-4 flex flex-col space-y-2 book-item"
          >
            {editingBook && editingBook._id === book._id ? (
              <EditBookForm
                book={editingBook}
                onSave={handleSave}
                dateError={dateError}
              />
            ) : (
              <BookItem
                book={book}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
