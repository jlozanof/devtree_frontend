import { useForm } from "react-hook-form";
import ErrorMessage from "../Components/ErrorMessage";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { ProfileForm, User } from "../types";
import { updateProfile, uploadImage } from "../api/DevTreeApi";
import { toast } from "sonner";

export default function ProfileView() {
  const queryClient = useQueryClient();
  const data: User = queryClient.getQueryData(["user"])!;
  // console.log(data);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: {
      handle: data.handle,
      description: data.description,
    },
  });

  //mutacion
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,

    onError: (error) => {
      // console.log("hubo un error");
      toast.error(error.message);
    },
    onSuccess: (data) => {
      //console.log(data);
      toast.success(data);
      //invalida los datos cacheados y vulve a ejecutar la consulta de applayout.
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  //mutacion
  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,

    onError: (error) => {
      // console.log("hubo un error");
      toast.error(error.message);
    },
    onSuccess: (data) => {
      // queryClient.invalidateQueries({ querykey: ["user"] });  //optimistc updates //invalida los datos cacheados y vulve a ejecutar la consulta de applayout.
      queryClient.setQueryData(["user"], (prevData: User) => {
        //console.log(prevData);
        return {
          ...prevData,
          image: data,
        };
      }); //optimistc updates //invalida los datos cacheados y vulve a ejecutar la consulta de applayout.
    },
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadImageMutation.mutate(e.target.files[0]);
    }
  };

  const handleUserProfileForm = async (formData: ProfileForm) => {
    const user: User = queryClient.getQueryData(["user"])!;
    user.description = formData.description;
    user.handle = formData.handle;
    //console.log(user);
    //console.log(formData);
    updateProfileMutation.mutate(user);
  };

  return (
    <form
      className="bg-white p-10 rounded-lg space-y-5"
      onSubmit={handleSubmit(handleUserProfileForm)}
    >
      <legend className="text-2xl text-slate-800 text-center">
        Editar Información
      </legend>
      <div className="grid grid-cols-1 gap-2">
        <label htmlFor="handle">Handle:</label>
        <input
          type="text"
          className="border-none bg-slate-100 rounded-lg p-2"
          placeholder="handle o Nombre de Usuario"
          {...register("handle", {
            required: "El Nombre del Usuario es Obligatorio",
          })}
        />
        {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label htmlFor="description">Descripción:</label>
        <textarea
          className="border-none bg-slate-100 rounded-lg p-2"
          placeholder="Tu Descripción"
          {...register("description", {
            required: "La decripcion  es Obligatorio",
          })}
        />
        {errors.description && (
          <ErrorMessage>{errors.description.message}</ErrorMessage>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label htmlFor="handle">Imagen:</label>
        <input
          id="image"
          type="file"
          name="handle"
          className="border-none bg-slate-100 rounded-lg p-2"
          accept="image/*"
          onChange={handleChange}
        />
      </div>

      <input
        type="submit"
        className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-950 rounded-lg font-bold cursor-pointer"
        value="Guardar Cambios"
      />
    </form>
  );
}
