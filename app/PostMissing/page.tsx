'use client'
import style from "./page.module.css";
import { redirect, useRouter } from "next/navigation";

export default function PostMissing() {
    const router = useRouter()
    return (
        <div className={`${style.page} concert_one_regular`}>
            <div className={style.main}>
                <h1 className={style.main_title}>
                    Post Missing
                </h1>
                <div className={style.postmissing_container}>
                    <div className={style.page_add_image}></div>
                    <button className={style.page_return} onClick={() => {redirect('https://silver-space-memory-wvp6pvr4rph9pwr-3000.app.github.dev')}}>
                        <h1>Cancle Post</h1>
                    </button>
                </div>
            </div>
        </div>
    )
}