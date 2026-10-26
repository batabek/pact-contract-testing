import { Verifier } from "@pact-foundation/pact";
import { AddressInfo } from "node:net";
import path from "node:path";
import { Server } from "node:http";

import { app, orders } from "../../src/provider/app"
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

describe("Order Service provider verification", () => {

    let server: Server;
    let providerBaseUrl: string;

    beforeAll(async () => {
        server = await new Promise<Server>((resolve) => {
            const runningServer = app.listen(0, "127.0.0.1", () => {
                resolve(runningServer);
            });
        });;

        const address = server.address() as AddressInfo;
        providerBaseUrl = `http://127.0.0.1:${address.port}`;
    });

    afterAll(async () => {
       await new Promise<void>((resolve, reject) => {
        server.close((error) =>
            error ? reject(error) : resolve()
        );
        });
    });

    it("satisfies the Shipping Service contract", async () => {
        const verifier = new Verifier({

            provider: "OrderService",
            providerBaseUrl,

            pactUrls : [
                path.resolve(
                    process.cwd(),
                    "pacts/Shipping Service-OrderService.json"
                )
            ],

            stateHandlers: {
                "order ORD-123 exists" : async () => {
                    orders.clear();

                    orders.set("ORD-123", {
                        orderId: "ORD-123",
                        status: "SHIPPED",
                        shippingAddress: {
                            city: "Berlin",
                            country: "DE"
                        }
                    });
                }
            }
        });

        await verifier.verifyProvider();
    });
});