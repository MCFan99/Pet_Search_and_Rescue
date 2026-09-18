'use client'
import style from "./Settings.module.css"
import global from "./globals.css";
import { redirect } from "next/navigation";
export function Settings(){
    return (
        <div className={style.settings_container}>
             <button className={style.settings_default_mode} onClick={() => { document.documentElement.dataset.theme = "default" }}>
                <h3 className="concert_one_regular">🔵 Default Mode</h3>
            </button>
            <button className={style.settings_light_mode} onClick={() => { document.documentElement.dataset.theme = "light" }}>
                <h3 className="concert_one_regular">⚪ Light Mode</h3>
            </button>
            <button className={style.settings_dark_mode} onClick={() => { document.documentElement.dataset.theme = "dark" }}>
                <h3 className="concert_one_regular">⚫ Dark Mode</h3>
            </button>
            <div className={`${style.settings_posters} concert_one_regular`}>
                <p>Background:</p>
                <input type="name" placeholder={"#82a8d7"} onChange={(e) => {}} />
                <p>Foreground:</p>
                <input type="name" placeholder={"#6e7fcf"} onChange={(e) => {}} />
                <p>Text:</p>
                <input type="name" placeholder={"#cbeefe"} onChange={(e) => {}} />
                <p>Tertiary:</p>
                <input type="name" placeholder={"#5a66d7"} onChange={(e) => {}} />
                <p>Highlight:</p>
                <input type="name" placeholder={"#6771cb"} onChange={(e) => {}} />
            </div>
        </div>
    )
}
