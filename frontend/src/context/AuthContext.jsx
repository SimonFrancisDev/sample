// /src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context object
const AuthContext = createContext();

// Constants for local storage keys
const USER_INFO_KEY = 'userInfo';
const USER_TOKEN_KEY = 'userToken';

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- Persistence Logic: Load User on Mount ---
    useEffect(() => {
        const token = localStorage.getItem(USER_TOKEN_KEY);
        const userInfo = localStorage.getItem(USER_INFO_KEY);
        
        if (token && userInfo) {
            setUser(JSON.parse(userInfo));
            setUserToken(token);
        }
        setIsLoading(false);
    }, []);

    // --- Auth Actions ---

    const login = (userData, token) => {
        // Save user data and token to local storage for persistence
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(userData));
        localStorage.setItem(USER_TOKEN_KEY, token);
        
        setUser(userData);
        setUserToken(token);
    };

    const logout = () => {
        // Remove data from local storage
        localStorage.removeItem(USER_INFO_KEY);
        localStorage.removeItem(USER_TOKEN_KEY);

        setUser(null);
        setUserToken(null);
    };

    const contextValue = {
        user,
        userToken,
        isLoading,
        isAuthenticated: !!user, // Helper boolean
        login,
        logout,
    };

    // 3. Provide the context value to the children
    return (
        <AuthContext.Provider value={contextValue}>
            {/* Don't render children until we've checked local storage */}
            {!isLoading && children} 
            {/* Optional: Add a loading spinner here while isLoading is true */}
        </AuthContext.Provider>
    );
};

// 4. Create a custom hook for easy consumption
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};