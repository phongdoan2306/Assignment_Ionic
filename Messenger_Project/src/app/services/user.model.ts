export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
}

export interface UserCreds {
    email: string;
    password: string;
}

export interface ConnReq {
    sender: string;
    recipient: string;
}

