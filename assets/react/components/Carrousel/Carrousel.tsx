import React, { useState } from "react";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cards = [
    { title: "Bucarest", image: "/img/bucarest.png" },
    { title: "Batoumi", image: "/img/batoumi.png" },
    { title: "Bursa", image: "/img/bursa.jpg" },
    { title: "Verna", image: "/img/verna.png" },
    { title: "Constanta", image: "/img/constanta.jpg" },
    { title: "Sibiu", image: "/img/sibiu.jpg" },
    { title: "Oradea", image: "/img/oradea.jpg" },
    { title: "Adana", image: "/img/adana.jpg" },
  ];

  const cardsPerPage = 4;

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 < Math.ceil(cards.length / cardsPerPage) ? prevIndex + 1 : 0
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 >= 0 ? prevIndex - 1 : Math.ceil(cards.length / cardsPerPage) - 1
    );
  };

  return (
    <div className="relative mt-6 overflow-hidden">
      {/* Bouton gauche */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-3 w-10 h-10 rounded-full hover:brightness-95 flex items-center justify-center left-2 z-10"
      >
        &#8592;
      </button>

      {/* Conteneur des cartes */}
      <div className="overflow-hidden">
        <div 
          className={`flex transition-transform duration-500 ease-in-out`}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex-none w-1/4 p-2"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-500 text-center text-white py-2 font-bold">
                  {card.title}
                </div>
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-[200px] lg:h-[300px] w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton droit */}
      <button
        onClick={goToNext}
        className="absolute top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-3 w-10 h-10 rounded-full hover:brightness-95 flex items-center justify-center right-2 z-10"
      >
        &#8594;
      </button>
    </div>
  );
};

export default Carousel;
