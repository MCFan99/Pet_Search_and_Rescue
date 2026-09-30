'use client'
import style from "./Settings.module.css"

function updateCustomColor(variable: string, value: string) {
    const root = document.documentElement;
    root.dataset.theme = "custom";
    root.style.setProperty(variable, value);
}

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
                <input type="text" placeholder={"#82a8d7"} onChange={(e) => updateCustomColor("--background", e.target.value)} />
                <p>Foreground:</p>
                <input type="text" placeholder={"#6e7fcf"} onChange={(e) => updateCustomColor("--foreground", e.target.value)} />
                <p>Text:</p>
                <input type="text" placeholder={"#cbeefe"} onChange={(e) => updateCustomColor("--text", e.target.value)} />
                <p>Tertiary:</p>
                <input type="text" placeholder={"#5a66d7"} onChange={(e) => updateCustomColor("--tertiary", e.target.value)} />
                <p>Highlight:</p>
                <input type="text" placeholder={"#6771cb"} onChange={(e) => updateCustomColor("--highlight", e.target.value)} />
            </div>
        </div>
    )
}
