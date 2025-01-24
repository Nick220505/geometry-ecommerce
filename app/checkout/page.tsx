"use client";

import { useCart } from "@/components/cart-provider";
import { StripePaymentForm } from "@/components/stripe-payment-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const SHIPPING_COST = 13.0;

// Zod validation schema
const checkoutSchema = z.object({
  // Billing Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  country: z.string().min(2, "Please select a country"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  // Shipping Information (optional based on differentShippingAddress)
  shippingFirstName: z.string().optional(),
  shippingLastName: z.string().optional(),
  shippingAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingState: z.string().optional(),
  shippingCountry: z.string().optional(),
  shippingPostalCode: z.string().optional(),
  // Additional Information
  orderNotes: z.string().optional(),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { total, cart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [differentShippingAddress, setDifferentShippingAddress] =
    useState(false);
  const [clientSecret, setClientSecret] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      acceptedTerms: false,
    },
  });

  // Calculate totals
  const subtotal = parseFloat(total);
  const finalTotal = subtotal + SHIPPING_COST;

  // Create PaymentIntent as soon as the page loads
  useEffect(() => {
    if (paymentMethod === "card") {
      fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((error) => console.error("Error:", error));
    }
  }, [paymentMethod, finalTotal]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (paymentMethod === "card") {
      // Stripe payment is handled by StripePaymentForm
      console.log("Form data:", data);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Billing & Shipping Information */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Billing Information</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  {...register("address")}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select onValueChange={(value) => setValue("country", value)}>
                    <SelectTrigger
                      className={errors.country ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CO">Colombia</SelectItem>
                      {/* Add more countries as needed */}
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="state">State/Department *</Label>
                  <Select onValueChange={(value) => setValue("state", value)}>
                    <SelectTrigger
                      className={errors.state ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BOG">Bogotá</SelectItem>
                      {/* Add more states as needed */}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    {...register("city")}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    {...register("postalCode")}
                    className={errors.postalCode ? "border-red-500" : ""}
                  />
                  {errors.postalCode && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="differentShipping"
                  checked={differentShippingAddress}
                  onCheckedChange={(checked: boolean) =>
                    setDifferentShippingAddress(checked)
                  }
                />
                <label
                  htmlFor="differentShipping"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ship to a different address?
                </label>
              </div>

              {differentShippingAddress && (
                <div className="space-y-4 mt-4 p-4 border rounded-lg">
                  <h3 className="font-medium">Shipping Address</h3>
                  {/* Add shipping address fields with their own validation */}
                </div>
              )}

              <div>
                <Label htmlFor="orderNotes">Order Notes (optional)</Label>
                <Textarea
                  id="orderNotes"
                  {...register("orderNotes")}
                  placeholder="Notes about your order, e.g. special notes for delivery"
                  className="h-24"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    {...register("acceptedTerms")}
                    className={errors.acceptedTerms ? "border-red-500" : ""}
                  />
                  <label htmlFor="terms" className="text-sm leading-none">
                    I have read and agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:underline"
                    >
                      terms and conditions
                    </Link>
                    *
                  </label>
                </div>
                {errors.acceptedTerms && (
                  <p className="text-sm text-red-500">
                    {errors.acceptedTerms.message}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={paymentMethod === "paypal"}
                >
                  {paymentMethod === "card"
                    ? "Pay Now"
                    : "Select Payment Method"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Your Order</h2>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex justify-between text-sm font-medium">
                  <span>Product</span>
                  <span>Subtotal</span>
                </div>
              </div>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm text-gray-500">
                      × {item.quantity}
                    </span>
                  </div>
                  <span className="text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${SHIPPING_COST.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="font-semibold">Payment Method</h3>
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
                    createOrder={(_, actions) => {
                      const formData = watch(); // Get current form values
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                          {
                            amount: {
                              currency_code: "USD",
                              value: finalTotal.toFixed(2),
                            },
                          },
                        ],
                        payer: formData.email
                          ? {
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
                            }
                          : undefined,
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

              {paymentMethod === "card" && clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                    },
                  }}
                >
                  <StripePaymentForm clientSecret={clientSecret} />
                </Elements>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
