# ONEDESK — COMPLETE FEATURE INVENTORY & FUNCTIONAL GUIDE

> **Author:** OneDesk Lead Engineering & Architecture Team  
> **Source Target:** Complete Codebase (`src/components/dashboard/*`, `src/services/*`, Supabase Migrations)  
> **Status:** Audited & Verified against PostgreSQL Migrations (Phases 1–4)

---

## ১. মডিউল: Workspace Management (ওয়ার্কস্পেস ব্যবস্থাপনা)

### ১.১ Workspace Creation & Switching
- **Feature Name:** Multi-Workspace Isolation & Switcher
- **Purpose:** একক ইউজারের অধীনে একাধিক পৃথক টিম বা ক্লায়েন্টের কাজের পরিবেশ আলাদা রাখা।
- **Why it Exists:** ফ্রিল্যান্সার বা এজেন্সিদের জন্য পার্সোনাল কাজ ও ক্লায়েন্ট প্রজেক্টকে সম্পূর্ণ আলাদা ডাটাবেস বাউন্ডারিতে রাখা আবশ্যক।
- **What Problem it Solves:** ডেটা মিক্সিং এবং ক্রস-কোম্পানি ইনফরমেশন লিক বন্ধ করে।
- **Who Uses It:** সমস্ত রেজিস্টার্ড ইউজার (স্পেশালি এজেন্সির মালিক ও টিম লিড)।
- **How it Works:** ইউজার নেম বা কাস্টম নামে ওয়ার্কস্পেস তৈরি হয়, যা পোস্টগ্রিসের `workspaces` টেবিলে ওনার আইডি সহ এন্ট্রি নেয়।
- **Available Actions:** ক্রিয়েট ওয়ার্কস্পেস, সুইচ ওয়ার্কস্পেস, ওয়ার্কস্পেস নেম এডিট।
- **Inputs Required:** ওয়ার্কস্পেস নাম (`name: string`)।
- **Outputs Generated:** নতুন ইউইউআইডি (`id: uuid`), ওনার অ্যাসাইনমেন্ট, রিফ্রেশড ওয়ার্কস্পেস স্টেট।
- **Relationship with Other Features:** সমস্ত টাস্ক, ডক, চ্যানেল এবং টাইম এন্ট্রি `workspace_id`-এর সাথে যুক্ত।
- **Data Storage Mechanism:** Supabase PostgreSQL `workspaces` ও `workspace_members` টেবিল।
- **Backend/API Dependencies:** `workspaceService.getUserWorkspaces()`, `workspaceService.createWorkspace()`।
- **User Permissions:** যেকোনো সাইনড-ইন ইউজার ওয়ার্কস্পেস বানাতে পারে। কেবলমাত্র ওনার বা অ্যাডমিন মেম্বারদের ইনভাইট দিতে পারে।
- **Current Implementation Status:** **FULLY IMPLEMENTED** (Phase 2 & 4 এ ভেরিফাইড)।
- **Known Limitations:** ফ্রি-টিয়ারে আনলিমিটেড ওয়ার্কস্পেস পারমিটেড হলেও ওয়ার্কস্পেস ডিলিটেশনে ক্যাস্কেডিং কনফার্মেশন প্রম্পট সীমিত।

---

## ২. মডিউল: Home & Inbox (হোম ড্যাশবোর্ড ও ইনবক্স)

### ২.১ Home Dashboard (Overview, LineUp & Agenda)
- **Feature Name:** Personal Command Center (`WorkspaceApp.tsx: Overview Mode`)
- **Purpose:** কর্মদিবসের শুরুতে ইউজারের প্রয়োজনীয় প্রায়োরিটি টাস্ক এবং শিডিউল একসাথে প্রদর্শন করা।
- **Why it Exists:** প্রতিদিন সকালে কাজে বসে "আমি আজ কী করব?" তা খুঁজতে সময় নষ্ট হওয়া রোধ করতে।
- **What Problem it Solves:** প্রায়োরিটি নির্ধারণে বিভ্রান্তি দূর করে এবং ডিউ-ডেট মিস হওয়া বন্ধ করে।
- **Who Uses It:** প্রতিটি সক্রিয় ব্যবহারকারী।
- **How it Works:** ডাটাবেস থেকে ইউজারের জন্য নির্ধারিত টাস্কগুলো ফেচ করে `LineUp` (হাই প্রায়োরিটি), `Recent Tasks`, এবং `Agenda`-তে রেন্ডার করে।
- **Available Actions:** টাস্ক কার্ড ওপেন, ড্র্যাগ-অ্যান্ড-ড্রপ স্ট্যাটাস পরিবর্তন, কুইক কমপ্লিট টিকমার্ক।
- **Inputs Required:** ইউজারের ইউনিক অথ সেশন (`user.id`)।
- **Outputs Generated:** ইন্টারেক্টিভ উইজেট গ্রিড, টাস্ক ডিটেইল প্যানেল।
- **Relationship with Other Features:** টাস্ক ডাটাবেস, ক্যালেন্ডার ইভেন্টস ও টাইম ট্র্যাকারের সাথে সরাসরি লিঙ্কড।
- **Data Storage Mechanism:** PostgreSQL `tasks` ও `planner_priorities` টেবিল।
- **Backend/API Dependencies:** `supabaseService.getTasks(userId)`।
- **User Permissions:** শুধুমাত্র ইউজারের নিজস্ব ও পাবলিক ওয়ার্কস্পেস টাস্ক দৃশ্যমান।
- **Current Implementation Status:** **FULLY IMPLEMENTED**।
- **Known Limitations:** উইজেট কাস্টমাইজেশন (কার্ড রি-অর্ডারিং) লোকালস্টেটে সাময়িক সংরক্ষিত।

### ২.২ Activity Inbox (Primary, Other, Later, Cleared)
- **Feature Name:** Centralized Notification Hub (`InboxView.tsx`)
- **Purpose:** প্ল্যাটফর্মে ঘটে যাওয়া সমস্ত অ্যাক্টিভিটি (টাস্ক অ্যাসাইন, ডেডলাইন চেঞ্জ, চ্যাট মেনশন) ট্র্যাক করা।
- **Why it Exists:** কাজের খবরাখবর যেন মিস না যায় এবং টিম কমিউনিকেশন সিনক্রোনাইজড থাকে।
- **What Problem it Solves:** একাধিক চ্যানেলে ছড়ানো তথ্যের মাঝে জরুরি নোটিফিকেশন হারিয়ে যাওয়া রোধ করে।
- **Who Uses It:** টিম মেম্বার ও প্রজেক্ট ম্যানেজার।
- **How it Works:** সিস্টেম ইভেন্ট ঘটলে `notifications` টেবিলে রো ইনসার্ট হয়। ইনবক্সে ট্যাব অনুযায়ী ফিল্টার (Primary, Other, Later, Cleared) হয়।
- **Available Actions:** মার্ক অ্যাজ রিড, মুভ টু লেটার, ক্লিয়ার অল, নোটিফিকেশন ফিল্টারিং।
- **Inputs Required:** ফিল্টার ট্যাব ক্লিক অথবা নোটিফিকেশন আইডি।
- **Outputs Generated:** রিড/আনরিড কাউন্টার ব্যাজ এবং নোটিফিকেশন লিস্ট।
- **Relationship with Other Features:** টাস্ক কমেন্টস, টিম চ্যাট ও ওয়ার্কস্পেস ইনভাইটের সাথে যুক্ত।
- **Data Storage Mechanism:** Supabase `notifications` টেবিল (Phase 3 মাইগ্রেশন)।
- **Backend/API Dependencies:** `supabaseService.getNotifications()`, `supabaseService.updateNotificationStatus()`।
- **User Permissions:** ইউজার শুধুমাত্র তার নিজের নোটিফিকেশন দেখতে এবং আপডেট করতে পারে (RLS এনফোর্সড)।
- **Current Implementation Status:** **FULLY IMPLEMENTED** (Phase 3 টেস্টে ভেরিফাইড)।
- **Known Limitations:** থার্ড-পার্টি পুশ নোটিফিকেশন (Browser Push API) এখনও সংযুক্ত নয়।

---

## ৩. মডিউল: Task Management (টাস্ক ব্যবস্থাপনা)

### ৩.১ Task CRUD & Lifecycle Management
- **Feature Name:** Enterprise Task Engine (`KanbanBoard.tsx`, `TaskListView.tsx`, `TaskDetailModal.tsx`)
- **Purpose:** প্রজেক্টের প্রতিটি স্বতন্ত্র কাজ তৈরি, অ্যাসাইন, অগ্রগতি ট্র্যাক এবং সম্পন্ন করা।
- **Why it Exists:** যে কোনো কাজের ডেলিভারি নিশ্চিত করতে সুনির্দিষ্ট ট্র্যাকিং অপরিহার্য।
- **What Problem it Solves:** টাস্কের ডেডলাইন মিস, কে দায়ী তা না জানা, এবং স্ট্যাটাস কনফিউশন পুরোপুরি দূর করে।
- **Who Uses It:** সকল প্রজেক্ট টিম, ম্যানেজার, ইঞ্জিনিয়ার ও ডিজাইনার।
- **How it Works:** 
  1. ইউজার "New Task" ক্লিক করে টাইটেল, প্রায়োরিটি, স্ট্যাটাস, ডিউ-ডেট ইনপুট দেয়।
  2. `supabaseService.createTask()` ক্লাউড ডাটাবেসে ভ্যালিড UUID সহ টাস্ক স্টোর করে।
  3. কানবান বোর্ডে ড্র্যাগ-অ্যান্ড-ড্রপ করলে স্ট্যাটাস (`TODO` -> `IN PROGRESS` -> `REVIEW` -> `COMPLETE`) স্বয়ংক্রিয়ভাবে ক্লাউডে প্যাচ হয়।
- **Available Actions:** ক্রিয়েট, এডিট, ভিউ ডিটেইলস, ডিলিট, প্রায়োরিটি পরিবর্তন, সাবটাস্ক অ্যাড, ফিল্টার বাই ট্যাগ/অ্যাসাইনি, সার্চ।
- **Inputs Required:** টাইটেল, স্ট্যাটাস, প্রায়োরিটি, অ্যাসাইনি, ডিউ ডেট, টাইম এস্টিমেট।
- **Outputs Generated:** কানবান কলাম আপডেট, লিস্ট রো আপডেট, ডিটেইল মডাল রেন্ডারিং, রিফ্রেশড মেজরমেন্ট।
- **Relationship with Other Features:** ক্যালেন্ডার (ডিউ ডেট), টাইমসheets (টাস্ক আওয়ার লগ), ড্যাশবোর্ড (মেট্রিক্স প্রগ্রেস)।
- **Data Storage Mechanism:** PostgreSQL `tasks` ও `subtasks` টেবিল।
- **Backend/API Dependencies:** `supabaseService.getTasks()`, `createTask()`, `updateTask()`, `deleteTask()`।
- **User Permissions:** মেম্বাররা টাস্ক ক্রিয়েট ও স্ট্যাটাস চেঞ্জ করতে পারে; অন্য ইউজারের প্রাইভেট টাস্কে ক্রস-ইউজার টেম্পারিং RLS দিয়ে ব্লকড।
- **Current Implementation Status:** **FULLY IMPLEMENTED & TESTED** (Phase 1 এর ৭টি টেস্টে উত্তীর্ণ)।
- **Known Limitations:** ফাইল অ্যাটাচমেন্ট বর্তমানে বাহ্যিক ইউআরএল লিঙ্কিং মোডে কাজ করে, ডিরেক্ট S3 আপলোড ড্রপজোন মেমোরিতে প্রিভিউ করে।

---

## ৪. মডিউল: Project Management & Spaces (প্রজেক্ট ও স্পেস)

### ৪.১ Spaces, Folders & Lists Hierarchy
- **Feature Name:** Multi-Level Work Organization (`SpacesOverviewView.tsx`)
- **Purpose:** জটিল প্রজেক্টগুলোকে হায়ারার্কিক্যাল কাঠামোতে (Space -> Folder -> List -> Task) বিন্যস্ত করা।
- **Why it Exists:** বড় বড় কোম্পানিতে শত শত টাস্ক একটি সমতল লিস্টে রাখলে বিশৃঙ্খলা সৃষ্টি হয়।
- **What Problem it Solves:** ডিপার্টমেন্ট অনুযায়ী (Engineering, Marketing, Sales) ডেটা সেগমেন্টেশন নিশ্চিত করে।
- **Who Uses It:** প্রজেক্ট ম্যানেজার ও টিম লিডার।
- **How it Works:** স্পেস তৈরি করে তার আন্ডারে ফোল্ডার এবং ফোল্ডারের ভেতর কাজের তালিকা রাখা যায়।
- **Available Actions:** স্পেস ক্রিয়েশন, ভিউ সুইচিং (বোর্ড/লিস্ট), কালার কোডিং, মেম্বার পারমিশন।
- **Inputs Required:** স্পেস নেম, স্পেস ডেসক্রিপশন, আইকন কালার।
- **Outputs Generated:** সাইডবারে ডায়নামিক স্পেস লিস্ট এবং স্পেস ওভারভিউ ড্যাশবোর্ড।
- **Relationship with Other Features:** টাস্ক এবং ডক সরাসরি নির্দিষ্ট স্পেসের অধীনে থাকে।
- **Data Storage Mechanism:** ক্লাউড টাস্ক স্কিমাতে স্পেস ফিল্ড এবং লোকাল সেশন নেস্টেড রিলেশন।
- **Backend/API Dependencies:** `supabaseService.getTasks()` এর মাধ্যমে স্পেস ওয়াইজ গ্রুপ ফিল্টারিং।
- **Current Implementation Status:** **PARTIALLY IMPLEMENTED** (UI ও স্পেস ফিল্টারিং বাস্তবায়িত, ফোল্ডার-লেভেল মেটাডাটা স্কিমা লোকাল-স্টেট সমৃদ্ধ)।
- **Known Limitations:** ডীপলি নেস্টেড ফোল্ডার পারমিশন রুলস ডেডিকেটেড পোস্টগ্রিস রিলেশনে রূপান্তরের অপেক্ষায়।

---

## ৫. মডিউল: Planner & Calendar (প্ল্যানার ও ক্যালেন্ডার)

### ৫.১ Time-Blocking & Meeting Scheduler
- **Feature Name:** Visual Schedule & Google Meet Planner (`PlannerView.tsx`)
- **Purpose:** দিনের কাজের সময় নির্ধারণ এবং গুগল মিট ও মিটিং শিডিউলিং।
- **Why it Exists:** কাজের ডেডলাইন থাকলেও নির্দিষ্ট সময়ে কাজ বাস্তবায়নের টাইম-ব্লকিং না করলে প্রডাক্টিভিটি কমে যায়।
- **What Problem it Solves:** ক্যালেন্ডার এবং টাস্ক ম্যানেজারের মধ্যকার বিভাজন দূর করে।
- **Who Uses It:** এক্সিকিউটিভ, টিম লিড এবং সক্রিয় মেম্বারগণ।
- **How it Works:** ক্যালেন্ডারের নির্দিষ্ট টাইমস্লটে ক্লিক করে গুগল মিট লিঙ্ক বা ইন্টারনাল ইভেন্ট যোগ করা যায়।
- **Available Actions:** ক্রিয়েট ইভেন্ট, ড্র্যাগ টাইমব্লক, মিট ইউআরএল যুক্তকরণ, ডিলিট ইভেন্ট।
- **Inputs Required:** ইভেন্ট টাইটেল, স্টার্ট টাইম, এন্ড টাইম, মিট ইউআরএল।
- **Outputs Generated:** ভিজ্যুয়াল টাইম ব্লকস, গুগল ক্যালেন্ডার সিঙ্ক স্টেট।
- **Relationship with Other Features:** টাস্ক ডিউ ডেট এবং পার্সোনাল এজেন্ডার সাথে সংযুক্ত।
- **Data Storage Mechanism:** PostgreSQL `calendar_events` টেবিল (Phase 3)।
- **Backend/API Dependencies:** `supabaseService.saveCalendarEvent()`, `getCalendarEvents()`, `deleteCalendarEvent()`।
- **User Permissions:** ইউজার শুধুমাত্র নিজের শিডিউল ও অনুমোদিত টিম ক্যালেন্ডার এডিট করতে পারে (RLS এনফোর্সড)।
- **Current Implementation Status:** **FULLY IMPLEMENTED & TESTED** (Phase 3 Test 1 ভেরিফাইড)।
- **Known Limitations:** গুগল ক্যালেন্ডারের সাথে দ্বি-মুখী (Two-way OAuth Sync) ব্যাকগ্রাউন্ড ক্রন জব ভবিষ্যতের জন্য শিডিউল করা।

---

## ৬. মডিউল: Teams & Collaboration (টিম ও কোলাবোরেশন)

### ৬.১ Workspace Members & Invitation Tokens
- **Feature Name:** Cryptographic Workspace Inviter (`TeamsView.tsx`, `InviteModal.tsx`, `JoinWorkspacePage.tsx`)
- **Purpose:** টিমের নতুন মেম্বারদের নিরাপদ ক্রিপ্টোগ্রাফিক লিংকের মাধ্যমে ওয়ার্কস্পেসে যুক্ত করা।
- **Why it Exists:** ফ্রি টায়ারে থার্ড-পার্টি কাস্টম SMTP মেইল সার্ভার ছাড়া ইনস্ট্যান্ট মেম্বার ইনভাইট সম্পন্ন করার জন্য।
- **What Problem it Solves:** ইমেইল ডেলিভারিবিলিটি ফেইলিউর বা ভেরিফিকেশন কোডের ঝামেলা দূর করে ১-ক্লিকে অনবোর্ডিং নিশ্চিত করে।
- **Who Uses It:** ওয়ার্কস্পেস ওনার এবং অ্যাডমিনগণ।
- **How it Works:** 
  1. অ্যাডমিন ইমেইল ও রোল সিলেক্ট করে "Generate Invite Link" চাপলে একটি ইউনিক টোকেন সহ URL তৈরি হয় (`/join?token=...`)।
  2. নতুন ইউজার এই লিংকে ভিজিট করলে `workspaceService.acceptInvitation()` কল হয় এবং তিনি স্বয়ংক্রিয়ভাবে ওয়ার্কস্পেসে মেম্বার হিসেবে অ্যাড হন।
- **Available Actions:** ইনভাইটেশন জেনারেশন, রোল অ্যাসাইনমেন্ট (Admin, Member, Guest), মেম্বার লিস্ট ভিউ, ইনভাইটেশন রিভোক।
- **Inputs Required:** প্রাপকের ইমেইল এবং নির্বাচিত রোল।
- **Outputs Generated:** ক্রিপ্টোগ্রাফিক ইনভাইটেশন লিঙ্ক, মেম্বার রো পোস্টগ্রিস ইনসার্ট।
- **Relationship with Other Features:** সমস্ত প্রাইভেট স্পেস, চ্যানেল ও টাস্ক পারমিশন মেম্বারশিপের ওপর নির্ভরশীল।
- **Data Storage Mechanism:** PostgreSQL `workspace_invitations` ও `workspace_members`।
- **Backend/API Dependencies:** `workspaceService.createInvitation()`, `acceptInvitation()`।
- **User Permissions:** কেবলমাত্র ওনার/অ্যাডমিন ইনভাইট জেনারেট করতে পারেন; সাধারণ মেম্বাররা প্রিভিলেজ এসকেলেশন করতে পারে না (RLS ব্লকিং টেস্টে প্রমাণিত)।
- **Current Implementation Status:** **FULLY IMPLEMENTED & TESTED** (Phase 2 Test 3 & Phase 4 Audit 3 উত্তীর্ণ)।
- **Known Limitations:** ইনভাইট লিঙ্ক কপি করে পাঠাতে হয়; ডিরেক্ট ইন-অ্যাপ ইমেইল সেন্ডিং ফ্রি টায়ারের রেট-লিমিটের কারণে লিঙ্ক ভিত্তিক রাখা হয়েছে।

---

## ৭. মডিউল: Chat, Channels & Direct Messages (রিয়েল-টাইম চ্যাট)

### ৭.১ Channel Messaging & Realtime Broadcasts
- **Feature Name:** Supabase Realtime Channel Engine (`ChannelChatView.tsx`, `ChatLaunchpadView.tsx`)
- **Purpose:** টিমের অভ্যন্তরীণ আলোচনা ও তাৎক্ষণিক মতামত আদান-প্রদান।
- **Why it Exists:** আলাদা স্ল্যাক বা ডিসকর্ড উইন্ডো ছাড়াই কাজের স্থানেই কথা বলা নিশ্চিত করতে।
- **What Problem it Solves:** কাজের ডিসকাশন চ্যাটে হারিয়ে যাওয়া বন্ধ করে।
- **Who Uses It:** পুরো টিম।
- **How it Works:** পোস্টগ্রিসের `chat_messages` টেবিলে মেসেজ স্টোর হয় এবং সুপাবেসের WebSocket রিয়েল-টাইম ব্রডকাস্টের মাধ্যমে অন্য সকল অনলাইন মেম্বারের স্ক্রিনে তৎক্ষণাৎ পপ-আপ করে।
- **Available Actions:** সেন্ড মেসেজ, ইমোজি রিঅ্যাকশন, রিপ্লাই থ্রেড, কুইক কোড ব্লকিং।
- **Inputs Required:** টেক্সট মেসেজ, চ্যানেল কি (`#general`, `#welcome`, ইত্যাদি)।
- **Outputs Generated:** লাইভ মেসেজ ফিড, প্রেরকের অ্যাভাটার ও রোল আইডেন্টিটি।
- **Relationship with Other Features:** চ্যানেল থেকে সরাসরি টাস্ক ডিসকাশন লিঙ্কিং।
- **Data Storage Mechanism:** PostgreSQL `chat_messages` ও `channels` টেবিল।
- **Backend/API Dependencies:** `supabaseService.sendChatMessage()`, `getChatMessages()`, `subscribeToChat()`।
- **User Permissions:** ওয়ার্কস্পেসের যে কোনো অথেনটিকেটেড মেম্বার চ্যানেলে মেসেজ পাঠাতে পারে।
- **Current Implementation Status:** **FULLY IMPLEMENTED & TESTED** (Phase 2 Test 4 & 5 উত্তীর্ণ)।
- **Known Limitations:** ভয়েস মেসেজ ও লাইভ ভিডিও কলিং ফ্রেমওয়ার্ক স্টাব অবস্থায় রয়েছে।

---

## ৮. মডিউল: Dashboard & Analytics (ড্যাশবোর্ড ও অ্যানালিটিক্স)

### ৮.১ Real Data Metric Aggregation
- **Feature Name:** Mathematical Productivity Analytics Hub (`DashboardHubView.tsx`)
- **Purpose:** প্রজেক্টের সঠিক অগ্রগতি, সম্পন্ন টাস্কের হার এবং টিমের কর্মদক্ষতা পরিমাপ করা।
- **Why it Exists:** অনুমান নির্ভর কাজ বন্ধ করে ডেটা-ড্রিভেন সিদ্ধান্ত নিতে।
- **What Problem it Solves:** প্রজেক্ট পিছিয়ে আছে কিনা তা সময়মতো বুঝতে না পারার সমস্যা দূর করে।
- **Who Uses It:** টিম লিডার, প্রজেক্ট ম্যানেজার এবং ক্লায়েন্টগণ।
- **How it Works:** পোস্টগ্রিস ডাটাবেসের টাস্ক স্ট্যাটাস ফিল্ড থেকে সরাসরি ক্যালকুলেশন করে:  
  `Completion Rate (%) = (Completed Tasks / Total Tasks) * 100`।
- **Available Actions:** ম্যাট্রিক্স ফিল্টারিং, স্ট্যাটাস রেশিও পাই-চার্ট ভিউ, টিম ভেলোসিটি গ্রাফ।
- **Inputs Required:** ডাটাবেস টাস্ক রেকর্ডস।
- **Outputs Generated:** রিয়েল পার্সেন্টেজ, টাস্ক সম্পন্নতার সংখ্যা, ইন-প্রোগ্রেস রেশিও (জিরো ফেক ডেটা)।
- **Relationship with Other Features:** টাস্ক ইঞ্জিন ও টাইমশিটের সাথে সরাসরি সংযুক্ত।
- **Data Storage Mechanism:** পোস্টগ্রিস `tasks` ও `time_entries` থেকে রিয়েল-টাইম অ্যাগ্রিগেশন।
- **Backend/API Dependencies:** `supabaseService.getTasks()`।
- **Current Implementation Status:** **FULLY IMPLEMENTED & TESTED** (Phase 3 Test 6 এ ১০০% বাস্তব ম্যাথমেটিক্যাল ক্যালকুলেশন ভেরিফাইড)।
- **Known Limitations:** কাস্টম BI কোয়েরি এক্সপোর্ট (যেমন CSV বা PDF রিপোর্ট জেনারেটর) লোকাল ব্রাউজার প্রিন্ট ফরম্যাটে সীমাবদ্ধ।

---

## ৯. মডিউল: Whiteboard (হোয়াইটবোর্ড ও ব্রেনস্টর্মিং)

### ৯.১ Vector Canvas & Node Architect
- **Feature Name:** Cloud-Persisted Interactive Canvas (`WhiteboardView.tsx`)
- **Purpose:** সিস্টেম আর্কিটেকচার, ইউজার ফ্লো, মাইন্ডম্যাপ এবং ভিজ্যুয়াল ব্রেনস্টর্মিং করা।
- **Why it Exists:** জটিল সফটওয়্যার আর্কিটেকচার বা প্রজেক্ট ফ্লো শুধুমাত্র টেক্সট দিয়ে বোঝানো সম্ভব নয়।
- **What Problem it Solves:** Miro বা Figma-এর মতো বাহ্যিক অ্যাপে বারবার যাওয়ার ঝামেলা দূর করে।
- **Who Uses It:** সফটওয়্যার আর্কিটেক্ট, ইউআই/ইউএক্স ডিজাইনার এবং প্রোডাক্ট ম্যানেজার।
- **How it Works:** ক্যানভাসে ড্রয়িং, টেক্সট বক্স, রেকট্যাঙ্গেল বা কানেক্টর যুক্ত করলে তা JSON ভেক্টর ফরম্যাটে ক্লাউডে সংরক্ষিত হয়।
- **Available Actions:** ড্রয়িং, পেন টুল, ইরেজার, শেপস (Rectangle, Circle), টেক্সট, ক্যানভাস জুম/প্যান, অটো-সেভ।
- **Inputs Required:** মাউস ড্র্যাগ/ক্লিক ইভেন্ট, কালার প্যালেট সিলেকশন।
- **Outputs Generated:** ভেক্টর নোডস গ্রিড, ক্লাউড অটো-সেভ নোটিফিকেশন।
- **Relationship with Other Features:** স্পেস এবং ডকুমেন্টের সাথে লিঙ্ক করার সুযোগ।
- **Data Storage Mechanism:** PostgreSQL `whiteboards` টেবিল (JSONB ডেটা কলাম সহ)।
- **Backend/API Dependencies:** `supabaseService.saveWhiteboard()`, `getWhiteboards()`।
- **User Permissions:** ওয়ার্কস্পেসের মেম্বারগণ ক্যানভাস ভিউ ও এডিট করতে পারে।
- **Current Implementation Status:** **FULLY IMPLEMENTED & TESTED** (Phase 2 Test 7 উত্তীর্ণ)।
- **Known Limitations:** মাল্টি-কার্সর লাইভ কো-ড্রয়িং (একই সাথে দুজন ইউজারের মাউস পয়েন্টার দেখা) অপশনাল পোলিং মোডে কাজ করে।

---

## ১০. মডিউল: Timesheets & Time Tracking (টাইম ট্র্যাকিং)

### ১০.১ Live Stopwatches & Billable Entry Ledger
- **Feature Name:** Granular Time Ledger & Approvals (`TimesheetView.tsx`)
- **Purpose:** কাজের সঠিক সময় রেকর্ড রাখা এবং ক্লায়েন্টের জন্য বিলিং আওয়ার হিসাব করা।
- **Why it Exists:** ফ্রিল্যান্সিং ও এজেন্সিতে কত ঘণ্টা কাজ হয়েছে তার প্রমাণ ও স্বচ্ছতা বজায় রাখতে।
- **What Problem it Solves:** ক্লায়েন্টের সাথে কাজের সময় নিয়ে বিতর্ক এবং আন্ডার-বিলিং সমস্যা রোধ করে।
- **Who Uses It:** ডেভেলপার, ডিজাইনার, কনসালট্যান্ট এবং অ্যাকাউন্টস ম্যানেজার।
- **How it Works:** লাইভ টাইমার চালু করে কাজ করা যায় অথবা অতীতের কাজের জন্য ম্যানুয়াল টাইম লগ (যেমন: 7,200 সেকেন্ড = ২ ঘণ্টা) সাবমিট করা যায়।
- **Available Actions:** স্টার্ট/স্টপ লাইভ টাইমার, ম্যানুয়াল টাইম লগ, বিলযোগ্য (Billable) ফ্ল্যাগ সেট, ডিলিট এন্ট্রি।
- **Inputs Required:** টাস্ক আইডি, সময়কাল (Duration in seconds), ডেসক্রিপশন, বিলযোগ্য স্ট্যাটাস।
- **Outputs Generated:** টাইমশিট ক্যালেন্ডার গ্রিড, টোটাল আওয়ার্স সামারি, উইকলি লগ লিস্ট।
- **Relationship with Other Features:** সরাসরি নির্দিষ্ট `task_id` এবং প্রজেক্টের সাথে যুক্ত।
- **Data Storage Mechanism:** PostgreSQL `time_entries` ও `timesheet_approvals` (Phase 3)।
- **Backend/API Dependencies:** `supabaseService.saveTimeEntry()`, `getTimeEntries()`, `deleteTimeEntry()`।
- **User Permissions:** মেম্বার নিজের এন্ট্রি লগ করতে পারে; ম্যানেজাররা অ্যাপ্রুভাল দিতে পারেন।
- **Current Implementation Status:** **FULLY IMPLEMENTED & TESTED** (Phase 3 Test 3 উত্তীর্ণ)।
- **Known Limitations:** ক্লায়েন্ট ইনভয়েস অটো-জেনারেটর (PDF Invoice) এখনও বিল্ডার টুলে রূপান্তর করা হয়নি।

---

## ১১. মডিউল: Docs & Knowledge Management (ডকুমেন্টেশন)

### ১১.১ Rich Text Document Creator
- **Feature Name:** Cloud Knowledge Base (`DocsView.tsx`)
- **Purpose:** প্রজেক্ট রিকোয়ারমেন্ট, এপিআই স্পেসিফিকেশন এবং কোম্পানির SOP সংরক্ষণ করা।
- **Why it Exists:** কোডের পাশাপাশি নলেজ শেয়ারিং ও ডকুমেন্টেশন একই জায়গায় না থাকলে নলেজ গ্যাপ তৈরি হয়।
- **What Problem it Solves:** গুগল ড্রাইভের বিভিন্ন ফোল্ডারে ডকুমেন্ট হারিয়ে যাওয়া রোধ করে।
- **Who Uses It:** টেকনিক্যাল রাইটার, ডেভেলপার এবং প্রোডাক্ট টিম।
- **How it Works:** হেডিং, বোল্ড, ইটালিক, কোড ব্লক এবং বুলেট লিস্ট সহ ড্রাফটিং করা যায় যা সুপাবেসে অটো-সেভ হয়।
- **Available Actions:** ক্রিয়েট ডক, এডিট টাইটেল ও কনটেন্ট, ডিলিট, সার্চ ডকস, অটো-সেভ।
- **Inputs Required:** ডকুমেন্ট টাইটেল এবং টেক্সট কনটেন্ট।
- **Outputs Generated:** ফরম্যাটেড রিচ-টেক্সট ডকুমেন্ট ও সেভ স্ট্যাটাস ইন্ডিকেটর।
- **Relationship with Other Features:** স্পেসের সাথে লিঙ্কড এবং গ্লোবাল সার্চে ইনডেক্সড।
- **Data Storage Mechanism:** PostgreSQL `docs` টেবিল।
- **Backend/API Dependencies:** `supabaseService.saveDoc()`, `getDocs()`, `deleteDoc()`।
- **User Permissions:** অথেনটিকেটেড ইউজার ডক তৈরি ও এডিট করতে পারে (পোস্টগ্রিস RLS সিকিউরড)।
- **Current Implementation Status:** **FULLY IMPLEMENTED & TESTED** (Phase 2 Test 6 উত্তীর্ণ)।
- **Known Limitations:** গুগল ডকসের মতো রিয়েল-টাইম ক্যারেক্টার-লেভেল কো-এডিটিং (OT/CRDT) এর বদলে ফাস্ট-অটোসেভ আর্কিটেকচার ব্যবহৃত।

---

## ১২. মডিউল: Forms (ফর্ম বিল্ডার ও সাবমিশন)

### ১২.১ Public Lead & Client Requirement Intake
- **Feature Name:** Dynamic Form Generator (`FormsView.tsx`)
- **Purpose:** ক্লায়েন্ট ফিডব্যাক, সাপোর্ট টিকেট, বা কাজের রিকোয়ারমেন্ট সংগ্রহের জন্য পাবলিক ফর্ম তৈরি।
- **Why it Exists:** বাইরের কোনো ক্লায়েন্টকে ওয়ানডেস্কের অ্যাকাউন্ট ছাড়াই তথ্য সাবমিট করতে দেওয়ার জন্য।
- **What Problem it Solves:** গুগল ফর্ম বা টাইপফর্মের জন্য আলাদা টাকা খরচ করার প্রয়োজন শেষ করে।
- **Who Uses It:** প্রোডাক্ট ম্যানেজার, কাস্টমার সাপোর্ট এবং সেলস টিম।
- **How it Works:** অ্যাডমিন ড্র্যাগ করে টেক্সট, ড্রপডাউন বা রেটিং ফিল্ড যুক্ত করে ফর্ম প্রকাশ করেন। বাইরের ইউজাররা পাবলিকলি রেসপন্স সাবমিট করতে পারে।
- **Available Actions:** ফর্ম ফিল্ড ক্রিয়েশন, প্রিভিউ মোড, পাবলিক সাবমিশন, রেসপন্স ভিউয়ার।
- **Inputs Required:** ফর্ম টাইটেল, ফিল্ড কনফিগারেশন JSONB, সাবমিশন আনসার।
- **Outputs Generated:** ইউনিক ফর্ম আইডি, সাবমিশন রেকর্ডস ও রেসপন্স লিস্ট।
- **Relationship with Other Features:** সাবমিশন থেকে স্বয়ংক্রিয়ভাবে নতুন টাস্ক তৈরি করা সম্ভব।
- **Data Storage Mechanism:** PostgreSQL `forms` ও `form_submissions` টেবিল (Phase 3 RLS)।
- **Backend/API Dependencies:** `supabaseService.saveForm()`, `submitFormResponse()`, `getForms()`।
- **User Permissions:** যে কেউ রেসপন্স সাবমিট করতে পারে (পাবলিক ইনসার্ট), কিন্তু সাবমিশন ডেটা শুধুমাত্র ফর্ম ক্রিয়েটর দেখতে পারে।
- **Current Implementation Status:** **FULLY IMPLEMENTED & TESTED** (Phase 3 Test 4 & Phase 4 Audit 5 উত্তীর্ণ)।
- **Known Limitations:** মাল্টি-পেজ কন্ডিশনাল লজিক ব্রাঞ্চিং (Skip logic) প্রাথমিক ভার্সনে অনুপস্থিত।

---

## ১৩. মডিউল: Goals & Targets (কৌশলগত লক্ষ্যমাত্রা)

### ১৩.১ OKRs & Progress Tracking
- **Feature Name:** Strategic Milestone Tracker (`GoalsView.tsx`)
- **Purpose:** টিমের দীর্ঘমেয়াদী কোয়ার্টারলি গোল এবং কি-রেজাল্ট (OKRs) পরিচালনা করা।
- **Why it Exists:** প্রতিদিনের ছোট কাজের ভিড়ে টিমের চূড়ান্ত স্ট্র্যাটেজিক ভিশন যাতে হারিয়ে না যায়।
- **What Problem it Solves:** প্রজেক্ট শেষ হলেও কোম্পানির বিজনেস অবজেক্টিভ পূর্ণ হলো কিনা তা মনিটর করা যায়।
- **Who Uses It:** সি-লেভেল এক্সিকিউটিভ, ফাউন্ডার এবং প্রজেক্ট ডিরেক্টর।
- **How it Works:** একটি গোল তৈরি করে তার আন্ডারে নিউমেরিক বা পার্সেন্টেজ টার্গেট যুক্ত করা হয় (যেমন: 75% প্রগ্রেস)।
- **Available Actions:** ক্রিয়েট গোল, অ্যাড টার্গেট, প্রগ্রেস ভ্যালু আপডেট, গোল কমপ্লিশন ব্যাজ।
- **Inputs Required:** গোলের নাম, ডিউ ডেট, টার্গেট মেজারমেন্ট টাইপ (Currency, Percentage, Number)।
- **Outputs Generated:** ভিজ্যুয়াল প্রগ্রেস বার, এচিভমেন্ট হিস্ট্রি।
- **Relationship with Other Features:** টাস্কের অগ্রগতির সাথে গোলের প্রগ্রেস লিংক করা যায়।
- **Data Storage Mechanism:** PostgreSQL `goals` ও `goal_targets` টেবিল (Phase 3)।
- **Backend/API Dependencies:** `supabaseService.saveGoal()`, `getGoals()`, `deleteGoal()`।
- **User Permissions:** ওয়ার্কস্পেসের মেম্বাররা গোল দেখতে পারে, ওনার/অ্যাডমিন এডিট করতে পারে।
- **Current Implementation Status:** **FULLY IMPLEMENTED & TESTED** (Phase 3 Test 5 উত্তীর্ণ)।
- **Known Limitations:** স্বয়ংক্রিয় টাস্ক কমপ্লিশন থেকে ফর্মুলা-ড্রিভেন ডাইনামিক গোল ক্যালকুলেশন বর্তমানে ম্যানুয়াল প্রগ্রেস আপডেটে সিঙ্কড।

---

## ১৪. মডিউল: AI Features (ClickUp Brain & Agents)

### ১৪.১ ClickUp Brain & BYOK Architecture
- **Feature Name:** Autonomous Workspace Intelligence (`ClickUpBrainView.tsx`, `AiAgentsView.tsx`)
- **Purpose:** কাজের সারাংশ তৈরি, টাস্কের রিকোয়ারমেন্ট ড্রাফটিং এবং কোডিং সহায়তা।
- **Why it Exists:** পুনরাবৃত্তিমূলক লেখালেখি ও প্ল্যানিংয়ে সময় সাশ্রয় করতে।
- **What Problem it Solves:** রাইটার্স ব্লক দূর করে এবং টিমের জন্য স্মার্ট অ্যাসিস্ট্যান্ট হিসেবে কাজ করে।
- **Who Uses It:** যেকোনো ইউজার।
- **How it Works:** 
  1. **BYOK (Bring Your Own Key) মোড:** ইউজার তার নিজস্ব OpenAI (GPT-4o), Google Gemini (Gemini 2.0 Flash), Groq বা Anthropic এপিআই কি ইনপুট দিলে সিস্টেম রিয়েল এপিআই দিয়ে সক্রিয় টাস্কের কনটেক্সট পাঠিয়ে উত্তর এনে দেয়।
  2. **জিরো-কনফিগ ডিটারমিনিস্টিক মোড:** এপিআই কি না থাকলে ওয়ানডেস্কের লোকাল ইন্টেলিজেন্স ইঞ্জিন সক্রিয় টাস্ক ও ওয়ার্কস্পেস ডেটাবেস বিশ্লেষণ করে স্মার্ট অ্যাকশনেবল সামারি প্রদান করে।
- **Available Actions:** চ্যাট উইথ ব্রেন, ড্রাফট টাস্ক, সামারাইজ অ্যাক্টিভিটি, এপিআই কি ভ্যালিডেশন অ্যান্ড সুইচিং।
- **Inputs Required:** প্রম্পট কোয়েরি, অপশনাল এপিআই কি।
- **Outputs Generated:** মার্কডাউন রেসপন্স, কোড ব্লক, জেনারেটেড সাবটাস্কস।
- **Relationship with Other Features:** সরাসরি টাস্ক ও ডকের সাথে ডেটা কনটেক্সট আদান-প্রদান করে।
- **Data Storage Mechanism:** এপিআই কি লোকাল সেশনে সুরক্ষিত থাকে (ক্লাউডে এক্সপোজ হয় না), হিস্ট্রি সেশন মেমোরিতে থাকে।
- **Backend/API Dependencies:** OpenAI API, Google Gemini API, Groq Cloud API, অথবা ইন্টারনাল রুল ইঞ্জিন।
- **Current Implementation Status:** **FULLY IMPLEMENTED** (লাইভ এপিআই কানেক্টিভিটি টেস্টেড ও ভেরিফাইড)।
- **Known Limitations:** ব্রাউজার ব্যাকগ্রাউন্ডে স্বাধীনভাবে ডিসিশন নিয়ে ডাটাবেস পরিবর্তনকারী "অটোনোমাস সেলফ-রানিং বট" ফ্রেমওয়ার্ক স্টাব অবস্থায় রয়েছে।

---

## ১৫. মডিউল: Search & Productivity Tools (সার্চ ও টুলস)

### ১৫.১ Multi-Entity Global Search
- **Feature Name:** Unified Omnisearch (`WorkspaceApp.tsx`, `supabaseService.ts`)
- **Purpose:** এক ক্লিকে প্ল্যাটফর্মের সব ডেটা থেকে প্রয়োজনীয় তথ্য খুঁজে বের করা।
- **How it Works:** কি-ওয়ার্ড টাইপ করলে পোস্টগ্রিসের `tasks`, `docs` এবং `channels` টেবিলে একসাথে সার্চ কোয়েরি চলে এবং ক্যাটাগরি ওয়াইজ রেজাল্ট দেখায়।
- **Implementation Status:** **FULLY IMPLEMENTED & TESTED** (Phase 3 Test 7 উত্তীর্ণ)।

---

## ১৬. মডিউল: Account & Settings (অ্যাকাউন্ট ও সিকিউরিটি)

### ১৬.১ Authentication & Profile Management
- **Feature Name:** Production Auth & Role Enforcement (`AuthContext.tsx`, `LoginPage.tsx`, `SignupPage.tsx`, `ProfileToolsModal.tsx`)
- **How it Works:** Supabase Email/Password অথেনটিকেশন, সেশন পারসিস্টেন্স এবং ইউজার প্রোফাইল আরএলএস দিয়ে সুরক্ষিত।
- **Implementation Status:** **FULLY IMPLEMENTED & TESTED** (Phase 4 Security Audits 1–8 উত্তীর্ণ)।

---

## ১৭. মডিউল: Other Features (অন্যান্য সুবিধাসমূহ)

- **ClipsView (`ClipsView.tsx`):** স্ক্রিন রেকর্ডিং ও ভিডিও ক্লিপস প্রিভিউ (সুপাবেস `clips` টেবিলে স্টোরেজ সাপোর্টেড)।
- **AppCenter (`AppCenterModal.tsx`):** থার্ড-পার্টি ইন্টিগ্রেশন ডিরেক্টরি (গুগল ক্যালেন্ডার, স্ল্যাক, গিটহাব)। স্ট্যাটাস প্রদর্শনে কার্যকরী।
- **ConfettiCelebration (`ConfettiCelebration.tsx`):** টাস্ক সম্পন্ন হলে বা ইমেইল ভেরিফাই হলে স্ক্রিনে ক্যানভাস কনফেটি স্পার্কল এনিমেশন।
- **UpgradeModal (`UpgradeModal.tsx`):** প্রিমিয়াম ClickUp 3.0 টিয়ার প্রদর্শনকারী ইন্টারফেস (বর্তমানে UI Showcase)।
