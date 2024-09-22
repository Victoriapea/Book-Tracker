import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import bannerImage from "../assets/banner.jpg";

const Home = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="flex flex-col lg:flex-row max-w-5xl mx-auto">
        <div className="flex justify-center lg:w-2/3">
          <img
            src={bannerImage}
            alt="Banner"
            className="w-full h-auto object-cover max-h-[400px]"
          />
        </div>
        <div
          className="flex flex-col items-center justify-center p-4 lg:p-8 min-h-[300px] 
          lg:min-h-[400px]"
        >
          <div className="text-center mb-8 lg:mb-0">
            <h1 className="text-3xl sm:text-4xl mb-2">
              Bienvenue sur <span className="text-primary">BookTracker</span>
            </h1>
            <p className="text-lg text-gray-700 m-0 sm:mb-4 max-w-lg">
              Gérez votre bibliothèque personnelle et suivez vos lectures.
            </p>
          </div>
          {user && (
            <Link
              to="/books"
              className="px-6 py-3 mt-3 text-white bg-button rounded-lg hover:bg-border 
              transition duration-300"
            >
              Voir mes livres
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
