import axios from 'axios'

const token = 'ujByv0zpaa3I8SMEOuKxaPUzIbzzZkG9kqi9I7dC65KprIGAhpaXuWYBDw3L'; // Replace with your token
const phoneNumberId = '15558000116'; // From Meta dashboard
const recipientNumber = '919539539764'; // e.g., '919876543210'

const sendMessage = async () => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: recipientNumber,
        type: 'template',
        template: {
          name: 'dr_sibinew', // Template name must be approved
          language: { code: 'en_US' }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Message sent:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};


export default sendMessage
