import axios, { AxiosInstance } from "axios";
import { injectable, inject } from "inversify";
import { IAPIClient } from "../interface/IAPIClient";
import { DependencyIdentifier } from "../../../DependencyIdentifiers";
import 'dotenv/config'

@injectable()
export class APIClient implements IAPIClient {
    private userId: string | undefined = process.env.BUYER;
    instance: AxiosInstance;

    public constructor(
        @inject(DependencyIdentifier.BASE_URL) private baseUrl: string,
    ) {
        this.instance = axios.create({
            baseURL: this.baseUrl,
            headers: { "Content-Type": "application/json", userId: this.userId },
        });
    }
}
