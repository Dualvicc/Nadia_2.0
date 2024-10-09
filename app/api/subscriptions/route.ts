import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import axios from "axios";
import https from "https";

export const dynamic = "force-static";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function GET() {
  try {
    const contextBrokerUrl = `${env.OCB_URL}/subscriptions/`;

    const response = await axios.get(contextBrokerUrl, { httpsAgent: agent });
    return NextResponse.json(response.data, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const subsData = await req.json();
    const contextBrokerUrl = `${env.OCB_URL}/subscriptions/`;
    const response = await axios.post(contextBrokerUrl, subsData, {
      httpsAgent: agent,
      headers: {
        "Content-Type": "application/json",
      },
    });

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
    const contextBrokerUrl = `${env.OCB_URL}/subscriptions/${id}`;
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
