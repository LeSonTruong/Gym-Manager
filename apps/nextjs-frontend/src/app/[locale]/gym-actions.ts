"use server";

import process from "node:process";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
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

function getOptionalNumberValue(formData: FormData, key: string): number | undefined {
  const value = getOptionalString(formData, key);

  if (!value) {
    return undefined;
  }

  return Number(value);
}

function getBooleanValue(formData: FormData, key: string): boolean {
  return getString(formData, key) === "true";
}

function getLineList(formData: FormData, key: string): string[] {
  const rawValue = getString(formData, key);

  if (!rawValue) {
    return [];
  }

  return rawValue
    .split(/\r?\n|,/v)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function getBackendErrorMessage(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  if (!("message" in payload)) {
    return undefined;
  }

  const { message } = payload as { readonly message?: unknown };

  if (typeof message === "string" && message.length > 0) {
    return message;
  }

  if (Array.isArray(message)) {
    const messageItems = message.filter(
      (item): item is string => typeof item === "string" && item.length > 0,
    );

    if (messageItems.length > 0) {
      return messageItems.join("; ");
    }
  }

  return undefined;
}

type ActionToastSeverity = "error" | "info" | "success" | "warn";

const actionToastSeverityQueryKey = "toastSeverity";
const actionToastMessageQueryKey = "toastMessage";

function normalizeActionToastMessage(
  locale: string,
  message: string | undefined,
): string {
  const fallbackMessage = locale === "vi"
    ? "Thao tác không thành công. Vui lòng thử lại."
    : "Action failed. Please try again.";

  if (!message) {
    return fallbackMessage;
  }

  const normalizedMessage = message.replaceAll(/\s+/gv, " ").trim();

  if (normalizedMessage.length === 0) {
    return fallbackMessage;
  }

  return normalizedMessage.slice(0, 260);
}

async function buildActionToastRedirectUrl(
  locale: string,
  severity: ActionToastSeverity,
  message: string,
): Promise<string> {
  const fallbackPath = `/${locale}`;
  let pathname = fallbackPath;
  let params = new URLSearchParams();

  try {
    const headerStore = await headers();
    const referer = headerStore.get("referer");

    if (referer) {
      const refererUrl = new URL(referer);

      if (refererUrl.pathname.startsWith(`/${locale}`)) {
        pathname = refererUrl.pathname;
        params = new URLSearchParams(refererUrl.search);
      }
    }
  } catch {
    pathname = fallbackPath;
    params = new URLSearchParams();
  }

  params.set(actionToastSeverityQueryKey, severity);
  params.set(actionToastMessageQueryKey, message);

  const queryString = params.toString();

  return queryString.length > 0 ? `${pathname}?${queryString}` : pathname;
}

async function redirectWithActionToast(
  locale: string,
  severity: ActionToastSeverity,
  message: string,
): Promise<never> {
  const redirectUrl = await buildActionToastRedirectUrl(
    locale,
    severity,
    message,
  );

  redirect(redirectUrl);
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
  const response = await fetch(`${backendUrl.replace(/\/$/v, "")}${endpoint}`, {
    method,
    headers,
    cache: "no-store",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let backendMessage: string | undefined;

    try {
      const contentType = response.headers.get("content-type") ?? "";

      if (contentType.includes("application/json")) {
        const payload: unknown = await response.json();

        backendMessage = getBackendErrorMessage(payload);
      } else {
        const responseTextRaw = await response.text();
        const responseText = responseTextRaw.trim();

        if (responseText.length > 0) {
          backendMessage = responseText;
        }
      }
    } catch {
      backendMessage = undefined;
    }

    const errorDetail = backendMessage
      ? `Backend request failed for ${endpoint} (${response.status}): ${backendMessage}`
      : `Backend request failed for ${endpoint} (${response.status})`;

    return redirectWithActionToast(
      locale,
      "error",
      normalizeActionToastMessage(locale, errorDetail),
    );
  }
}

export async function loginAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";
  const username = getString(formData, "username");
  const password = getString(formData, "password");

  try {
    await loginToGymFrontend(username, password);
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

export async function createPersonalTrainerAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";

  await postToBackend(locale, "/api/pts", {
    code: getString(formData, "code"),
    fullName: getString(formData, "fullName"),
    phone: getString(formData, "phone"),
  });
  revalidatePath(`/${locale}/pts`);
}

export async function updatePersonalTrainerAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";
  const ptId = getString(formData, "ptId");

  await postToBackend(
    locale,
    `/api/pts/${ptId}`,
    {
      code: getString(formData, "code"),
      fullName: getString(formData, "fullName"),
      phone: getString(formData, "phone"),
      status: getString(formData, "status"),
    },
    "PATCH",
  );
  revalidatePath(`/${locale}/pts`);
  revalidatePath(`/${locale}/pts/${ptId}`);
}

export async function deletePersonalTrainerAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";
  const ptId = getString(formData, "ptId");

  await postToBackend(locale, `/api/pts/${ptId}`, {}, "DELETE");
  revalidatePath(`/${locale}/pts`);
}

export async function createMemberAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";

  await postToBackend(locale, "/api/members", {
    code: getString(formData, "code"),
    fullName: getString(formData, "fullName"),
    phone: getString(formData, "phone"),
  });
  revalidatePath(`/${locale}/members`);
}

export async function updateMemberAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";
  const memberId = getString(formData, "memberId");

  await postToBackend(
    locale,
    `/api/members/${memberId}`,
    {
      code: getString(formData, "code"),
      fullName: getString(formData, "fullName"),
      phone: getString(formData, "phone"),
      status: getString(formData, "status"),
    },
    "PATCH",
  );
  revalidatePath(`/${locale}/members`);
  revalidatePath(`/${locale}/members/${memberId}`);
}

export async function deleteMemberAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";
  const memberId = getString(formData, "memberId");

  await postToBackend(locale, `/api/members/${memberId}`, {}, "DELETE");
  revalidatePath(`/${locale}/members`);
  revalidatePath(`/${locale}/members/${memberId}`);
}

export async function createMembershipPlanAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";

  await postToBackend(locale, "/api/membership-plans", {
    code: getString(formData, "code"),
    name: getString(formData, "name"),
    type: getString(formData, "type"),
    price: getNumberValue(formData, "price"),
    durationDays: getNumberValue(formData, "durationDays"),
    usageLimit: getOptionalNumberValue(formData, "usageLimit"),
    includesPt: getBooleanValue(formData, "includesPt"),
    includedPtSessions: getNumberValue(formData, "includedPtSessions"),
    perks: getLineList(formData, "perks"),
    status: getString(formData, "status"),
  });
  revalidatePath(`/${locale}/membership-plans`);
}

export async function updateMembershipPlanAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";
  const planId = getString(formData, "planId");

  await postToBackend(
    locale,
    `/api/membership-plans/${planId}`,
    {
      code: getString(formData, "code"),
      name: getString(formData, "name"),
      type: getString(formData, "type"),
      price: getNumberValue(formData, "price"),
      durationDays: getNumberValue(formData, "durationDays"),
      usageLimit: getOptionalNumberValue(formData, "usageLimit"),
      includesPt: getBooleanValue(formData, "includesPt"),
      includedPtSessions: getNumberValue(formData, "includedPtSessions"),
      perks: getLineList(formData, "perks"),
      status: getString(formData, "status"),
    },
    "PATCH",
  );
  revalidatePath(`/${locale}/membership-plans`);
}

export async function deleteMembershipPlanAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";
  const planId = getString(formData, "planId");

  await postToBackend(locale, `/api/membership-plans/${planId}`, {}, "DELETE");
  revalidatePath(`/${locale}/membership-plans`);
}

export async function createProductAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";

  await postToBackend(locale, "/api/products", {
    code: getString(formData, "code"),
    name: getString(formData, "name"),
    category: getString(formData, "category"),
    unitCost: getNumberValue(formData, "unitCost"),
    salePrice: getNumberValue(formData, "salePrice"),
    stockOnHand: getNumberValue(formData, "stockOnHand"),
    minimumStockLevel: getNumberValue(formData, "minimumStockLevel"),
    status: getString(formData, "status"),
  });
  revalidatePath(`/${locale}/products`);
}

export async function updateProductAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";
  const productId = getString(formData, "productId");

  await postToBackend(
    locale,
    `/api/products/${productId}`,
    {
      code: getString(formData, "code"),
      name: getString(formData, "name"),
      category: getString(formData, "category"),
      unitCost: getNumberValue(formData, "unitCost"),
      salePrice: getNumberValue(formData, "salePrice"),
      stockOnHand: getNumberValue(formData, "stockOnHand"),
      minimumStockLevel: getNumberValue(formData, "minimumStockLevel"),
      status: getString(formData, "status"),
    },
    "PATCH",
  );
  revalidatePath(`/${locale}/products`);
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";
  const productId = getString(formData, "productId");

  await postToBackend(locale, `/api/products/${productId}`, {}, "DELETE");
  revalidatePath(`/${locale}/products`);
}

export async function patchSystemConfigAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";
  const configKey = getString(formData, "configKey");

  await postToBackend(
    locale,
    `/api/settings/${configKey}`,
    { value: getString(formData, "value") },
    "PATCH",
  );
  revalidatePath(`/${locale}/settings`);
}

export async function updateAccountAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";

  await postToBackend(
    locale,
    "/api/auth/account",
    {
      username: getOptionalString(formData, "username"),
      currentPassword: getOptionalString(formData, "currentPassword"),
      newPassword: getOptionalString(formData, "newPassword"),
    },
    "PATCH",
  );

  revalidatePath(`/${locale}/settings`);
  revalidatePath(`/${locale}/dashboard`);
}

export async function patchPtCompensationAction(formData: FormData): Promise<void> {
  const locale = getString(formData, "locale") || "en";
  const ptId = getString(formData, "ptId");
  const configUpdates = [
    {
      key: `pt_${ptId}_base_salary`,
      value: getString(formData, "baseSalary"),
    },
    {
      key: `pt_${ptId}_overtime_hourly_rate`,
      value: getString(formData, "overtimeHourlyRate"),
    },
    {
      key: `pt_${ptId}_allowance`,
      value: getString(formData, "allowance"),
    },
    {
      key: `pt_${ptId}_package_commission_rate`,
      value: getString(formData, "packageCommissionRate"),
    },
    {
      key: `pt_${ptId}_sales_commission_rate`,
      value: getString(formData, "salesCommissionRate"),
    },
    {
      key: `pt_${ptId}_performance_bonus_threshold`,
      value: getString(formData, "performanceBonusThreshold"),
    },
    {
      key: `pt_${ptId}_performance_bonus_amount`,
      value: getString(formData, "performanceBonusAmount"),
    },
  ];

  await Promise.all(configUpdates.map(async (config) =>
    postToBackend(
      locale,
      `/api/settings/${config.key}`,
      { value: config.value },
      "PATCH",
    ),
  ));

  revalidatePath(`/${locale}/pts`);
  revalidatePath(`/${locale}/pts/${ptId}`);
  revalidatePath(`/${locale}/payroll`);
  revalidatePath(`/${locale}/settings`);
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
    ptId: getString(formData, "ptId"),
    memberMembershipId: getString(formData, "memberMembershipId"),
    assignedFrom: getString(formData, "assignedFrom"),
    commissionType: getOptionalString(formData, "commissionType") ?? "PERCENT",
    commissionValue: getOptionalNumberValue(formData, "commissionValue") ?? 10,
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
    customerName: getOptionalString(formData, "customerName") ?? "Khach le",
    paymentMethod: getString(formData, "paymentMethod"),
    discountAmount: getOptionalNumberValue(formData, "discountAmount") ?? 0,
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
    ptId: getOptionalString(formData, "ptId"),
    checkInAt: getOptionalString(formData, "checkInAt"),
  });
  revalidatePath(`/${locale}/pts/attendance`);
}

export async function checkOutAttendanceAction(
  formData: FormData,
): Promise<void> {
  const locale = getString(formData, "locale") || "en";

  await postToBackend(locale, "/api/attendance/check-out", {
    ptId: getOptionalString(formData, "ptId"),
    attendanceLogId: getOptionalString(formData, "attendanceLogId"),
    checkOutAt: getOptionalString(formData, "checkOutAt"),
  });
  revalidatePath(`/${locale}/pts/attendance`);
}
