'use client'
import style from "./page.module.css";
import { redirect, useRouter } from "next/navigation";
import { useState, useContext, ChangeEvent } from "react";
import { UserContext } from "../contexts";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function PostMissing() {
    const router = useRouter();
    const [user] = useContext(UserContext);
    const [petName, setPetName] = useState("");
    const [species, setSpecies] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handlePostSubmit = async () => {
        if (!petName || !species) {
            alert("Please fill out both Name and Species.");
            return;
        }

        setLoading(true);
        try {
            const db = getFirestore();
            let petImageUrl = "";

            if (imageFile) {
                const storage = getStorage();
                const storageRef = ref(storage, `pet_images/${user?.uid}/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                petImageUrl = await getDownloadURL(snapshot.ref);
            }
            
            await addDoc(collection(db, "posts"), {
                petName: petName,
                petSpecies: species,
                petImage: petImageUrl,
                authorId: user?.uid,
                authorName: user?.name || "User",
                createdAt: serverTimestamp()
            });

            alert("Pet posted successfully!");
            router.push('/'); 
        } catch (error) {
            console.error("Error creating post: ", error);
            alert("Failed to submit post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${style.page} concert_one_regular`}>
            <div className={style.main}>
                <h1 className={style.main_title}>
                    Post Missing
                </h1>
                <div className={style.postmissing_container}>
                    <div className={style.page_add_image} style={{ backgroundImage: imagePreview ? `url(${imagePreview})` : 'none' }}>
                        <p>Picture</p>
                        {!imagePreview ? (
                            <>
                            <input 
                                id="avatar" 
                                type="file" 
                                name="avatar" 
                                accept="image/png, image/jpeg" 
                                onChange={handleImageChange} 
                            />
                            </>
                        ) : (
                            /* ONLY this button element handles the image display */
                            <button 
                            type="button" 
                            className={style.image_preview_btn}
                            style={{ '--bg-image': `url(${imagePreview})` } as React.CSSProperties}
                            onClick={() => { setImagePreview(""); setImageFile(null); }}
                            title="Click to remove or change photo"
                            >
                                <span className={style.remove_overlay_text}>Remove Photo</span>
                            </button>
                        )}
                    </div>
                    <div className={`${style.page_add_name} concert_one_regular`}>
                        <p>Name:</p>
                        <input 
                            type="text" 
                            placeholder="Greg" 
                            value={petName} 
                            onChange={(e) => setPetName(e.target.value)} 
                        />
                    </div>
                    <button className={`${style.page_return} concert_one_regular`} onClick={() => {redirect('/')}} disabled={loading}>
                        <p>Cancel Post</p>
                    </button>
                    <div className={`${style.page_add_location} concert_one_regular`}>
                        <h2>Last seen:</h2>
                        <input id="avatar" type="file" name="avatar" accept="image/png, image/jpeg" />
                    </div>
                    <div className={`${style.page_species} concert_one_regular`}>
                        <p>Species:</p>
                        <input 
                            type="text" 
                            placeholder="Dog" 
                            value={species} 
                            onChange={(e) => setSpecies(e.target.value)} 
                        />
                    </div>
                    <button className={`${style.page_post} concert_one_regular`} onClick={() => {redirect('/')}} disabled={loading}>
                        <p>{loading ? "Posting..." : "Post"}</p>
                    </button>
                </div>
            </div>
        </div>
    )
}