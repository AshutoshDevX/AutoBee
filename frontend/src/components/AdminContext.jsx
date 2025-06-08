
import { createContext, useState } from 'react';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [isAdminPage, setIsAdminPage] = useState(false);
    return (
        <AdminContext value={[isAdminPage, setIsAdminPage]}>
            {children}
        </AdminContext>
    );
};
