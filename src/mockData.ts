import {UserProfile, Exam, RoomLayout, InvigilationDuty, ChatMessage, ChatChannel, SosAlert, IncidentReport} from './types';

export const mockUsers: UserProfile[] = [
  {
    id: 'u1',
    name: 'Dr. Robert Sterling',
    email: 'r.sterling@university.edu',
    role: 'admin',
    department: 'Computer Science & Engineering',
    designation: 'Chief Exam Controller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'online',
  },
  {
    id: 'u2',
    name: 'Prof. Eleanor Vance',
    email: 'e.vance@university.edu',
    role: 'admin',
    department: 'Electronics & Communication',
    designation: 'Deputy Exam Controller',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'online',
  },
  {
    id: 'u3',
    name: 'Dr. Marcus Thorne',
    email: 'm.thorne@university.edu',
    role: 'staff',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor & Invigilator',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'on_duty',
  },
  {
    id: 'u4',
    name: 'Dr. Sophia Chen',
    email: 's.chen@university.edu',
    role: 'staff',
    department: 'Information Technology',
    designation: 'Assistant Professor & Invigilator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'on_duty',
  },
  {
    id: 'u5',
    name: 'Prof. David Miller',
    email: 'd.miller@university.edu',
    role: 'staff',
    department: 'Mechanical Engineering',
    designation: 'Professor & Flying Squad Head',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'online',
  },
  {
    id: 'u6',
    name: 'Dr. Ananya Sharma',
    email: 'a.sharma@university.edu',
    role: 'staff',
    department: 'Electrical Engineering',
    designation: 'Assistant Professor',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'offline',
  }
];

export const mockExams: Exam[] = [
  {
    id: 'ex-1',
    courseCode: 'CS-401',
    courseName: 'Advanced Algorithms & Data Structures',
    date: '2026-10-22',
    timeSlot: 'Morning (09:30 AM - 12:30 PM)',
    durationMinutes: 180,
    venue: 'Room 101',
    totalStudents: 32,
    chiefInvigilatorId: 'u3',
    status: 'Ongoing',
    department: 'Computer Science',
  },
  {
    id: 'ex-2',
    courseCode: 'IT-302',
    courseName: 'Distributed Systems & Cloud Computing',
    date: '2026-10-22',
    timeSlot: 'Morning (09:30 AM - 12:30 PM)',
    durationMinutes: 180,
    venue: 'Room 102',
    totalStudents: 40,
    chiefInvigilatorId: 'u4',
    status: 'Ongoing',
    department: 'Information Technology',
  },
  {
    id: 'ex-3',
    courseCode: 'EC-501',
    courseName: 'VLSI Design & Embedded Systems',
    date: '2026-10-22',
    timeSlot: 'Afternoon (02:00 PM - 05:00 PM)',
    durationMinutes: 180,
    venue: 'Hall A',
    totalStudents: 60,
    chiefInvigilatorId: 'u5',
    status: 'Upcoming',
    department: 'Electronics',
  },
  {
    id: 'ex-4',
    courseCode: 'ME-405',
    courseName: 'Finite Element Analysis in Mechanics',
    date: '2026-10-22',
    timeSlot: 'Afternoon (02:00 PM - 05:00 PM)',
    durationMinutes: 180,
    venue: 'Computer Lab 1',
    totalStudents: 30,
    chiefInvigilatorId: 'u6',
    status: 'Upcoming',
    department: 'Mechanical',
  },
  {
    id: 'ex-5',
    courseCode: 'CS-303',
    courseName: 'Database Management Systems',
    date: '2026-10-21',
    timeSlot: 'Morning (09:30 AM - 12:30 PM)',
    durationMinutes: 180,
    venue: 'Room 101',
    totalStudents: 32,
    chiefInvigilatorId: 'u3',
    status: 'Completed',
    department: 'Computer Science',
  }
];

// Helper to generate realistic student names and roll numbers
const branches = ['CSE', 'IT', 'ECE', 'MECH', 'EEE'];
const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Diya', 'Sanya', 'Ananya', 'Priya', 'Neha', 'Kavya', 'Riya', 'Tanvi', 'Meera', 'Pooja', 'Rahul', 'Amit', 'Rohit', 'Karan', 'Vikram', 'Siddharth', 'Nikhil', 'Varun', 'Akash', 'Manish'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Malhotra', 'Iyer', 'Reddy', 'Patel', 'Mehta', 'Nair', 'Deshmukh', 'Joshi', 'Choudhury', 'Sen', 'Das', 'Bose', 'Kapoor', 'Mehra', 'Saxena', 'Bhatia', 'Aggarwal'];

function generateSeats(venue: string, rows: number, cols: number, startRoll: number): RoomLayout {
  const seats = [];
  let studentIdx = 0;
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const seatNum = `S-${r}${c < 10 ? '0' + c : c}`;
      const branch = branches[(r + c) % branches.length];
      const name = `${firstNames[(startRoll + studentIdx) % firstNames.length]} ${lastNames[(startRoll * 3 + studentIdx) % lastNames.length]}`;
      const rollNumber = `${branch}-2026-${100 + ((startRoll + studentIdx) % 900)}`;
      
      // Simulate a few absent or flagged seats
      let status: 'seated' | 'absent' | 'flagged_malpractice' | 'relocated' = 'seated';
      if (studentIdx === 4 && venue === 'Room 101') status = 'absent';
      if (studentIdx === 11 && venue === 'Room 101') status = 'flagged_malpractice';
      if (studentIdx === 7 && venue === 'Room 102') status = 'absent';

      seats.push({
        seatNumber: seatNum,
        row: r,
        col: c,
        studentId: `std-${startRoll + studentIdx}`,
        studentName: name,
        rollNumber: rollNumber,
        branch: branch,
        status: status,
        remarks: status === 'flagged_malpractice' ? 'Unauthorized formula sheet detected' : status === 'absent' ? 'Student did not report' : undefined,
      });
      studentIdx++;
    }
  }

  return {
    venue,
    building: 'Academic Block 3',
    capacity: rows * cols,
    rows,
    cols,
    seats,
  };
}

export const mockRoomLayouts: Record<string, RoomLayout> = {
  'Room 101': generateSeats('Room 101', 4, 8, 101),
  'Room 102': generateSeats('Room 102', 5, 8, 201),
  'Hall A': generateSeats('Hall A', 6, 10, 301),
  'Computer Lab 1': generateSeats('Computer Lab 1', 5, 6, 401),
};

export const mockInvigilationDuties: InvigilationDuty[] = [
  {
    id: 'duty-1',
    examId: 'ex-1',
    courseCode: 'CS-401',
    courseName: 'Advanced Algorithms & Data Structures',
    venue: 'Room 101',
    date: '2026-10-22',
    timeSlot: 'Morning (09:30 AM - 12:30 PM)',
    facultyId: 'u3',
    facultyName: 'Dr. Marcus Thorne',
    department: 'Computer Science & Engineering',
    dutyType: 'Chief Invigilator',
    checkInStatus: 'Checked-In',
    checkInTime: '09:05 AM',
  },
  {
    id: 'duty-2',
    examId: 'ex-2',
    courseCode: 'IT-302',
    courseName: 'Distributed Systems & Cloud Computing',
    venue: 'Room 102',
    date: '2026-10-22',
    timeSlot: 'Morning (09:30 AM - 12:30 PM)',
    facultyId: 'u4',
    facultyName: 'Dr. Sophia Chen',
    department: 'Information Technology',
    dutyType: 'Chief Invigilator',
    checkInStatus: 'Checked-In',
    checkInTime: '09:12 AM',
  },
  {
    id: 'duty-3',
    examId: 'ex-3',
    courseCode: 'EC-501',
    courseName: 'VLSI Design & Embedded Systems',
    venue: 'Hall A',
    date: '2026-10-22',
    timeSlot: 'Afternoon (02:00 PM - 05:00 PM)',
    facultyId: 'u5',
    facultyName: 'Prof. David Miller',
    department: 'Electronics & Communication',
    dutyType: 'Chief Invigilator',
    checkInStatus: 'Pending',
  },
  {
    id: 'duty-4',
    examId: 'ex-4',
    courseCode: 'ME-405',
    courseName: 'Finite Element Analysis in Mechanics',
    venue: 'Computer Lab 1',
    date: '2026-10-22',
    timeSlot: 'Afternoon (02:00 PM - 05:00 PM)',
    facultyId: 'u6',
    facultyName: 'Dr. Ananya Sharma',
    department: 'Mechanical Engineering',
    dutyType: 'Chief Invigilator',
    checkInStatus: 'Pending',
  }
];

export const mockChatChannels: ChatChannel[] = [
  {
    id: 'broadcast',
    name: '📢 Exam Control Broadcast',
    type: 'broadcast',
    description: 'Official announcements and urgent notices from the Exam Controller office.',
    unreadCount: 1,
  },
  {
    id: 'room-101',
    name: '🏫 Room 101 - CS-401',
    type: 'room',
    description: 'Direct coordination channel for Room 101 invigilators and controllers.',
  },
  {
    id: 'room-102',
    name: '🏫 Room 102 - IT-302',
    type: 'room',
    description: 'Direct coordination channel for Room 102 invigilators and controllers.',
  },
  {
    id: 'flying-squad',
    name: '⚡ Flying Squad & Security',
    type: 'squad',
    description: 'Mobile squad reporting, surprise inspections, and malpractice checks.',
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'm1',
    channelId: 'broadcast',
    senderId: 'u1',
    senderName: 'Dr. Robert Sterling',
    senderRole: 'admin',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    content: 'All invigilators are requested to complete biometric roll verification within the first 45 minutes of the morning session.',
    timestamp: '09:15 AM',
  },
  {
    id: 'm2',
    channelId: 'room-101',
    senderId: 'u3',
    senderName: 'Dr. Marcus Thorne',
    senderRole: 'staff',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    content: 'Question papers distributed successfully in Room 101. All 31 present candidates accounted for. 1 absent recorded.',
    timestamp: '09:35 AM',
  },
  {
    id: 'm3',
    channelId: 'room-101',
    senderId: 'u3',
    senderName: 'Dr. Marcus Thorne',
    senderRole: 'staff',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    content: 'Flagged seat S-11 for unauthorized reference material. Flying squad requested for inspection.',
    timestamp: '10:10 AM',
  },
  {
    id: 'm4',
    channelId: 'flying-squad',
    senderId: 'u5',
    senderName: 'Prof. David Miller',
    senderRole: 'staff',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    content: 'En route to Room 101 for inspection regarding reported flag.',
    timestamp: '10:12 AM',
  }
];

export const mockSosAlerts: SosAlert[] = [
  {
    id: 'sos-1',
    venue: 'Room 101',
    reportedBy: 'Dr. Marcus Thorne',
    facultyId: 'u3',
    alertType: 'Disruptive Behavior',
    description: 'Candidate in seat S-11 caught with unauthorized formula notes. Confiscated and logged.',
    timestamp: '10:10 AM',
    status: 'Acknowledged',
    priority: 'High',
  }
];

export const mockIncidentReports: IncidentReport[] = [
  {
    id: 'inc-1',
    examId: 'ex-1',
    courseCode: 'CS-401',
    venue: 'Room 101',
    studentRollNumber: 'CSE-2026-111',
    studentName: 'Aarav Sharma',
    reportedBy: 'Dr. Marcus Thorne',
    category: 'Malpractice',
    details: 'Found handwritten formula sheet inside scientific calculator casing during routine check.',
    timestamp: '10:10 AM',
    status: 'Pending Review',
  }
];
