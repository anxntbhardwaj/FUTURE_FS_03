/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  usernameLowercase: string;
  phoneCountryCode: string;
  phoneNumber: string;
  normalizedPhone: string;
  age: number;
  country: string;
  state: string;
  city: string;
  pincode: string;
  photoURL: string;
  role: 'user' | 'moderator' | 'company_owner' | 'developer';
  permissions: string[];
  accountStatus: 'active' | 'suspended';
  isBanned: boolean;
  banReason?: string;
  bannedBy?: string;
  bannedAt?: string;
  unbannedBy?: string;
  unbannedAt?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  consentGranted: boolean;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface TravelPackage {
  packageId: string;
  title: string;
  slug: string;
  startingPrice: number;
  shortDescription: string;
  fullDescription: string;
  destination: string;
  duration: string; // e.g. "7 Days, 6 Nights"
  itinerary: ItineraryDay[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  heroImage: string;
  galleryImages: string[];
  sceneType: 'himalayas' | 'desert' | 'lakes' | 'rainforest' | 'backwaters' | 'snow';
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type LeadStatus =
  | 'New'
  | 'Viewed'
  | 'Contacted'
  | 'In Discussion'
  | 'Quoted'
  | 'Follow-up Needed'
  | 'Converted'
  | 'Closed'
  | 'Cancelled'
  | 'Spam';

export interface TravelInquiry {
  inquiryId: string;
  userId: string;
  username: string;
  userEmail: string;
  fullName: string;
  phoneCountryCode: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  packageId: string;
  packageTitle: string;
  inquiryType: 'package' | 'custom_trip' | 'fleet' | 'bulk_corporate' | 'general_contact';
  selectedDate: string;
  guests: number;
  notes: string;
  customDetails?: {
    destinationType?: string;
    travelStyle?: string;
    vehicleSelected?: string;
    budgetRange?: string;
  };
  status: LeadStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  lastUpdatedBy?: string;
  sourcePage?: string;
  deviceType?: string;
}

export interface BanAppeal {
  appealId: string;
  userId: string;
  username: string;
  email: string;
  banReason: string;
  appealMessage: string;
  apologyMessage: string;
  status: 'pending' | 'under_review' | 'accepted' | 'rejected';
  reviewedBy?: string;
  reviewDecision?: string;
  reviewNote?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface AuditLog {
  logId: string;
  actorUid: string;
  actorUsername: string;
  actorEmail: string;
  actorRole: string;
  actionType: string; // e.g., "BAN_USER", "UPDATE_PRICE", "CREATE_PACKAGE"
  targetType: string;
  targetId: string;
  targetUsername?: string;
  description: string;
  metadata?: Record<string, any>;
  userAgent?: string;
  deviceType?: string;
  createdAt: string;
}

export interface SupportTicket {
  ticketId: string;
  userId: string;
  username: string;
  userEmail: string;
  subject: string;
  message: string;
  relatedPackageId?: string;
  relatedInquiryId?: string;
  status: 'Open' | 'Waiting for Team' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  replies?: Array<{
    replyId: string;
    actorEmail: string;
    actorRole: string;
    message: string;
    createdAt: string;
  }>;
}

export interface FleetOption {
  vehicleId: string;
  name: string;
  description: string;
  capacity: string;
  pricePerKm: number;
  image: string;
}

export interface Review {
  reviewId: string;
  userId: string;
  username: string;
  fullName: string;
  photoURL: string;
  rating: number;
  message: string;
  createdAt: string;
  updatedAt: string;
  attachedImage?: string;
}

