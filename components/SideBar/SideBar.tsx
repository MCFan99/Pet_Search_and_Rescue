import { useState, createContext } from "react";
import SideBarExpanded from "./Expanded/SideBar";
import SideBarCollapsed from "./Collapsed/SideBar"

export const CollaspedContext = createContext<[boolean, (value: boolean) => void]>([false, () => { }])

export default function SideBar() {
    const [, setScreen] = useContext(ScreenContext)
    return (
        <div className={styles.side_bar}>
            <div className={styles.side_bar_title}></div>
            <div className={styles.side_bar_redirect_list}>
                <Redirect iconName="🏠 Home" label="Main Menu" />
                <Redirect iconName="📍 Pin" label="Map View" />
                <Redirect iconName="🔎 Missing" label="Lost Pets" />
            </div>
        </div>
    )
}