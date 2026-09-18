'use client'
import { User } from "@/app/page";
import { GetApp } from "../firebase";
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager, 
  doc, 
  getDoc, 
  setDoc,
  Firestore
} from "firebase/firestore";

// Cache the database instance HERE so it never runs initializeFirestore twice
let memoizedDb: Firestore | null = null;

function getCachedFirestore(): Firestore {
    if (memoizedDb) return memoizedDb;

    const app = GetApp(); // Now guaranteed to be defined
    
    // Server pre-rendering protection for Next.js builds
    if (typeof window === "undefined") {
        return getFirestore(app);
    }

    // Initialize exactly ONCE inside the actual browser
    memoizedDb = initializeFirestore(app, {
        localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
        }),
    });

    return memoizedDb;
}

export async function GetUserData(uid: string): Promise<User | null> {
    try {
        const db = getCachedFirestore();
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            return { uid: uid, ...data } as User;
        } else {
            console.log("No such document!");
            return await CreateUserData(uid);
        }
    } catch (error) {
        console.error("Error inside GetUserData:", error);
        return null;
    }
}

export async function SaveUserData(data: User) {
    const db = getCachedFirestore();
    const docRef = doc(db, "users", data.uid);
    await setDoc(docRef, data);
}

export async function CreateUserData(uid: string): Promise<User | null> {
    const db = getCachedFirestore();
    const docRef = doc(db, "users", uid);
    const newProfile = { name: "temp" };
    await setDoc(docRef, newProfile);
    return { uid: uid, ...newProfile } as User;
}