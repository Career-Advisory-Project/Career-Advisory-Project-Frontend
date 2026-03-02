export interface Userlist {
    user: User[]
}
export interface User {
    cmuitaccount : string
    fname : string
    lname : string
}
export interface AddUserPayload {
    cmuitaccount: string[];
    role: string;
}