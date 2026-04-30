import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SeatMapProps {
  resourceType: string;
  date: string;
  time: string;
  capacity?: number;
  selectedSeats?: string[];
  onSeatsChange: (seats: string[]) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({
  resourceType,
  date,
  time,
  capacity,
  selectedSeats: externalSelectedSeats,
  onSeatsChange
}) => {
  const [seatData, setSeatData] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(externalSelectedSeats || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (resourceType && date && time) {
      fetchAvailableSeats();
    }
  }, [resourceType, date, time]);

  const fetchAvailableSeats = async () => {
    setLoading(true);
    setError('');
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${API_URL}/bookings/available-seats`, {
        params: { resourceType, date, time }
      });
      setSeatData(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load seat data');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat: string) => {
    if (seatData?.bookedSeats?.includes(seat)) return;

    setSelectedSeats(prev => {
      let newSeats;
      if (prev.includes(seat)) {
        // Deselect seat
        newSeats = prev.filter(s => s !== seat);
      } else {
        // Select seat - no capacity restriction
        newSeats = [...prev, seat];
      }
      // Always update parent with new seats
      onSeatsChange(newSeats);
      return newSeats;
    });
  };

  const generateSeatGrid = () => {
    if (!seatData) return null;

    const { totalSeats, rows, cols } = seatData;
    const grid = [];
    let seatCounter = 1;

    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      for (let col = 1; col <= cols; col++) {
        const seatNumber = seatCounter.toString();
        const isBooked = seatData.bookedSeats.includes(seatNumber);
        const isSelected = selectedSeats.includes(seatNumber);

        rowSeats.push(
          <button
            key={seatNumber}
            onClick={() => handleSeatClick(seatNumber)}
            disabled={isBooked}
            className={`
              w-10 h-10 rounded-lg text-sm font-bold transition-all duration-200
              ${isBooked 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : isSelected
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg transform scale-110'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
              }
            `}
            title={`Seat ${seatNumber}`}
          >
            {seatNumber}
          </button>
        );
        seatCounter++;
      }
      grid.push(
        <div key={row} className="flex justify-center gap-2 mb-2">
          {rowSeats}
        </div>
      );
    }

    return grid;
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/50">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading seat map...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
        {error}
      </div>
    );
  }

  if (!seatData) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-3 rounded-xl">
        Please select date and time to view available seats
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/50">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Select Your Seats</h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded mr-2"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
              <span>Booked</span>
            </div>
          </div>
          <div>
            <span className="font-semibold">
              {selectedSeats.length}/{capacity} seats selected
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 text-white px-8 py-3 rounded-lg text-sm font-semibold shadow-lg">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🎬</span>
                <span>Screen / Front</span>
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-700"></div>
          </div>
        </div>
        {generateSeatGrid()}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">
          Total Seats: {seatData.totalSeats} | Available: {seatData.availableSeats.length}
        </div>
        {selectedSeats.length > 0 && (
          <div className="text-blue-600 font-medium">
            Selected: {selectedSeats.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatMap;
