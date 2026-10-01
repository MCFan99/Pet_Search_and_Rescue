import style from "./Alerts.module.css"
import Image from "next/image"

export function Alerts() {
    return (
        <div className={style.alerts_container}>
            <button className={style.alert_test} onClick={() => {}}>
                <h3 className="concert_one_regular"> Test</h3>
            </button>
        </div>
    )
}