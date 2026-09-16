/**
 * Client testimonials — real, verifiable Fiverr reviews.
 *
 * These replace three fabricated testimonials ("Alex Johnson, CTO, FinStart" and
 * similar) that carried invented outcome metrics such as "300% performance boost".
 *
 * Source: the public Fiverr profile at https://www.fiverr.com/sameemamjad.
 * Usernames are the reviewers' real Fiverr handles, so every quote here can be
 * checked against the profile — which is the entire point. A checkable handle is
 * worth more than an impressive-sounding "CTO, TechCorp" that nobody can verify.
 *
 * Deliberately NOT marked up with Review or AggregateRating structured data.
 * Google does not permit self-serving review markup — reviews about the business
 * collected and displayed on its own site are ineligible for rich results, and
 * adding it risks a manual action. Display them; do not mark them up.
 *
 * Order value is deliberately omitted: the "$50" in the export is the gig's
 * display price, not the project value, and publishing it would misrepresent
 * the work.
 */
export type Testimonial = {
  /** Reviewer's public Fiverr handle — verifiable, unlike an invented full name. */
  username: string;
  country: string;
  rating: number;
  text: string;
  /** Whether the review carried a delivery screenshot on Fiverr. */
  hasDeliveryProof: boolean;
};

export const FIVERR_PROFILE_URL = 'https://www.fiverr.com/sameemamjad';

export const TESTIMONIALS: Testimonial[] = [
  {
    "username": "monica_lisa",
    "country": "United States",
    "rating": 5,
    "text": "Sameem did an excellent job deploying my React application on AWS EC2 and connecting it to my domain. Everything was configured perfectly, including Nginx and SSL. The website is fast, secure, and running smoothly. Communication was clear throughout the process, and he delivered on time. Highly recommended for server deployment and AWS work!",
    "hasDeliveryProof": true
  },
  {
    "username": "smith3131",
    "country": "United Kingdom",
    "rating": 5,
    "text": "Great experience working with this Sameem! They improved my existing Figma website design by fixing alignment issues, spacing, typography, and responsiveness. The final design looks much cleaner, more professional, and well-organized. Communication was smooth, and delivery was on time. Highly recommended!",
    "hasDeliveryProof": false
  },
  {
    "username": "roychid",
    "country": "Canada",
    "rating": 5,
    "text": "I had an absolute pleasure working with Sameem and his team, they are very reliable, respectful, and professional. They provided an exceptional result, and I can't recommend them enough. Will definitely continue working with them for all my future projects. Thank you Sameem and team!",
    "hasDeliveryProof": true
  },
  {
    "username": "irmairvin",
    "country": "United States",
    "rating": 5,
    "text": "I had a great experience working with Sameem. He delivered exactly what I needed for my Doctor & Patient Appointment app landing page. The design is modern, clean, and very professional, and it works perfectly on mobile, tablet, and desktop. Sameem built the page using Next.",
    "hasDeliveryProof": false
  },
  {
    "username": "monica7o9",
    "country": "United States",
    "rating": 5,
    "text": "Excellent work, definitely recommended! The seller was great to work with, very professional and paid close attention to every detail. Everything was handled smoothly and delivered exactly as expected. I’m really happy with the result and would gladly work together again.",
    "hasDeliveryProof": false
  },
  {
    "username": "irmairvin",
    "country": "United States",
    "rating": 5,
    "text": "Very quick delivery and great communication. Fixed my issue perfectly. The developer understood the problem immediately, provided timely updates, and ensured everything was fully responsive and bug-free. Highly recommend for anyone needing fast and efficient solutions.",
    "hasDeliveryProof": false
  },
  {
    "username": "irmairvin",
    "country": "United States",
    "rating": 5,
    "text": "Sameem did an excellent job optimizing and restructuring our Next.js app. The codebase is now clean, scalable, and production-ready with noticeable performance improvements. Professional, efficient, and highly recommended.",
    "hasDeliveryProof": true
  },
  {
    "username": "lilyadam2",
    "country": "Canada",
    "rating": 5,
    "text": "Amazing experience working with him! He was professional, responsive, and delivered exactly what I needed. I’m very satisfied with the results and will definitely hire him again in the future. Highly recommended!",
    "hasDeliveryProof": false
  },
  {
    "username": "cedric_coleman",
    "country": "United States",
    "rating": 5,
    "text": "Sameem successfully completed the full OneSignal integration for both iOS and Android apps, including push notifications, in-app notifications, and email notifications using OneSignal APIs.",
    "hasDeliveryProof": false
  },
  {
    "username": "tidem06",
    "country": "United States",
    "rating": 5,
    "text": "Well he was a professional in his work. he deliver more than my expectation. I highly recommend him and he deliver before the due date and he always give explanation more for the project.",
    "hasDeliveryProof": false
  },
  {
    "username": "robertfelt0n",
    "country": "United Kingdom",
    "rating": 5,
    "text": "Excellent Sameem! He fixed all the UI issues in my mobile app and made it look very professional and clean. Communication was smooth and delivery was on time. Highly recommended!",
    "hasDeliveryProof": false
  },
  {
    "username": "cedric_coleman",
    "country": "United States",
    "rating": 5,
    "text": "Amazing work! The website looks professional, works perfectly, and the order system is smooth. Seller was responsive and delivered on time. Will definitely work again.",
    "hasDeliveryProof": true
  },
  {
    "username": "matthew4l2",
    "country": "United States",
    "rating": 5,
    "text": "Working with Sameem was an amazing experience! He integrated Stripe payment API, and built a user dashboard in my Next.js 15 app - all delivered one day early!",
    "hasDeliveryProof": true
  },
  {
    "username": "airo001",
    "country": "United States",
    "rating": 5,
    "text": "Excellent seller! Delivered outstanding quality with great attention to detail. Very professional, responsive, and reliable. Will definitely work again!",
    "hasDeliveryProof": true
  },
  {
    "username": "stevieowen",
    "country": "Hong Kong",
    "rating": 5,
    "text": "Amazingly friendly person. Operates with great skill, expertise and knowhow. Genuine person who communicates openly and honestly. Thank your brother.",
    "hasDeliveryProof": true
  },
  {
    "username": "samuelfmdan",
    "country": "United States",
    "rating": 5,
    "text": "Sameem and his team are skilled and know their stuff. They do solid work and are a pleasure to work with.",
    "hasDeliveryProof": true
  },
  {
    "username": "amybrown31",
    "country": "United Kingdom",
    "rating": 5,
    "text": "He was delivered on time and the communication was clear throughout the project.",
    "hasDeliveryProof": true
  },
  {
    "username": "johnniedrtu",
    "country": "United States",
    "rating": 5,
    "text": "Seller delivered a high Quality work. Highly recommended",
    "hasDeliveryProof": true
  },
  {
    "username": "juldany4",
    "country": "United States",
    "rating": 5,
    "text": "Great work, beat my expectations",
    "hasDeliveryProof": false
  },
  {
    "username": "juldany4",
    "country": "United States",
    "rating": 5,
    "text": "Did exactly what i asked for",
    "hasDeliveryProof": false
  }
];

/** Verifiable aggregates, counted from the reviews above — no rounding up. */
export const TESTIMONIAL_STATS = {
  totalReviews: 20,
  uniqueClients: 16,
  repeatClients: 3,
  countries: 4,
  allFiveStar: true,
  withDeliveryProof: 10,
};
