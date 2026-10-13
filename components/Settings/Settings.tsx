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
             <button className={style.settings_default_mode} onClick={() => { document.documentElement.dataset.theme = "default"
                updateCustomColor("--background", "#82a8d7"); setPreferedBackground("#82a8d7");
                updateCustomColor("--foreground", "#6e7fcf"); setPreferedForeground("#6e7fcf");
                updateCustomColor("--text", "#cbeefe"); setPreferedText("#cbeefe");
                updateCustomColor("--tertiary", "#5a66d7"); setPreferedTertiary("#5a66d7");
                updateCustomColor("--highlight", "#6771cb"); setPreferedHighlight("#6771cb");
              }}>
                <h3 className="concert_one_regular"> Default Mode</h3>
            </button>
            <button className={style.settings_light_mode} onClick={() => { document.documentElement.dataset.theme = "light"; 
                updateCustomColor("--background", "#d7e3f8"); setPreferedBackground("#d7e3f8");
                updateCustomColor("--foreground", "#e5eaf3"); setPreferedForeground("#e5eaf3");
                updateCustomColor("--text", "#4b4f52"); setPreferedText("#4b4f52");
                updateCustomColor("--tertiary", "#97b2d2"); setPreferedTertiary("#97b2d2");
                updateCustomColor("--highlight", "#f8f9ff"); setPreferedHighlight("#f8f9ff"); }}>
                <h3 className="concert_one_regular"> Light Mode</h3>
            </button>
            <button className={style.settings_dark_mode} onClick={() => { document.documentElement.dataset.theme = "dark" 
                updateCustomColor("--background", "#121314"); setPreferedBackground("#121314");
                updateCustomColor("--foreground", "#191a1b"); setPreferedForeground("#191a1b");
                updateCustomColor("--text", "#989898"); setPreferedText("#989898");
                updateCustomColor("--tertiary", "#373838"); setPreferedTertiary("#373838");
                updateCustomColor("--highlight", "#2c2d2e"); setPreferedHighlight("#2c2d2e");}}>
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
