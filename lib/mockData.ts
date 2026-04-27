import type { ChartPoint, DashboardStats } from "@/types/Dashboard";
import type { ChatMessage, ChatMessagesResult, ChatSummary } from "@/types/Chat";
import type { Shipment } from "@/types/Shipment";
import type { User } from "@/types/User";

type MockShipmentStatus = "pending" | "in_transit" | "delivered" | "cancelled";

type MockShipmentSeed = Omit<Shipment, "status" | "events"> & {
  status: MockShipmentStatus;
  events: Array<{
    _id: string;
    status: string;
    location: string;
    date: string;
    time: string;
    completed?: boolean;
    current?: boolean;
  }>;
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function toDisplayShipmentStatus(status: MockShipmentStatus) {
  switch (status) {
    case "pending":
      return "Processing";
    case "in_transit":
      return "In Transit";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return "Processing";
  }
}

const shipmentSeeds: MockShipmentSeed[] = [
  {
    _id: "shp_20481",
    id: "shp_20481",
    trackingNumber: "SP-20481",
    from: "Cairo",
    to: "Dubai",
    status: "in_transit",
    progress: 62,
    currentLocation: "Riyadh",
    estimatedDelivery: "2025-04-30T16:00:00.000Z",
    weight: "12.4 kg",
    dimensions: "48 x 32 x 26 cm",
    courier: { _id: "cr_01", id: "cr_01", name: "DHL Express", price: 420, deliveryTime: "Apr 30, 2025" },
    createdAt: "2025-04-24T08:30:00.000Z",
    updatedAt: "2025-04-27T09:10:00.000Z",
    events: [
      { _id: "evt_20481_1", status: "Order confirmed", location: "Cairo", date: "Apr 24, 2025", time: "10:30 AM", completed: true },
      { _id: "evt_20481_2", status: "Departed facility", location: "Cairo", date: "Apr 25, 2025", time: "06:15 AM", completed: true },
      { _id: "evt_20481_3", status: "Customs clearance", location: "Riyadh", date: "Apr 27, 2025", time: "11:10 AM", completed: true, current: true },
    ],
  },
  {
    _id: "shp_39822",
    id: "shp_39822",
    trackingNumber: "SP-39822",
    from: "London",
    to: "New York",
    status: "delivered",
    progress: 100,
    currentLocation: "New York",
    estimatedDelivery: "2025-03-18T14:00:00.000Z",
    weight: "8.1 kg",
    dimensions: "40 x 28 x 18 cm",
    courier: { _id: "cr_02", id: "cr_02", name: "FedEx Priority", price: 510, deliveryTime: "Mar 18, 2025" },
    createdAt: "2025-03-12T09:00:00.000Z",
    updatedAt: "2025-03-18T14:05:00.000Z",
    events: [
      { _id: "evt_39822_1", status: "Picked up", location: "London", date: "Mar 12, 2025", time: "09:00 AM", completed: true },
      { _id: "evt_39822_2", status: "Arrived at hub", location: "New York", date: "Mar 17, 2025", time: "08:40 PM", completed: true },
      { _id: "evt_39822_3", status: "Delivered", location: "New York", date: "Mar 18, 2025", time: "02:05 PM", completed: true, current: true },
    ],
  },
  {
    _id: "shp_51764",
    id: "shp_51764",
    trackingNumber: "SP-51764",
    from: "Dubai",
    to: "Istanbul",
    status: "pending",
    progress: 14,
    currentLocation: "Dubai",
    estimatedDelivery: "2025-05-03T12:00:00.000Z",
    weight: "22 kg",
    dimensions: "60 x 41 x 35 cm",
    courier: { _id: "cr_03", id: "cr_03", name: "Aramex Freight", price: 295, deliveryTime: "May 3, 2025" },
    createdAt: "2025-04-26T15:20:00.000Z",
    updatedAt: "2025-04-27T08:45:00.000Z",
    events: [
      { _id: "evt_51764_1", status: "Shipment created", location: "Dubai", date: "Apr 26, 2025", time: "03:20 PM", completed: true },
      { _id: "evt_51764_2", status: "Awaiting pickup", location: "Dubai", date: "Apr 27, 2025", time: "08:45 AM", completed: false, current: true },
    ],
  },
  {
    _id: "shp_61209",
    id: "shp_61209",
    trackingNumber: "SP-61209",
    from: "Riyadh",
    to: "Cairo",
    status: "cancelled",
    progress: 0,
    currentLocation: "Riyadh",
    estimatedDelivery: "2025-02-14T10:00:00.000Z",
    weight: "5.6 kg",
    dimensions: "34 x 22 x 16 cm",
    courier: { _id: "cr_04", id: "cr_04", name: "UPS Saver", price: 180, deliveryTime: "Cancelled" },
    createdAt: "2025-02-10T07:10:00.000Z",
    updatedAt: "2025-02-11T01:25:00.000Z",
    events: [
      { _id: "evt_61209_1", status: "Label generated", location: "Riyadh", date: "Feb 10, 2025", time: "07:10 AM", completed: true },
      { _id: "evt_61209_2", status: "Shipment cancelled", location: "Riyadh", date: "Feb 11, 2025", time: "01:25 PM", completed: true, current: true },
    ],
  },
  {
    _id: "shp_44017",
    id: "shp_44017",
    trackingNumber: "SP-44017",
    from: "Istanbul",
    to: "London",
    status: "delivered",
    progress: 100,
    currentLocation: "London",
    estimatedDelivery: "2025-01-09T17:00:00.000Z",
    weight: "16.3 kg",
    dimensions: "52 x 39 x 29 cm",
    courier: { _id: "cr_05", id: "cr_05", name: "Maersk Air Cargo", price: 610, deliveryTime: "Jan 9, 2025" },
    createdAt: "2025-01-04T12:50:00.000Z",
    updatedAt: "2025-01-09T17:20:00.000Z",
    events: [
      { _id: "evt_44017_1", status: "Picked up", location: "Istanbul", date: "Jan 4, 2025", time: "12:50 PM", completed: true },
      { _id: "evt_44017_2", status: "Transit completed", location: "London", date: "Jan 9, 2025", time: "04:20 PM", completed: true },
      { _id: "evt_44017_3", status: "Delivered", location: "London", date: "Jan 9, 2025", time: "05:20 PM", completed: true, current: true },
    ],
  },
  {
    _id: "shp_28973",
    id: "shp_28973",
    trackingNumber: "SP-28973",
    from: "New York",
    to: "Dubai",
    status: "in_transit",
    progress: 48,
    currentLocation: "London",
    estimatedDelivery: "2024-12-22T18:00:00.000Z",
    weight: "10.8 kg",
    dimensions: "44 x 31 x 20 cm",
    courier: { _id: "cr_06", id: "cr_06", name: "Emirates SkyCargo", price: 560, deliveryTime: "Dec 22, 2024" },
    createdAt: "2024-12-17T11:25:00.000Z",
    updatedAt: "2024-12-19T06:45:00.000Z",
    events: [
      { _id: "evt_28973_1", status: "Collected", location: "New York", date: "Dec 17, 2024", time: "11:25 AM", completed: true },
      { _id: "evt_28973_2", status: "In transit", location: "London", date: "Dec 19, 2024", time: "06:45 AM", completed: true, current: true },
    ],
  },
  {
    _id: "shp_73155",
    id: "shp_73155",
    trackingNumber: "SP-73155",
    from: "Cairo",
    to: "Riyadh",
    status: "delivered",
    progress: 100,
    currentLocation: "Riyadh",
    estimatedDelivery: "2024-11-15T13:00:00.000Z",
    weight: "7.2 kg",
    dimensions: "36 x 24 x 18 cm",
    courier: { _id: "cr_07", id: "cr_07", name: "Saudi Cargo", price: 230, deliveryTime: "Nov 15, 2024" },
    createdAt: "2024-11-10T08:00:00.000Z",
    updatedAt: "2024-11-15T01:05:00.000Z",
    events: [
      { _id: "evt_73155_1", status: "Dispatched", location: "Cairo", date: "Nov 10, 2024", time: "08:00 AM", completed: true },
      { _id: "evt_73155_2", status: "Delivered", location: "Riyadh", date: "Nov 15, 2024", time: "01:05 PM", completed: true, current: true },
    ],
  },
  {
    _id: "shp_84502",
    id: "shp_84502",
    trackingNumber: "SP-84502",
    from: "Dubai",
    to: "London",
    status: "cancelled",
    progress: 0,
    currentLocation: "Dubai",
    estimatedDelivery: "2024-10-06T18:00:00.000Z",
    weight: "13.5 kg",
    dimensions: "49 x 35 x 25 cm",
    courier: { _id: "cr_08", id: "cr_08", name: "Qatar Airways Cargo", price: 470, deliveryTime: "Cancelled" },
    createdAt: "2024-10-04T09:40:00.000Z",
    updatedAt: "2024-10-05T03:12:00.000Z",
    events: [
      { _id: "evt_84502_1", status: "Order submitted", location: "Dubai", date: "Oct 4, 2024", time: "09:40 AM", completed: true },
      { _id: "evt_84502_2", status: "Cancelled by shipper", location: "Dubai", date: "Oct 5, 2024", time: "03:12 PM", completed: true, current: true },
    ],
  },
  {
    _id: "shp_11358",
    id: "shp_11358",
    trackingNumber: "SP-11358",
    from: "London",
    to: "Istanbul",
    status: "pending",
    progress: 18,
    currentLocation: "London",
    estimatedDelivery: "2024-09-21T09:00:00.000Z",
    weight: "9.9 kg",
    dimensions: "42 x 29 x 21 cm",
    courier: { _id: "cr_09", id: "cr_09", name: "Turkish Cargo", price: 340, deliveryTime: "Sep 21, 2024" },
    createdAt: "2024-09-18T02:30:00.000Z",
    updatedAt: "2024-09-18T04:05:00.000Z",
    events: [
      { _id: "evt_11358_1", status: "Booking created", location: "London", date: "Sep 18, 2024", time: "02:30 PM", completed: true },
      { _id: "evt_11358_2", status: "Awaiting handoff", location: "London", date: "Sep 18, 2024", time: "04:05 PM", completed: false, current: true },
    ],
  },
  {
    _id: "shp_65241",
    id: "shp_65241",
    trackingNumber: "SP-65241",
    from: "Riyadh",
    to: "New York",
    status: "delivered",
    progress: 100,
    currentLocation: "New York",
    estimatedDelivery: "2024-08-13T19:00:00.000Z",
    weight: "19.1 kg",
    dimensions: "58 x 40 x 32 cm",
    courier: { _id: "cr_10", id: "cr_10", name: "UPS Worldwide", price: 720, deliveryTime: "Aug 13, 2024" },
    createdAt: "2024-08-07T07:55:00.000Z",
    updatedAt: "2024-08-13T07:10:00.000Z",
    events: [
      { _id: "evt_65241_1", status: "Picked up", location: "Riyadh", date: "Aug 7, 2024", time: "07:55 AM", completed: true },
      { _id: "evt_65241_2", status: "Delivered", location: "New York", date: "Aug 13, 2024", time: "07:10 PM", completed: true, current: true },
    ],
  },
  {
    _id: "shp_92634",
    id: "shp_92634",
    trackingNumber: "SP-92634",
    from: "Istanbul",
    to: "Cairo",
    status: "in_transit",
    progress: 57,
    currentLocation: "Cairo",
    estimatedDelivery: "2024-07-29T15:00:00.000Z",
    weight: "6.4 kg",
    dimensions: "31 x 24 x 14 cm",
    courier: { _id: "cr_11", id: "cr_11", name: "MNG Airlines", price: 205, deliveryTime: "Jul 29, 2024" },
    createdAt: "2024-07-24T05:45:00.000Z",
    updatedAt: "2024-07-28T09:30:00.000Z",
    events: [
      { _id: "evt_92634_1", status: "Accepted", location: "Istanbul", date: "Jul 24, 2024", time: "05:45 AM", completed: true },
      { _id: "evt_92634_2", status: "Arrived in destination city", location: "Cairo", date: "Jul 28, 2024", time: "09:30 AM", completed: true, current: true },
    ],
  },
];

const baseUsers: User[] = [
  { _id: "usr_01", id: "usr_01", fullName: "Omar Hassan", email: "omar.hassan@shipsphere-demo.com", role: "Merchant", phone: "+20 100 245 8821", status: "Active", isActive: true, shipmentsCount: 14, totalSpent: 6840, createdAt: "2025-04-12T10:20:00.000Z", joinedAt: "2025-04-12T10:20:00.000Z", updatedAt: "2025-04-27T08:50:00.000Z" },
  { _id: "usr_02", id: "usr_02", fullName: "Fatima Al Hammadi", email: "fatima.hammadi@shipsphere-demo.com", role: "Enterprise", phone: "+971 50 667 9120", status: "Active", isActive: true, shipmentsCount: 21, totalSpent: 12340, createdAt: "2025-03-02T09:00:00.000Z", joinedAt: "2025-03-02T09:00:00.000Z", updatedAt: "2025-04-26T03:10:00.000Z" },
  { _id: "usr_03", id: "usr_03", fullName: "Youssef El Sherif", email: "youssef.sherif@shipsphere-demo.com", role: "Merchant", phone: "+20 111 338 4519", status: "Inactive", isActive: false, shipmentsCount: 6, totalSpent: 2140, createdAt: "2025-01-18T02:15:00.000Z", joinedAt: "2025-01-18T02:15:00.000Z", updatedAt: "2025-03-11T11:40:00.000Z" },
  { _id: "usr_04", id: "usr_04", fullName: "Emily Carter", email: "emily.carter@shipsphere-demo.com", role: "Retail", phone: "+1 646 420 0091", status: "Active", isActive: true, shipmentsCount: 11, totalSpent: 3895, createdAt: "2024-12-09T11:45:00.000Z", joinedAt: "2024-12-09T11:45:00.000Z", updatedAt: "2025-04-24T09:35:00.000Z" },
  { _id: "usr_05", id: "usr_05", fullName: "Abdulrahman Al Qahtani", email: "abdulrahman.qahtani@shipsphere-demo.com", role: "Enterprise", phone: "+966 55 702 4401", status: "Active", isActive: true, shipmentsCount: 18, totalSpent: 9720, createdAt: "2024-11-03T08:25:00.000Z", joinedAt: "2024-11-03T08:25:00.000Z", updatedAt: "2025-04-22T02:18:00.000Z" },
  { _id: "usr_06", id: "usr_06", fullName: "Layla Mahmoud", email: "layla.mahmoud@shipsphere-demo.com", role: "Merchant", phone: "+20 120 992 7144", status: "Banned", isActive: false, shipmentsCount: 3, totalSpent: 890, createdAt: "2024-10-20T01:30:00.000Z", joinedAt: "2024-10-20T01:30:00.000Z", updatedAt: "2025-02-14T06:50:00.000Z" },
  { _id: "usr_07", id: "usr_07", fullName: "Daniel Brooks", email: "daniel.brooks@shipsphere-demo.com", role: "Retail", phone: "+44 7700 900321", status: "Active", isActive: true, shipmentsCount: 9, totalSpent: 4510, createdAt: "2024-09-15T07:40:00.000Z", joinedAt: "2024-09-15T07:40:00.000Z", updatedAt: "2025-04-18T01:05:00.000Z" },
  { _id: "usr_08", id: "usr_08", fullName: "Mariam Naguib", email: "mariam.naguib@shipsphere-demo.com", role: "Merchant", phone: "+20 109 550 6218", status: "Active", isActive: true, shipmentsCount: 13, totalSpent: 5775, createdAt: "2024-08-28T05:20:00.000Z", joinedAt: "2024-08-28T05:20:00.000Z", updatedAt: "2025-04-27T07:25:00.000Z" },
];

const baseChats: ChatSummary[] = [
  { _id: "chat_01", participantName: "Fatima Al Hammadi", participantEmail: "fatima.hammadi@shipsphere-demo.com", avatar: null, lastMessage: "Can you confirm customs clearance for SP-20481?", unreadCount: 2, updatedAt: "2025-04-27T09:14:00.000Z", createdAt: "2025-04-25T09:20:00.000Z", isClosed: false, status: "open" },
  { _id: "chat_02", participantName: "Emily Carter", participantEmail: "emily.carter@shipsphere-demo.com", avatar: null, lastMessage: "Thanks, the package arrived this morning.", unreadCount: 0, updatedAt: "2025-04-26T02:35:00.000Z", createdAt: "2025-04-21T11:10:00.000Z", isClosed: false, status: "open" },
  { _id: "chat_03", participantName: "Abdulrahman Al Qahtani", participantEmail: "abdulrahman.qahtani@shipsphere-demo.com", avatar: null, lastMessage: "Please hold pickup until tomorrow afternoon.", unreadCount: 1, updatedAt: "2025-04-24T04:05:00.000Z", createdAt: "2025-04-23T12:45:00.000Z", isClosed: false, status: "open" },
  { _id: "chat_04", participantName: "Omar Hassan", participantEmail: "omar.hassan@shipsphere-demo.com", avatar: null, lastMessage: "Issue resolved, thank you.", unreadCount: 0, updatedAt: "2025-04-20T01:42:00.000Z", createdAt: "2025-04-19T08:00:00.000Z", isClosed: true, status: "closed" },
];

const baseMessagesByChatId: Record<string, ChatMessage[]> = {
  chat_01: [
    { _id: "msg_01_1", chatId: "chat_01", sender: "user", text: "Hello, I need an update on SP-20481.", createdAt: "2025-04-27T08:50:00.000Z" },
    { _id: "msg_01_2", chatId: "chat_01", sender: "admin", text: "It cleared Riyadh customs and is moving toward Dubai.", createdAt: "2025-04-27T09:03:00.000Z" },
    { _id: "msg_01_3", chatId: "chat_01", sender: "user", text: "Can you confirm customs clearance for SP-20481?", createdAt: "2025-04-27T09:14:00.000Z" },
  ],
  chat_02: [
    { _id: "msg_02_1", chatId: "chat_02", sender: "user", text: "Has shipment SP-39822 been delivered?", createdAt: "2025-04-26T01:58:00.000Z" },
    { _id: "msg_02_2", chatId: "chat_02", sender: "admin", text: "Yes, it was delivered in New York and signed for.", createdAt: "2025-04-26T02:20:00.000Z" },
    { _id: "msg_02_3", chatId: "chat_02", sender: "user", text: "Thanks, the package arrived this morning.", createdAt: "2025-04-26T02:35:00.000Z" },
  ],
  chat_03: [
    { _id: "msg_03_1", chatId: "chat_03", sender: "user", text: "Can you delay pickup for tomorrow?", createdAt: "2025-04-24T03:34:00.000Z" },
    { _id: "msg_03_2", chatId: "chat_03", sender: "admin", text: "Yes, I can update the pickup window for your Dubai route.", createdAt: "2025-04-24T03:48:00.000Z" },
    { _id: "msg_03_3", chatId: "chat_03", sender: "user", text: "Please hold pickup until tomorrow afternoon.", createdAt: "2025-04-24T04:05:00.000Z" },
  ],
  chat_04: [
    { _id: "msg_04_1", chatId: "chat_04", sender: "user", text: "The recipient phone number was incorrect.", createdAt: "2025-04-20T12:20:00.000Z" },
    { _id: "msg_04_2", chatId: "chat_04", sender: "admin", text: "We updated the contact details and notified the courier.", createdAt: "2025-04-20T01:28:00.000Z" },
    { _id: "msg_04_3", chatId: "chat_04", sender: "user", text: "Issue resolved, thank you.", createdAt: "2025-04-20T01:42:00.000Z" },
  ],
};

const mockShipmentsData: Shipment[] = shipmentSeeds.map((shipment) => ({
  ...shipment,
  status: toDisplayShipmentStatus(shipment.status),
}));

export function getMockShipments() {
  return clone(mockShipmentsData);
}

export function getMockShipmentById(id: string) {
  const shipment = mockShipmentsData.find(
    (item) => item._id === id || item.id === id || item.trackingNumber === id
  );
  return shipment ? clone(shipment) : null;
}

export function getMockUsers() {
  return clone(baseUsers);
}

export function getMockUserById(id: string) {
  const user = baseUsers.find((item) => item._id === id || item.id === id || item.email === id);
  return user ? clone(user) : null;
}

export function getMockChats() {
  return clone(baseChats);
}

export function getMockChatById(id: string) {
  const chat = baseChats.find((item) => item._id === id);
  return chat ? clone(chat) : null;
}

export function getMockChatMessages(chatId: string, page = 1, limit = 20): ChatMessagesResult {
  const allMessages = clone(baseMessagesByChatId[chatId] ?? []);
  const startIndex = Math.max(0, (page - 1) * limit);

  return {
    messages: allMessages.slice(startIndex, startIndex + limit),
    total: allMessages.length,
    page,
    limit,
  };
}

export function createMockChatSummary(input: {
  userId?: string;
  participantName?: string;
  participantEmail?: string;
  name?: string;
  email?: string;
}): ChatSummary {
  const now = new Date().toISOString();
  const participantName = input.participantName?.trim() || input.name?.trim() || "New conversation";
  const participantEmail = input.participantEmail?.trim() || input.email?.trim() || null;

  return {
    _id: `chat_mock_${Date.now()}`,
    participantName,
    participantEmail,
    avatar: null,
    lastMessage: "No messages yet",
    unreadCount: 0,
    updatedAt: now,
    createdAt: now,
    isClosed: false,
    status: "open",
  };
}

export function createMockChatMessage(chatId: string, text: string): ChatMessage {
  return {
    _id: `msg_mock_${Date.now()}`,
    chatId,
    sender: "admin",
    text,
    createdAt: new Date().toISOString(),
    pending: false,
  };
}

export function getMockDashboardStats(): DashboardStats {
  const shipments = mockShipmentsData;
  const users = baseUsers;
  const totalRevenue = shipments.reduce((sum, shipment) => {
    if (shipment.courier && typeof shipment.courier === "object" && typeof shipment.courier.price === "number") {
      return sum + shipment.courier.price;
    }

    return sum;
  }, 0);

  return {
    totalShipments: shipments.length,
    activeShipments: shipments.filter((shipment) => shipment.status === "In Transit").length,
    totalUsers: users.length,
    delayedCount: 2,
    totalRevenue,
    shipmentsChange: "+12.4%",
    revenueChange: "+18.1%",
    usersChange: "+9.7%",
  };
}

export function getMockShipmentChart(): ChartPoint[] {
  const monthlyCounts = new Map<string, { shipments: number; revenue: number }>();

  for (const shipment of mockShipmentsData) {
    const sourceDate = shipment.createdAt || shipment.updatedAt;
    if (!sourceDate) {
      continue;
    }

    const parsedDate = new Date(sourceDate);
    if (Number.isNaN(parsedDate.getTime())) {
      continue;
    }

    const key = `${parsedDate.getFullYear()}-${parsedDate.getMonth()}`;
    const currentValue = monthlyCounts.get(key) ?? { shipments: 0, revenue: 0 };
    const shipmentRevenue =
      shipment.courier && typeof shipment.courier === "object" && typeof shipment.courier.price === "number"
        ? shipment.courier.price
        : 0;

    monthlyCounts.set(key, {
      shipments: currentValue.shipments + 1,
      revenue: currentValue.revenue + shipmentRevenue,
    });
  }

  return Array.from(monthlyCounts.entries())
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => {
      const [year, month] = key.split("-").map(Number);
      return {
        month: `${MONTH_LABELS[month]} ${year}`,
        shipments: value.shipments,
        revenue: value.revenue,
      };
    });
}
