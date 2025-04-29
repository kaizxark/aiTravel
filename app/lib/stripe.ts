import Stripe from 'stripe';

// Fallback value if the environment variable is not set
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'your_default_stripe_secret_key_here';

// Initialize Stripe with the fallback key (you can replace it with a hardcoded key for testing purposes)
const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2022-11-15',
});

export const createProduct = async (
    name: string, description: string, images: string[], price:number, tripId: string
) => {
    const product = await stripe.products.create({
        name,
        description,
        images
    });

    const priceObject = await stripe.prices.create({
        product: product.id,
        unit_amount: price * 100,
        currency: 'usd'
    });

    const paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: priceObject.id, quantity: 1 }],
        metadata: { tripId },
        after_completion: {
            type: 'redirect',
            redirect: {
                url: `${process.env.VITE_BASE_URL}/travel/${tripId}/success`
            }
        }
    });

    return paymentLink;
}
