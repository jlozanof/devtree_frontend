import { useEffect, useState } from "react";
import { social } from "../data/social";
import DevTreeInput from "../Components/DevTreeInput";
import { isValidUrl } from "../utils";
import { toast } from "sonner";
import {
  // QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { updateProfile } from "../api/DevTreeApi";
import { SocialNetwork, User } from "../types";

export default function LinkTreeView() {
  const [devTreeLinks, setDevTreeLinks] = useState(social);

  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData(["user"])!;

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Actualizado Correctamente.");
    },
  });

  useEffect(() => {
    const updateData = devTreeLinks.map((item) => {
      const userlink = JSON.parse(user.links).find(
        (link: SocialNetwork) => link.name === item.name
      );
      if (userlink) {
        return { ...item, url: userlink.url, enabled: userlink.enabled };
      }
      return item;
    });
    //console.log(JSON.parse(user.links));
    //console.log(devTreeLinks);
    setDevTreeLinks(updateData);
  }, []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = devTreeLinks.map((link) =>
      link.name === e.target.name ? { ...link, url: e.target.value } : link
    );

    setDevTreeLinks(updatedLinks);
  };

  const links: SocialNetwork[] = JSON.parse(user.links);

  const handleEnableLink = (socialNetwork: string) => {
    const updatedLinks = devTreeLinks.map((link) => {
      if (link.name === socialNetwork) {
        if (isValidUrl(link.url)) {
          return { ...link, enabled: !link.enabled };
        } else toast.error("Url No válida");
      }
      return link;
    });

    setDevTreeLinks(updatedLinks);
    //console.log(updatedLinks);

    let updatedItems: SocialNetwork[] = [];
    const selectedSocialNetwork = updatedLinks.find(
      (link) => link.name === socialNetwork
    );
    // console.log(selectedSocialNetwork);

    if (selectedSocialNetwork?.enabled) {
      const id = links.filter((link) => link.id).length + 1;
      if (links.some((link) => link.name === socialNetwork)) {
        updatedItems = links.map((link) => {
          if (link.name === socialNetwork) {
            return { ...link, enabled: true, id };
          } else {
            return link;
          }
        });
      } else {
        const mewItem = {
          ...selectedSocialNetwork,
          id,
        };
        updatedItems = [...links, mewItem];
      }
    } else {
      const indexToUpdate = links.findIndex(
        (link) => link.name == socialNetwork
      );
      updatedItems = links.map((link) => {
        if (link.name === socialNetwork) {
          return {
            ...link,
            id: 0,
            enabled: false,
          };
        } else if (
          link.id > indexToUpdate &&
          indexToUpdate != 0 &&
          link.id == 1
        ) {
          return {
            ...link,
            id: link.id - 1,
            enabled: false,
          };
        } else {
          return link;
        }
      });
      console.log(indexToUpdate);
    }

    console.log(updatedItems);
    //Guarda en la base de datos
    queryClient.setQueryData(["user"], (prevData: User) => {
      return {
        ...prevData,
        links: JSON.stringify(updatedItems),
      };
    });
  };
  return (
    <>
      <div className="space-y-5">
        {devTreeLinks.map((item) => (
          <DevTreeInput
            key={item.name}
            item={item}
            handleUrlChange={handleUrlChange}
            handleEnableLink={handleEnableLink}
          />
        ))}
        <button
          className="bg-green-600 p-2 text-lg w-full uppercase text-slate-100 rounded-lg font-bold"
          onClick={() => mutate(queryClient.getQueryData(["user"])!)}
        >
          Guardar Cambios
        </button>
      </div>
    </>
  );
}
