export interface Order {
    orderId: string,
    status: string,
    shippingAddress: {
        city: string,
        country: string
    };
}

export class OrderClient {
    constructor(private readonly baseUrl: string) {}
    
    async getOrder(orderId: string): Promise<Order> {

        const response = await fetch(`${this.baseUrl}/orders/${encodeURIComponent(orderId)}`,
         {
            headers: {
                Accept: "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Order API returned ${response.status}`);
        }

        return await (response.json()) as Order;
    }
}