import { Form } from "@remix-run/react";

export default function Navbar() {
  return (
    <div className=" flex  mb-6 justify-between items-center">
      <h1 className="text-3xl font-bold"> Ticket Management</h1>
      <Form method="post" action="/logout">
        <button
          type="submit"
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Logout
        </button>
      </Form>
    </div>
  );
}
