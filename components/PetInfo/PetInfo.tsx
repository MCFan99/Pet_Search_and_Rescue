import style from "./PetInfo.module.css"
import { useContext, useState } from "react";
import { ScreenContext, SelectedPetContext, UserContext } from "@/app/contexts";
import { getFirestore, deleteDoc, doc, collection, addDoc, serverTimestamp } from "firebase/firestore";

{/*
    This will not be on the sidebar;
    it is only to be used for viewing info about a missing pet
    and opened by pressing the info button on a poster in the main menu
*/}

export function PetInfo() {
    const [, setScreen] = useContext(ScreenContext);
    const [user] = useContext(UserContext);
    const [selectedPet] = useContext(SelectedPetContext);
    const [sendingAlert, setSendingAlert] = useState(false);
    const [alertFeedback, setAlertFeedback] = useState("");

    const handleDeletePost = async (postId: string) => {
        try {
            const db = getFirestore();
            await deleteDoc(doc(db, "posts", postId));
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleFoundPet = async () => {
        if (!selectedPet?.authorId || !user?.uid || !user.email || selectedPet.authorId === user.uid) {
            setAlertFeedback("You must be signed in with an email address to send this alert.");
            return;
        }

        setSendingAlert(true);
        setAlertFeedback("");
        try {
            const db = getFirestore();
            await addDoc(collection(db, "alerts"), {
                recipientId: selectedPet.authorId,
                senderId: user.uid,
                senderEmail: user.email,
                petId: selectedPet.id,
                petName: selectedPet.petName,
                message: "Someone has found your pet!",
                createdAt: serverTimestamp(),
            });
            setAlertFeedback(`Alert sent to ${selectedPet.authorName}.`);
        } catch (error) {
            console.error("Error sending found-pet alert:", error);
            setAlertFeedback("Could not send the alert. Please try again.");
        } finally {
            setSendingAlert(false);
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
        postAction = <button className={`${style.remove_post} concert_one_regular`}
            onClick={() => {handleDeletePost(selectedPet.id); setScreen("Lost Pets")}}
            style={{ backgroundColor: '#ff4d4d', color: 'white' }}
        >
            Delete
        </button>
    } else {
        postAction = (
            <>
                <button
                    className={`${style.remove_post} concert_one_regular`}
                    onClick={handleFoundPet}
                    disabled={sendingAlert || !user?.email}
                >
                    {sendingAlert ? "Sending..." : "I found your pet!"}
                </button>
                {!user?.email && <p role="alert">An account email is required to send this alert.</p>}
                {alertFeedback && <p role="status">{alertFeedback}</p>}
            </>
        );
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
                    <div className={style.pet_name}>Name: {selectedPet.petName} <br /> Species: {selectedPet.petSpecies}</div>
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
                    {postAction} 
                </div>
            ) : (
                <p>No pet selected.</p>
            )}
        </div>
    )
}