import {
    PactV4,
    MatchersV3
} from "@pact-foundation/pact";

import { OrderClient } from "../../src/consumer/orderClient";
import { describe, it, expect } from "@jest/globals";

const { like } = MatchersV3;

describe(`Shipping Service consumer contract`, () => {

    const pact = new PactV4({
        consumer: "Shipping Service",
        provider: "OrderService",
        dir: "./pacts"
    });

    it("retrieves an order for shipping", async () => {
        await pact.addInteraction()
        .given("order ORD-123 exists")
        .uponReceiving("a request for order ORD-123")
        .withRequest("GET", "/orders/ORD-123", (builder) => {
            builder.headers({
                Accept: "application/json"
            });
        })
        .willRespondWith(200, (builder) => {
            builder.headers({
                "Content-Type": "application/json"
            });

            builder.jsonBody({
                orderId: like("ORD-123"),
                status: like("SHIPPED"),
                shippingAddress: {
                    city: like("Berlin"),
                    country: like("DE")
                }
            });
        })
        .executeTest(async (mockServer) => {
            const client = new OrderClient(mockServer.url);

            const order = await client.getOrder("ORD-123");

            expect(order.orderId).toBe("ORD-123");
            expect(order.shippingAddress.city).toBe("Berlin");
            expect(order.shippingAddress.country).toBe("DE");
        });

        
    });

});