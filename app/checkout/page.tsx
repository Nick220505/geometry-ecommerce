"use client";

import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CheckoutPage() {
  const { total, cart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission based on payment method
    if (paymentMethod === "card") {
      // Handle Stripe payment
    } else if (paymentMethod === "paypal") {
      // PayPal is handled by PayPal buttons
    }
  };

  // Don't show checkout if cart is empty
  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">
          Add some items to your cart to checkout
        </p>
        <Button onClick={() => (window.location.href = "/store")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  const safeTotal = total || "0.00";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Payment Method</h2>
          <RadioGroup
            defaultValue="card"
            onValueChange={(value: string) => setPaymentMethod(value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card">Credit Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal">PayPal</Label>
            </div>
          </RadioGroup>

          {paymentMethod === "paypal" && (
            <PayPalScriptProvider
              options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                currency: "USD",
              }}
            >
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: {
                          currency_code: "USD",
                          value: safeTotal,
                        },
                      },
                    ],
                    payer: {
                      email_address: formData.email,
                      name: {
                        given_name: formData.firstName,
                        surname: formData.lastName,
                      },
                      address: {
                        address_line_1: formData.address,
                        admin_area_2: formData.city,
                        postal_code: formData.postalCode,
                        country_code: formData.country,
                      },
                    },
                  });
                }}
                onApprove={async (data, actions) => {
                  if (actions.order) {
                    return actions.order.capture().then((details) => {
                      // Handle successful payment
                      console.log("Payment completed:", details);
                      // Here you would typically:
                      // 1. Update your database
                      // 2. Clear the cart
                      // 3. Show a success message
                      // 4. Redirect to a success page
                    });
                  }
                }}
              />
            </PayPalScriptProvider>
          )}

          {paymentMethod === "card" && (
            <Elements stripe={stripePromise}>
              {/* Stripe Card Element will go here */}
              <div className="p-4 border rounded">
                <p className="text-sm text-gray-500">
                  Stripe integration will be implemented here
                </p>
              </div>
            </Elements>
          )}

          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${safeTotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${safeTotal}</span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={paymentMethod === "paypal"}
          >
            {paymentMethod === "card" ? "Pay Now" : "Select Payment Method"}
          </Button>
        </div>
      </div>
    </div>
  );
}
