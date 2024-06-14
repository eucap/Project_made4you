import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationContext = createContext();

export const useNavigation = () => {
    return useContext(NavigationContext);
};

export const NavigationProvider = ({ children }) => {
    const navigate = useNavigate();

    const goToPage = (path) => {
        navigate(path);
    };

    return (
        <NavigationContext.Provider value={{ goToPage }}>
            {children}
        </NavigationContext.Provider>
    );
};
