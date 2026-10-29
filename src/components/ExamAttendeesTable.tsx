import React, { useState, useEffect } from 'react';

interface Attendee {
  id: number;
  name: string | null;
  role: string;
  department?: string | null;
  dutyType?: string | null;
  seatNumber?: string | null;
}

interface ExamAttendees {
  exam: {
    courseName: string;
    venue: string;
  };
  faculty: Attendee[];
  students: Attendee[];
}

export const ExamAttendeesTable: React.FC<{ examId: number }> = ({ examId }) => {
  const [data, setData] = useState<ExamAttendees | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/exams/${examId}/attendees`)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [examId]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Error loading data</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{data.exam.courseName} - {data.exam.venue}</h2>
      
      <h3 className="text-lg font-semibold mt-4 mb-2">Faculty</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Duty</th>
          </tr>
        </thead>
        <tbody>
          {data.faculty.map(f => (
            <tr key={f.id}>
              <td className="border p-2">{f.name}</td>
              <td className="border p-2">{f.role}</td>
              <td className="border p-2">{f.department}</td>
              <td className="border p-2">{f.dutyType}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-lg font-semibold mt-6 mb-2">Students</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Seat Number</th>
          </tr>
        </thead>
        <tbody>
          {data.students.map(s => (
            <tr key={s.id}>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.seatNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
