'use client'
import styles from "./page.module.css";
import Image from "next/image";
import { useEffect, useState, createContext, useRef } from "react";
import PostMissing from "./PostMissing/page";
import SideBar from "@/components/SideBar/SideBar";
import { MainMenu } from "@/components/MainMenu/MainMenu";
import { LostPets } from "@/components/LostPets/LostPets";
import { MapView } from "@/components/MapView/MapView";
import { ScreenContext } from "./contexts";

export default function Home() {
	const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
	const tempUserRef = useRef<User | null>(user);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || undefined
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  function SetUser(val: User | null) {
		tempUserRef.current = val
		setUser(val)

    if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
    }

		autoSaveTimerRef.current = setTimeout(() => {
			console.log("checking if user data needs to be saved")
			console.log(tempUserRef.current)
			console.log(val)
			if (val == tempUserRef.current && !(tempUserRef.current == null)) {
				SaveUserData(tempUserRef.current ?? { uid: "" })
			}
		}, 10000)
	}

  const [screen, setScreen] = useState<string>("Main Menu")
  return (
    <div className={`${styles.page} concert_one_regular`}>
      <ScreenContext.Provider value={[screen, setScreen]}>
        {screen == "Post Missing" ? (
          <PostMissing />
        ) : (
          <></>
        )}
        <SideBar />
        {/* <ListsContext.Provider value={[lists, setLists]}> */}
        <div className={styles.main}>
          <h1 className={styles.main_title}>
            {screen}
          </h1>
          {screen == "Main Menu" ? (
            <MainMenu />
          ) : (
            <></>
          )}
          {screen == "Lost Pets" ? (
            <LostPets />
          ) : (
            <></>
          )}
          {screen == "Map View" ? (
            <MapView />
          ) : (
            <></>
          )}
        </div>
        {/* </ListsContext.Provider> */}
      </ScreenContext.Provider>
    </div>
  );
}