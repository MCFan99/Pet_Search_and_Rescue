'use client'
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/app/contexts";
import { getFirestore, collection, onSnapshot, query, where } from "firebase/firestore";
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

    return (
        <div className={style.alerts_container}>
            <h2 className="concert_one_regular">Alerts</h2>
            {!user?.uid ? (
                <p>Sign in to view alerts.</p>
            ) : !currentAlertState ? (
                <p>Loading alerts...</p>
            ) : currentAlertState.error ? (
                <p role="alert">{currentAlertState.error}</p>
            ) : alerts.length === 0 ? (
                <p>No alerts yet.</p>
            ) : (
                <div className={style.alerts_list}>
                    {alerts.map((alert) => (
                        <article className={style.alert_card} key={alert.id}>
                            <h3 className="concert_one_regular">{alert.message}</h3>
                            {alert.petName && <p>Pet: {alert.petName}</p>}
                            <p>Contact email: {alert.senderEmail}</p>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}