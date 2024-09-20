import Book from "../models/Book.js";

export const addBook = (req, res) => {
  const { title, author, status, startDate, endDate } = req.body;
  const newBook = new Book({
    title,
    author,
    status,
    startDate,
    endDate,
    userId: req.user.id,
  });

  newBook
    .save()
    .then((savedBook) => {
      res.status(201).json(savedBook);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

export const getBooks = (req, res) => {
  Book.find({ userId: req.user.id })
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

export const updateBook = (req, res) => {
  const { id } = req.params;
  const update = req.body;

  Book.findOneAndUpdate({ _id: id, userId: req.user.id }, update, { new: true })
    .then((updatedBook) => {
      if (!updatedBook) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }
      res.json(updatedBook);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

export const deleteBook = (req, res) => {
  const { id } = req.params;

  Book.findOneAndDelete({ _id: id, userId: req.user.id })
    .then((deletedBook) => {
      if (!deletedBook) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }
      res.json({ message: "Livre supprimé avec succès" });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

export const getReadingStats = (req, res) => {
  Book.find({ userId: req.user.id })
    .then((books) => {
      const totalBooks = books.length;
      const readBooks = books.filter(
        (book) => book.status === "Terminé"
      ).length;
      const readingBooks = books.filter(
        (book) => book.status === "En cours"
      ).length;
      const toReadBooks = books.filter(
        (book) => book.status === "À lire"
      ).length;

      res.json({
        totalBooks,
        readBooks,
        readingBooks,
        toReadBooks,
      });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};
