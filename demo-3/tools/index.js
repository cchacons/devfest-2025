import { Type } from '@google/genai';
import { searchFlights } from './searchFlights.js';
import { bookFlight } from './bookFlights.js';
import { getUserConfirmation } from './userConfirmation.js';

export const functionDeclarations = [
  {
    name: 'searchFlights',
    description: 'Search for available flights from Singapore to Zurich (return trip). Returns a list of available flights with pricing for economy and business class.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        departureDate: {
          type: Type.STRING,
          description: 'Departure date from Singapore (e.g., "2025-03-15")',
        },
        returnDate: {
          type: Type.STRING,
          description: 'Return date from Zurich (e.g., "2025-03-22")',
        },
        passengers: {
          type: Type.NUMBER,
          description: 'Number of passengers',
        },
        classPreference: {
          type: Type.STRING,
          description: 'Preferred class: "economy" or "business"',
          enum: ['economy', 'business'],
        },
      },
      required: ['departureDate', 'returnDate', 'passengers'],
    },
  },
  {
    name: 'bookFlight',
    description: 'Book a specific flight. IMPORTANT: You MUST call searchFlights first to get available flight IDs. Only use flight IDs from the search results (e.g., "SQ327-LX178", "LH778-LH779"). Requires flight ID from search results, passenger details, and class type.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        flightId: {
          type: Type.STRING,
          description: 'Flight ID from search results (e.g., "SQ327-LX178")',
        },
        passengerName: {
          type: Type.STRING,
          description: 'Full name of the passenger',
        },
        passengerEmail: {
          type: Type.STRING,
          description: 'Email address of the passenger',
        },
        classType: {
          type: Type.STRING,
          description: 'Class type: "economy" or "business"',
          enum: ['economy', 'business'],
        },
      },
      required: ['flightId', 'passengerName', 'passengerEmail', 'classType'],
    },
  },
];

export { searchFlights, bookFlight, getUserConfirmation };

export const availableFunctions = {
  searchFlights,
  bookFlight,
};
