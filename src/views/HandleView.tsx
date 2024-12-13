import { Navigate, useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { getUserByHandle } from "../api/DevTreeApi";
import HandleData from "../Components/HandleData";

export default function HandleView() {
  const params = useParams();
  const handle = params.handle!;

  const { data, error, isLoading } = useQuery({
    queryFn: () => getUserByHandle(handle),
    queryKey: ["handle", handle],
    retry: 0,
  });

  if (isLoading)
    return <p className=" text-white text-center">"Cargando..."</p>;
  if (error) return <Navigate to={"/404"} />;

  if (data) return <HandleData data={data} />;
}
