import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  try {
    const contextBrokerUrl = `${process.env.OCB_URL}/subscriptions/`;
    const requestOptions = {
      method: "GET",
    };

    const res = await fetch(contextBrokerUrl, requestOptions);
    const data = await res.json();

    if (res.status === 200) {
      return Response.json({ data });
    } else {
      return Response.json(
        { message: "Something went wrong" },
        { status: res.status }
      );
    }
  } catch (e) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const subsData = await req.json();
    const contextBrokerUrl = `${process.env.OCB_URL}/subscriptions/`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(subsData),
    };

    const response = await fetch(contextBrokerUrl, requestOptions);
    if (response.status === 201) {
      return NextResponse.json(
        { message: "Subscription created" },
        { status: 201 }
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

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const contextBrokerUrl = `${process.env.OCB_URL}/subscriptions/${id}`;
    const requestOptions = {
      method: "DELETE",
    };

    const response = await fetch(contextBrokerUrl, requestOptions);
    if (response.status === 204) {
      return NextResponse.json(
        { message: `Subscription ${id} deleted` },
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
