"use client";

import React, { useEffect, useRef, useMemo, useLayoutEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFydGludjk2IiwiYSI6ImNtNGdzemhoZzAzMGQyaXNndnN6dmpzdm4ifQ.TPhbyyQf-DvQ4hMsNAtzTg";

const InteractiveMap = ({
  isSidebarVisible,
}: {
  isSidebarVisible: boolean;
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Définir les markers
  const markers = useMemo(
    () => [
      { id: 1, position: [37.6173, 55.7558] as [number, number] }, // Russie
      { id: 2, position: [30.5234, 50.4501] as [number, number] }, // Ukraine
      { id: 3, position: [26.1025, 44.4268] as [number, number] }, // Roumanie
      { id: 4, position: [25.4858, 42.7339] as [number, number] }, // Bulgarie
      { id: 5, position: [32.8597, 39.9334] as [number, number] }, // Turquie
      { id: 6, position: [44.8271, 41.7151] as [number, number] }, // Géorgie
    ],
    []
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [29.0, 43.0],
      zoom: 5,
    });

    markers.forEach(({ position }) => {
      new mapboxgl.Marker().setLngLat(position).addTo(map);
    });

    mapRef.current = map;

    return () => map.remove();
  }, [markers]);

  useLayoutEffect(() => {
    if (mapRef.current) {
      mapRef.current.resize();
    }
  }, [isSidebarVisible]);

  return (
    <div
      ref={mapContainerRef}
      className={`transition-all h-[500px] rounded-lg shadow-lg border border-gray-300 mt-6
        ${
          isSidebarVisible ? "md:w-[calc(100%-300px)]" : "md:w-full"
        } // Garder la taille en grand écran
        md:ml-[256px] // Garder le décalage de la barre latérale
        w-full`} // S'assurer que la carte prend toute la largeur en mobile
    ></div>
  );
};

export default InteractiveMap;
