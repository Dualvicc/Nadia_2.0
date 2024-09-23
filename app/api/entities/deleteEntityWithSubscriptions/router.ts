import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const contextBrokerURL = `${process.env.OCB_URL}/entities/${id}`;
    const contextBrokerSubsURL = `${process.env.OCB_URL}/subscriptions`;

    const subscriptionRequestOptions = { method: "GET" };
    const subscriptionResponse = await fetch(
      contextBrokerSubsURL,
      subscriptionRequestOptions
    );
    const subscriptions = await subscriptionResponse.json();

    for (const subscription of subscriptions) {
      const isAssociated = subscription.subject.entities.some(
        (entity: any) => entity.id === id
      );

      if (isAssociated) {
        const deleteSubscriptionUrl = `${contextBrokerSubsURL}/${subscription.id}`;
        const deleteSubscriptionOptions = { method: "DELETE" };
        await fetch(deleteSubscriptionUrl, deleteSubscriptionOptions);
      }
    }

    const deleteEntityOptions = { method: "DELETE" };
    const response = await fetch(contextBrokerURL, deleteEntityOptions);

    if (response.status === 204) {
      return NextResponse.json(
        { message: `Entity ${id} with their subscriptions deleted` },
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
