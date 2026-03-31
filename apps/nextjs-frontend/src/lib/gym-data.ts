import { AsyncLocalStorage } from "node:async_hooks";
import process from "node:process";
import {
  type ApiResponse,
  createGymManagementMockData,
  createGymManagementSnapshot,
  findEquipmentAssetById,
  findMemberById,
  findMembershipPlanById,
  findPersonalTrainerById,
  findPtContractByPtId,
  type EquipmentAsset,
  type GymManagementSnapshot,
  type Member,
  type MembershipPlan,
  type PersonalTrainer,
  type Product,
} from "@next-nest-turbo-boilerplate/shared";

export type BadgeTone = "slate" | "emerald" | "amber" | "rose" | "sky";

type LoginPayload = {
  accessToken: string;
};

const gymSnapshotStorage = new AsyncLocalStorage<GymManagementSnapshot>();

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeZone: "Asia/Ho_Chi_Minh",
});

const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Ho_Chi_Minh",
});

const numberFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 1,
});

function createFallbackSnapshot(): GymManagementSnapshot {
  return createGymManagementSnapshot(createGymManagementMockData());
}

function getBackendUrl(): string {
  return (
    process.env.GYM_BACKEND_URL ??
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    "http://localhost:4000"
  ).replace(/\/$/, "");
}

function getDemoCredentials(): { email: string; password: string } {
  return {
    email: process.env.GYM_FRONTEND_DEMO_EMAIL ?? "admin@gymmanager.local",
    password: process.env.GYM_FRONTEND_DEMO_PASSWORD ?? "demo123",
  };
}

async function loginToBackend(): Promise<string> {
  const backendUrl = getBackendUrl();
  const credentials = getDemoCredentials();
  const response = await fetch(`${backendUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(
      `Unable to authenticate frontend snapshot request (${response.status})`,
    );
  }

  const payload = (await response.json()) as ApiResponse<LoginPayload>;

  if (!payload.data.accessToken) {
    throw new Error(
      "Gym frontend snapshot login did not return an access token",
    );
  }

  return payload.data.accessToken;
}

export async function loadGymSnapshot(): Promise<GymManagementSnapshot> {
  try {
    const backendUrl = getBackendUrl();
    const accessToken = await loginToBackend();
    const headers = new Headers();

    headers.set("Authorization", `Bearer ${accessToken}`);
    const response = await fetch(`${backendUrl}/api/snapshot`, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Unable to load backend snapshot (${response.status})`);
    }

    const payload =
      (await response.json()) as ApiResponse<GymManagementSnapshot>;

    return payload.data;
  } catch {
    return createFallbackSnapshot();
  }
}

export function runWithGymSnapshot<Result>(
  snapshot: GymManagementSnapshot,
  render: () => Result,
): Result {
  return gymSnapshotStorage.run(snapshot, render);
}

export function getGymSnapshot(): GymManagementSnapshot {
  return gymSnapshotStorage.getStore() ?? createFallbackSnapshot();
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function formatDateTime(value: string): string {
  return dateTimeFormatter.format(new Date(value));
}

export function formatHours(value: number): string {
  return `${numberFormatter.format(value)}h`;
}

export function humanizeStatus(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (fragment) => `${fragment.slice(0, 1).toUpperCase()}${fragment.slice(1)}`,
    )
    .join(" ");
}

export function getStatusTone(status: string): BadgeTone {
  switch (status) {
    case "ACTIVE":
    case "VALID":
    case "APPROVED":
    case "PAID":
    case "CONFIRMED": {
      return "emerald";
    }

    case "HALF":
    case "PENDING_APPROVAL":
    case "OPEN":
    case "ON_SALE": {
      return "amber";
    }

    case "INVALID":
    case "REJECTED":
    case "CANCELLED":
    case "NEEDS_REPLACEMENT":
    case "INACTIVE":
    case "OFF_SALE": {
      return "rose";
    }

    default: {
      return "sky";
    }
  }
}

export function getTrainerName(
  snapshot: GymManagementSnapshot,
  ptId: string,
): string {
  return (
    findPersonalTrainerById(snapshot.dataset, ptId)?.fullName ?? "Chua gan PT"
  );
}

export function getMemberName(
  snapshot: GymManagementSnapshot,
  memberId: string,
): string {
  return findMemberById(snapshot.dataset, memberId)?.fullName ?? "Khach le";
}

export function getPlanName(
  snapshot: GymManagementSnapshot,
  membershipPlanId: string,
): string {
  return (
    findMembershipPlanById(snapshot.dataset, membershipPlanId)?.name ??
    "Unknown plan"
  );
}

export function getProductName(
  snapshot: GymManagementSnapshot,
  productId: string,
): string {
  return (
    snapshot.dataset.products.find((product) => product.id === productId)
      ?.name ?? "Unknown product"
  );
}

export function getEquipmentName(
  snapshot: GymManagementSnapshot,
  equipmentAssetId?: string,
): string {
  if (!equipmentAssetId) {
    return "Khong gan thiet bi";
  }

  return (
    findEquipmentAssetById(snapshot.dataset, equipmentAssetId)?.name ??
    "Unknown equipment"
  );
}

export function getContractForTrainer(
  snapshot: GymManagementSnapshot,
  ptId: string,
): GymManagementSnapshot["dataset"]["ptContracts"][number] | undefined {
  return findPtContractByPtId(snapshot.dataset, ptId);
}

export function getTrainerForMember(
  snapshot: GymManagementSnapshot,
  memberId: string,
): PersonalTrainer | undefined {
  const activeAssignment = snapshot.dataset.memberPtAssignments.find(
    (assignment) =>
      assignment.memberId === memberId && assignment.status === "ACTIVE",
  );

  return activeAssignment
    ? findPersonalTrainerById(snapshot.dataset, activeAssignment.ptId)
    : undefined;
}

export function getMembershipPlanForMember(
  snapshot: GymManagementSnapshot,
  memberId: string,
): MembershipPlan | undefined {
  const activeMembership = snapshot.dataset.memberMemberships.find(
    (membership) =>
      membership.memberId === memberId && membership.status === "ACTIVE",
  );

  if (!activeMembership) {
    return undefined;
  }

  return findMembershipPlanById(
    snapshot.dataset,
    activeMembership.membershipPlanId,
  );
}

export function sortProductsByStock(products: Product[]): Product[] {
  return [...products].sort(
    (firstProduct, secondProduct) =>
      firstProduct.stockOnHand - secondProduct.stockOnHand,
  );
}

export function sortMembersByDate(members: Member[]): Member[] {
  return [...members].sort((firstMember, secondMember) =>
    secondMember.registeredAt.localeCompare(firstMember.registeredAt),
  );
}

export function sortEquipmentByMaintenance(
  equipmentAssets: EquipmentAsset[],
): EquipmentAsset[] {
  return [...equipmentAssets].sort((firstAsset, secondAsset) =>
    firstAsset.nextMaintenanceAt.localeCompare(secondAsset.nextMaintenanceAt),
  );
}
