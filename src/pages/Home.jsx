import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const Home = () => {
  const { isDark } = useTheme();

  return (
    <div className="container mx-auto px-4 py-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
      <h1
        className={`text-4xl font-bold mb-4 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        Welcome to MovieMaster Pro
      </h1>
      <p
        className={`text-lg max-w-2xl ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Your ultimate movie collection manager. Browse, organize, and enjoy your
        favorite films all in one place!
      </p>
    </div>
  );
};
export default Home;
