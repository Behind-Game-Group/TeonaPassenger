import React, { useState, useEffect, useRef } from "react";

const DestinationSelector: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [passengers, setPassengers] = useState<{ adults: number; children: number }>({
    adults: 1,
    children: 0,
  });
  const [classType, setClassType] = useState<string>("Économique");
  const [baggage, setBaggage] = useState<number>(0);
  const [tripType, setTripType] = useState<string>("Aller-retour");

  // Utilisez la référence correcte en fonction de l'élément ciblé
  const tripTypeRef = useRef<HTMLLIElement>(null);
  const passengersRef = useRef<HTMLLIElement>(null);
  const classTypeRef = useRef<HTMLLIElement>(null);
  const baggageRef = useRef<HTMLLIElement>(null);

  const toggleDropdown = (dropdown: string): void => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleClickOutside = (event: MouseEvent): void => {
    // Vérifie si le clic s'est fait à l'extérieur de tous les dropdowns
    if (
      (tripTypeRef.current && !tripTypeRef.current.contains(event.target as Node)) &&
      (passengersRef.current && !passengersRef.current.contains(event.target as Node)) &&
      (classTypeRef.current && !classTypeRef.current.contains(event.target as Node)) &&
      (baggageRef.current && !baggageRef.current.contains(event.target as Node))
    ) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePassengersChange = (type: "adults" | "children", isIncrement: boolean): void => {
    setPassengers((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + (isIncrement ? 1 : -1)),
    }));
  };

  return (
    <div className="relative top-10 right-[318px] isolate z-20">
      <div className="absolute top-0 left-[-60px] flex flex-wrap items-end content-start gap-[16px_14px] w-[853px] h-[103px]">
        <h2 className="w-[505px] h-[44px] text-white font-lucida font-medium text-[32px] leading-[40px] text-center">
          Où voulez-vous partir ?
        </h2>
      </div>
      <ul className="flex space-x-4 h-[150px] ml-[15px]">
        {/* Trip Type */}
        <li ref={tripTypeRef} className="relative flex items-center space-x-2 text-white text-[16px] leading-[40px] font-medium">
          <a href="#" onClick={() => toggleDropdown("tripType")}>
            {tripType}
          </a>
          <img
            src="/img/caret-circle-down.svg"
            className="w-[26px] h-[27px]"
            alt=""
            onClick={() => toggleDropdown("tripType")}
          />
          {activeDropdown === "tripType" && (
            <div className="absolute top-12 left-0 bg-white text-black p-6 rounded-xl shadow-2xl w-48 z-50">
              {["Aller", "Retour", "Aller-retour"].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setTripType(type);
                    setActiveDropdown(null);
                  }}
                  className="block w-full text-left hover:bg-gray-200 p-2"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </li>

        {/* Passengers */}
        <li ref={passengersRef} className="relative flex items-center space-x-2 text-white text-[16px] leading-[40px] font-medium">
          <a href="#" onClick={() => toggleDropdown("passengers")}>
            {passengers.adults} adulte{passengers.adults > 1 ? "s" : ""},{" "}
            {passengers.children} enfant{passengers.children > 1 ? "s" : ""}
          </a>
          <img
            src="/img/caret-circle-down.svg"
            className="w-[26px] h-[27px]"
            alt=""
            onClick={() => toggleDropdown("passengers")}
          />
          {activeDropdown === "passengers" && (
            <div className="absolute top-12 left-0 bg-white text-black p-6 rounded-xl shadow-2xl w-80 z-50">
              <div className="flex justify-between items-center mb-2">
                <span>Adultes</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePassengersChange("adults", false)}
                    className="bg-gray-200 px-2"
                  >
                    -
                  </button>
                  <span>{passengers.adults}</span>
                  <button
                    onClick={() => handlePassengersChange("adults", true)}
                    className="bg-gray-200 px-2"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Enfants</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePassengersChange("children", false)}
                    className="bg-gray-200 px-2"
                  >
                    -
                  </button>
                  <span>{passengers.children}</span>
                  <button
                    onClick={() => handlePassengersChange("children", true)}
                    className="bg-gray-200 px-2"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </li>

        {/* Class */}
        <li ref={classTypeRef} className="relative flex items-center space-x-2 text-white text-[16px] leading-[40px] font-medium">
          <a href="#" onClick={() => toggleDropdown("classType")}>
            {classType}
          </a>
          <img
            src="/img/caret-circle-down.svg"
            className="w-[26px] h-[27px]"
            alt=""
            onClick={() => toggleDropdown("classType")}
          />
          {activeDropdown === "classType" && (
            <div className="absolute top-12 left-0 bg-white text-black p-6 rounded-xl shadow-2xl w-48 z-50">
              {["Économique", "Affaire", "Premium"].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setClassType(type);
                    setActiveDropdown(null);
                  }}
                  className="block w-full text-left hover:bg-gray-200 p-2"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </li>

        {/* Baggage */}
        <li ref={baggageRef} className="relative flex items-center space-x-2 text-white text-[16px] leading-[40px] font-medium">
          <a href="#" onClick={() => toggleDropdown("baggage")}>
            {baggage} bagage{baggage > 1 ? "s" : ""}
          </a>
          <img
            src="/img/caret-circle-down.svg"
            className="w-[26px] h-[27px]"
            alt=""
            onClick={() => toggleDropdown("baggage")}
          />
          {activeDropdown === "baggage" && (
            <div className="absolute top-12 left-0 bg-white text-black p-6 rounded-xl shadow-2xl w-80 z-50">
              <div className="flex justify-between items-center">
                <p>Combien de bagages ?</p>
                <button
                  onClick={() => setBaggage(Math.max(0, baggage - 1))}
                  className="bg-gray-200 px-2"
                >
                  -
                </button>
                <span>{baggage}</span>
                <button
                  onClick={() => setBaggage(baggage + 1)}
                  className="bg-gray-200 px-2"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};

export default DestinationSelector;
