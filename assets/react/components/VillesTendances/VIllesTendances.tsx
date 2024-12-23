import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TrendingCities = () => {
  const cities = [
    { name: "Bucarest", image: "/img/cities/bucarest.png" },
    { name: "Cluj-Napoca", image: "/img/cities/cluj-napoca.png" },
    { name: "Timișoara", image: "/img/cities/timisoara.png" },
    { name: "Iași", image: "/img/cities/lasi.png" },
    { name: "Constanta", image: "/img/cities/constanta.png" },
    { name: "Sibiu", image: "/img/cities/sibiu.png" },
    { name: "Oradea", image: "/img/cities/oradea.png" },
    { name: "Tbilissi", image: "/img/cities/tbilissi.png" },
    { name: "Batoumi", image: "/img/cities/batoumi.png" },
    { name: "Koutaïssi", image: "/img/cities/kutaisi.png" },
    { name: "Zougdidis", image: "/img/cities/zugdidi.png" },
    { name: "Rustavi", image: "/img/cities/rustavi.png" },
    { name: "Istanbul", image: "/img/cities/istanbul.png" },
    { name: "Bursa", image: "/img/cities/bursa.png" },
    { name: "Adana", image: "/img/cities/adana.png" },
    { name: "Mersin", image: "/img/cities/mersin.png" },
    { name: "Sofia", image: "/img/cities/sofia.png" },
    { name: "Plovdiv", image: "/img/cities/plovdiv.png" },
    { name: "Varna", image: "/img/cities/varna.png" },
    { name: "Burgas", image: "/img/cities/burgas.png" },
    { name: "Shumen", image: "/img/cities/shumen.png" },
  ];

  const [destinationName, setDestinationName] = useState("");
    useEffect(() => {
      // Ajoute dynamiquement les destinations à partir des éléments <h2>
      const pElements = document.querySelectorAll(".dynamic-destination h2");
      pElements.forEach((p) => {
        p.addEventListener("click", () => {
          const name = p.textContent?.trim();
          if (name) {
            setDestinationName(name);
            window.location.href = `/resultat/${encodeURIComponent(name)}`;
          }
        });
      });
    }, []);

  return (
    <section className="w-full max-w-6xl mt-5 px-4 ${isSidebarVisible ? 'ml-64' : 'ml-10'} py-6">
      <h2 className="text-3xl font-bold text-white text-center mb-3">
        Villes tendance
      </h2>
      <p className="text-center text-white mb-8">Les destinations les plus recherchées sur notre site</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 max-w-6xl mx-auto">
        {cities.map((city, index) => (
          <div key={index} className="relative group">
            <Link to={`/resultat/${encodeURIComponent(city.name)}`}>
            <img
              src={city.image}
              alt={city.name}
              className="w-full h-32 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <p className="text-white text-lg font-semibold">{city.name}</p>
            </div></Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingCities;
