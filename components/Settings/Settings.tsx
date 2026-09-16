'use client'
import style from "./Settings.module.css"
import test from "./globals.css";
import { redirect } from "next/navigation";
export function Settings(){
    return (
        <div className={style.settings_container}>
            <button className={style.settings_light_mode} onClick={() => {}}>
                <h3 className="concert_one_regular">⚪ Light Mode</h3>
            </button>
            <button className={style.settings_dark_mode} onClick={() => {redirect("/PostMissing")}}>
                <h3 className="concert_one_regular">⚫ Dark Mode</h3>
            </button>
            <div className={style.settings_posters}>
                <h3 className="concert_one_regular">I dont know what to put here</h3>
            </div>
        </div>
    )
}
