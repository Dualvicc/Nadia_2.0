import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  try {
    const contextBrokerUrl = `${process.env.OCB_URL}/entities/`;
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

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const contextBrokerURL = `${process.env.OCB_URL}/entities/${id}`;
    const deleteEntityOptions = {
      method: "DELETE",
    };

    const response = await fetch(contextBrokerURL, deleteEntityOptions);
    if (response.status === 204) {
      return NextResponse.json(
        { message: `Entity ${id} deleted` },
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
