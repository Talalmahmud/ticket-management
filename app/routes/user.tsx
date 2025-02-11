import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { prisma } from "~/utils/prisma";
import { getSession } from "~/utils/session";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("cookie"));
  const userId = session.get("userId");
  const userRole = session.get("role");

  if (!userId || userRole !== "CUSTOMER") {
    return redirect("/login"); // Only customers can access this page
  }

  // Fetch user tickets
  const tickets = await prisma.ticket.findMany({
    where: { customerId: userId },
    include: {
      responses: {
        include: {
          admin: { select: { id: true, name: true, email: true } }, // Include admin user details
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  console.log(tickets);
  return { tickets };
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("cookie"));
  const userId = session.get("userId");

  if (!userId) return redirect("/login");

  const formData = await request.formData();
  const subject = formData.get("subject") as string;
  const description = formData.get("description") as string;

  await prisma.ticket.create({
    data: {
      subject,
      description,
      status: "OPEN",
      customerId: userId,
    },
  });

  return redirect("/user");
};

export default function UserDashboard() {
  const { tickets } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Tickets</h1>
      <Form method="post" action="/logout">
        <button
          type="submit"
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Logout
        </button>
      </Form>

      {/* Ticket Creation Form */}
      <Form method="post" className="bg-gray-100 p-4 rounded-lg mb-6 shadow">
        <h2 className="text-xl font-semibold mb-2">Create a New Ticket</h2>
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          className="w-full p-2 border rounded-lg mb-2"
          required
        />
        <textarea
          name="description"
          placeholder="Describe your issue..."
          className="w-full p-2 border rounded-lg mb-2"
          required
        ></textarea>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Submit Ticket
        </button>
      </Form>

      {/* Ticket List */}
      {tickets.length === 0 ? (
        <p>No tickets created yet.</p>
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

              <h3 className="font-semibold mt-3">Replies:</h3>
              <ul className="text-sm">
                {ticket.responses.length === 0 ? (
                  <li className="text-gray-500">No replies yet.</li>
                ) : (
                  ticket.responses.map((resp, index) => (
                    <li key={index} className="border-l-4 pl-2 mt-1">
                      {resp.message} -{" "}
                      <span className="text-gray-500">
                        {resp.admin ? resp.admin.name : "System"}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
