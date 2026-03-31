"use server";

import process from "node:process";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearRefreshTokenCookie,
  loginToGymFrontend,
  logoutFromGymFrontend,
  requireGymSession,
} from "@/lib/gym-auth.ts";

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, key: string): string | undefined {
  const value = getString(formData, key);

  return value.length > 0 ? value : undefined;
}

function getNumberValue(formData: FormData, key: string): number {
  return Number(getString(formData, key));
}

async function postToBackend(
  locale: string,
  endpoint: string,
  body: Record<string, unknown>,
  method = "POST",
): Promise<void> {
  const session = await requireGymSession(locale);
  const backendUrl =
    process.env.GYM_BACKEND_URL ??
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    "http://localhost:4000";
  const headers = new Headers();

  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${session.accessToken}`);
  const response = await fetch(`${backendUrl.replace(/\/$/, "")}${endpoint}`, {
    method,
    headers,
    cache: "no-store",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Backend request failed for ${endpoint} (${response.status})`);
  }
}

export async function loginAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  try {
    const session = await loginToGymFrontend(email, password);

    if (session.user.role === "PT") {
      redirect(`/${locale}/pts/attendance`);
    }
  } catch {
    await clearRefreshTokenCookie();
    redirect(`/${locale}/login?error=invalid`);
  }

  redirect(`/${locale}/dashboard`);
}

export async function logoutAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";

  await logoutFromGymFrontend();
  redirect(`/${locale}/login`);
}

export async function createMembershipAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";

  await postToBackend(locale, "/api/member-memberships", {
    memberId: getString(formData, "memberId"),
    membershipPlanId: getString(formData, "membershipPlanId"),
    startDate: getString(formData, "startDate"),
    paymentMethod: getString(formData, "paymentMethod"),
  });
  revalidatePath(`/${locale}/members/memberships`);
  revalidatePath(`/${locale}/members`);
}

export async function renewMembershipAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";
  const membershipId = getString(formData, "membershipId");
  const memberId = getOptionalString(formData, "memberId");

  await postToBackend(locale, `/api/member-memberships/${membershipId}/renew`, {
    startDate: getOptionalString(formData, "startDate"),
    paymentMethod: getOptionalString(formData, "paymentMethod"),
  });
  revalidatePath(`/${locale}/members/memberships`);
  revalidatePath(`/${locale}/members`);
  if (memberId) {
    revalidatePath(`/${locale}/members/${memberId}`);
  }
}

export async function cancelMembershipAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";
  const membershipId = getString(formData, "membershipId");
  const memberId = getOptionalString(formData, "memberId");

  await postToBackend(locale, `/api/member-memberships/${membershipId}/cancel`, {
    cancelledAt: getOptionalString(formData, "cancelledAt"),
  });
  revalidatePath(`/${locale}/members/memberships`);
  revalidatePath(`/${locale}/members`);
  if (memberId) {
    revalidatePath(`/${locale}/members/${memberId}`);
  }
}

export async function createPtContractAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";
  const ptId = getString(formData, "ptId");

  await postToBackend(locale, `/api/pts/${ptId}/contracts`, {
    contractCode: getOptionalString(formData, "contractCode"),
    contractType: getString(formData, "contractType"),
    salaryType: getString(formData, "salaryType"),
    baseSalary: getNumberValue(formData, "baseSalary"),
    minValidShiftHours: getNumberValue(formData, "minValidShiftHours"),
    standardShiftHours: getNumberValue(formData, "standardShiftHours"),
    overtimeHourlyRate: getNumberValue(formData, "overtimeHourlyRate"),
    performanceBonusThreshold: getNumberValue(formData, "performanceBonusThreshold"),
    performanceBonusAmount: getNumberValue(formData, "performanceBonusAmount"),
    packageCommissionRate: getNumberValue(formData, "packageCommissionRate"),
    salesCommissionRate: getNumberValue(formData, "salesCommissionRate"),
    allowances: getNumberValue(formData, "allowances"),
    penaltyRules: getString(formData, "penaltyRules")
      .split("\n")
      .map((rule) => rule.trim())
      .filter(Boolean),
    effectiveFrom: getString(formData, "effectiveFrom"),
    effectiveTo: getOptionalString(formData, "effectiveTo"),
  });
  revalidatePath(`/${locale}/pts/${ptId}/contracts`);
  revalidatePath(`/${locale}/pts/${ptId}`);
}

export async function updatePtContractAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";
  const ptId = getString(formData, "ptId");
  const contractId = getString(formData, "contractId");

  await postToBackend(locale, `/api/pts/${ptId}/contracts/${contractId}`, {
    contractCode: getOptionalString(formData, "contractCode"),
    contractType: getString(formData, "contractType"),
    salaryType: getString(formData, "salaryType"),
    baseSalary: getNumberValue(formData, "baseSalary"),
    minValidShiftHours: getNumberValue(formData, "minValidShiftHours"),
    standardShiftHours: getNumberValue(formData, "standardShiftHours"),
    overtimeHourlyRate: getNumberValue(formData, "overtimeHourlyRate"),
    performanceBonusThreshold: getNumberValue(formData, "performanceBonusThreshold"),
    performanceBonusAmount: getNumberValue(formData, "performanceBonusAmount"),
    packageCommissionRate: getNumberValue(formData, "packageCommissionRate"),
    salesCommissionRate: getNumberValue(formData, "salesCommissionRate"),
    allowances: getNumberValue(formData, "allowances"),
    penaltyRules: getString(formData, "penaltyRules")
      .split("\n")
      .map((rule) => rule.trim())
      .filter(Boolean),
    effectiveFrom: getString(formData, "effectiveFrom"),
    effectiveTo: getOptionalString(formData, "effectiveTo"),
  }, "PATCH");
  revalidatePath(`/${locale}/pts/${ptId}/contracts`);
  revalidatePath(`/${locale}/pts/${ptId}`);
}

export async function createPayrollPeriodAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";

  await postToBackend(locale, "/api/payroll/periods", {
    code: getOptionalString(formData, "code"),
    from: getString(formData, "from"),
    to: getString(formData, "to"),
  });
  revalidatePath(`/${locale}/payroll`);
}

export async function generatePayrollAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";

  await postToBackend(locale, "/api/payroll/generate", {
    payrollPeriodId: getString(formData, "payrollPeriodId"),
  });
  revalidatePath(`/${locale}/payroll`);
}

export async function createAssignmentAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";

  await postToBackend(locale, "/api/member-assignments", {
    memberId: getString(formData, "memberId"),
    ptId: getString(formData, "ptId"),
    memberMembershipId: getString(formData, "memberMembershipId"),
    assignedFrom: getString(formData, "assignedFrom"),
    commissionType: getString(formData, "commissionType"),
    commissionValue: getNumberValue(formData, "commissionValue"),
  });
  revalidatePath(`/${locale}/member-assignments`);
  revalidatePath(`/${locale}/members`);
}

export async function endAssignmentAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";
  const assignmentId = getString(formData, "assignmentId");
  const memberId = getOptionalString(formData, "memberId");

  await postToBackend(locale, `/api/member-assignments/${assignmentId}/end`, {
    assignedTo: getOptionalString(formData, "assignedTo"),
  });
  revalidatePath(`/${locale}/members/memberships`);
  revalidatePath(`/${locale}/members`);
  if (memberId) {
    revalidatePath(`/${locale}/members/${memberId}`);
  }
}

export async function createSalesInvoiceAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";

  await postToBackend(locale, "/api/sales/invoices", {
    memberId: getOptionalString(formData, "memberId"),
    customerName: getString(formData, "customerName"),
    paymentMethod: getString(formData, "paymentMethod"),
    discountAmount: getNumberValue(formData, "discountAmount"),
    items: [
      {
        productId: getString(formData, "productId"),
        quantity: getNumberValue(formData, "quantity"),
      },
    ],
  });
  revalidatePath(`/${locale}/invoices`);
  revalidatePath(`/${locale}/inventory`);
}

export async function importInventoryAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";

  await postToBackend(locale, "/api/inventory/import", {
    productId: getString(formData, "productId"),
    quantity: getNumberValue(formData, "quantity"),
    unitCost: getNumberValue(formData, "unitCost"),
    referenceCode: getOptionalString(formData, "referenceCode"),
  });
  revalidatePath(`/${locale}/inventory`);
  revalidatePath(`/${locale}/products`);
}

export async function createMaintenanceAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";

  await postToBackend(locale, "/api/maintenance", {
    equipmentAssetId: getString(formData, "equipmentAssetId"),
    maintenanceType: getString(formData, "maintenanceType"),
    maintenanceDate: getString(formData, "maintenanceDate"),
    description: getString(formData, "description"),
    vendorName: getString(formData, "vendorName"),
    amount: getNumberValue(formData, "amount"),
    resultStatus: getString(formData, "resultStatus"),
    nextMaintenanceAt: getOptionalString(formData, "nextMaintenanceAt"),
  });
  revalidatePath(`/${locale}/maintenance`);
  revalidatePath(`/${locale}/equipment`);
}

export async function patchAttendanceAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";
  const attendanceLogId = getString(formData, "attendanceLogId");

  await postToBackend(
    locale,
    `/api/attendance/${attendanceLogId}`,
    {
      checkInAt: getOptionalString(formData, "checkInAt"),
      checkOutAt: getOptionalString(formData, "checkOutAt"),
      note: getOptionalString(formData, "note"),
    },
    "PATCH",
  );
  revalidatePath(`/${locale}/pts/attendance`);
}

export async function checkInAttendanceAction(
  formData: FormData,
): Promise<void> {
  const locale = getString(formData, "locale") || "en";

  await postToBackend(locale, "/api/attendance/check-in", {
    checkInAt: getOptionalString(formData, "checkInAt"),
  });
  revalidatePath(`/${locale}/pts/attendance`);
}

export async function checkOutAttendanceAction(
  formData: FormData,
): Promise<void> {
  const locale = getString(formData, "locale") || "en";

  await postToBackend(locale, "/api/attendance/check-out", {
    attendanceLogId: getOptionalString(formData, "attendanceLogId"),
    checkOutAt: getOptionalString(formData, "checkOutAt"),
  });
  revalidatePath(`/${locale}/pts/attendance`);
}
