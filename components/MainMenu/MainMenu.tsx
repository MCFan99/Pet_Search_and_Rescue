'use client'
import style from "./MainMenu.module.css"
import Icon from "../Icon";
import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import { ScreenContext } from "@/app/contexts";
import { getFirestore, collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { redirect } from "next/navigation";

interface PetPost {
    id: string;
    petName: string;
    petSpecies: string;
    petImage?: string;
    authorName: string;
}

export function MainMenu(){
    const [screen, setScreen] = useContext(ScreenContext);
    const [posts, setPosts] = useState<PetPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const db = getFirestore();
        
        // REMOVED: limit(5) so that all posters are returned from the database
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as PetPost[];
            
            setPosts(fetchedPosts);
            setLoading(false);
        }, (error) => {
            console.error("Error listening to global posts:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAddTestPost = async () => {
        try {
            const db = getFirestore();
            const names = ["Fluffy", "Rex", "Bella", "Max", "Luna"];
            const speciesList = ["Dog", "Cat", "Bird", "Rabbit"];
            
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomSpecies = speciesList[Math.floor(Math.random() * speciesList.length)];

            await addDoc(collection(db, "posts"), {
                petName: randomName,
                petSpecies: randomSpecies,
                authorName: "Tester App",
                createdAt: serverTimestamp()
                // Leaving petImage blank so it triggers the placeholder asset
            });
        } catch (error) {
            console.error("Error adding test post:", error);
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            const db = getFirestore();
            await deleteDoc(doc(db, "posts", postId));
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    return (
        <div className={style.mainmenu_container}>
            <button 
                className={style.mainmenu_post_missing} 
                onClick={() => redirect("/PostMissing")}
            >
                <Image
                    src="/missing-pet.png"
                    alt="Post Missing Pet"
                    width={200}
                    height={200}
                />
            </button>
            <div className={style.mainmenu_posters}>
                {/* TEMPORARY TEST BUTTON */}
                <button 
                    onClick={handleAddTestPost}
                    className={style.test_btn}
                >
                    🔧 Test: Add Random Post
                </button>

                {loading ? (
                    <p>Loading posters...</p>
                ) : posts.length === 0 ? (
                    /* Fallback when no pets are missing */
                    <Image
                        src="/no-pets-missing.png"
                        alt="No Pets Missing"
                        width={200}
                        height={200}
                    />
                ) : (
                    /* The dynamic posters template list */
                    <div className={style.posters_scroll_grid}>
                        {posts.map((post) => (
                            <div key={post.id} className={style.poster_card}>
                                <div className={style.poster_image_wrapper}>
                                    {post.petImage ? (
                                        <img 
                                            src={post.petImage} 
                                            alt={post.petName} 
                                            className={style.poster_pet_img} 
                                        />
                                    ) : (
                                        <div className={style.poster_placeholder_img}>No Image</div>
                                    )}
                                </div>
                                <h3 className={style.poster_pet_name}>{post.petName}</h3>
                                
                                {/* Info Button updates your app frame view to show all data */}
                                <button 
                                    className={`${style.poster_info_btn} concert_one_regular`}
                                    onClick={() => setScreen("Lost Pets")}
                                >
                                    Info
                                </button>
                                {/* CHANGED: Temporary Delete Button */}
                                <button 
                                    className={`${style.poster_info_btn} concert_one_regular`}
                                    onClick={() => handleDeletePost(post.id)}
                                    style={{ backgroundColor: '#ff4d4d', color: 'white' }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button className={style.mainmenu_map}>
                <Image
                    src="/map-view.webp"
                    alt="Map View"
                    width={200}
                    height={200}
                />
            </button>

        </div>
    )
}