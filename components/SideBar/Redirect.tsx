import { ScreenContext } from "@/app/contexts"
import styles from "./SideBar.module.css"
import { useContext } from "react"
import Icon from "@/components/Icon"

export default function Redirect({ iconName, label, disableHover = false}: { iconName: string, label: string, disableHover?: boolean}) {
    const [screen, setScreen] = useContext(ScreenContext)

    return (
        <button
            type="button"
            title={label}
            className={`
                ${styles.side_bar_redirect}
                ${screen == label ? styles.side_bar_redirect_highlighted : ""}
                ${disableHover ? styles.side_bar_redirect_no_hover : ""}
                concert_one_regular
            `}
            onClick={() => setScreen(label)}
        >
            <Icon iconName={iconName} />
        </button>
    )
}