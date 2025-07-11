import React from 'react';
import { Home, Bed, Car, Coffee, Tv, Bath } from 'lucide-react';

interface RoomSelectorProps {
  selectedRoom: string;
  onRoomSelect: (room: string) => void;
  rooms: string[];
}

const RoomSelector: React.FC<RoomSelectorProps> = ({
  selectedRoom,
  onRoomSelect,
  rooms
}) => {
  const getRoomIcon = (room: string) => {
    switch (room.toLowerCase()) {
      case 'living room':
        return <Tv className="w-5 h-5" />;
      case 'bedroom':
        return <Bed className="w-5 h-5" />;
      case 'kitchen':
        return <Coffee className="w-5 h-5" />;
      case 'bathroom':
        return <Bath className="w-5 h-5" />;
      case 'garage':
        return <Car className="w-5 h-5" />;
      default:
        return <Home className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Room</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {rooms.map((room) => (
          <button
            key={room}
            onClick={() => onRoomSelect(room)}
            className={`
              flex items-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200
              ${selectedRoom === room
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            {getRoomIcon(room)}
            <span className="text-sm font-medium">{room}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoomSelector;