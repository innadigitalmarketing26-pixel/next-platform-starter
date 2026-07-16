import '../styles/globals.css';

export const metadata = {
    title: {
        template: '%s | TripMuse AI',
        default: 'TripMuse AI — Personalized Itinerary Builder'
    },
    description: 'Create personalized, editable day-by-day travel itineraries with destination-based recommendations.'
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
