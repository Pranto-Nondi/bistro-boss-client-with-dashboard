


import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import './CheckoutForm.css'
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CheckoutForm = ({ cart, price }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const [cardError, setCardError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [processing, setProcessing] = useState(false);
    const [transactionId, setTransactionId] = useState('');

    useEffect(() => {
        if (price > 0) {
            axiosSecure.post('/create-payment-intent', { price })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(error => {
                    console.log('Error creating payment intent:', error);
                });
        }
    }, [price]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);
        if (card === null) {
            return;
        }

        setProcessing(true);

        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card,
            });

            if (error) {
                console.log('Stripe createPaymentMethod error:', error);
                setCardError(error.message);
                setProcessing(false);
                return;
            }

            setCardError('');

            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: paymentMethod.id
                }
            );

            if (confirmError) {
                console.log('Stripe confirmCardPayment error:', confirmError);
                setProcessing(false);
                return;
            }

            setProcessing(false);

            if (paymentIntent.status === 'succeeded') {
                setTransactionId(paymentIntent.id);
                // Save payment information to the server
                const payment = {
                    email: user?.email,
                    transactionId: paymentIntent.id,
                    price,
                    date: new Date(),
                    quantity: cart.length,
                    cartItems: cart.map(item => item._id),
                    menuItems: cart.map(item => item.menuItemId),
                    status: 'service pending',
                    itemNames: cart.map(item => item.name),
                };

                axiosSecure.post('/payments', payment)
                    .then(res => {
                        console.log(res.data);
                        if (res.data.result.insertedId) {
                            // Display confirmation to the user
                        }
                    })
                    .catch(error => {
                        console.log('Error saving payment information:', error);
                    });
            }
        } catch (error) {
            console.log('Stripe payment error:', error);
            setProcessing(false);
        }
    };

    return (
        <>
            <form className="w-2/3 m-8" onSubmit={handleSubmit}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
                <button className="btn btn-primary btn-sm mt-4" type="submit" disabled={!stripe || !clientSecret || processing}>
                    {processing ? 'Processing...' : 'Pay'}
                </button>
            </form>
            {cardError && <p className="text-red-600 ml-8">{cardError}</p>}
            {transactionId && <p className="text-green-500">Transaction complete with transactionId: {transactionId}</p>}
        </>
    );
};

export default CheckoutForm;
