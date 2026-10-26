/**
 * OneDesk — Product Scope & Feature Configuration
 * Phase 0: Strict Scope Freeze for Free Production Launch
 * 
 * In this release:
 * - OneDesk is 100% FREE for all users (No billing/subscription paywalls).
 * - Audio/Video calling and WebRTC huddles are frozen to preserve $0 budget and prevent simulated/fake calls.
 * - Text chat, channel messaging, and direct messaging remain fully operational.
 */

export interface ProductFlagsConfig {
  billingEnabled: boolean;
  subscriptionsEnabled: boolean;
  audioCallsEnabled: boolean;
  videoCallsEnabled: boolean;
  editionName: string;
  isFreeCommunityEdition: boolean;
}

export const PRODUCT_FLAGS: ProductFlagsConfig = {
  billingEnabled: false,
  subscriptionsEnabled: false,
  audioCallsEnabled: false,
  videoCallsEnabled: false,
  editionName: 'OneDesk Free Community Edition',
  isFreeCommunityEdition: true,
};

export default PRODUCT_FLAGS;
