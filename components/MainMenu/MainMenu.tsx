'use client'
import style from "./MainMenu.module.css"
import Icon from "../Icon";
import Image from "next/image";
import { redirect } from "next/navigation";

export function MainMenu(){
    return (
        <div className={style.mainmenu_container}>

            <button 
                className={style.mainmenu_post_missing} 
                onClick={() => redirect("/PostMissing")}
            >
                <Image
                    src="/missing-pet.png"
                    alt="Post Missing Pet"
                    width={200}
                    height={200}
                />
            </button>

            <div className={style.mainmenu_posters}>
                <Image
                    src="/no-pets-missing.png"
                    alt="No Pets Missing"
                    width={200}
                    height={200}
                />
            </div>

            <button className={style.mainmenu_map}>
                <Image
                    src="/map-view.webp"
                    alt="Map View"
                    width={200}
                    height={200}
                />
            </button>

        </div>
    )
}