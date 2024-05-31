import { createContext, useEffect, useState } from "react";
import { auth } from "../../utils/config/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const FirebaseContext = createContext();

export const FirebaseContextProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      console.log(user, "firebase user");
    });

    return () => unsub();
  }, []);

  return (
    <FirebaseContext.Provider value={{ firebaseUser }}>
      {children}
    </FirebaseContext.Provider>
  );
};
