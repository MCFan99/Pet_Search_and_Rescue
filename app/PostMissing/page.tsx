'use client'
import React from "react"
import style from "./page.module.css";
import { useRouter } from "next/navigation";
import { useState, useContext, ChangeEvent } from "react";
import { UserContext } from "../contexts";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { GetApp } from "@/lib/firebase/firebase";
import "leaflet/dist/leaflet.css";

export default function PostMissing() {
    const router = useRouter();
    const [general] = useContext(UserContext);
    const [petName, setPetName] = useState("");
    const [species, setSpecies] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [lastSeenLocation, setLastSeenLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const [tilesRejected, setTilesRejected] = React.useState(false);

    React.useEffect(() => {
        let map: import("leaflet").Map | undefined;
        let marker: import("leaflet").CircleMarker | undefined;
        let cancelled = false;

        async function initializeMap() {
            const { default: L } = await import("leaflet");
            if (cancelled || !mapContainerRef.current) return;
            var northEast = L.latLng(180, 180);
            var southWest = L.latLng(-180, -180);
            var bounds = L.latLngBounds(southWest, northEast);

            map = L.map(mapContainerRef.current).setView([39.8283, -98.5795], 5);
            map.setMaxBounds(bounds);
            map.on("click", ({ latlng }) => {
                setLastSeenLocation({ latitude: latlng.lat, longitude: latlng.lng });
                if (marker) {
                    marker.setLatLng(latlng);
                } else {
                    marker = L.circleMarker(latlng, {
                        radius: 8,
                        color: "#ffffff",
                        weight: 2,
                        fillColor: "#d1495b",
                        fillOpacity: 1,
                    }).addTo(map!);
                }
            });
            const tiles = L.tileLayer(
                "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
                {
                    maxZoom: 16,
                    minZoom: 3,
                    attribution: 'Tiles courtesy of the <a href="https://www.usgs.gov/programs/national-geospatial-program/national-map">USGS National Map</a>',
                }
            );
            tiles.on("tileerror", () => {
                setTilesRejected(true);
            });
            tiles.addTo(map);
        }

        void initializeMap().catch(() => setTilesRejected(true));

        return () => {
            cancelled = true;
            map?.remove();
        };
    }, []);

    const mapError = tilesRejected ? "Map tiles could not be loaded. Check your connection or the tile provider status." : null;

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
            const auth = getAuth();
            const db = getFirestore(GetApp());
            const user = auth.currentUser;
            let petImageUrl = "";

            if (imageFile) {
                petImageUrl = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (typeof reader.result === "string") resolve(reader.result);
                        else reject(new Error("Could not read image"));
                    };
                    reader.onerror = () => reject(reader.error);
                    reader.readAsDataURL(imageFile);
                });
            }
            
            const docRef = await addDoc(collection(db, "posts"), {
                petName: petName,
                petSpecies: species,
                petImage: petImageUrl,
                authorId: user?.uid,
                authorName: general?.name || "User",
                authorEmail: user?.email || "",
                lastSeenLocation: lastSeenLocation,
            });
            await updateDoc(docRef, {
                createdAt: serverTimestamp()
            })

            console.log("Document written with ID: ", docRef.id);
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
                    <button className={`${style.page_return} concert_one_regular`} onClick={() => router.push('/')} disabled={loading}>
                        <p>Cancel Post</p>
                    </button>
                    <div className={`${style.page_add_location} concert_one_regular`}>
                        <h2>Last seen:</h2>
                        <div className={style.add_location_map}>
                            <div ref={mapContainerRef} className={style.add_location_canvas} />
                            {mapError && <p className={style.add_location_error} role="alert">{mapError}</p>}
                        </div>
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
                    <button
                        type="button"
                        className={`${style.page_post} concert_one_regular`}
                        onClick={handlePostSubmit}
                        disabled={loading}
                    >
                        <p>{loading ? "Posting..." : "Post"}</p>
                    </button>
                </div>
            </div>
        </div>
    )
}