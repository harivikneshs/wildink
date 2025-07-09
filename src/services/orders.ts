import { AirtableClient } from "@/data-sources/airtable/client";

// DTO for order fields from Airtable
export interface OrderFields {
  id?: string;
  product_id: string;
  product_price: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_pincode: number;
}

// Full order with Airtable record structure
export interface Order {
  id: string;
  createdTime: string;
  fields: OrderFields;
}

// Order Service Class
export class OrderService {
  static async create(orderData: OrderFields): Promise<Order> {
    try {
      console.log("📦 OrderService.create() called with data:", orderData);

      // Use the Airtable client to insert the record directly
      const createdRecord = await AirtableClient.insertRecord<OrderFields>(
        "orders",
        orderData
      );

      console.log("✅ Order created successfully:", createdRecord);

      return {
        id: createdRecord.id,
        createdTime: createdRecord.createdTime,
        fields: createdRecord.fields,
      };
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  static async getAll(): Promise<Order[]> {
    try {
      console.log("🔍 OrderService.getAll() called");
      const records = await AirtableClient.getRecords<OrderFields>("orders");
      console.log("📊 Orders fetched successfully:", records);
      return records.map((record) => ({
        id: record.id,
        createdTime: record.createdTime,
        fields: record.fields,
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  static async getById(orderId: string): Promise<Order | null> {
    try {
      const records = await AirtableClient.getRecords<OrderFields>("orders", {
        filterByFormula: `{id} = '${orderId}'`,
      });
      return records.length > 0
        ? {
            id: records[0].id,
            createdTime: records[0].createdTime,
            fields: records[0].fields,
          }
        : null;
    } catch (error) {
      console.error(`Error fetching order with id ${orderId}:`, error);
      throw error;
    }
  }

  static async getByCustomerEmail(email: string): Promise<Order[]> {
    try {
      const records = await AirtableClient.getRecords<OrderFields>("orders", {
        filterByFormula: `{customer_email} = '${email}'`,
      });
      return records.map((record) => ({
        id: record.id,
        createdTime: record.createdTime,
        fields: record.fields,
      }));
    } catch (error) {
      console.error(`Error fetching orders for customer ${email}:`, error);
      throw error;
    }
  }
}
