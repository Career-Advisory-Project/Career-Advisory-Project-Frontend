import type { Userlist, User } from "../types/Userlist";
import type { AddUserPayload } from "../types/Userlist";

export const getUserlist = async (): Promise<User[]> => {
    
    const response = await fetch(`/api/admin/users?role=user`);
    
    if (!response.ok) {
        throw new Error("Failed to fetch user list");
    }
    
    const data: Userlist = await response.json();
    return data.user;
}
export const getAdminlist = async (): Promise<User[]> => {
    
    const response = await fetch(`/api/admin/users?role=admin`);
    
    if (!response.ok) {
        throw new Error("Failed to fetch admin list");
    }
    
    const data: Userlist = await response.json();
    return data.user;
}
export const addUser = async (emails: string[]): Promise<void> => {
    const payload: AddUserPayload = {
        cmuitaccount: emails,
        // The role is fixed to "user" as shown in the Postman screenshot body
        role: "user" 
    };

    // Assuming /api prefix. Endpoint matches the Postman screenshot
    const response = await fetch(`/api/admin/addUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        // Attempt to extract error message from backend if available
        let errorMessage = "Failed to add users";
        try {
            const errorBody = await response.json();
            if (errorBody.message) errorMessage = errorBody.message;
        } catch (e) {
            // Fallback if response isn't JSON
        }
        throw new Error(errorMessage);
    }
    
    // Request successful, nothing needed to return
};
export const addAdmin = async (emails: string[]): Promise<void> => {
    const payload: AddUserPayload = {
        cmuitaccount: emails,
        // The role is fixed to "admin" as shown in the Postman screenshot body
        role: "admin" 
    };

    // Assuming /api prefix. Endpoint matches the Postman screenshot
    const response = await fetch(`/api/admin/addUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        // Attempt to extract error message from backend if available
        let errorMessage = "Failed to add users";
        try {
            const errorBody = await response.json();
            if (errorBody.message) errorMessage = errorBody.message;
        } catch (e) {
            // Fallback if response isn't JSON
        }
        throw new Error(errorMessage);
    }
    
    // Request successful, nothing needed to return
};

export const deleteUser = async (emails: string[]): Promise<void> => {
    const response = await fetch(`/api/admin/deleteUser`, {
        method: 'DELETE', // Using DELETE method based on your screenshot
        headers: {
            'Content-Type': 'application/json',
        },
        // Payload matches the format {"cmuitaccount": ["email1", "email2"]}
        body: JSON.stringify({ cmuitaccount: emails }), 
    });

    if (!response.ok) {
        let errorMessage = "Failed to delete user";
        try {
            const errorBody = await response.json();
            if (errorBody.message) errorMessage = errorBody.message;
        } catch (e) {}
        throw new Error(errorMessage);
    }
};
