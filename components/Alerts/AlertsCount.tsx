'use client'

import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/app/contexts";
import { collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import styles from "./AlertsCount.module.css";

export function AlertsCount() {
    const [user] = useContext(UserContext);
    const [countState, setCountState] = useState<{ userId: string; count: number | null } | null>(null);

    useEffect(() => {
        if (!user?.uid) return;

        const alertsQuery = query(
            collection(getFirestore(), "alerts"),
            where("recipientId", "==", user.uid)
        );

        return onSnapshot(alertsQuery, (snapshot) => {
            setCountState({ userId: user.uid, count: snapshot.size });
        }, (error) => {
            console.error("Error listening to alert count:", error);
            setCountState({ userId: user.uid, count: null });
        });
    }, [user?.uid]);

    const count = countState && countState.userId === user?.uid ? countState.count : null;

    return count === null || count === 0 ? null : (
        <span className={styles.alert_count} aria-label={`${count} alerts`}>
            {count}
        </span>
    );
}
