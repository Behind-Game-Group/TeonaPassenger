import React, { useEffect, useState } from "react";
import "../../../styles/HeaderProfilResponsive.css"; // Import du fichier CSS pour le responsive
import { useUserContext } from "../../context/UserContext";
import { getMethod } from "../../services/axiosInstance";

type User = {
  firstname?: string;
  local_airport?: string;
  avatar?: string;
}

const HeaderProfil = () => {
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
  const [user, setUser] = useState<User>({
    firstname: "",
    local_airport: "",
    avatar: ""
  });
  const { currentUser } = useUserContext();

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const response = await getMethod("/showUserProfile");
      console.log(response);
      setUser(response);
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur :", error);
    }
  };

  return (
    <div className="header-container flex justify-between items-center text-white p-6 w-full max-w-6xl">
      {/* Informations utilisateur */}
      <div className="user-info flex justify-between items-center text-white p-6 w-full max-w-6xl">
        <div className="space-y-4 flex flex-col">
          <h1 className="header-text text-2xl font-bold">Bonjour {user.firstname}</h1>
          <div className="grid grid-cols-none lg:grid-cols-2 gap-6 user-grid">
            <div>
              <p className="font-semibold">Adresse e-mail :</p>
              <p className="mt-1">{currentUser.email}</p>
            </div>
            <div>
              <p className="font-semibold">Aéroport local :</p>
              <p className="mt-1 underline">{user.local_airport}</p>
            </div>
          </div>
        </div>
        <div
          className="profile-circle relative flex items-center justify-center min-w-32 min-h-32 rounded-full text-white text-3xl font-bold"
          style={{ backgroundColor: circleColor }}
        >
          {user.firstname?.charAt(0)}
        </div>
        <button
          onClick={() => setIsColorPickerVisible(!isColorPickerVisible)}
          className="color-picker-button absolute top-[8.7rem] right-[50px] rounded-full p-2 bg-customOrange shadow-md text-gray-800 hover:brightness-90"
        >
          <img src="/img/Pencil.png" alt="Pencil" className="w-4" />
        </button>
        {/* Palette de couleurs */}
        {isColorPickerVisible && (
          <div className="color-picker absolute top-[11rem] right-[30px] bg-customOrange p-2 rounded shadow-lg">
            <h2 className="text-black pb-1">Couleur de votre profil :</h2>
            <div className="grid grid-cols-5 gap-2">
              {colorPalette.map((color, index) => (
                <div
                  key={index}
                  onClick={() => handleColorChange(color)}
                  className="w-8 h-8 border-[0.5px] border-white rounded-full cursor-pointer"
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
