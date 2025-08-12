// Frontend - services/authService.js
export const verifyOTP = async (email, otp) => {
  try {
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, otp })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'OTP verification failed');
    }

    return data;
  } catch (error) {
    console.error('OTP verification error:', error);
    throw error;
  }
};
