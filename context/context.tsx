import React, { createContext } from "react"

export const UserData = createContext(null)

interface UserDataObject {
  onboarded: boolean;
  userId: string;
  country: string;
  year: number;
}

function Context({ children }) {
  const [userData, setUserData] = React.useState<UserDataObject>({
    onboarded: false,
    userId: `0`,
    country: `any`,
    year: 0
  })

  return (
    <UserData.Provider value={{ userData, setUserData }}>
      {children}
    </UserData.Provider>
  );
}

export default Context
