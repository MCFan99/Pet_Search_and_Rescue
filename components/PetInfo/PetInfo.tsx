import style from "./PetInfo.module.css"
import Image from "next/image"
import { useState, useEffect, useContext } from "react";
import { ScreenContext } from "@/app/contexts";
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";

{/*
    This will not be on the sidebar;
    it is only to be used for viewing info about a missing pet
    and opened by pressing the info button on a poster in the main menu
*/}

interface PetInformation {
    id: string;
    petName: string;
    petSpecies: string;
    petImage?: string;
    authorName: string;
}

export function PetInfo() {
    const [screen, setScreen] = useContext(ScreenContext);
    const [posts, setPosts] = useState<PetInformation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const db = getFirestore();
        
        // REMOVED: limit(5) so that all posters are returned from the database
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as PetInformation[];
            
            setPosts(fetchedPosts);
            setLoading(false);
        }, (error) => {
            console.error("Error listening to global posts:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDeletePost = async (postId: string) => {
        try {
            const db = getFirestore();
            await deleteDoc(doc(db, "posts", postId));
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    return (
        <div className={style.petinfo_container}>
            {posts.map((post) => (
                <div key={post.id} className={style.petinfo_full}>
                    <div className={style.pet_image}></div>
                    <div className={style.pet_name}></div>
                    <div className={style.pet_owner}></div>
                    <button className={`${style.return} concert_one_regular`} onClick={() => setScreen("Lost Pets")}>
                        <p>Return</p>
                    </button>
                    <div className={style.pet_last_seen}></div>
                    <div className={style.pet_species}></div>
                    <button className={style.remove_post}
                        onClick={() => handleDeletePost(post.id)}
                        style={{ backgroundColor: '#ff4d4d', color: 'white' }}
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    )
}