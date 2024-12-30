import axios, { AxiosError } from 'axios';

// Créer une instance Axios avec une configuration de base
export const instanceFile = () => {
  return axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    timeout: 10000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const instance = () => {
  return axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    timeout: 10000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

// Méthode pour effectuer une requête GET
export const getMethod = async (url: string) => {
  const apiInstance = instance();
  try {
    const response = await apiInstance.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError; // Type casting here
    if (axiosError.response) {
      // La requête a été effectuée, mais le serveur a répondu avec un code d'erreur
      console.log('Erreur de réponse du serveur :', axiosError.response.status);
      // Afficher un message en fonction du code d'erreur
      if (axiosError.response.status === 404) {
        // 404 (Not Found)
        console.warn('La ressource demandée est introuvable.');
      } else if (axiosError.request) {
        // 500
        console.warn(
          'Une erreur interne du serveur est survenue. Veuillez réessayer plus tard.',
        );
      } else {
        console.warn(
          'Une erreur est survenue lors de la récupération des données.',
        );
      }
    } else if (axiosError.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      // console.error('Pas de réponse du serveur :', error.request);
      // Afficher un message générique à l'utilisateur pour ce cas
      console.warn('Aucune réponse du serveur. Veuillez réessayer plus tard.');
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      // console.error('Erreur de configuration de la requête :', error.message);
      // Afficher un message générique à l'utilisateur pour les autres erreurs
      console.warn('Une erreur est survenue. Veuillez réessayer.');
    }
    throw error; // Propager l'erreur pour une gestion à un niveau supérieur si nécessaire
  }
};

// Méthode pour effectuer une requête POST
export const postMethod = async (
  url: string,
  data: Record<string, unknown> = {},
) => {
  const apiInstance = instance();
  try {
    const response = await apiInstance.post(url, data);
    return response.data; // Retourne les données de la réponse
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 400
    ) {
      console.warn(error.response.data.message); // Affiche le message d'erreur provenant du back
      throw error;
    } else if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      // erreur de timeout
      console.warn('La requête a expiré. Veuillez réessayer plus tard.');
      throw new Error('Timeout de la requête dépassé');
    } else {
      console.warn('Une erreur est survenue. Veuillez réessayer.');
      throw error;
    }
  }
};

export const putMethod = async (url: string, data: Record<string, unknown> = {}) => {
  const apiInstance = instance();
  try {
    const response = await apiInstance.put(url, data);
    return response.data; // Retourne les données de la réponse
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 400
    ) {
      console.warn(error.response.data.message); // Affiche le message d'erreur provenant du back
      throw error;
    } else if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      // erreur de timeout
      console.warn('La requête a expiré. Veuillez réessayer plus tard.');
      throw new Error('Timeout de la requête dépassé');
    } else {
      console.warn('Une erreur est survenue. Veuillez réessayer.');
      throw error;
    }
  }
};

// Méthode pour effectuer une requête POST de fichier
export const postFileMethod = async (url: string, formData: FormData) => {
  const apiInstance = instanceFile();
  const response = await apiInstance.post(url, formData);
  return response.data;
};

export const deleteMethod = async (url: string, data: any) => {
  return axios.delete(url, {
    data, // Ajout explicite des données dans la requête DELETE
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
