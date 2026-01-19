import React, { useState } from "react";

const Logout = ({ setLoggedIn, setShowUserMenu }) => {
  const [loggedOut, setLoggedOut] = useState(false);

  const handleLogout = () => {
    // ✅ First show success message
    setLoggedOut(true);

    // ✅ Then clear login state AFTER a small delay
    setTimeout(() => {
      localStorage.removeItem("isLoggedIn");
      setLoggedIn(false);
      setShowUserMenu(false);
      window.dispatchEvent(new Event("loginStatusChanged"));
    }, 300); // wait 300ms so UI can update
  };

  return (
    <div className="flex max-w-7xl items-center m-4 justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-xl min-h-screen p-10 min-h-[300px] flex flex-col justify-center w-full text-center border border-gray-200 transition-all duration-300">
        {!loggedOut ? (
          <>
            {/* Confirmation UI */}
            <h2 className="text-lg md:text-xl font-semibold text-indigo-900 mb-3">
              Are you sure you want to log out?
            </h2>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              You’ll be signed out of your account and will need to log in again
              to continue exploring opportunities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleLogout}
                className="bg-indigo-900 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-800 transition w-full sm:w-auto"
              >
                Log Out
              </button>
              <button
                className="border border-indigo-900 text-indigo-900 px-6 py-2 rounded-lg hover:bg-indigo-50 transition w-full sm:w-auto"
                onClick={() => window.history.back()}
              >
                Cancel & Stay Logged In
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Success Message UI */}
            <h2 className="text-lg md:text-xl font-semibold text-green-600 mb-3">
              You’ve successfully logged out.
            </h2>
            <p className="text-indigo-900 mb-6 text-sm md:text-base">
              Come back soon to continue your journey with projects, jobs, and
              new achievements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => (window.location.href = "/login")}
                className="bg-indigo-900 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-800 transition w-full sm:w-auto"
              >
                Log in Again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="border border-indigo-900 text-indigo-900 px-6 py-2 rounded-lg hover:bg-indigo-50 transition w-full sm:w-auto"
              >
                Go to Home Page
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Logout;
