import React, { useState, useEffect } from 'react';

interface EventSeatMapProps {
  selectedSeats?: string[];
  onSeatsChange: (seats: string[]) => void;
  eventData: any;
}

const EventSeatMap: React.FC<EventSeatMapProps> = ({
  selectedSeats: externalSelectedSeats,
  onSeatsChange,
  eventData
}) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>(externalSelectedSeats || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (externalSelectedSeats) {
      setSelectedSeats(externalSelectedSeats);
    }
  }, [externalSelectedSeats]);

  const handleSeatClick = (seat: string) => {
    // Check if seat is already booked by another participant
    const bookedSeats = eventData.participants
      .flatMap((p: any) => p.seats || [])
      .filter((seat: string) => seat && seat.trim() !== ''); // Remove empty seats
    
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats(prev => {
      let newSeats;
      if (prev.includes(seat)) {
        // Deselect seat
        newSeats = prev.filter(s => s !== seat);
      } else {
        // Select seat
        newSeats = [...prev, seat];
      }
      onSeatsChange(newSeats);
      return newSeats;
    });
  };

  const generateSeatGrid = () => {
    const rows = 10;
    const cols = 10;
    const bookedSeats = eventData.participants
      .flatMap((p: any) => p.seats || [])
      .filter((seat: string) => seat && seat.trim() !== ''); // Remove empty seats
    
    const seats = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const seatNumber = `${String.fromCharCode(65 + row)}${col + 1}`;
        const isBooked = bookedSeats.includes(seatNumber);
        const isSelected = selectedSeats.includes(seatNumber);
        
        seats.push(
          <button
            key={seatNumber}
            onClick={() => handleSeatClick(seatNumber)}
            disabled={isBooked}
            className={`
              w-8 h-8 text-xs font-medium rounded transition-all duration-200
              ${isBooked 
                ? 'bg-red-500 text-white cursor-not-allowed' 
                : isSelected 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }
            `}
          >
            {seatNumber}
          </button>
        );
      }
    }
    return seats;
  };

  const totalSeats = 100;
  const bookedSeats = eventData.participants
    .flatMap((p: any) => p.seats || [])
    .filter((seat: string) => seat && seat.trim() !== ''); // Remove empty seats
  const availableSeats = totalSeats - bookedSeats.length;

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading seats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => setError('')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span className="text-gray-600">Available ({availableSeats})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Selected ({selectedSeats.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-600">Booked ({bookedSeats.length})</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="mb-4 text-center">
          <div className="text-sm text-gray-600 mb-2">Stage / Screen</div>
          <div className="w-full h-2 bg-gray-800 rounded"></div>
        </div>
        
        <div className="grid grid-cols-10 gap-1 max-w-md mx-auto">
          {generateSeatGrid()}
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Selected seats:</strong> {selectedSeats.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventSeatMap;
