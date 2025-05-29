import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Shopify Storefront API mutation for creating a contact form submission
    const response = await fetch(
      "https://sastabazarbynabeelaadnan.myshopify.com/api/2024-01/graphql.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Shopify-Storefront-Access-Token": "6814d8eaf588e22f9468079520508b17",
        },
        body: JSON.stringify({
          query: `
            mutation contactFormCreate($input: ContactFormInput!) {
              contactFormCreate(input: $input) {
                contactForm {
                  id
                  name
                  email
                  subject
                  message
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `,
          variables: {
            input: {
              name: name,
              email: email,
              subject: subject,
              message: message,
            },
          },
        }),
      }
    );

    const data = await response.json();

    if (data.errors || data.data?.contactFormCreate?.userErrors?.length > 0) {
      console.error("Shopify API Error:", data);
      throw new Error("Failed to submit contact form to Shopify");
    }

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json(
      { message: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
} 