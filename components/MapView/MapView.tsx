'use client'
import React from "react"
import style from "./MapView.module.css"
import { useState, useEffect } from "react";
import { getFirestore, collection, query, onSnapshot } from "firebase/firestore";
import {  Timestamp } from "firebase/firestore";
import "leaflet/dist/leaflet.css";

interface PetCenter {
    name: string;
    website: string;
    latitude: number;
    longitude: number;
    address: string;
}

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

function parseCsvRows(csv: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = "";
    let quoted = false;

    for (let i = 0; i < csv.length; i++) {
        const character = csv[i];

        if (quoted) {
            if (character === '"') {
                if (csv[i + 1] === '"') {
                    field += '"';
                    i++;
                } else {
                    quoted = false;
                }
            } else {
                field += character;
            }
        } else if (character === '"' && field.length === 0) {
            quoted = true;
        } else if (character === '"') {
            throw new Error("Unexpected quote in CSV field.");
        } else if (character === ",") {
            row.push(field);
            field = "";
        } else if (character === "\n" || character === "\r") {
            row.push(field);
            if (row.some((value) => value.length > 0)) {
                rows.push(row);
            }
            row = [];
            field = "";
            if (character === "\r" && csv[i + 1] === "\n") {
                i++;
            }
        } else {
            field += character;
        }
    }

    if (quoted) {
        throw new Error("Unclosed quoted field in CSV.");
    }
    if (field.length > 0 || row.length > 0) {
        row.push(field);
        rows.push(row);
    }

    return rows;
}

function parsePetCenters(csv: string): PetCenter[] {
    return parseCsvRows(csv).map((columns, index) => {
        if (columns.length < 4 || columns.length > 5) {
            throw new Error(`Invalid PetCenters.csv row ${index + 1}: expected 4 or 5 columns.`);
        }

        const latitude = Number(columns[2]);
        const longitude = Number(columns[3]);
        let website: URL;
        try {
            website = new URL(columns[1]);
        } catch {
            throw new Error(`Invalid website URL in PetCenters.csv row ${index + 1}.`);
        }

        if (
            !columns[0].trim() ||
            !["http:", "https:"].includes(website.protocol) ||
            !Number.isFinite(latitude) ||
            latitude < -90 ||
            latitude > 90 ||
            !Number.isFinite(longitude) ||
            longitude < -180 ||
            longitude > 180
        ) {
            throw new Error(`Invalid pet center data in PetCenters.csv row ${index + 1}.`);
        }

        return {
            name: columns[0].trim(),
            website: website.href,
            latitude,
            longitude,
            address: columns[4]?.trim() ?? "",
        };
    });
}

export function MapView(){
    const [posts, setPosts] = useState<PetPost[]>([]);
    const [petCenters, setPetCenters] = useState<PetCenter[]>([]);
    const [petCentersError, setPetCentersError] = useState<string | null>(null);
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

    useEffect(() => {
        let cancelled = false;

        async function loadPetCenters() {
            try {
                const response = await fetch("/PetCenters.csv");
                if (!response.ok) {
                    throw new Error(`PetCenters.csv request failed with status ${response.status}.`);
                }

                const centers = parsePetCenters(await response.text());
                if (!cancelled) {
                    setPetCenters(centers);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Error loading pet centers CSV:", error);
                    setPetCentersError("Pet centers could not be loaded.");
                }
            }
        }

        void loadPetCenters();
        return () => {
            cancelled = true;
        };
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

    const mapErrors = [
        tilesRejected ? "Map tiles could not be loaded. Check your connection or the tile provider status." : null,
        petCentersError,
    ].filter((error): error is string => error !== null);

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

            for (const center of petCenters) {
                const popup = document.createElement("div");
                const name = document.createElement("strong");
                name.textContent = center.name;
                popup.append(name);

                if (center.address) {
                    const address = document.createElement("p");
                    address.textContent = center.address;
                    popup.append(address);
                }

                const website = document.createElement("a");
                website.href = center.website;
                website.target = "_blank";
                website.rel = "noopener noreferrer";
                website.textContent = "Visit website";
                popup.append(website);

                L.circleMarker([center.latitude, center.longitude], {
                    radius: 8,
                    color: "#166534",
                    weight: 2,
                    fillColor: "#22c55e",
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
    }, [mapInstance, posts, petCenters]);

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
                {mapErrors.length > 0 && (
                    <p className={style.mapview_error} role="alert">
                        {mapErrors.join(" ")}
                    </p>
                )}
            </div>
        </div>
    )
}
