import style from "./page.module.css";
import { redirect } from "next/navigation";

export default function PostMissing() {
    return (
        <div className={`${style.page} concert_one_regular`}>
            <button className={`${style.page_return} concert_one_regular`} onClick={() => {redirect("/MainMenu")}}>
                Cancle Post
            </button>
        </div>
    )
}