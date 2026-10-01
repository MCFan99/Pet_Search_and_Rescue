import style from "./PetInfo.module.css"
import { useContext } from "react";
import { ScreenContext, SelectedPetContext, UserContext } from "@/app/contexts";
import { getFirestore, deleteDoc, doc } from "firebase/firestore";

{/*
    This will not be on the sidebar;
    it is only to be used for viewing info about a missing pet
    and opened by pressing the info button on a poster in the main menu
*/}

export function PetInfo() {
    const [, setScreen] = useContext(ScreenContext);
    const [user] = useContext(UserContext);
    const [selectedPet] = useContext(SelectedPetContext);

    const handleDeletePost = async (postId: string) => {
        try {
            const db = getFirestore();
            await deleteDoc(doc(db, "posts", postId));
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    if (!selectedPet) {
        return (
            <div className={style.petinfo_container}>
                <p>No pet selected.</p>
            </div>
        );
    }
    let postAction;
    if (!selectedPet.authorId || selectedPet.authorId === user?.uid) {
        <button className={style.remove_post}
            onClick={() => {handleDeletePost(selectedPet.id); setScreen("Lost Pets")}}
            style={{ backgroundColor: '#ff4d4d', color: 'white' }}
        >
            Delete
        </button>
    } else {
        <button className={style.remove_post}>
            I found your pet!
        </button>
    }

    return (
        <div className={style.petinfo_container}>
            {selectedPet ? (
                <div className={style.petinfo_full}>
                    <div className={style.pet_image}>
                        <img
                            src={selectedPet.petImage || "/no-image-available.png"}
                            alt={selectedPet.petName}
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                        />
                    </div>
                    <div className={style.pet_name}>Name: {selectedPet.petName}</div>
                    <div className={style.pet_owner}>
                        Reported by: {selectedPet.authorName}
                        {selectedPet.authorEmail && <div>{selectedPet.authorEmail}</div>}
                    </div>
                    <button className={`${style.return} concert_one_regular`} onClick={() => setScreen("Lost Pets")}>
                        <p>Return</p>
                    </button>
                    <div className={style.pet_last_seen}>
                        Last seen: {selectedPet.lastSeenLocation
                            ? `${selectedPet.lastSeenLocation.latitude}, ${selectedPet.lastSeenLocation.longitude}`
                            : "Not provided"}
                    </div>
                    <div className={style.pet_species}>Species: {selectedPet.petSpecies}</div>
                    {postAction} 
                </div>
            ) : (
                <p>No pet selected.</p>
            )}
        </div>
    )
}