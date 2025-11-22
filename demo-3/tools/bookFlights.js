import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function generateBookingReference() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let reference = '';
  for (let i = 0; i < 6; i++) {
    reference += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return reference;
}

export async function bookFlight({ flightId, passengerName, passengerEmail, classType }) {
  const flightsPath = join(__dirname, '../data/flights.json');
  const flightsData = JSON.parse(readFileSync(flightsPath, 'utf-8'));

  const flight = flightsData.find(f => f.id === flightId);

  if (!flight) {
    throw new Error(`Flight with ID ${flightId} not found`);
  }

  const selectedClass = classType || 'economy';
  const price = flight.pricing[selectedClass];

  const bookingReference = generateBookingReference();

  return {
    status: 'confirmed',
    bookingReference,
    flight: {
      id: flight.id,
      airline: flight.airline,
      route: flight.route,
      outbound: flight.outbound,
      return: flight.return,
      class: selectedClass,
      price
    },
    passenger: {
      name: passengerName,
      email: passengerEmail
    },
    totalAmount: price,
    currency: 'USD',
    bookedAt: new Date().toISOString(),
    message: 'Your flight has been successfully booked! A confirmation email will be sent shortly.'
  };
}
