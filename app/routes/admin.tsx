import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";

type TicketStatus = "OPEN" | "RESOLVED" | "CLOSED";

import { useLoaderData, Form } from "@remix-run/react";
import { prisma } from "~/utils/prisma";
import { getSession } from "~/utils/session";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("cookie"));

  if (!session.get("userId") || session.get("role") !== "ADMIN") {
    return redirect("/login"); // Only admins can access
  }
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  // Fetch all tickets
  const tickets = await prisma.ticket.findMany({
    include: {
      customer: true,
      responses: {
        include: {
          admin: { select: { id: true, name: true, email: true } }, // Include admin user details
        },
      },
    }, // Include customer info and replies
    orderBy: { createdAt: "desc" },
  });
  return { users, tickets };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const ticketId = formData.get("ticketId") as string;
  const reply = formData.get("reply") as string;
  const status = formData.get("status") as string;
  const session = await getSession(request.headers.get("cookie"));

  await prisma.ticketResponse.create({
    data: {
      ticketId,
      message: reply,
      adminId: session.get("userId"), // Track who responded
    },
  });

  // Update ticket status
  if (status) {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: status.toUpperCase() as TicketStatus },
    });
  }

  return redirect("/admin");
};

export default function AdminDashboard() {
  const { users, tickets } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Ticket Management</h1>
      <Form method="post" action="/logout">
        <button
          type="submit"
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Logout
        </button>
      </Form>
      {tickets.length === 0 ? (
        <p>No tickets available.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="border p-4 rounded-lg shadow-md bg-white"
            >
              <h2 className="text-xl font-semibold">{ticket.subject}</h2>
              <p className="text-gray-600">{ticket.description}</p>
              <p className="text-sm text-gray-500">Status: {ticket.status}</p>
              <p className="text-sm text-gray-500">
                Customer: {ticket.customer.email}
              </p>

              <h3 className="font-semibold mt-3">Responses:</h3>
              <ul className="text-sm">
                {ticket.responses.length === 0 ? (
                  <li className="text-gray-500">No replies yet.</li>
                ) : (
                  ticket.responses.map((resp, index: number) => (
                    <li key={index} className="border-l-4 pl-2 mt-1">
                      {resp.message} -{" "}
                      <span className="text-gray-500">
                        {resp.admin ? resp.admin.name : "System"}
                      </span>
                    </li>
                  ))
                )}
              </ul>

              {/* Reply Form */}
              <Form method="post" className="mt-4 space-y-2">
                <input type="hidden" name="ticketId" value={ticket.id} />
                <textarea
                  name="reply"
                  placeholder="Write a reply..."
                  className="w-full p-2 border rounded-lg"
                  required
                ></textarea>
                <select name="status" className="w-full p-2 border rounded-lg">
                  <option value="">Change Status (Optional)</option>
                  <option value="OPEN">Open</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Submit Reply
                </button>
              </Form>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">All Users</h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="border-b pb-2">
              <span className="font-semibold">{user.name}</span> - {user.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
