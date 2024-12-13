import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../Components/ErrorMessage";
import { LoginForm } from "../types";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import api from "../config/axios";

// rfc = tab genera la funcion
export default function LoginView() {
  const navigate = useNavigate();

  const initialtValues: LoginForm = {
    email: "joel@joel.com",
    password: "12345678",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialtValues });

  const handleLogin = async (formData: LoginForm) => {
    console.log(formData);

    try {
      const { data } = await api.post(`/auth/login`, formData);
      //console.log(data)
      /*
      toast.success(data, {
        className: "bg-green-500 text-white text-sm font-sans ",
      });
      */
      localStorage.setItem("AUTH_TOKEN", data);
      navigate("/admin");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        //console.log(error.response.data)
        toast.error(error.response.data.error);
      }
    }
  };
  return (
    <>
      <h1 className=" text-white mb-10 text-4xl font-bold text-center">
        Iniciar Sesion
      </h1>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10"
        noValidate
      >
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="email" className="text-2xl text-slate-500">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="password" className="text-2xl text-slate-500">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
          value="Iniciar Sesión"
        />
      </form>
      <nav className=" mt-10  text-white">
        <Link className="text-center text-lg block" to="/auth/register">
          No tienes cuenta? Crea una cuenta aqui
        </Link>
      </nav>
    </>
  );
}
