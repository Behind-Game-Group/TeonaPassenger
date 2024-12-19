import React from 'react';
import './VoyageurForm.css';

const VoyageurForm: React.FC = () => {
  return (
    <div className="container">
      {/* En-tête */}
      <header className="header">
        <h1>Bonjour Manuel</h1>
        <p>Adresse e-mail : <span>ristamanuel01@gmail.com</span></p>
        <p>Aéroport local : <span>Aéroport de Batoumi, Géorgie</span></p>
      </header>

      {/* Carte principale */}
      <section className="voyageur-principal">
        <h2>Voyageur·euse principale</h2>
        <div className="info-card">
          <div className="avatar">M</div>
          <div className="details">
            <p><strong>Prénom :</strong> Manuel</p>
            <p><strong>2ème prénom :</strong> --</p>
            <p><strong>Nom de famille :</strong> --</p>
            <p><strong>Date de naissance :</strong> --</p>
            <p><strong>Sexe :</strong> --</p>
            <p><strong>Numéro de téléphone :</strong> --</p>
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section className="form-section">
        <h3>Ajouter une voyageur·euse</h3>
        <form className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Prénom</label>
              <input type="text" placeholder="Entrez le prénom" />
            </div>
            <div className="form-group">
              <label>2ème prénom</label>
              <input type="text" placeholder="Entrez le 2ème prénom" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Nom de famille</label>
              <input type="text" placeholder="Entrez le nom de famille" />
            </div>
            <div className="form-group">
              <label>Date de naissance</label>
              <input type="date" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Numéro de téléphone</label>
              <input type="tel" placeholder="Entrez le numéro" />
            </div>
            <div className="form-group">
              <label>Courriel</label>
              <input type="email" placeholder="Entrez l'email" />
            </div>
          </div>
          <div className="form-row">
            <button type="submit" className="submit-btn">Ajouter</button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default VoyageurForm;
