"use client";

import { Button } from "@/components/ui/button";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

function PaymentStatusCheck() {
  const stripe = useStripe();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Retrieve the "payment_intent_client_secret" query parameter
    const clientSecret = searchParams.get("payment_intent_client_secret");

    if (!clientSecret) {
      setStatus("error");
      setMessage("No payment intent client secret found");
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case "succeeded":
            setStatus("success");
            setMessage("Payment successful!");
            break;
          case "processing":
            setStatus("loading");
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setStatus("error");
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setStatus("error");
            setMessage("Something went wrong.");
            break;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setStatus("error");
        setMessage("An error occurred while checking payment status.");
      });
  }, [stripe, searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center space-y-6">
        {status === "loading" && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="text-6xl">✨</div>
            <h1 className="text-3xl font-bold">Thank You!</h1>
            <p className="text-muted-foreground">{message}</p>
            <div className="space-y-2">
              <Button onClick={() => router.push("/store")} className="w-full">
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/account/orders")}
                className="w-full"
              >
                View Order
              </Button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="text-6xl">❌</div>
            <h1 className="text-3xl font-bold">Payment Failed</h1>
            <p className="text-muted-foreground">{message}</p>
            <Button onClick={() => router.push("/checkout")} className="w-full">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("payment_intent_client_secret");

  if (!clientSecret) {
    return <PaymentStatusCheck />;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentStatusCheck />
    </Elements>
  );
}
