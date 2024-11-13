import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import RuleEngine from "./components/RuleEngine";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-blue-200">
        <div className="container mx-auto p-1 bg-white rounded-lg shadow-lg animate-fadeIn">
          <div className="navbar bg-gray-800 text-white p-3 rounded-md shadow-md mb-5 animate-slideInFromTop">
            <Navbar />
          </div>
          <div className="rule-engine p-5 border border-gray-300 rounded-md shadow-md bg-gray-100 animate-fadeIn">
            <RuleEngine />
          </div>
          <ToastContainer
            className="toast-container rounded-md shadow-md"
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
          />
        </div>
      </div>
    </Router>
  );
};

export default App;