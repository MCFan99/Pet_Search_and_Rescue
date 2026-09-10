'use client'
import style from "./MainMenu.module.css"
import Icon from "../Icon";
import { redirect } from "next/navigation";

export function MainMenu(){
    return (
        <div className={style.mainmenu_container}>
            <button className={style.mainmenu_post_missing} onClick={() => {redirect("/PostMissing")}}>
                <h3 className="concert_one_regular">🚨 Post Missing Pet 🚨</h3>
            </button>
            <div className={style.mainmenu_posters}></div>
            <button className={style.mainmenu_map}>
                <h3 className="concert_one_regular">Map View</h3>
            </button>
        </div>
    )
}
