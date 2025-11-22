import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function searchFlights({ departureDate, returnDate, passengers, classPreference }) {
  const flightsPath = join(__dirname, '../data/flights.json');
  const flightsData = JSON.parse(readFileSync(flightsPath, 'utf-8'));

  let results = flightsData.map(flight => {
    const pricePerPerson = classPreference === 'business'
      ? flight.pricing.business
      : flight.pricing.economy;

    const totalPrice = pricePerPerson * passengers;

    return {
      ...flight,
      selectedClass: classPreference || 'economy',
      pricePerPerson,
      totalPrice,
      passengers,
      dates: {
        departure: departureDate,
        return: returnDate
      }
    };
  });

  results.sort((a, b) => a.totalPrice - b.totalPrice);

  return {
    searchCriteria: {
      route: 'Singapore to Zurich (Return)',
      departureDate,
      returnDate,
      passengers,
      class: classPreference || 'economy'
    },
    flights: results,
    count: results.length
  };
}
