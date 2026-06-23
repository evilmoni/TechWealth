'use client';

import React, { useState } from 'react';
import AdminAccess from '../../../components/AdminAccess';

export default function AdminDashboardPage() {
  const [showAdmin, setShowAdmin] = useState(true);

  return (
    <>
      <AdminAccess onClose={() => setShowAdmin(false)} />
    </>
  );
}
