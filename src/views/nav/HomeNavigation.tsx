import { Link } from "react-router-dom";

export default function HomeNavigation() {
  return (
    <>
      <Link
        className="text-white p-2 uppercase text-xs cursor-pointer"
        to="/auth/login"
      >
        Iniciar Sesion
      </Link>
      <Link
        className="rounded-lg  bg-lime-500 text-slate-800 p-2 uppercase text-xs cursor-pointer"
        to="/auth/register"
      >
        Registrarme
      </Link>
    </>
  );
}
