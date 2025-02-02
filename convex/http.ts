import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

export const doSomething = httpAction(async (ctx, request) => {
  console.log("Received webhook request");

  try {
    const { data, type } = await request.json();
    console.log("Parsed Data: ", JSON.stringify(data, null, 2));
    console.log("Webhook Type: ", type);

    switch (type) {
      case "user.created":
        console.log("Creating User...");
        await ctx.runMutation(internal.users.createUser, {
          clerkId: data.id,
          email:
            data.email_addresses.find(
              (email: { id: any }) => email.id === data.primary_email_address_id
            )?.email_address || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          imageUrl: data.image_url || "",
          username: data.username || `${data.first_name}${data.last_name}`,
          followersCount: 0,
        });
        console.log("User successfully created in DB!");
        break;

      case "user.updated":
        console.log("User Updated - No DB Action Implemented");
        break;
    }
  } catch (error) {
    console.error("Error handling webhook: ", error);
  }

  return new Response(null, { status: 200 });
});

http.route({
  path: "/clerk-user-webhook",
  method: "POST",
  handler: doSomething,
});

// https://terrific-loris-238.convex.site
// https://terrific-loris-238.convex.cloud
export default http;
