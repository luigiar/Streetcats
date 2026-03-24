//dati che arrivano da node.js quando il login è avvenuto con successo
export interface  AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}


//struttura per l'utente loggato
export interface User {
  id: number;
  username: string;
  email: string;
}


