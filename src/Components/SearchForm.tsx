import ErrorMessage from "./ErrorMessage";
import { useForm } from "react-hook-form";
import slugify from "react-slugify";
import { useMutation } from "@tanstack/react-query";
import { searchByHandle } from "../api/DevTreeApi";
import { Link } from "react-router";

export default function SearchForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      handle: "",
    },
  });

  const mutacion = useMutation({
    mutationFn: searchByHandle,
  });

  const handle = watch("handle");
  const handleSearch = () => {
    const slug = slugify(handle);
    mutacion.mutate(slug);
  };

  console.log(mutacion);
  return (
    <form onSubmit={handleSubmit(handleSearch)} className="space-y-5">
      <div className="relative flex items-center  bg-white  px-2">
        <label htmlFor="handle">joellozano.com/</label>
        <input
          type="text"
          id="handle"
          className="border-none bg-transparent p-2 focus:ring-0 flex-1"
          placeholder="elonmusk, zuck, jeffbezos"
          {...register("handle", {
            required: "Un Nombre de Usuario es obligatorio",
          })}
        />
      </div>
      {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}

      <div className="mt-10">
        {mutacion.isPending && <p className="text-center">Cargando...</p>}
        {mutacion.isError && (
          <p className="text-center text-red-600 font-black text-2xl">
            {mutacion.error.message}
          </p>
        )}
        {mutacion.data && (
          <p className="text-center text-cyan-500   text-2xl">
            {mutacion.data} ir a{" "}
            <Link to={"auth/register"} state={{ handle: slugify(handle) }}>
              <span className="underline-offset-2 text-blue-700 ">
                Registrar Aquí
              </span>
            </Link>
          </p>
        )}
      </div>

      <input
        type="submit"
        className="bg-cyan-400 p-3 text-lg w-full uppercase text-pretty rounded-lg font-bold cursor-pointer"
        value="Obtener mi DevTree"
      />
    </form>
  );
}
