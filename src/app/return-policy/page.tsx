"use client";

export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Return Policy</h1>

      <div className="prose prose-lg max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Return Policy</h2>
          <p className="text-gray-600 mb-4">
            We want you to be completely satisfied with your purchase. If for any
            reason you are not satisfied, we offer a 30-day return policy for
            most items.
          </p>
          <p className="text-gray-600">
            Please read the following information carefully to ensure a smooth
            return process.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Return Conditions</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Items must be unworn, unwashed, and in original condition</li>
            <li>All original tags and labels must be attached</li>
            <li>Items must be returned in their original packaging</li>
            <li>Returns must be initiated within 30 days of delivery</li>
            <li>Proof of purchase is required</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">How to Return</h2>
          <ol className="list-decimal pl-6 space-y-4 text-gray-600">
            <li>
              <strong>Initiate Return:</strong>
              <p>
                Log into your account and go to the order details page. Click on
                &quot;Return Item&quot; and follow the instructions.
              </p>
            </li>
            <li>
              <strong>Package Item:</strong>
              <p>
                Place the item in its original packaging with all tags attached.
                Include the return form in the package.
              </p>
            </li>
            <li>
              <strong>Ship Return:</strong>
              <p>
                Use the provided return shipping label. Drop off the package at
                your nearest shipping location.
              </p>
            </li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Refund Process</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Once we receive your return, we will inspect the item within 2-3
              business days. If the return is approved:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Refunds will be processed within 5-7 business days</li>
              <li>Refunds will be issued to the original payment method</li>
              <li>Shipping costs are non-refundable unless the item was defective</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Exclusions</h2>
          <p className="text-gray-600 mb-4">
            The following items are not eligible for return:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Items marked as &quot;Final Sale&quot;</li>
            <li>Swimwear without hygiene stickers</li>
            <li>Items that have been worn, washed, or altered</li>
            <li>Items without original tags and packaging</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about our return policy, please contact our
            customer service team at{' '}
            <a href="mailto:returns@fashioncollection.com" className="text-primary hover:underline">
              returns@fashioncollection.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
} 