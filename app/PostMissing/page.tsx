'use client'
import style from "./page.module.css";
import { redirect, useRouter } from "next/navigation";

export default function PostMissing() {
    const router = useRouter();
    return (
        <div className={`${style.page} concert_one_regular`}>
            <div className={style.main}>
                <h1 className={style.main_title}>
                    Post Missing
                </h1>
                <div className={style.postmissing_container}>
                    <div className={style.page_add_image}></div>
                    <div className={`${style.page_add_name} concert_one_regular`}>
                        <p>Name:</p>
                        <input type="name" placeholder={"Greg"} onChange={(e) => {}} />
                    </div>
                    <button className={`${style.page_return} concert_one_regular`} onClick={() => {redirect('/')}}>
                        <p>Cancle Post</p>
                    </button>
                    <div className={`${style.page_add_location} concert_one_regular`}>
                        <h2>Last seen:</h2>
                        <input id="avatar" type="file" name="avatar" accept="image/png, image/jpeg" />
                    </div>
                    <div className={`${style.page_species} concert_one_regular`}>
                        <p>Species:</p>
                        <input type="species" placeholder={"Dog"} onChange={(e) => {}} />
                    </div>
                    <button className={`${style.page_post} concert_one_regular`} onClick={() => {redirect('/')}}>
                        <p>Post</p>
                    </button>
                </div>
            </div>
        </div>
    )
}