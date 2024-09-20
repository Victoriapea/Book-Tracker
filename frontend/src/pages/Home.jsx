import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import bannerImage from "../assets/banner.jpg";

const Home = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="flex flex-row max-w-5xl mx-auto">
        <img
          src={bannerImage}
          alt="Banner"
          className="w-2/3 h-auto object-cover"
        />
        <div className="flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl text-center">
            Bienvenue sur <span className="text-primary">BookTracker</span>
          </h1>
          <p className="text-lg text-gray-700 mt-3 text-center max-w-lg">
            Gérez votre bibliothèque personnelle et suivez vos lectures.
          </p>
          {user ? (
            <Link
              to="/books"
              className="px-6 py-3 mt-3 text-white bg-button rounded-lg hover:bg-border
              transition duration-300"
            >
              Voir mes livres
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Home;
