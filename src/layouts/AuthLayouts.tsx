import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Logo from "../Components/Logo";

export default function AuthLayouts() {
  return (
    <>
      <div className="bg-slate-800 min-h-screen">
        <div className=" max-w-lg  mx-auto pt-10 px-5">
          <Logo />
          <div className=" py-10">
            <Outlet />
          </div>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            error: "bg-red-400",
            success: "text-green-400",
            warning: "text-yellow-400",
            info: "bg-blue-400",
            description: "text-white-800",
          },
        }}
      />
    </>
  );
}
