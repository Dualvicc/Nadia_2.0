import { NextRequest, NextResponse } from "next/server";

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

export async function GET() {
  try {
    const contextBrokerUrl = `${process.env.OCB_URL}/entities/`;
    const requestOptions = { method: "GET" };

    const response = await fetch(contextBrokerUrl, requestOptions);
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, deleteSubscriptions }: DeleteEntityRequest = await req.json();

    if (deleteSubscriptions) {
      const contextBrokerSubsURL = `${process.env.OCB_URL}/subscriptions/`;
      const subscriptionRequestOptions = { method: "GET" };
      const subscriptionResponse = await fetch(
        contextBrokerSubsURL,
        subscriptionRequestOptions
      );

      const subscriptions: Subscription[] = await subscriptionResponse.json();

      for (const subscription of subscriptions) {
        const isAssociated = subscription.subject.entities.some(
          (entity) => entity.id === id
        );

        if (isAssociated) {
          const deleteSubscriptionUrl = `${contextBrokerSubsURL}${subscription.id}`;
          const deleteSubscriptionOptions = { method: "DELETE" };
          await fetch(deleteSubscriptionUrl, deleteSubscriptionOptions);
        }
      }
    }

    const contextBrokerURL = `${process.env.OCB_URL}/entities/${id}`;
    const deleteEntityOptions = { method: "DELETE" };
    const response = await fetch(contextBrokerURL, deleteEntityOptions);

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
