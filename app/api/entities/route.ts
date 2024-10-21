import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import axios from "axios";
import https from "https";

interface Subscription {
  id: string;
  subject: {
    entities: { id: string }[];
  };
}

interface DeleteEntityRequest {
  id: string;
  deleteSubscriptions?: boolean;
}

const agent = new https.Agent({ rejectUnauthorized: false });

export async function GET() {
  try {
    const contextBrokerUrl = `${env.OCB_URL}/entities/`;

    const response = await axios.get(contextBrokerUrl, { httpsAgent: agent });
    return NextResponse.json(response.data, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, deleteSubscriptions }: DeleteEntityRequest = await req.json();

    if (deleteSubscriptions) {
      const contextBrokerSubsURL = `${env.OCB_URL}/subscriptions/`;
      const subscriptionResponse = await axios.get(contextBrokerSubsURL, { httpsAgent: agent });

      const subscriptions: Subscription[] = await subscriptionResponse.data;

      for (const subscription of subscriptions) {
        const isAssociated = subscription.subject.entities.some(
          (entity) => entity.id === id
        );

        if (isAssociated) {
          const deleteSubscriptionUrl = `${contextBrokerSubsURL}${subscription.id}`;
          await axios.delete(deleteSubscriptionUrl, { httpsAgent: agent });
        }
      }
    }

    const contextBrokerURL = `${env.OCB_URL}/entities/${id}`;
    const response = await axios.delete(contextBrokerURL, { httpsAgent: agent });

    if (response.status === 204) {
      return NextResponse.json(
        {
          message: `Entity ${id} ${
            deleteSubscriptions ? "and subscriptions " : ""
          }deleted`,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: response.status }
      );
    }
  } catch (e) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
