'use client'
import style from "./Settings.module.css"
import { useContext, useState } from "react";
import { UserContext } from "@/app/contexts";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { GetApp } from "@/lib/firebase/firebase";

function updateCustomColor(variable: string, value: string) {
    const root = document.documentElement;
    root.dataset.theme = "custom";
    root.style.setProperty(variable, value);
    
}

export function Settings(){
    const [user] = useContext(UserContext);
    const [preferedBackground, setPreferedBackground] = useState("");
    const [preferedForeground, setPreferedForeground] = useState("");
    const [preferedText, setPreferedText] = useState("");
    const [preferedTertiary, setPreferedTertiary] = useState("");
    const [preferedHighlight, setPreferedHighlight] = useState("");
    const [loading, setLoading] = useState(false);
    
    const db = getFirestore(GetApp());

    const handleSetPreference = async () => {
        const uid = user?.uid;
        if (!uid) {
            return;
        }

        try {
            const userDocRef = doc(db, "users", uid);
            await updateDoc(userDocRef, {
                preferedBackground: preferedBackground,
                preferedForeground: preferedForeground,
                preferedText: preferedText,
                preferedTertiary: preferedTertiary,
                preferedHighlight: preferedHighlight,
            })
        } catch (error) {
            console.error("Error updating user prefered colors: ", error);
            alert("Failed to update user preferences. Please try again.");
        } finally {
            setLoading(false);
        }
    }
    

    return (
        <div className={style.settings_container}>
             <button className={style.settings_default_mode} onClick={() => { document.documentElement.dataset.theme = "default" }}>
                <h3 className="concert_one_regular"> Default Mode</h3>
            </button>
            <button className={style.settings_light_mode} onClick={() => { document.documentElement.dataset.theme = "light" }}>
                <h3 className="concert_one_regular"> Light Mode</h3>
            </button>
            <button className={style.settings_dark_mode} onClick={() => { document.documentElement.dataset.theme = "dark" }}>
                <h3 className="concert_one_regular">Dark Mode</h3>
            </button>
            <div className={`${style.settings_posters} concert_one_regular`}>
                <p>Background:</p>
                <input type="text" placeholder={"#82a8d7"} value={preferedBackground} onChange={(e) => {updateCustomColor("--background", e.target.value); setPreferedBackground(e.target.value);}} />
                <p>Foreground:</p>
                <input type="text" placeholder={"#6e7fcf"} value={preferedForeground} onChange={(e) => {updateCustomColor("--foreground", e.target.value); setPreferedForeground(e.target.value);}} />
                <p>Text:</p>
                <input type="text" placeholder={"#cbeefe"} value={preferedText} onChange={(e) => {updateCustomColor("--text", e.target.value); setPreferedText(e.target.value);}} />
                <p>Tertiary:</p>
                <input type="text" placeholder={"#5a66d7"} value={preferedTertiary} onChange={(e) => {updateCustomColor("--tertiary", e.target.value); setPreferedTertiary(e.target.value);}} />
                <p>Highlight:</p>
                <input type="text" placeholder={"#6771cb"} value={preferedHighlight} onChange={(e) => {updateCustomColor("--highlight", e.target.value); setPreferedHighlight(e.target.value);}} />
                <button className={`${style.settings_posters_set} concert_one_regular`} onClick={handleSetPreference}>
                    <p>{loading ? "Saving..." : "Save"}</p>
                </button>
            </div>
        </div>
    )
}
