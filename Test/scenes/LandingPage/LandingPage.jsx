import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
// import nor from "../public/nor.png";
import img1 from "../../public/ana1.svg";
import img2 from "../../public/ana2.svg";
import img3 from "../../public/ana3.svg";
// import img4 from "../../public/ana4.svg";
import img5 from "../../public/ana5.svg";
import img6 from "../../public/ana6.svg";
import img7 from "../../public/ana7.svg";
import img8 from "../../public/ana8.svg";
// import img9 from "../../public/ana9.svg";
import img10 from "../../public/ana10.svg";

export default function CapsuleMediaLanding() {
  const [randomImage, setRandomImage] = useState(null);
  
  const images = [img1, img2, img3, img5, img6, img7, img8, img10];
  
  useEffect(() => {
    const idx = Math.floor(Math.random() * images.length);
    setRandomImage(images[idx]);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 shadow-sm">
        <Link to="/">
          <h1 className="text-2xl font-bold text-blue-600">Evalon</h1>
        </Link>
        <nav className="space-x-6 text-gray-700 font-medium hidden md:flex">
          <a href="#">Features</a>
          <a href="#">Resources</a>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <Link to="/auth">
            Login
          </Link>
        </nav>
        <div className="space-x-3 hidden md:flex">
          <Link to="/auth">
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
              SIGN UP
            </button>
          </Link>
          <Link to="/auth">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              LOGIN
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-between flex-1 px-10 py-16 max-w-7xl mx-auto -mt-6">
        {/* Left Content */}
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Academic <span className="text-blue-600">Examination &</span>{" "}
            Assessment System
          </h2>
          <p className="mt-6 text-lg text-gray-600">
            Evalon combines smart automation with insightful analytics to help
            educators create, conduct, and evaluate exams effortlessly. Focus on
            teaching.
          </p>
          <Link to="/auth">
            <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition">
              Discover Evalon
            </button>
          </Link>
        </motion.div>

        {/* Right - Mobile Mockup */}

        <motion.div
          className="mt-10 md:mt-0 md:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={randomImage}
            alt="CapsuleMedia App"
            className="w-[400px] md:w-[480px] drop-shadow-2xl"
          />
        </motion.div>
        

        
        
      </main>
    </div>
  );
}
