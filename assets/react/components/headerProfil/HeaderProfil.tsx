import React, { useState } from "react";

interface HeaderProfilProps {
  user: {
    name: string;
    email: string;
    airport: string;
    OtherAirport?: string;
  };
}

const HeaderProfil = ({ user }: HeaderProfilProps) => {
  // Couleur du cercle
  const [circleColor, setCircleColor] = useState("#3B82F6"); // Bleu par défaut
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

  // Palette de couleurs
  const colorPalette = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#9333EA", "#34D399",
    "#FBBF24", "#DC2626", "#8B5CF6",
  ];

  // Fonction pour changer la couleur
  const handleColorChange = (color: string) => {
    setCircleColor(color);
    setIsColorPickerVisible(false); // Cacher la palette après sélection
  };

  return (
    <div className="flex justify-between items-center text-white p-6 w-full max-w-6xl">
      {/* Informations utilisateur */}
      <div className="flex justify-between items-center text-white p-6 w-full max-w-6xl">
        <div className="space-y-4 flex flex-col">
          <h1 className="text-2xl font-bold">Bonjour {user.name}</h1>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="font-semibold">Adresse e-mail :</p>
              <p className="mt-1">{user.email}</p>
            </div>
            <div>
              <p className="font-semibold">Aéroport local :</p>
              <p className="mt-1 underline">{user.airport}</p>
            </div>
          </div>
        </div>
        <div className="relative flex items-center justify-center min-w-32 min-h-32 rounded-full text-white text-3xl font-bold" style={{ backgroundColor: circleColor }}>
          {user.name.charAt(0)}
        </div>
        <button
          onClick={() => setIsColorPickerVisible(!isColorPickerVisible)}
          className="absolute top-[8.7rem] right-[50px] rounded-full p-2 bg-customOrange shadow-md text-gray-800 hover:brightness-90"
        >
          🖌️
        </button>
        {/* Palette de couleurs */}
        {isColorPickerVisible && (
          <div className="absolute top-[11rem] right-[30px] bg-white p-2 border rounded shadow-lg">
            <div className="grid grid-cols-5 gap-2">
              {colorPalette.map((color, index) => (
                <div
                  key={index}
                  onClick={() => handleColorChange(color)}
                  className="w-8 h-8 rounded-full cursor-pointer"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderProfil;
