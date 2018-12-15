import React from 'react';
import AdminEventList from './AdminEventList-container';

export const UnpublishedAdminEventList = () => (
  <AdminEventList published={false} showNewEventButton />
);
