import { User, Group, Member } from "./types";

/**
 * Account Management Utilities for Mkutano
 * Handles secretary account creation, member addition, and group join codes
 */

// Storage keys
const STORAGE_USERS = "mkutano_users";
const STORAGE_GROUPS = "mkutano_groups";
const STORAGE_MEMBERS = "mkutano_members";

// Generate a unique group join code
export function generateJoinCode(groupName: string): string {
  const prefix = groupName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, "");
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix || "GRP"}-${suffix}`;
}

// Create or register a secretary account
export function createSecretaryAccount(secretary: {
  name: string;
  phone: string;
  email?: string;
  password: string;
  groupName: string;
  village: string;
  district: string;
  country: string;
  shareValue: number;
  currency: string;
}): { user: User; group: Group } {
  // Generate IDs
  const userId = `u_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const groupId = `g_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const joinCode = generateJoinCode(secretary.groupName);

  // Create user
  const user: User = {
    id: userId,
    name: secretary.name,
    phone: secretary.phone,
    email: secretary.email,
    role: "secretary",
    groupId: groupId,
    avatarInitials: secretary.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2),
    joinedAt: new Date().toISOString().split("T")[0],
    isActive: true,
  };

  // Create group
  const group: Group = {
    id: groupId,
    name: secretary.groupName,
    village: secretary.village,
    district: secretary.district,
    country: secretary.country,
    secretaryId: userId,
    secretaryName: secretary.name,
    secretaryPhone: secretary.phone,
    memberCount: 0,
    createdAt: new Date().toISOString().split("T")[0],
    cycleStartDate: new Date().toISOString().split("T")[0],
    cycleEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    shareValue: secretary.shareValue,
    currency: secretary.currency,
    joinCode: joinCode,
    isActive: true,
  };

  // Save to localStorage
  const users = getAllUsers();
  users.push({ ...user, password: secretary.password });
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));

  const groups = getAllGroups();
  groups.push(group);
  localStorage.setItem(STORAGE_GROUPS, JSON.stringify(groups));

  return { user, group };
}

// Add a member to a group (by secretary)
export function addMemberToGroup(groupId: string, member: {
  name: string;
  phone: string;
  nationalId?: string;
}) {
  const groups = getAllGroups();
  const group = groups.find((g) => g.id === groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  // Check if phone already exists in group
  const members = getAllMembers();
  const existingMember = members.find(
    (m) => m.groupId === groupId && m.phone === member.phone
  );

  if (existingMember) {
    throw new Error("Member with this phone already exists in the group");
  }

  // Create user for member
  const userId = `u_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const memberId = `m_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const memberUser: User = {
    id: userId,
    name: member.name,
    phone: member.phone,
    role: "member",
    groupId: groupId,
    memberId: memberId,
    avatarInitials: member.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2),
    joinedAt: new Date().toISOString().split("T")[0],
    isActive: true,
  };

  const memberRecord: Member = {
    id: memberId,
    groupId: groupId,
    userId: userId,
    name: member.name,
    phone: member.phone,
    nationalId: member.nationalId,
    sharesHeld: 0,
    totalSaved: 0,
    totalLoaned: 0,
    totalRepaid: 0,
    walletBalance: 0,
    joinedAt: new Date().toISOString().split("T")[0],
    status: "active",
  };

  // Update group member count
  group.memberCount = Math.max(0, group.memberCount) + 1;

  // Save all
  const users = getAllUsers();
  users.push({ ...memberUser, password: `temp_${Date.now()}` }); // Temporary password
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));

  localStorage.setItem(STORAGE_GROUPS, JSON.stringify(groups));

  const membersList = getAllMembers();
  membersList.push(memberRecord);
  localStorage.setItem(STORAGE_MEMBERS, JSON.stringify(membersList));

  return { user: memberUser, member: memberRecord };
}

// Member joins with group code
export function joinGroupWithCode(member: {
  name: string;
  phone: string;
  password: string;
  joinCode: string;
  nationalId?: string;
}) {
  const groups = getAllGroups();
  const group = groups.find((g) => g.joinCode === member.joinCode);

  if (!group) {
    throw new Error("Invalid join code. Please check and try again.");
  }

  // Add member to group
  try {
    const result = addMemberToGroup(group.id, {
      name: member.name,
      phone: member.phone,
      nationalId: member.nationalId,
    });

    // Update password
    const users = getAllUsers();
    const user = users.find((u) => u.id === result.user.id);
    if (user) {
      user.password = member.password;
      localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    }

    return { user: result.user, group, member: result.member };
  } catch (error) {
    throw error;
  }
}

// Get all users
export function getAllUsers(): Array<User & { password: string }> {
  try {
    const data = localStorage.getItem(STORAGE_USERS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Get all groups
export function getAllGroups(): Group[] {
  try {
    const data = localStorage.getItem(STORAGE_GROUPS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Get all members
export function getAllMembers(): Member[] {
  try {
    const data = localStorage.getItem(STORAGE_MEMBERS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Get members by group
export function getMembersByGroup(groupId: string): Member[] {
  return getAllMembers().filter((m) => m.groupId === groupId);
}

// Get group by ID
export function getGroupById(groupId: string): Group | null {
  return getAllGroups().find((g) => g.id === groupId) || null;
}

// Get group by join code
export function getGroupByJoinCode(joinCode: string): Group | null {
  return getAllGroups().find((g) => g.joinCode === joinCode) || null;
}

// Delete member from group (secretary only)
export function removeMemberFromGroup(groupId: string, memberId: string): boolean {
  const members = getAllMembers();
  const memberIndex = members.findIndex((m) => m.id === memberId && m.groupId === groupId);

  if (memberIndex === -1) {
    return false;
  }

  // Get the member to find user
  const member = members[memberIndex];

  // Remove member
  members.splice(memberIndex, 1);
  localStorage.setItem(STORAGE_MEMBERS, JSON.stringify(members));

  // Remove associated user
  const users = getAllUsers();
  const userIndex = users.findIndex((u) => u.id === member.userId);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  }

  // Update group member count
  const groups = getAllGroups();
  const group = groups.find((g) => g.id === groupId);
  if (group) {
    group.memberCount = Math.max(0, group.memberCount - 1);
    localStorage.setItem(STORAGE_GROUPS, JSON.stringify(groups));
  }

  return true;
}

// Update member status
export function updateMemberStatus(
  groupId: string,
  memberId: string,
  status: "active" | "inactive" | "suspended"
): boolean {
  const members = getAllMembers();
  const member = members.find((m) => m.id === memberId && m.groupId === groupId);

  if (!member) {
    return false;
  }

  member.status = status;
  localStorage.setItem(STORAGE_MEMBERS, JSON.stringify(members));

  // Update user active status
  if (status === "inactive" || status === "suspended") {
    const users = getAllUsers();
    const user = users.find((u) => u.id === member.userId);
    if (user) {
      user.isActive = status === "active";
      localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    }
  }

  return true;
}
