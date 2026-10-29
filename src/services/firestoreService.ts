import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDocs,
  getDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  Exam,
  RoomLayout,
  InvigilationDuty,
  ChatMessage,
  ChatChannel,
  SosAlert,
  IncidentReport,
  FacultyMember,
} from '../types';
import {
  mockExams,
  mockRoomLayouts,
  mockInvigilationDuties,
  mockChatChannels,
  mockChatMessages,
  mockSosAlerts,
  mockIncidentReports,
} from '../mockData';

// Super Admin emails
export const SUPER_ADMIN_EMAILS = [
  'laxmisricharank@gmail.com',
  'babecanikissu7@gmail.com',
];

/**
 * Seed initial data if Firestore is empty on first app run
 */
export async function seedInitialFirestoreData() {
  try {
    // 1. Ensure Super Admins exist in /admins and /faculty
    for (const adminEmail of SUPER_ADMIN_EMAILS) {
      const adminDocId = adminEmail.replace(/[^a-zA-Z0-9]/g, '_');
      await setDoc(
        doc(db, 'admins', adminDocId),
        {
          email: adminEmail,
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      await setDoc(
        doc(db, 'faculty', adminDocId),
        {
          id: adminDocId,
          email: adminEmail,
          name: adminEmail.startsWith('laxmi') ? 'Laxmi Sri Charan K (Super Admin)' : 'Exam Controller Admin',
          department: 'Examination Control Board',
          designation: 'Chief Exam Controller & Administrator',
          role: 'admin',
          employeeId: 'ADM-001',
          registeredBy: 'System Bootstrap',
          registeredAt: new Date().toISOString(),
          status: 'active',
        },
        { merge: true }
      );
    }

    // 2. Seed default faculty if none exist
    const facultySnap = await getDocs(collection(db, 'faculty'));
    if (facultySnap.size <= SUPER_ADMIN_EMAILS.length) {
      const defaultFaculty: FacultyMember[] = [
        {
          id: 'faculty_m_thorne',
          email: 'm.thorne@university.edu',
          name: 'Dr. Marcus Thorne',
          department: 'Computer Science & Engineering',
          designation: 'Associate Professor & Invigilator',
          role: 'staff',
          employeeId: 'EMP-1021',
          registeredBy: 'laxmisricharank@gmail.com',
          registeredAt: new Date().toISOString(),
          status: 'active',
        },
        {
          id: 'faculty_s_chen',
          email: 's.chen@university.edu',
          name: 'Dr. Sophia Chen',
          department: 'Information Technology',
          designation: 'Assistant Professor & Invigilator',
          role: 'staff',
          employeeId: 'EMP-1022',
          registeredBy: 'laxmisricharank@gmail.com',
          registeredAt: new Date().toISOString(),
          status: 'active',
        },
        {
          id: 'faculty_d_miller',
          email: 'd.miller@university.edu',
          name: 'Prof. David Miller',
          department: 'Mechanical Engineering',
          designation: 'Professor & Flying Squad Head',
          role: 'staff',
          employeeId: 'EMP-1023',
          registeredBy: 'laxmisricharank@gmail.com',
          registeredAt: new Date().toISOString(),
          status: 'active',
        },
      ];
      for (const f of defaultFaculty) {
        await setDoc(doc(db, 'faculty', f.id), f);
      }
    }

    // 3. Seed exams if empty
    const examsSnap = await getDocs(collection(db, 'exams'));
    if (examsSnap.empty) {
      for (const ex of mockExams) {
        await setDoc(doc(db, 'exams', ex.id), ex);
      }
    }

    // 4. Seed room layouts if empty
    const roomsSnap = await getDocs(collection(db, 'rooms'));
    if (roomsSnap.empty) {
      for (const [venue, room] of Object.entries(mockRoomLayouts)) {
        const roomId = venue.replace(/[^a-zA-Z0-9]/g, '_');
        await setDoc(doc(db, 'rooms', roomId), removeUndefined(room));
      }
    }

    // 5. Seed duties if empty
    const dutiesSnap = await getDocs(collection(db, 'duties'));
    if (dutiesSnap.empty) {
      for (const duty of mockInvigilationDuties) {
        await setDoc(doc(db, 'duties', duty.id), duty);
      }
    }

    // 6. Seed channels if empty
    const channelsSnap = await getDocs(collection(db, 'channels'));
    if (channelsSnap.empty) {
      for (const ch of mockChatChannels) {
        await setDoc(doc(db, 'channels', ch.id), ch);
      }
    }

    // 7. Seed messages if empty
    const msgSnap = await getDocs(collection(db, 'messages'));
    if (msgSnap.empty) {
      for (const msg of mockChatMessages) {
        await setDoc(doc(db, 'messages', msg.id), msg);
      }
    }

    // 8. Seed alerts if empty
    const alertsSnap = await getDocs(collection(db, 'sosAlerts'));
    if (alertsSnap.empty) {
      for (const a of mockSosAlerts) {
        await setDoc(doc(db, 'sosAlerts', a.id), a);
      }
    }

    // 9. Seed incidents if empty
    const incSnap = await getDocs(collection(db, 'incidentReports'));
    if (incSnap.empty) {
      for (const inc of mockIncidentReports) {
        await setDoc(doc(db, 'incidentReports', inc.id), inc);
      }
    }
  } catch (error) {
    console.error('Error in seeding Firestore:', error);
  }
}

// ----------------- Real-Time Listeners -----------------

export function subscribeToExams(callback: (exams: Exam[]) => void) {
  const path = 'exams';
  return onSnapshot(
    collection(db, path),
    snapshot => {
      const data: Exam[] = [];
      snapshot.forEach(docSnap => {
        data.push(docSnap.data() as Exam);
      });
      callback(data);
    },
    error => handleFirestoreError(error, OperationType.GET, path)
  );
}

export function subscribeToRooms(callback: (rooms: Record<string, RoomLayout>) => void) {
  const path = 'rooms';
  return onSnapshot(
    collection(db, path),
    snapshot => {
      const data: Record<string, RoomLayout> = {};
      snapshot.forEach(docSnap => {
        const room = docSnap.data() as RoomLayout;
        data[room.venue] = room;
      });
      callback(data);
    },
    error => handleFirestoreError(error, OperationType.GET, path)
  );
}

export function subscribeToDuties(callback: (duties: InvigilationDuty[]) => void) {
  const path = 'duties';
  return onSnapshot(
    collection(db, path),
    snapshot => {
      const data: InvigilationDuty[] = [];
      snapshot.forEach(docSnap => {
        data.push(docSnap.data() as InvigilationDuty);
      });
      callback(data);
    },
    error => handleFirestoreError(error, OperationType.GET, path)
  );
}

export function subscribeToFaculty(callback: (faculty: FacultyMember[]) => void) {
  const path = 'faculty';
  return onSnapshot(
    collection(db, path),
    snapshot => {
      const data: FacultyMember[] = [];
      snapshot.forEach(docSnap => {
        data.push(docSnap.data() as FacultyMember);
      });
      callback(data);
    },
    error => handleFirestoreError(error, OperationType.GET, path)
  );
}

export function subscribeToChannels(callback: (channels: ChatChannel[]) => void) {
  const path = 'channels';
  return onSnapshot(
    collection(db, path),
    snapshot => {
      const data: ChatChannel[] = [];
      snapshot.forEach(docSnap => {
        data.push(docSnap.data() as ChatChannel);
      });
      callback(data);
    },
    error => handleFirestoreError(error, OperationType.GET, path)
  );
}

export function subscribeToMessages(callback: (messages: ChatMessage[]) => void) {
  const path = 'messages';
  return onSnapshot(
    collection(db, path),
    snapshot => {
      const data: ChatMessage[] = [];
      snapshot.forEach(docSnap => {
        data.push(docSnap.data() as ChatMessage);
      });
      callback(data);
    },
    error => handleFirestoreError(error, OperationType.GET, path)
  );
}

export function subscribeToSosAlerts(callback: (alerts: SosAlert[]) => void) {
  const path = 'sosAlerts';
  return onSnapshot(
    collection(db, path),
    snapshot => {
      const data: SosAlert[] = [];
      snapshot.forEach(docSnap => {
        data.push(docSnap.data() as SosAlert);
      });
      callback(data);
    },
    error => handleFirestoreError(error, OperationType.GET, path)
  );
}

export function subscribeToIncidents(callback: (incidents: IncidentReport[]) => void) {
  const path = 'incidentReports';
  return onSnapshot(
    collection(db, path),
    snapshot => {
      const data: IncidentReport[] = [];
      snapshot.forEach(docSnap => {
        data.push(docSnap.data() as IncidentReport);
      });
      callback(data);
    },
    error => handleFirestoreError(error, OperationType.GET, path)
  );
}

/**
 * Remove undefined fields from objects to prevent Firestore errors.
 */
function removeUndefined(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  }
  
  const newObj: any = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      newObj[key] = removeUndefined(obj[key]);
    }
  }
  return newObj;
}

// ----------------- CRUD Operations -----------------

export async function addExamToFirestore(exam: Exam) {
  const path = 'exams';
  try {
    await setDoc(doc(db, path, exam.id), removeUndefined(exam));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteExamFromFirestore(id: string) {
  const path = 'exams';
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function updateRoomInFirestore(venue: string, room: RoomLayout) {
  const path = 'rooms';
  const roomId = venue.replace(/[^a-zA-Z0-9]/g, '_');
  try {
    await setDoc(doc(db, path, roomId), removeUndefined(room));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function addDutyToFirestore(duty: InvigilationDuty) {
  const path = 'duties';
  try {
    await setDoc(doc(db, path, duty.id), removeUndefined(duty));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateDutyStatusInFirestore(
  dutyId: string,
  status: InvigilationDuty['checkInStatus'],
  checkInTime?: string
) {
  const path = 'duties';
  try {
    const updatePayload: Partial<InvigilationDuty> = { checkInStatus: status };
    if (checkInTime) updatePayload.checkInTime = checkInTime;
    await updateDoc(doc(db, path, dutyId), removeUndefined(updatePayload));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function addMessageToFirestore(message: ChatMessage) {
  const path = 'messages';
  try {
    await setDoc(doc(db, path, message.id), removeUndefined(message));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function addChannelToFirestore(channel: ChatChannel) {
  const path = 'channels';
  try {
    await setDoc(doc(db, path, channel.id), removeUndefined(channel));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function addSosAlertToFirestore(alert: SosAlert) {
  const path = 'sosAlerts';
  try {
    await setDoc(doc(db, path, alert.id), removeUndefined(alert));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateSosStatusInFirestore(
  alertId: string,
  status: SosAlert['status']
) {
  const path = 'sosAlerts';
  try {
    await updateDoc(doc(db, path, alertId), removeUndefined({ status }));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function addIncidentToFirestore(incident: IncidentReport) {
  const path = 'incidentReports';
  try {
    await setDoc(doc(db, path, incident.id), removeUndefined(incident));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function registerFacultyInFirestore(
  faculty: Omit<FacultyMember, 'id' | 'registeredAt'>
) {
  const path = 'faculty';
  const facultyId = faculty.email.replace(/[^a-zA-Z0-9]/g, '_');
  const record: FacultyMember = {
    ...faculty,
    id: facultyId,
    registeredAt: new Date().toISOString(),
  };
  try {
    await setDoc(doc(db, path, facultyId), removeUndefined(record));
    // If registered as admin, also add to admins collection
    if (faculty.role === 'admin') {
      await setDoc(doc(db, 'admins', facultyId), removeUndefined({
        email: faculty.email,
        role: 'admin',
        createdAt: new Date().toISOString(),
      }));
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteFacultyFromFirestore(id: string) {
  const path = 'faculty';
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
