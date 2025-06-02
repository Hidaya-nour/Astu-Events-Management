"use client";


import React, { createContext, useContext, useState } from "react";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  joinedAt: string;
  profileImage: string;
  coverImage: string;
  department?: string;
};

const defaultUser: UserProfile = {
  id: "1",
  name: "Ezedin Kedir",
  email: "ezex.kedir@astu.edu.et",
  bio: "Computer Science and Engineering Student at Adama Science and Technology University",
  location: "Adama, Ethiopia",
  joinedAt: "May 2025",
  profileImage: "/placeholder.svg?height=150&width=150",
  coverImage: "/placeholder.svg?height=300&width=1200",
  department: "Computer Science",
};

export type UserProfileContextType = {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(defaultUser);
  return (
    <UserProfileContext.Provider value={{ user, setUser }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
}; 