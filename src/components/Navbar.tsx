import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlignJustify,
  ClipboardList,
  LogOut,
  SquareKanban,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserAuth } from "../context/userAuthContext";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [showLogout, setShowLogout] = useState<boolean>(false);
  const navigate = useNavigate();

  const { user, logOut } = useUserAuth();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Error while logging out:", error);
    }
  };

  return (
    <div>
      <div className="bg-[#FAEEFC] md:bg-white shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-2">
            <ClipboardList className="hidden md:block" size={29} />
            <h1 className="text-lg md:text-2xl font-medium">TaskBuddy</h1>
          </div>
          <div>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowLogout((prev) => !prev)}
            >
              <div className="relative w-9 h-9 rounded-full">
                {user?.photoURL && (
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={user.photoURL}
                    alt="profile"
                  />
                )}
                {showLogout && (
                  <button
                    onClick={handleLogout}
                    className="absolute cursor-pointer left-0 flex gap-2 items-center top-full mt-1 bg-[#FFF9F9] border border-gray-300 rounded-[12px] px-4 py-2 text-sm text-[#000000] hover:bg-gray-50 shadow-sm"
                  >
                    <LogOut size={15} />
                    <span>Logout</span>
                  </button>
                )}
              </div>
              {user?.displayName && (
                <h3 className="hidden md:block font-bold text-sm text-[#0000009c]">
                  {user.displayName}
                </h3>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link to="/" className="flex gap-2 items-center relative">
          <AlignJustify size={18} />
          <h4
            className={`text-[#231F20] text-sm font-medium ${
              location.pathname === "/"
                ? "after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[2px] after:bg-[#231F20]"
                : ""
            }`}
          >
            List
          </h4>
        </Link>
        <Link to="/board" className="flex gap-2 items-center relative">
          <SquareKanban size={18} />
          <h4
            className={`text-[#231F20] text-sm font-medium ${
              location.pathname === "/board"
                ? "after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[2px] after:bg-[#231F20]"
                : ""
            }`}
          >
            Board
          </h4>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
