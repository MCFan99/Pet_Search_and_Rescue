'use client'
import React from "react"
import style from "./MapView.module.css"
import { useState, useEffect, useContext } from "react";
import { getFirestore, collection, query, onSnapshot } from "firebase/firestore";
import {  Timestamp } from "firebase/firestore";
import "leaflet/dist/leaflet.css";

interface PetPost {
    id: string;
    petName: string;
    petSpecies: string;
    petImage?: string;
    authorId: string;
    authorName: string;
    authorEmail?: string;
    lastSeenLocation: Location;
    createdAt: Timestamp;
}

interface Location {
    latitude: number;
    longitude: number;
}

export function MapView(){
    const [posts, setPosts] = useState<PetPost[]>([]);
    const [mapInstance, setMapInstance] =
    useState<import("leaflet").Map | null>(null);
    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const [tilesRejected, setTilesRejected] = React.useState(false);

    useEffect(() => {
        const db = getFirestore();
        const q = query(collection(db, "posts"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as PetPost[];
            setPosts(fetchedPosts);
        }, (error) => {
            console.error("Error listening to global posts:", error);
        });
        
        return () => unsubscribe();
    }, []);

    React.useEffect(() => {
        let map: import("leaflet").Map | undefined;
        let cancelled = false;

        async function initializeMap() {
            const { default: L } = await import("leaflet");
            if (cancelled || !mapContainerRef.current) return;

            var northEast = L.latLng(180, 180);
            var southWest = L.latLng(-180, -180);
            var bounds = L.latLngBounds(southWest, northEast);

            map = L.map(mapContainerRef.current).setView([39.8283, -98.5795], 5);
            setMapInstance(map);
            const tiles = L.tileLayer(
                "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
                {
                    maxZoom: 16,
                    minZoom: 4,
                    attribution: 'Tiles courtesy of the <a href="https://www.usgs.gov/programs/national-geospatial-program/national-map">USGS National Map</a>',
                }
            );
            tiles.on("tileerror", () => {
                setTilesRejected(true);
            });
            tiles.addTo(map);
            map.setMaxBounds(bounds);

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    ({ coords }) => {
                        if (cancelled || !map) return;

                        const userLocation: [number, number] = [coords.latitude, coords.longitude];
                        map.setView(userLocation, 13);
                        L.circleMarker(userLocation, {
                            radius: 8,
                            color: "#ffffff",
                            weight: 2,
                            fillColor: "#2878d0",
                            fillOpacity: 1,
                        }).addTo(map);
                    },
                    () => {
                        // Keep the default map view if location access is denied or unavailable.
                    },
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
                );
            }
        }

        void initializeMap().catch(() => setTilesRejected(true));

        return () => {
            cancelled = true;
            map?.remove();
        };
    }, []);

    const mapError = tilesRejected ? "Map tiles could not be loaded. Check your connection or the tile provider status." : null;

    useEffect(() => {
        if (!mapInstance) return;

        let cancelled = false;
        let markerLayer: import("leaflet").LayerGroup | undefined;

        void import("leaflet").then(({ default: L }) => {
            if (cancelled) return;

            markerLayer = L.layerGroup().addTo(mapInstance);

            for (const post of posts) {
                const location = post.lastSeenLocation;
                if (
                    !location ||
                    !Number.isFinite(location.latitude) ||
                    !Number.isFinite(location.longitude)
                ) {
                    continue;
                }

                const popup = document.createElement("div");
                const popupInfo = "Name: " + post.petName + ", Species: " + post.petSpecies + ", Date lost: " + post.createdAt.toDate().toLocaleString();
                popup.textContent = popupInfo || "Lost pet";

                L.circleMarker([location.latitude, location.longitude], {
                    radius: 8,
                    color: "#b91c1c",
                    weight: 2,
                    fillColor: "#ef4444",
                    fillOpacity: 1,
                })
                    .bindPopup(popup)
                    .addTo(markerLayer);
            }
        });

        return () => {
            cancelled = true;
            markerLayer?.remove();
        };
    }, [mapInstance, posts]);

    return (
        <div className={style.mapview_container}>
            {/* <button className={style.mapview_post_missing} onClick={() => {redirect("/PostMissing")}}>
                <h3 className="concert_one_regular">🚨 Post Missing Pet 🚨</h3>
            </button> */}
            {/* <button className={style.mapview_map}>
                <h3 className="concert_one_regular">✔ No Pets Missing!</h3>
            </button> */}
            <div className={style.mapview_map}>
                <div ref={mapContainerRef} className={style.mapview_canvas} />
                {mapError && <p className={style.mapview_error} role="alert">{mapError}</p>}
            </div>
        </div>
    )
}
