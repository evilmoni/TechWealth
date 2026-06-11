import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDUDQti3a-SnstsakWSB6vTppsxDV_gh2Q",
  authDomain: "techwealth-website.firebaseapp.com",
  projectId: "techwealth-website",
  storageBucket: "techwealth-website.appspot.com",
  messagingSenderId: "36453865287",
  appId: "1:36453865287:web:22bef340b02a7b8e385e62",
  measurementId: "G-HLRMJ3E11E"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      name,
      email,
      phone,
      company,
      title,
      tier,
      telegramHandle,
      linkedinUrl,
      paymentMethod,
      paymentAmount
    } = req.body;

    // Validation
    if (!name || !email || !phone || !company || !title || !tier) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create membership application
    const applicationData = {
      name,
      email,
      phone,
      company,
      title,
      tier,
      telegramHandle: telegramHandle || null,
      linkedinUrl: linkedinUrl || null,
      paymentMethod: paymentMethod || 'manual',
      paymentAmount: paymentAmount || 0,
      status: 'pending', // Default: pending admin approval
      paymentStatus: 'unpaid',
      verified: false,
      joinedDate: serverTimestamp(),
      appliedDate: serverTimestamp()
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'membership_applications'), applicationData);

    console.log('Application submitted:', docRef.id);

    return res.status(200).json({
      success: true,
      applicationId: docRef.id,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    return res.status(500).json({ error: 'Failed to submit application' });
  }
}
