import React from 'react';
import { AdminEventListContainer as AdminEventList } from './AdminEventList-container';

export const UnpublishedAdminEventList = () => (
  <AdminEventList published={false} showNewEventButton />
);
