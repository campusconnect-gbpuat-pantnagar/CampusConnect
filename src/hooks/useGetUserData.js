import { onSnapshot, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../utils/config/firebase";

export const useGetUserData = (talkingWithId) => {
  const [userData, setUserData] = useState();
  useEffect(() => {
    const getUserData = () => {
      const unsub = onSnapshot(doc(db, "users", talkingWithId), (doc) => {
        setUserData(doc.data());
      });
      return () => {
        unsub();
      };
    };
    talkingWithId && getUserData();
  }, [talkingWithId]);


  return userData;
};
