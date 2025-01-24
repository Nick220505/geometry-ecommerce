"use client";

import { Button } from "@/components/ui/button";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";

interface StripePaymentFormProps {
  clientSecret: string;
}

export function StripePaymentForm({ clientSecret }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (submitError) {
        setError(submitError.message ?? "An unknown error occurred");
        setIsLoading(false);
      }
      // If no error, the page will redirect to return_url
    } catch (e) {
      console.error("Error:", e);
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={!stripe || isLoading} className="w-full">
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
}
