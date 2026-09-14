'use client'
import styles from "./page.module.css";
import Image from "next/image";
import { useState, createContext, useRef } from "react";
import PostMissing from "./PostMissing/page";
import SideBar from "@/components/SideBar/SideBar";
import { MainMenu } from "@/components/MainMenu/MainMenu";
import { LostPets } from "@/components/LostPets/LostPets";
import { MapView } from "@/components/MapView/MapView";
import { ScreenContext } from "./contexts";

export default function Home() {
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
