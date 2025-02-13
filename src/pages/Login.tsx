import circle from "../assets/images/circles_bg.png";
import task from "../assets/icons/task.png";
import google from "../assets/icons/google.png";
import table from "../assets/images/Task list view 3.png";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/userAuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { googleSignIn } = useUserAuth();

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
      navigate("/");
    } catch (error) {
      console.log("error in while login ", error);
    }
  };

  return (
    <div className="h-screen  relative flex items-center justify-center md:gap-5 md:justify-between px-6 md:px-0 md:pt-6 md:pl-14">
      {/* Left Section */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <div className="flex items-center gap-3 mb-2">
          <img
            src={task}
            alt="TaskBuddy Icon"
            className="w-8 h-8 object-cover"
          />
          <h1 className="text-[#7B1984] font-bold text-[1.6rem] lg:text-4xl">
            TaskBuddy
          </h1>
        </div>

        <p className="text-gray-800 font-medium mt-2 text-sm lg:text-[16px] mb-7 max-w-[24rem] lg:max-w-lg">
          Streamline your workflow and track progress effortlessly with our
          all-in-one task management app.
        </p>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 bg-black text-white px-6 py-4 rounded-[18px] hover:bg-gray-800 transition mx-auto w-full"
        >
          <img src={google} alt="Google Icon" className="w-5 h-5" />
          <span className="font-bold text-sm">Continue with Google</span>
        </button>
      </div>

      <div className="bottom-3 absolute md:hidden w-32 h-32 flex items-center justify-center rounded-full border border-[rgba(123,25,132,0.5)] md:bottom-3">
        <div className="w-28 h-28 rounded-full flex items-center justify-center border border-[rgba(123,25,132,0.5)]">
          <div className="w-24 h-24 rounded-full border border-[#7B1984]"></div>
        </div>
      </div>
      <div className="top-14 absolute -left-14 md:hidden w-32 h-32 flex items-center justify-center rounded-full border border-[rgba(123,25,132,0.5)]">
        <div className="w-28 h-28 rounded-full flex items-center justify-center border border-[rgba(123,25,132,0.5)]">
          <div className="w-24 h-24 rounded-full border border-[#7B1984]"></div>
        </div>
      </div>
      <div className="fixed -top-[30px] -right-[30px]   md:hidden w-32 h-32 flex items-center justify-center rounded-full border border-[rgba(123,25,132,0.5)]">
        <div className="w-28 h-28 rounded-full flex items-center justify-center border border-[rgba(123,25,132,0.5)]">
          <div className="w-24 h-24 rounded-full border border-[#7B1984]"></div>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative hidden md:block">
        <img
          src={circle}
          alt="Background Circle"
          className="max-w-[860px] w-full max-h-[600px] object-cover"
        />
        <img
          src={table}
          alt="Task Table"
          className="absolute right-0 bottom-3 h-[90%] max-h-[600px] w-auto object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
