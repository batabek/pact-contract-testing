# Pact Contract Testing

A small TypeScript example of consumer-driven contract testing with Pact. The
`Shipping Service` consumer calls the `OrderService` provider to retrieve an
order, and Pact checks that both sides agree on the HTTP interaction.

## Contract

The consumer requests:

```http
GET /orders/ORD-123
Accept: application/json
```

The contract expects a `200` JSON response with an order ID, status, and
structured shipping address:

```json
{
  "orderId": "ORD-123",
  "status": "SHIPPED",
  "shippingAddress": {
    "city": "Berlin",
    "country": "DE"
  }
}
```

Pact uses type matchers for the response fields, so the provider can return
different values as long as the response has the expected types and structure.

## Prerequisites

- Node.js
- npm

## Setup

Install the project dependencies:

```sh
npm install
```

## Run checks

Run the consumer contract test, which exercises `OrderClient` against a Pact
mock server and writes the contract to `pacts/`:

```sh
npm run test:consumer
```

Verify the provider against the Pact file in `pacts/`:

```sh
npm run test:provider
```

Run both Pact tests in sequence:

```sh
npm run test:contracts
```

Check TypeScript types without emitting build output:

```sh
npm run typecheck
```

## Project layout

```text
src/
  consumer/orderClient.ts       HTTP client used by the Shipping Service
  provider/app.ts               Express OrderService provider
tests/
  consumer/                     Consumer contract test
  provider/                     Provider verification test
pacts/
  Shipping Service-OrderService.json
                               Pact contract between the services
```

The consumer test defines the expected request and response and uses Pact's
mock server. The provider test starts the Express app on a local ephemeral
port, configures the `order ORD-123 exists` provider state, and verifies the
provider against the generated Pact.

## Current provider verification status

The provider verification currently reports a body mismatch. The Pact expects
`shippingAddress` to be an object containing `city` and `country`, but the
provider route currently returns it as the string `"Berlin, DE"`. Update the
provider response to match the contract for `npm run test:provider` and
`npm run test:contracts` to pass.
