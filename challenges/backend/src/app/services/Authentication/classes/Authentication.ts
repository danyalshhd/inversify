import { AxiosResponse } from "axios";
import { injectable, inject } from "inversify";
import { LoginResponse } from "../types/Login";
import { DependencyIdentifier } from "../../../DependencyIdentifiers";
import { ILogger } from "../../Logger/interface/ILogger";
import { IAuthentication } from "../interface/IAuthentication";
import { IAPIClient } from "../../APIClient/interface/IAPIClient";

@injectable()
export class Authentication implements IAuthentication {

    private userid: string = "buyer-challenge@caronsale.de";
    private password: string = "Test123.";
    userId!: string;
    token!: string;

    public constructor(
        @inject(DependencyIdentifier.API_CLIENT) private apiClient: IAPIClient,
        @inject(DependencyIdentifier.LOGGER) private logger: ILogger
    ) {

    }

    public async authenticateUser() {
        const credentials = {
            userId: this.userid,
            password: this.password,
        };
        const url = `/v1/authentication/${credentials.userId}`;
        const response: AxiosResponse<LoginResponse> = await this.apiClient.instance.put(url, {
            password: credentials.password,
        });

        this.userId = response.data.userId;
        this.token = response.data.token;
        this.logger.log("User logged in successfully");
    }
}
