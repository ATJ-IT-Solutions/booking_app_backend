import axios from 'axios'

const sendSms = async (to, message) => {
  try {
    const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
      },
      params: {
        route: 'q',
        message: message,
        language: 'english',
        flash: 0,
        numbers: to, // comma-separated for multiple numbers
      }
    });

    console.log('SMS sent:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('SMS send failed:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

export default sendSms