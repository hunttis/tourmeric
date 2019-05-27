import React from 'react';
import { AdminEventListContainer as AdminEventList } from './AdminEventList-container';

export const PublishedAdminEventList = () => (
  <AdminEventList published showNewEventButton={false} />
);
