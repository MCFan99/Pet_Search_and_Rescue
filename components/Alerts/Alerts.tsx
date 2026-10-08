'use client'
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/app/contexts";
import { getFirestore, collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import type { Timestamp } from "firebase/firestore";
import style from "./Alerts.module.css";

interface PetFoundAlert {
    id: string;
    message: string;
    senderEmail: string;
    petName: string;
    createdAt?: Timestamp;
}

export function Alerts() {
    const [user] = useContext(UserContext);
    const [alertState, setAlertState] = useState<{
        userId: string;
        alerts: PetFoundAlert[];
        error: string;
    } | null>(null);
    const [deletingAlertId, setDeletingAlertId] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        if (!user?.uid) return;
        const alertsQuery = query(
            collection(getFirestore(), "alerts"),
            where("recipientId", "==", user.uid)
        );

        return onSnapshot(alertsQuery, (snapshot) => {
            const fetchedAlerts = snapshot.docs.map((alertDoc) => ({
                id: alertDoc.id,
                ...alertDoc.data(),
            })) as PetFoundAlert[];
            fetchedAlerts.sort(
                (a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)
            );
            setAlertState({ userId: user.uid, alerts: fetchedAlerts, error: "" });
        }, (snapshotError) => {
            console.error("Error listening to alerts:", snapshotError);
            setAlertState({
                userId: user.uid,
                alerts: [],
                error: "Could not load alerts. Please try again later.",
            });
        });
    }, [user?.uid]);

    const currentAlertState = user?.uid && alertState?.userId === user.uid ? alertState : null;
    const alerts = currentAlertState?.alerts ?? [];

    const handleDeleteAlert = async (alertId: string) => {
        setDeletingAlertId(alertId);
        setDeleteError("");
        try {
            await deleteDoc(doc(getFirestore(), "alerts", alertId));
        } catch (error) {
            console.error("Error deleting alert:", error);
            setDeleteError("Could not delete the alert. Please try again.");
        } finally {
            setDeletingAlertId(null);
        }
    };

    return (
        <div className={style.alerts_container}>
            <h2 className="concert_one_regular">Alerts</h2>
            {deleteError && <p role="alert">{deleteError}</p>}
            {!user?.uid ? (
                <div className={style.alerts_messages}>
                <p>Sign in to view alerts.</p>
                </div>
            ) : !currentAlertState ? (
                <div className={style.alerts_messages}>
                <p>Loading alerts...</p>
                </div>
            ) : currentAlertState.error ? (
                 <div className={style.alerts_messages}>
                <p role="alert">{currentAlertState.error}</p>
                </div>
            ) : alerts.length === 0 ? (
                <div className={style.alerts_clear}>
                <p></p>
                <p>No alerts yet.</p>
                 </div>
            ) : (
                <div className={style.alerts_list}>
                    {alerts.map((alert) => (
                        <article className={style.alert_card} key={alert.id}>
                            <div className={style.alert_card_header}>
                                <h3 className="concert_one_regular">{alert.message}</h3>
                                <button
                                    className={`${style.delete_alert_button} concert_one_regular`}
                                    type="button"
                                    onClick={() => handleDeleteAlert(alert.id)}
                                    disabled={deletingAlertId !== null}
                                >
                                    {deletingAlertId === alert.id ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                            {alert.petName && <p>Pet: {alert.petName}</p>}
                            <p>Contact email: {alert.senderEmail}</p>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}