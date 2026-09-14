'use client'
import style from "./LostPets.module.css"
import { redirect } from "next/navigation";

export function LostPets(){
    return (
        <div className={style.lostpets_container}>
            {/* <button className={style.lostpets_post_missing} onClick={() => {redirect("/PostMissing")}}>
                <h3 className="concert_one_regular">🚨 Post Missing Pet 🚨</h3>
            </button> */}
            <div className={style.lostpets_posters}>
                <h3 className="concert_one_regular">✔ No Pets Missing!</h3>
            </div>
            {/* <button className={style.lostpets_map}>
                <h3 className="concert_one_regular">🗺 Map View</h3>
            </button> */}
        </div>
    )
}
