import arcjet, { tokenBucket } from "@arcjet/node";


export const aj = arcjet({
    key: process.env.ARCJET_KEY, // Get your site key from https://app.arcjet.com
    characteristics: ["ip.src"], // track requests by a custom user ID
    rules: [
        // Create a token bucket rate limit. Other algorithms are supported.
        tokenBucket({
            mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
            refillRate: 10, // refill 5 tokens per interval
            interval: 3600, // refill every 10 seconds
            capacity: 10, // bucket maximum capacity of 10 tokens
        }),
    ],
});

