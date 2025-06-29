import { loadStripe } from '@stripe/stripe-react-native';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { auth } from '../firebase/auth';

const stripePromise = loadStripe(process.env.EXPO_PUBLIC_STRIPE_KEY);

export async function processTipPayment({
  amount,
  creatorId,
  message = ''
}: {
  amount: number;
  creatorId: string;
  message?: string;
}) {
  // 1. Create Stripe Payment Intent
  const { error, paymentIntent } = await stripePromise.createPaymentIntent({
    amount: amount * 100, // cents
    currency: 'usd',
    metadata: {
      creatorId,
      tipperId: auth.currentUser?.uid,
      message
    }
  });

  if (error) throw new Error(error.message);

  // 2. Record transaction in Firestore
  await updateDoc(doc(db, 'users', creatorId), {
    earnings: arrayUnion({
      amount,
      timestamp: new Date(),
      from: auth.currentUser?.uid,
      type: 'tip',
      message
    })
  });

  return paymentIntent;
}

export async function setupSubscription(creatorId: string) {
  // Premium subscription logic
}
mport { loadStripe } from '@stripe/stripe-react-native';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { auth } from '../firebase/auth';

const stripePromise = loadStripe(process.env.EXPO_PUBLIC_STRIPE_KEY);

export async function processTipPayment({
  amount,
  creatorId,
  message = ''
}: {
  amount: number;
  creatorId: string;
  message?: string;
}) {
  // 1. Create Stripe Payment Intent
  const { error, paymentIntent } = await stripePromise.createPaymentIntent({
    amount: amount * 100, // cents
    currency: 'usd',
    metadata: {
      creatorId,
      tipperId: auth.currentUser?.uid,
      message
    }
  });

  if (error) throw new Error(error.message);

  // 2. Record transaction in Firestore
  await updateDoc(doc(db, 'users', creatorId), {
    earnings: arrayUnion({
      amount,
      timestamp: new Date(),
      from: auth.currentUser?.uid,
      type: 'tip',
      message
    })
  });

  return paymentIntent;
}

export async function setupSubscription(creatorId: string) {
  // Premium subscription logic
}
