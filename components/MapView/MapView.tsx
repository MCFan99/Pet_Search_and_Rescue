'use client'
import style from "./MapView.module.css"
import { redirect } from "next/navigation";

export function MapView(){
    return (
        <div className={style.mapview_container}>
            {/* <button className={style.mapview_post_missing} onClick={() => {redirect("/PostMissing")}}>
                <h3 className="concert_one_regular">🚨 Post Missing Pet 🚨</h3>
            </button> */}
            {/* <button className={style.mapview_map}>
                <h3 className="concert_one_regular">✔ No Pets Missing!</h3>
            </button> */}
            <div className={style.mapview_map}>
                <h3 className="concert_one_regular">🗺</h3>
            </div>
        </div>
    )
}
