/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EventSlot {
  id: string;
  time: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  venue: string;
  duration: string;
  category: 'audio' | 'visual' | 'keynote' | 'experience' | 'hacking';
}

export interface TicketPass {
  id: string;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  limit: string;
  glowColor: string;
}

export interface BookingState {
  fullName: string;
  email: string;
  passType: string;
  quantity: number;
}


