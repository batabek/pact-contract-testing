import express, { type Express, type Request, type Response } from "express";
import { error } from "node:console";

export interface StoredOrder {
    orderId: string,
    status: string,
    shippingAddress: {
        city: string,
        country: string
    };
}

export const orders = new Map<string, StoredOrder>();

export const app: Express = express();

app.get("/orders/:orderId", (req, res) => {

    const order = orders.get(req.params.orderId);

    if (!order) {
        res.status(404).json({
            error: "Order not found"
        });
        return;
    }

    res.json({
        ...order,
        shippingAddress: "Berlin, DE"
    });

});