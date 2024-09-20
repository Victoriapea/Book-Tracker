import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import BookList from "./pages/BookList";
import AddBook from "./pages/AddBook";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReadingStats from "./pages/ReadingStats";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <div className="px-32">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/add-book" element={<AddBook />} />
              <Route path="/stats" element={<ReadingStats />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
