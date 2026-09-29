'use client'
import React from "react"
import style from "./MapView.module.css"
import "leaflet/dist/leaflet.css";

export function MapView(){
    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const [tilesRejected, setTilesRejected] = React.useState(false);

    React.useEffect(() => {
        let map: import("leaflet").Map | undefined;
        let cancelled = false;

        async function initializeMap() {
            const { default: L } = await import("leaflet");
            if (cancelled || !mapContainerRef.current) return;

            map = L.map(mapContainerRef.current).setView([39.8283, -98.5795], 5);
            const tiles = L.tileLayer(
                "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
                {
                    maxZoom: 16,
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
