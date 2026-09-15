'use client'
import { useContext } from "react";
import styles from "./SideBar.module.css"
import Image from "next/image"
import Icon from "@/components/Icon";
import Redirect from "./Redirect";
import { ScreenContext } from "@/app/contexts";

export default function SideBar() {
    const [, setScreen] = useContext(ScreenContext)
    return (
        <div className={styles.side_bar}>
            <div className={styles.side_bar_title}></div>
            <div className={styles.side_bar_redirect_list}>
                <Redirect iconName="🏠 Home" label="Main Menu" />
                <Redirect iconName="📍 Pin" label="Map View" />
                <Redirect iconName="🔎 Missing" label="Lost Pets" disableHover />
            </div>
        </div>
    )
}