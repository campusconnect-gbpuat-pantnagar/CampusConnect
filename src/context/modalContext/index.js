import { Children, createContext, useState } from "react";

export const ModalContext = createContext();

export const ModalContextProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    type: "",
    data: {},
    open: false,
  });

  const onClose = () => {
    setModalState({
      type: "",
      data: {},
      open: false,
    });
  };

  return (
    <ModalContext.Provider value={{ modalState, onClose, setModalState }}>
      {children}
    </ModalContext.Provider>
  );
};
