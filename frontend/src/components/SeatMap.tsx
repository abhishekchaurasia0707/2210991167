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
              relative w-12 h-12 rounded-xl text-sm font-bold transition-all duration-300 transform
              ${isBooked 
                ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed opacity-60' 
                : isSelected
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-xl transform scale-110 ring-2 ring-emerald-300 ring-offset-2 animate-pulse'
                  : 'bg-gradient-to-br from-white to-gray-50 border-2 border-gray-300 text-gray-700 hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-lg hover:scale-105'
              }
            `}
            title={`Seat ${seatNumber}`}
          >
            <span className="relative z-10">{seatNumber}</span>
            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-xl"></div>
            )}
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
    <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-xl p-4 border border-white/60 backdrop-blur-xl">
      {/* Header Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Select Your Seats
            </h3>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md">
              <span className="text-lg font-bold text-white">{selectedSeats.length}</span>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-2 border border-white/40">
          <div className="flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded mr-1"></div>
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded mr-1"></div>
              <span className="text-emerald-600">Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-br from-gray-300 to-gray-400 rounded mr-1"></div>
              <span className="text-gray-500">Booked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Theater Screen */}
      <div className="mb-4">
        <div className="relative">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white px-6 py-2 rounded-xl text-center shadow-lg">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm">🎬</span>
              <span className="text-sm font-bold">SCREEN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="bg-gradient-to-br from-gray-50/80 to-blue-50/60 rounded-xl p-4 mb-4 border border-white/50 shadow-inner">
        <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
          {generateSeatGrid()}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-white/40">
          <div className="text-sm font-bold text-blue-600">{seatData.totalSeats}</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-white/40">
          <div className="text-sm font-bold text-emerald-600">{seatData.availableSeats.length}</div>
          <div className="text-xs text-gray-600">Available</div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-white/40">
          <div className="text-sm font-bold text-purple-600">{seatData.bookedSeats.length}</div>
          <div className="text-xs text-gray-600">Booked</div>
        </div>
      </div>

      {/* Selected Seats Display */}
      {selectedSeats.length > 0 && (
        <div className="mt-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-2 border border-emerald-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-emerald-600 text-sm font-semibold">Selected:</span>
              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-mono">
                {selectedSeats.join(', ')}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedSeats([]);
                onSeatsChange([]);
              }}
              className="text-red-500 hover:text-red-700 text-xs font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatMap;
