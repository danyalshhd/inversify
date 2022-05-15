export interface IAuthentication {
    token: string;
    userId: string;
    authenticateUser(userId?: string, password?: string): Promise<void>;
}
