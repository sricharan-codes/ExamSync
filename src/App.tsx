import React, {useState, useEffect} from 'react';
import {
  UserProfile,
  Exam,
  StudentSeat,
  InvigilationDuty,
  ChatMessage,
  ChatChannel,
  SosAlert,
  IncidentReport,
  RoomLayout,
  FacultyMember,
} from './types';
import {
  mockExams,
  mockRoomLayouts,
  mockInvigilationDuties,
  mockChatChannels,
  mockChatMessages,
  mockSosAlerts,
  mockIncidentReports,
} from './mockData';
import {auth, googleProvider, signInWithPopup, signOut, testConnection} from './firebase';
import {
  seedInitialFirestoreData,
  subscribeToExams,
  subscribeToRooms,
  subscribeToDuties,
  subscribeToFaculty,
  subscribeToChannels,
  subscribeToMessages,
  subscribeToSosAlerts,
  subscribeToIncidents,
  addExamToFirestore,
  deleteExamFromFirestore,
  updateRoomInFirestore,
  addDutyToFirestore,
  updateDutyStatusInFirestore,
  addMessageToFirestore,
  addChannelToFirestore,
  addSosAlertToFirestore,
  updateSosStatusInFirestore,
  addIncidentToFirestore,
  registerFacultyInFirestore,
  deleteFacultyFromFirestore,
  SUPER_ADMIN_EMAILS,
} from './services/firestoreService';
import {Navbar} from './components/Navbar';
import {Sidebar} from './components/Sidebar';
import {LoginView} from './views/LoginView';
import {UnauthorizedView} from './views/UnauthorizedView';
import {DashboardView} from './views/DashboardView';
import {ExamsView} from './views/ExamsView';
import {SeatingView} from './views/SeatingView';
import {InvigilationView} from './views/InvigilationView';
import {FacultyView} from './views/FacultyView';
import {ChatView} from './views/ChatView';
import {AlertsView} from './views/AlertsView';
import {ReportsView} from './views/ReportsView';
import {NewExamModal} from './components/NewExamModal';
import {SosModal} from './components/SosModal';
import {AiAssistantModal} from './components/AiAssistantModal';
import {NewDutyModal} from './components/NewDutyModal';
import {NewStudentSeatModal} from './components/NewStudentSeatModal';
import {NewChannelModal} from './components/NewChannelModal';
import {NewIncidentModal} from './components/NewIncidentModal';
import {RegisterFacultyModal} from './components/RegisterFacultyModal';
import {Loader2} from 'lucide-react';

export default function App() {
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Firestore Real-Time Data States
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [roomLayouts, setRoomLayouts] = useState<Record<string, RoomLayout>>(mockRoomLayouts);
  const [duties, setDuties] = useState<InvigilationDuty[]>(mockInvigilationDuties);
  const [facultyList, setFacultyList] = useState<FacultyMember[]>([]);
  const [chatChannels, setChatChannels] = useState<ChatChannel[]>(mockChatChannels);
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [sosAlerts, setSosAlerts] = useState<SosAlert[]>(mockSosAlerts);
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>(mockIncidentReports);

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isNewExamOpen, setIsNewExamOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isNewDutyOpen, setIsNewDutyOpen] = useState(false);
  const [isNewStudentOpen, setIsNewStudentOpen] = useState(false);
  const [isNewChannelOpen, setIsNewChannelOpen] = useState(false);
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);
  const [isRegisterFacultyOpen, setIsRegisterFacultyOpen] = useState(false);

  // Initialize connection
  useEffect(() => {
    testConnection();
  }, []);

  // Seed Firestore only after an admin is authenticated
  const hasSeededRef = React.useRef(false);
  useEffect(() => {
    if (currentUser && currentUser.role === 'admin' && !hasSeededRef.current) {
      hasSeededRef.current = true;
      seedInitialFirestoreData();
    }
  }, [currentUser]);

  // Listen to Firebase Auth state
  useEffect(() => {
    let unsubExams: () => void,
        unsubRooms: () => void,
        unsubDuties: () => void,
        unsubFaculty: () => void,
        unsubChannels: () => void,
        unsubMessages: () => void,
        unsubAlerts: () => void,
        unsubIncidents: () => void;

    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      setFirebaseUser(user);
      if (user && user.email) {
        // Setup real-time Firestore listeners ONLY when user is signed in
        unsubExams = subscribeToExams(liveExams => { if (liveExams.length > 0) setExams(liveExams); });
        unsubRooms = subscribeToRooms(liveRooms => { if (Object.keys(liveRooms).length > 0) setRoomLayouts(liveRooms); });
        unsubDuties = subscribeToDuties(liveDuties => { if (liveDuties.length > 0) setDuties(liveDuties); });
        unsubFaculty = subscribeToFaculty(liveFaculty => { if (liveFaculty.length > 0) setFacultyList(liveFaculty); });
        unsubChannels = subscribeToChannels(liveChannels => { if (liveChannels.length > 0) setChatChannels(liveChannels); });
        unsubMessages = subscribeToMessages(liveMessages => { if (liveMessages.length > 0) setMessages(liveMessages); });
        unsubAlerts = subscribeToSosAlerts(liveAlerts => { setSosAlerts(liveAlerts); });
        unsubIncidents = subscribeToIncidents(liveIncidents => { setIncidentReports(liveIncidents); });

        const userEmail = user.email.toLowerCase();
        const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(userEmail);

        // Check if user is in registered faculty list
        const registered = facultyList.find(f => f.email.toLowerCase() === userEmail);

        if (isSuperAdmin) {
          setCurrentUser({
            id: user.uid,
            name: user.displayName || (userEmail.startsWith('laxmi') ? 'Laxmi Sri Charan K' : 'Exam Controller Admin'),
            email: userEmail,
            role: 'admin',
            department: 'Examination Control Board',
            designation: 'Chief Exam Controller & Administrator',
            avatar: user.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            status: 'online',
            isRegistered: true,
          });
        } else if (registered) {
          setCurrentUser({
            id: user.uid,
            name: registered.name || user.displayName || 'Faculty Member',
            email: userEmail,
            role: registered.role,
            department: registered.department,
            designation: registered.designation,
            avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            status: 'online',
            isRegistered: true,
          });
        } else {
          // Unregistered Google user
          setCurrentUser({
            id: user.uid,
            name: user.displayName || 'Guest User',
            email: userEmail,
            role: 'staff',
            department: 'Pending Department',
            designation: 'Pending Registration',
            avatar: user.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            status: 'offline',
            isRegistered: false,
          });
        }
      } else {
        setCurrentUser(null);
        // Cleanup listeners when signed out
        if (unsubExams) unsubExams();
        if (unsubRooms) unsubRooms();
        if (unsubDuties) unsubDuties();
        if (unsubFaculty) unsubFaculty();
        if (unsubChannels) unsubChannels();
        if (unsubMessages) unsubMessages();
        if (unsubAlerts) unsubAlerts();
        if (unsubIncidents) unsubIncidents();
      }
      setAuthLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubExams) unsubExams();
      if (unsubRooms) unsubRooms();
      if (unsubDuties) unsubDuties();
      if (unsubFaculty) unsubFaculty();
      if (unsubChannels) unsubChannels();
      if (unsubMessages) unsubMessages();
      if (unsubAlerts) unsubAlerts();
      if (unsubIncidents) unsubIncidents();
    };
  }, [facultyList]);



  // Auth Handlers
  const handleGoogleSignIn = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      setCurrentUser(null);
    } catch (err: any) {
      console.error('Sign Out failed:', err);
    }
  };

  const handleRefreshRegistration = () => {
    if (firebaseUser && firebaseUser.email) {
      const userEmail = firebaseUser.email.toLowerCase();
      const registered = facultyList.find(f => f.email.toLowerCase() === userEmail);
      if (registered || SUPER_ADMIN_EMAILS.includes(userEmail)) {
        setCurrentUser(prev => prev ? {...prev, isRegistered: true} : null);
      }
    }
  };

  // Exam Handlers
  const handleAddExam = async (newExam: Exam) => {
    await addExamToFirestore(newExam);
  };

  const handleDeleteExam = async (id: string) => {
    await deleteExamFromFirestore(id);
  };

  // Seating Handlers
  const handleUpdateSeatStatus = async (venue: string, seatNumber: string, newStatus: StudentSeat['status']) => {
    const room = roomLayouts[venue];
    if (!room) return;
    const updatedSeats = room.seats.map(s => {
      if (s.seatNumber === seatNumber) {
        return {...s, status: newStatus};
      }
      return s;
    });
    const updatedRoom: RoomLayout = {...room, seats: updatedSeats};
    await updateRoomInFirestore(venue, updatedRoom);
  };

  const handleAddStudentSeat = async (venue: string, seat: StudentSeat) => {
    const room = roomLayouts[venue];
    if (!room) return;
    const updatedRoom: RoomLayout = {...room, seats: [...room.seats, seat], capacity: room.seats.length + 1};
    await updateRoomInFirestore(venue, updatedRoom);
  };

  const handleShuffleSeating = async (venue: string) => {
    const room = roomLayouts[venue];
    if (!room) return;
    const seatsCopy = [...room.seats];
    const students = seatsCopy.map(s => ({
      studentId: s.studentId,
      studentName: s.studentName,
      rollNumber: s.rollNumber,
      branch: s.branch,
      status: s.status,
      remarks: s.remarks,
    }));

    students.sort(() => Math.random() - 0.5);

    const newSeats = seatsCopy.map((s, idx) => ({
      ...s,
      studentId: students[idx].studentId,
      studentName: students[idx].studentName,
      rollNumber: students[idx].rollNumber,
      branch: students[idx].branch,
      status: students[idx].status,
      remarks: students[idx].remarks,
    }));

    const updatedRoom: RoomLayout = {...room, seats: newSeats};
    await updateRoomInFirestore(venue, updatedRoom);
  };

  // Duty Handlers
  const handleCheckInDuty = async (dutyId: string) => {
    const checkInTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    await updateDutyStatusInFirestore(dutyId, 'Checked-In', checkInTime);
  };

  const handleAddDuty = async (newDuty: InvigilationDuty) => {
    await addDutyToFirestore(newDuty);
  };

  const handleAutoAssignDuties = async () => {
    for (const d of duties) {
      if (d.checkInStatus === 'Pending') {
        await updateDutyStatusInFirestore(d.id, 'Checked-In', '09:20 AM');
      }
    }
  };

  // Chat Handlers
  const handleSendMessage = async (channelId: string, content: string) => {
    if (!currentUser) return;
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      channelId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      content,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
    };
    await addMessageToFirestore(newMsg);
  };

  const handleAddChannel = async (newChannel: ChatChannel) => {
    await addChannelToFirestore(newChannel);
  };

  // SOS & Incident Handlers
  const handleTriggerSos = async (alert: SosAlert) => {
    if (!currentUser) return;
    await addSosAlertToFirestore(alert);
    const broadcastMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      channelId: 'broadcast',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      content: `🚨 EMERGENCY SOS [${alert.alertType}] reported at ${alert.venue}: ${alert.description}`,
      timestamp: alert.timestamp,
    };
    await addMessageToFirestore(broadcastMsg);
  };

  const handleAcknowledgeSos = async (id: string) => {
    await updateSosStatusInFirestore(id, 'Acknowledged');
  };

  const handleResolveSos = async (id: string) => {
    await updateSosStatusInFirestore(id, 'Resolved');
  };

  const handleAddIncident = async (incident: IncidentReport) => {
    await addIncidentToFirestore(incident);
  };

  // Faculty Handlers (Only Admin)
  const handleRegisterFaculty = async (facultyData: Omit<FacultyMember, 'id' | 'registeredAt'>) => {
    await registerFacultyInFirestore(facultyData);
  };

  const handleDeleteFaculty = async (id: string) => {
    await deleteFacultyFromFirestore(id);
  };

  const unreadChatCount = chatChannels.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const activeSosCount = sosAlerts.filter(a => a.status === 'Active' || a.status === 'Acknowledged').length;

  // 1. Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Connecting to ExamSync Pro Institutional Portal...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State: Show Google Login Screen BEFORE dashboard
  if (!firebaseUser) {
    return <LoginView onSignInWithGoogle={handleGoogleSignIn} />;
  }

  // 3. Authenticated but Unregistered Google Account
  if (currentUser && currentUser.isRegistered === false) {
    return (
      <UnauthorizedView
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onRefresh={handleRefreshRegistration}
      />
    );
  }

  // Fallback check
  if (!currentUser) {
    return <LoginView onSignInWithGoogle={handleGoogleSignIn} />;
  }

  // 4. Authenticated & Authorized: Show ExamSync Pro Dashboard
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onSignInWithGoogle={handleGoogleSignIn}
        onSignOut={handleSignOut}
        activeSosAlerts={sosAlerts}
        onOpenSosModal={() => setIsSosModalOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          unreadChatCount={unreadChatCount}
          activeSosCount={activeSosCount}
          facultyCount={facultyList.length}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                exams={exams}
                sosAlerts={sosAlerts}
                duties={duties}
                roomLayouts={roomLayouts}
                onNavigate={setActiveTab}
                onOpenSosModal={() => setIsSosModalOpen(true)}
              />
            )}
            {activeTab === 'exams' && (
              <ExamsView
                exams={exams}
                onAddExamClick={() => setIsNewExamOpen(true)}
                onDeleteExam={handleDeleteExam}
                staffUsers={facultyList.map(f => ({
                  id: f.id,
                  name: f.name,
                  email: f.email,
                  role: f.role,
                  department: f.department,
                  designation: f.designation,
                  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
                  status: 'online',
                }))}
              />
            )}
            {activeTab === 'seating' && (
              <SeatingView
                roomLayouts={roomLayouts}
                onUpdateSeatStatus={handleUpdateSeatStatus}
                onShuffleSeating={handleShuffleSeating}
                onOpenNewStudentModal={() => setIsNewStudentOpen(true)}
              />
            )}
            {activeTab === 'invigilation' && (
              <InvigilationView
                duties={duties}
                staffUsers={facultyList.map(f => ({
                  id: f.id,
                  name: f.name,
                  email: f.email,
                  role: f.role,
                  department: f.department,
                  designation: f.designation,
                  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
                  status: 'online',
                }))}
                exams={exams}
                onCheckInDuty={handleCheckInDuty}
                onAutoAssignDuties={handleAutoAssignDuties}
                onOpenNewDutyModal={() => setIsNewDutyOpen(true)}
              />
            )}
            {activeTab === 'faculty' && (
              <FacultyView
                facultyList={facultyList}
                currentUser={currentUser}
                onOpenRegisterModal={() => setIsRegisterFacultyOpen(true)}
                onDeleteFaculty={handleDeleteFaculty}
              />
            )}
            {activeTab === 'chat' && (
              <ChatView
                channels={chatChannels}
                messages={messages}
                onSendMessage={handleSendMessage}
                currentUser={currentUser}
                onOpenNewChannelModal={() => setIsNewChannelOpen(true)}
              />
            )}
            {activeTab === 'alerts' && (
              <AlertsView
                sosAlerts={sosAlerts}
                incidentReports={incidentReports}
                onAcknowledgeSos={handleAcknowledgeSos}
                onResolveSos={handleResolveSos}
                onOpenSosModal={() => setIsSosModalOpen(true)}
                onOpenNewIncidentModal={() => setIsNewIncidentOpen(true)}
              />
            )}
            {activeTab === 'reports' && (
              <ReportsView
                exams={exams}
                roomLayouts={roomLayouts}
                duties={duties}
              />
            )}
          </div>
        </main>

      </div>

      {/* Modals */}
      <NewExamModal
        isOpen={isNewExamOpen}
        onClose={() => setIsNewExamOpen(false)}
        onAddExam={handleAddExam}
        staffUsers={facultyList.map(f => ({
          id: f.id,
          name: f.name,
          email: f.email,
          role: f.role,
          department: f.department,
          designation: f.designation,
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          status: 'online',
        }))}
      />

      <SosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        onTriggerSos={handleTriggerSos}
        currentUser={currentUser}
      />

      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        exams={exams}
        sosAlerts={sosAlerts}
      />

      <NewDutyModal
        isOpen={isNewDutyOpen}
        onClose={() => setIsNewDutyOpen(false)}
        onAddDuty={handleAddDuty}
        exams={exams}
        staffUsers={facultyList.map(f => ({
          id: f.id,
          name: f.name,
          email: f.email,
          role: f.role,
          department: f.department,
          designation: f.designation,
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          status: 'online',
        }))}
      />

      <NewStudentSeatModal
        isOpen={isNewStudentOpen}
        onClose={() => setIsNewStudentOpen(false)}
        venues={Object.keys(roomLayouts)}
        onAddStudentSeat={handleAddStudentSeat}
      />

      <NewChannelModal
        isOpen={isNewChannelOpen}
        onClose={() => setIsNewChannelOpen(false)}
        onAddChannel={handleAddChannel}
      />

      <NewIncidentModal
        isOpen={isNewIncidentOpen}
        onClose={() => setIsNewIncidentOpen(false)}
        onAddIncident={handleAddIncident}
        exams={exams}
        currentUser={currentUser}
      />

      <RegisterFacultyModal
        isOpen={isRegisterFacultyOpen}
        onClose={() => setIsRegisterFacultyOpen(false)}
        onRegisterFaculty={handleRegisterFaculty}
        currentUserEmail={currentUser.email}
      />

    </div>
  );
}
