import { Container } from "inversify";
import { ILogger } from "./services/Logger/interface/ILogger";
import { Logger } from "./services/Logger/classes/Logger";
import { DependencyIdentifier } from "./DependencyIdentifiers";
import { AuctionMonitorApp } from "./AuctionMonitorApp";
import { IAPIClient } from "./services/APIClient/interface/IAPIClient";
import { ICarOnSaleClient } from "./services/CarOnSaleClient/interface/ICarOnSaleClient";
import { CarOnSaleClient } from "./services/CarOnSaleClient/classes/CarOnSaleClient";
import { APIClient } from "./services/APIClient/classes/APIClient";
import { IAuthentication } from "./services/Authentication/interface/IAuthentication";
import { Authentication } from "./services/Authentication/classes/Authentication";

/*
 * Create the DI container.
 */
const container = new Container({
    defaultScope: "Singleton",
});

/*
 * Register dependencies in DI environment.
 */
container.bind<ILogger>(DependencyIdentifier.LOGGER).to(Logger);
container.bind<IAPIClient>(DependencyIdentifier.API_CLIENT).to(APIClient);
container.bind<IAuthentication>(DependencyIdentifier.AUTHENTICATION).to(Authentication);
container.bind<ICarOnSaleClient>(DependencyIdentifier.CARONSALE_CLIENT).to(CarOnSaleClient);
container
    .bind<string>(DependencyIdentifier.BASE_URL)
    .toConstantValue("https://api-core-dev.caronsale.de/api");

/*
 * Inject all dependencies in the application & retrieve application instance.
 */
const app = container.resolve(AuctionMonitorApp);

/*
 * Start the application
 */
(async () => {
    await app.start();
})();
