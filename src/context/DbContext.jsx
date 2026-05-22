import React, { createContext, useState, useEffect } from 'react';

export const DbContext = createContext(null);

const INITIAL_DB = {
  users: [
    { id: 1, name: 'Juan Dela Cruz', username: 'operator', email: 'operator@talipapa.com', phone: '0912 345 6789', role: 'operator', password: '1234', address: 'Pandacan, Manila', status: 'active' },
    { id: 2, name: 'Maria Santos', username: 'renter', email: 'maria@email.com', phone: '0917 234 5678', role: 'renter', password: '1234', address: 'Pandacan, Manila', status: 'active', stallId: 'A-12' },
    { id: 3, name: 'Pedro Reyes', username: 'pedro', email: 'pedro@email.com', phone: '0918 345 6789', role: 'renter', password: '1234', address: 'Sta. Mesa, Manila', status: 'active', stallId: 'B-05' },
  ],
  stalls: [
    { id: 'A-01', section: 'vegetables', size: '3m×2m', rent: 2500, status: 'occupied', renter: 'Maria Santos', desc: 'Prime vegetable stall near entrance' },
    { id: 'A-02', section: 'vegetables', size: '3m×2m', rent: 2500, status: 'available', renter: null, desc: 'Great location with morning sun' },
    { id: 'A-03', section: 'vegetables', size: '2m×2m', rent: 2000, status: 'available', renter: null, desc: 'Corner stall, high visibility' },
    { id: 'A-04', section: 'vegetables', size: '3m×2m', rent: 2500, status: 'reserved', renter: 'Ana Garcia', desc: 'Standard vegetable stall' },
    { id: 'A-05', section: 'vegetables', size: '3m×2m', rent: 2500, status: 'available', renter: null, desc: 'Near main pathway' },
    { id: 'A-12', section: 'vegetables', size: '3m×2m', rent: 2500, status: 'occupied', renter: 'Maria Santos', desc: 'Stall for vegetables and fresh produce' },
    { id: 'B-01', section: 'fish', size: '3m×2m', rent: 2800, status: 'available', renter: null, desc: 'Fish section with drainage' },
    { id: 'B-02', section: 'fish', size: '3m×3m', rent: 3200, status: 'occupied', renter: 'Pedro Reyes', desc: 'Large fish stall' },
    { id: 'B-05', section: 'fish', size: '3m×2m', rent: 2800, status: 'occupied', renter: 'Pedro Reyes', desc: 'Fish retail stall' },
    { id: 'B-06', section: 'fish', size: '2m×2m', rent: 2300, status: 'available', renter: null, desc: 'Small fish stall' },
    { id: 'C-01', section: 'meat', size: '3m×3m', rent: 3000, status: 'available', renter: null, desc: 'Meat section stall' },
    { id: 'C-08', section: 'meat', size: '3m×2m', rent: 2600, status: 'available', renter: null, desc: 'Meat vendor stall' },
    { id: 'D-01', section: 'dry', size: '3m×2m', rent: 2200, status: 'occupied', renter: 'Juan Dela Cruz', desc: 'Dry goods storage stall' },
    { id: 'D-10', section: 'dry', size: '5m×3m', rent: 4500, status: 'occupied', renter: 'Ana Garcia', desc: 'Large dry goods stall' },
    { id: 'D-11', section: 'dry', size: '3m×2m', rent: 2200, status: 'reserved', renter: 'Juan Dela Cruz', desc: 'Dry goods near exit' },
    { id: 'E-01', section: 'snacks', size: '2m×2m', rent: 1800, status: 'available', renter: null, desc: 'Snacks and drinks stall' },
    { id: 'E-03', section: 'snacks', size: '2m×2m', rent: 1800, status: 'available', renter: null, desc: 'Street food stall' },
    { id: 'E-07', section: 'snacks', size: '3m×2m', rent: 2100, status: 'reserved', renter: null, desc: 'Cooked food stall' },
  ],
  applications: [
    { id: 1, applicant: 'Ana Garcia', userId: 3, stallId: 'A-04', biz: 'Vegetable Retail', date: 'May 14, 2026', status: 'pending', msg: 'I want to sell fresh vegetables from my farm' },
    { id: 2, applicant: 'Maria Santos', userId: 2, stallId: 'A-12', biz: 'Vegetable Retail', date: 'May 15, 2026', status: 'approved', msg: 'Experienced vegetable vendor' },
    { id: 3, applicant: 'Pedro Reyes', userId: 3, stallId: 'B-05', biz: 'Fish Retail', date: 'May 15, 2026', status: 'approved', msg: 'Fish vendor with 5 years experience' },
    { id: 4, applicant: 'Carlos Mendoza', userId: 4, stallId: 'C-08', biz: 'Meat Vendor', date: 'May 16, 2026', status: 'pending', msg: 'Certified meat vendor' },
    { id: 5, applicant: 'Liza Mendoza', userId: 5, stallId: 'A-02', biz: 'Vegetable Retail', date: 'May 13, 2026', status: 'rejected', msg: 'Small vegetable stand' },
  ],
  payments: [
    { id: 1, renter: 'Maria Santos', stallId: 'A-12', amount: 2500, due: 'Jun 5, 2026', paid: 'May 4, 2026', status: 'paid', month: 'May 2026' },
    { id: 2, renter: 'Maria Santos', stallId: 'A-12', amount: 2500, due: 'May 5, 2026', paid: 'Apr 5, 2026', status: 'paid', month: 'Apr 2026' },
    { id: 3, renter: 'Pedro Reyes', stallId: 'B-05', amount: 2800, due: 'Jun 5, 2026', paid: null, status: 'unpaid', month: 'May 2026' },
    { id: 4, renter: 'Ana Garcia', stallId: 'D-10', amount: 4500, due: 'Jun 5, 2026', paid: 'May 3, 2026', status: 'paid', month: 'May 2026' },
    { id: 5, renter: 'Carlos Mendoza', stallId: 'D-11', amount: 2200, due: 'Jun 5, 2026', paid: null, status: 'unpaid', month: 'May 2026' },
  ],
  maintenance: [
    { id: 1, issue: 'Broken Light', location: 'Aisle 3', reporter: 'Juan Dela Cruz', priority: 'high', status: 'pending', date: 'May 15, 2026' },
    { id: 2, issue: 'Water Leak', location: 'CB Section', reporter: 'Pedro Reyes', priority: 'medium', status: 'in-progress', date: 'May 14, 2026' },
    { id: 3, issue: 'Damaged Floor', location: 'In front of D-05', reporter: 'Ana Garcia', priority: 'low', status: 'pending', date: 'May 14, 2026' },
    { id: 4, issue: 'Clogged Drain', location: 'Fish Section', reporter: 'Maria Santos', priority: 'medium', status: 'resolved', date: 'May 12, 2026' },
    { id: 5, issue: 'Broken Signage', location: 'Entrance', reporter: 'Carlos Mendoza', priority: 'low', status: 'resolved', date: 'May 10, 2026' },
  ],
  announcements: [
    { id: 1, title: 'Market Cleanup Drive', category: 'general', priority: 'normal', date: 'May 15, 2026', msg: 'Join us on May 20, 2026 for the monthly market cleanup drive. All vendors are required to participate.' },
    { id: 2, title: 'New Rental Policy', category: 'reminder', priority: 'normal', date: 'May 10, 2026', msg: 'Please be informed of the new rental policy effective June 1, 2026. Visit the admin office for details.' },
    { id: 3, title: 'Water Interruption', category: 'emergency', priority: 'high', date: 'May 8, 2026', msg: 'Water supply will be interrupted on May 18, 2026 from 8:00 AM - 12:00 PM. Please prepare accordingly.' },
    { id: 4, title: 'Fire Safety Reminder', category: 'reminder', priority: 'normal', date: 'May 3, 2026', msg: 'Please keep your area clean and be mindful of fire safety. Ensure all electrical connections are properly insulated.' },
  ],
  notifications: [
    { id: 1, icon: '📋', bg: '#e8f5e9', title: 'Application Approved', desc: 'Your application for Stall A-12 has been approved!', time: '2 hours ago', read: false },
    { id: 2, icon: '📢', bg: '#fff3cd', title: 'New Announcement', desc: 'Market Cleanup Drive on May 20, 2026', time: '5 hours ago', read: false },
    { id: 3, icon: '💳', bg: '#e3f2fd', title: 'Payment Due', desc: 'Your monthly rent for Stall A-12 is due on June 5', time: '1 day ago', read: true },
    { id: 4, icon: '🔧', bg: '#fce4ec', title: 'Maintenance Update', desc: 'Your maintenance request has been received', time: '2 days ago', read: true },
  ]
};

export const DbProvider = ({ children }) => {
  const [db, setDb] = useState(() => {
    const saved = localStorage.getItem('mytalipapa_db');
    return saved ? JSON.parse(saved) : INITIAL_DB;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('mytalipapa_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('mytalipapa_db', JSON.stringify(db));
  }, [db]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mytalipapa_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mytalipapa_user');
    }
  }, [currentUser]);

  // Authenticate user
  const loginUser = (usernameOrEmail, password) => {
    const user = db.users.find(
      u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'Invalid username or password' };
  };

  // Register a new user
  const registerUser = (name, username, email, phone, role, password) => {
    const userExists = db.users.some(u => u.username === username || u.email === email);
    if (userExists) {
      return { success: false, error: 'Username or Email already registered' };
    }

    const newUser = {
      id: db.users.length + 1,
      name,
      username,
      email,
      phone,
      role,
      password,
      address: '',
      status: 'active'
    };

    setDb(prev => ({
      ...prev,
      users: [...prev.users, newUser]
    }));
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  // Add a new stall (operator)
  const addStall = (id, section, size, rent, desc) => {
    const stallExists = db.stalls.some(s => s.id === id);
    if (stallExists) {
      return { success: false, error: 'Stall number already exists' };
    }

    const newStall = {
      id,
      section,
      size,
      rent: parseInt(rent) || 2500,
      status: 'available',
      renter: null,
      desc: desc || 'Market stall'
    };

    setDb(prev => ({
      ...prev,
      stalls: [...prev.stalls, newStall]
    }));
    return { success: true };
  };

  // Delete a stall (operator)
  const deleteStall = (id) => {
    setDb(prev => ({
      ...prev,
      stalls: prev.stalls.filter(s => s.id !== id)
    }));
    return { success: true };
  };

  // Submit rental application (renter)
  const submitApplication = (stallId, biz, msg) => {
    if (!currentUser) return { success: false, error: 'User not logged in' };

    const newApp = {
      id: db.applications.length + 1,
      applicant: currentUser.name,
      userId: currentUser.id,
      stallId,
      biz,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'pending',
      msg
    };

    setDb(prev => {
      // Set the stall status to reserved
      const updatedStalls = prev.stalls.map(s => {
        if (s.id === stallId && s.status === 'available') {
          return { ...s, status: 'reserved' };
        }
        return s;
      });

      return {
        ...prev,
        applications: [...prev.applications, newApp],
        stalls: updatedStalls
      };
    });

    return { success: true };
  };

  // Review rental application (operator)
  const reviewApplication = (appId, newStatus) => {
    const app = db.applications.find(a => a.id === appId);
    if (!app) return { success: false, error: 'Application not found' };

    setDb(prev => {
      // Update application status
      const updatedApps = prev.applications.map(a => (a.id === appId ? { ...a, status: newStatus } : a));

      // Update stall status and assignment if approved
      const updatedStalls = prev.stalls.map(s => {
        if (s.id === app.stallId) {
          if (newStatus === 'approved') {
            return { ...s, status: 'occupied', renter: app.applicant };
          } else if (newStatus === 'rejected') {
            return { ...s, status: 'available' };
          }
        }
        return s;
      });

      // Update the user details if approved to have a stallId
      const updatedUsers = prev.users.map(u => {
        if (u.name === app.applicant && newStatus === 'approved') {
          return { ...u, stallId: app.stallId };
        }
        return u;
      });

      // If approved, create a mock payment ledger item for renter
      const updatedPayments = [...prev.payments];
      if (newStatus === 'approved') {
        const stall = prev.stalls.find(s => s.id === app.stallId);
        updatedPayments.unshift({
          id: prev.payments.length + 1,
          renter: app.applicant,
          stallId: app.stallId,
          amount: stall ? stall.rent : 2500,
          due: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          paid: null,
          status: 'unpaid',
          month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        });
      }

      // Add notification for approved/rejected
      const newNotification = {
        id: prev.notifications.length + 1,
        icon: newStatus === 'approved' ? '📋' : '❌',
        bg: newStatus === 'approved' ? '#e8f5e9' : '#fce4ec',
        title: newStatus === 'approved' ? 'Application Approved' : 'Application Rejected',
        desc: newStatus === 'approved' ? `Your application for Stall ${app.stallId} has been approved!` : `Your application for Stall ${app.stallId} has been rejected.`,
        time: 'Just now',
        read: false
      };

      return {
        ...prev,
        applications: updatedApps,
        stalls: updatedStalls,
        users: updatedUsers,
        payments: updatedPayments,
        notifications: [newNotification, ...prev.notifications]
      };
    });

    // Update currentUser context if current active user is the applicant
    if (currentUser && currentUser.name === app.applicant && newStatus === 'approved') {
      setCurrentUser(prev => ({ ...prev, stallId: app.stallId }));
    }

    return { success: true };
  };

  // Submit maintenance request (renter or operator)
  const submitMaintenance = (issue, priority, desc) => {
    if (!currentUser) return { success: false, error: 'User not logged in' };

    const newMaint = {
      id: db.maintenance.length + 1,
      issue,
      location: currentUser.stallId || 'General',
      reporter: currentUser.name,
      priority,
      status: 'pending',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      desc
    };

    setDb(prev => ({
      ...prev,
      maintenance: [newMaint, ...prev.maintenance]
    }));
    return { success: true };
  };

  // Resolve maintenance issue (operator)
  const resolveMaintenance = (id) => {
    setDb(prev => ({
      ...prev,
      maintenance: prev.maintenance.map(m => (m.id === id ? { ...m, status: 'resolved' } : m))
    }));
    return { success: true };
  };

  // Post announcement (operator)
  const postAnnouncement = (title, category, priority, msg) => {
    const newAnn = {
      id: db.announcements.length + 1,
      title,
      category,
      priority,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      msg
    };

    const newNotification = {
      id: db.notifications.length + 1,
      icon: category === 'emergency' ? '🚨' : '📢',
      bg: category === 'emergency' ? '#fce4ec' : '#fff3cd',
      title: 'New Announcement',
      desc: title,
      time: 'Just now',
      read: false
    };

    setDb(prev => ({
      ...prev,
      announcements: [newAnn, ...prev.announcements],
      notifications: [newNotification, ...prev.notifications]
    }));
    return { success: true };
  };

  // Delete announcement (operator)
  const deleteAnnouncement = (id) => {
    setDb(prev => ({
      ...prev,
      announcements: prev.announcements.filter(a => a.id !== id)
    }));
    return { success: true };
  };

  // Update profile changes
  const updateProfile = (name, email, phone, address) => {
    if (!currentUser) return { success: false, error: 'User not logged in' };

    const updatedUser = {
      ...currentUser,
      name,
      email,
      phone,
      address
    };

    setDb(prev => ({
      ...prev,
      users: prev.users.map(u => (u.id === currentUser.id ? updatedUser : u))
    }));
    setCurrentUser(updatedUser);
    return { success: true };
  };

  // Mark all notifications as read
  const markNotificationsRead = () => {
    setDb(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  };

  // Mark single notification as read
  const markNotificationRead = (id) => {
    setDb(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => (n.id === id ? { ...n, read: true } : n))
    }));
  };

  return (
    <DbContext.Provider
      value={{
        db,
        currentUser,
        loginUser,
        registerUser,
        logoutUser,
        addStall,
        deleteStall,
        submitApplication,
        reviewApplication,
        submitMaintenance,
        resolveMaintenance,
        postAnnouncement,
        deleteAnnouncement,
        updateProfile,
        markNotificationsRead,
        markNotificationRead,
      }}
    >
      {children}
    </DbContext.Provider>
  );
};
