'use client'
import style from "./LostPets.module.css"
import { useState, useEffect, useContext } from "react";
import { ScreenContext, SelectedPetContext } from "@/app/contexts";
import { getFirestore, collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import Image from "next/image";
import { PetSearch, type PetSearchCategory } from "../PetSearch/PetSearch";

interface PetPost {
    id: string;
    petName: string;
    petSpecies: string;
    petImage?: string;
    authorId: string;
    authorName: string;
    authorEmail?: string;
    lastSeenLocation: Location;
    createdAt: Timestamp;
}

interface Location {
    latitude: number;
    longitude: number;
}

export function LostPets(){
    const [posts, setPosts] = useState<PetPost[]>([]);
     const [screen, setScreen] = useContext(ScreenContext);
    const [, setSelectedPet] = useContext(SelectedPetContext);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState<PetSearchCategory>("name");

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const filteredPosts = posts.filter((post) =>
        post[searchCategory === "name" ? "petName" : "petSpecies"].toLowerCase().includes(normalizedSearchTerm)
    );
    const searchSuggestions = [...new Set(posts.map((post) =>
        post[searchCategory === "name" ? "petName" : "petSpecies"]
    ))];

    useEffect(() => {
        const db = getFirestore();
        
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
    return (
        <div className={style.lostpets_container}>
             <PetSearch
                id="lost-pets-search"
                category={searchCategory}
                value={searchTerm}
                suggestions={searchSuggestions}
                onCategoryChange={setSearchCategory}
                onChange={setSearchTerm}
            />
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
                ) : filteredPosts.length === 0 ? (
                    <p role="status">No pets match &quot;{searchTerm}&quot;.</p>
                ) : (
                    /* The dynamic posters template list */
                    <div className={style.posters_scroll_grid}>
                        {filteredPosts.map((post) => (
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
                                <h3 className={style.poster_pet_name}>Name: {post.petName}</h3>
                                <h3 className={style.poster_date}>Date Posted: {post.createdAt.toDate().toLocaleString()}</h3>
                                <h3 className={style.poster_species}>Species: {post.petSpecies}</h3>
                                
                                {/* Info Button updates your app frame view to show all data */}
                                <button 
                                    className={`${style.poster_info_btn} concert_one_regular`}
                                    onClick={() => { setSelectedPet(post); setScreen("Pet Info"); }}
                                >
                                    Info
                                </button>
                                {/* CHANGED: Temporary Delete Button */}
                            </div>
                        ))}
                    </div>
                )}
        </div>
    )
}
