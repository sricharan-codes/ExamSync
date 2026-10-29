import React, {useState} from 'react';
import {RoomLayout, StudentSeat} from '../types';
import {Grid, Building, RefreshCw, Download, CheckCircle2, AlertOctagon, UserX, UserCheck, UserPlus} from 'lucide-react';

interface SeatingViewProps {
  roomLayouts: Record<string, RoomLayout>;
  onUpdateSeatStatus: (venue: string, seatNumber: string, newStatus: StudentSeat['status']) => void;
  onShuffleSeating: (venue: string) => void;
  onOpenNewStudentModal: () => void;
}

export const SeatingView: React.FC<SeatingViewProps> = ({
  roomLayouts,
  onUpdateSeatStatus,
  onShuffleSeating,
  onOpenNewStudentModal,
}) => {
  const venues = Object.keys(roomLayouts);
  const [selectedVenue, setSelectedVenue] = useState<string>(venues[0] || 'Room 101');
  const [selectedSeat, setSelectedSeat] = useState<StudentSeat | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const currentRoom = roomLayouts[selectedVenue] || {venue: selectedVenue, capacity: 0, rows: 4, cols: 8, seats: []};

  const filteredSeats = currentRoom.seats.filter(seat => {
    if (filterStatus === 'all') return true;
    return seat.status === filterStatus;
  });

  const exportSeatingCsv = () => {
    const headers = 'SeatNumber,RollNumber,StudentName,Branch,Status\n';
    const rows = currentRoom.seats.map(s => `${s.seatNumber},${s.rollNumber},"${s.studentName}",${s.branch},${s.status}`).join('\n');
    const blob = new Blob([headers + rows], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seating_chart_${selectedVenue.replace(/\s+/g, '_')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900">Seating Arrangement Engine</h1>
          <p className="text-xs text-slate-500 mt-0.5">Visual hall layout, student seat allocation, and anti-cheating branch randomization.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenNewStudentModal}
            className="bg-slate-100 hover:bg-slate-200 text-indigo-700 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-indigo-600" />
            <span>Add Candidate</span>
          </button>
          <button
            onClick={() => onShuffleSeating(selectedVenue)}
            className="bg-slate-100 hover:bg-slate-200 text-indigo-700 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-2 cursor-pointer"
            title="Shuffle seats to prevent adjacent branch malpractice"
          >
            <RefreshCw className="w-4 h-4 text-indigo-600" />
            <span>Anti-Cheat Shuffle</span>
          </button>
          <button
            onClick={exportSeatingCsv}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition shadow-md flex items-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Seating Chart</span>
          </button>
        </div>
      </div>

      {/* Venue Selector & Status Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Venues */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Select Exam Venue</span>
          {venues.map(v => {
            const room = roomLayouts[v];
            const flaggedCount = room?.seats.filter(s => s.status === 'flagged_malpractice').length || 0;

            return (
              <button
                key={v}
                onClick={() => {
                  setSelectedVenue(v);
                  setSelectedSeat(null);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center justify-between cursor-pointer ${
                  selectedVenue === v
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Building className={`w-4 h-4 ${selectedVenue === v ? 'text-indigo-200' : 'text-indigo-600'}`} />
                  <div>
                    <div className="font-bold text-xs">{v}</div>
                    <div className={`text-[10px] ${selectedVenue === v ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {room?.capacity || 0} Seat Capacity
                    </div>
                  </div>
                </div>
                {flaggedCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {flaggedCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Seat Map Visualizer */}
        <div className="lg:col-span-3 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900">{selectedVenue} - Seating Layout</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                  {currentRoom.rows} Rows × {currentRoom.cols} Cols
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Click any seat to inspect student details or update attendance status.</p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {['all', 'seated', 'absent', 'flagged_malpractice'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer capitalize ${
                    filterStatus === st ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">
            
            {/* Grid Map */}
            <div className="lg:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[360px]">
              <div className="w-full bg-indigo-50 border border-indigo-200 py-2 rounded-xl text-center text-xs font-bold text-indigo-700 mb-6 tracking-widest uppercase">
                [ INVIGILATOR PODIUM / EXAM CONTROLLER DESK ]
              </div>

              <div
                className="grid gap-3 w-full"
                style={{
                  gridTemplateColumns: `repeat(${currentRoom.cols}, minmax(0, 1fr))`,
                }}
              >
                {currentRoom.seats.map(seat => {
                  const isFilteredOut = filterStatus !== 'all' && seat.status !== filterStatus;
                  return (
                    <button
                      key={seat.seatNumber}
                      onClick={() => setSelectedSeat(seat)}
                      disabled={isFilteredOut}
                      className={`p-2.5 rounded-xl text-center transition border flex flex-col items-center justify-center cursor-pointer ${
                        isFilteredOut ? 'opacity-25 pointer-events-none' : ''
                      } ${
                        seat.status === 'absent'
                          ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                          : seat.status === 'flagged_malpractice'
                          ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 animate-pulse'
                          : selectedSeat?.seatNumber === seat.seatNumber
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md scale-105'
                          : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800 shadow-sm'
                      }`}
                    >
                      <span className="text-[10px] font-bold opacity-75">{seat.seatNumber}</span>
                      <span className="text-xs font-black truncate max-w-full mt-0.5">{seat.branch}</span>
                      <span className="text-[9px] opacity-70 truncate max-w-full">{seat.rollNumber.split('-').pop()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seat Inspector Sidebar */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between">
              {selectedSeat ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Seat {selectedSeat.seatNumber}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1.5">{selectedSeat.studentName}</h3>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        selectedSeat.status === 'seated'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : selectedSeat.status === 'absent'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {selectedSeat.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Roll Number:</span>
                      <span className="font-mono font-semibold text-slate-900">{selectedSeat.rollNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Branch:</span>
                      <span className="font-semibold text-indigo-600">{selectedSeat.branch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Row / Col:</span>
                      <span>Row {selectedSeat.row}, Col {selectedSeat.col}</span>
                    </div>
                    {selectedSeat.remarks && (
                      <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                        <strong className="block text-amber-700 mb-0.5">Remarks / Flag:</strong>
                        {selectedSeat.remarks}
                      </div>
                    )}
                  </div>

                  {/* Status update buttons */}
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <span className="block text-[11px] font-semibold text-slate-500 mb-1">Update Seat Status:</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => onUpdateSeatStatus(selectedVenue, selectedSeat.seatNumber, 'seated')}
                        className={`py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center space-x-1 cursor-pointer ${
                          selectedSeat.status === 'seated' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>Seated</span>
                      </button>
                      <button
                        onClick={() => onUpdateSeatStatus(selectedVenue, selectedSeat.seatNumber, 'absent')}
                        className={`py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center space-x-1 cursor-pointer ${
                          selectedSeat.status === 'absent' ? 'bg-rose-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <UserX className="w-3 h-3" />
                        <span>Absent</span>
                      </button>
                      <button
                        onClick={() => onUpdateSeatStatus(selectedVenue, selectedSeat.seatNumber, 'flagged_malpractice')}
                        className={`py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center space-x-1 cursor-pointer ${
                          selectedSeat.status === 'flagged_malpractice' ? 'bg-amber-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <AlertOctagon className="w-3 h-3" />
                        <span>Flag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400">
                  <Grid className="w-10 h-10 text-indigo-400/50 mx-auto mb-3" />
                  <p className="text-xs font-semibold text-slate-700">Select a seat in the grid</p>
                  <p className="text-[10px] text-slate-500 mt-1">Inspect candidate profile, attendance, or flag malpractice incidents.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
