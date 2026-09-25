import { useContext } from "react";
import styles from "./SideBar.module.css"
import Image from "next/image"
import Icon from "@/components/Icon";
import temp from "@/public/file.svg";
import { CollaspedContext } from "../SideBar";
import Redirect from "./Redirect";

export default function SideBarCollapsed() {
	const [, setCollapsed] = useContext(CollaspedContext)
    return (
        <div className={styles.side_bar}>
            <div className={styles.side_bar_title}>
                <button title="Side bar collapse" type="button" className={styles.side_bar_title_icon_wrapper} onClick={() => setCollapsed(false)}>
                    <Image className={styles.side_bar_title_icon} src={temp} alt="Pet Search and Rescue icons" />
                </button>
            </div>
            <div className={styles.side_bar_redirect_list}>
                <Redirect iconName="🏠" label="Main Menu" />
                <Redirect iconName="📍" label="Map View" />
                <Redirect iconName="🔎" label="Lost Pets" />
                <Redirect iconName="📄" label="Alerts" />
            </div>
        </div>
    )
}