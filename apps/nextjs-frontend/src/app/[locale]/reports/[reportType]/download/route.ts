import process from "node:process";
import { type NextRequest } from "next/server";
import { requireGymSession } from "@/lib/gym-auth.ts";

type RouteParams = {
  locale: string;
  reportType: string;
};

const reportTypes = new Set(["payroll", "revenue", "expenses", "profit"]);
const formats = new Set(["pdf", "xlsx"]);

function getBackendUrl(): string {
  return (
    process.env.GYM_BACKEND_URL ??
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    "http://localhost:4000"
  ).replace(/\/$/v, "");
}

async function getReportDownloadHandler(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<RouteParams> | RouteParams;
  },
): Promise<Response> {
  const { locale, reportType } = await params;

  if (!reportTypes.has(reportType)) {
    return new Response("Report type is not supported", {
      status: 404,
    });
  }

  const requestedFormat = request.nextUrl.searchParams.get("format") ?? "pdf";
  const format = formats.has(requestedFormat) ? requestedFormat : "pdf";
  const session = await requireGymSession(locale);

  if (session.user.role !== "ADMIN") {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  const requestHeaders = new Headers();

  requestHeaders.set("Authorization", `Bearer ${session.accessToken}`);

  const response = await fetch(
    `${getBackendUrl()}/api/reports/${reportType}/export?format=${format}`,
    {
      headers: requestHeaders,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorMessage = await response.text().catch(() => "");

    return new Response(errorMessage || "Unable to export report", {
      status: response.status,
    });
  }

  const fileContent = await response.arrayBuffer();
  const contentType =
    response.headers.get("content-type") ??
    (format === "xlsx"
      ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      : "application/pdf");
  const contentDisposition =
    response.headers.get("content-disposition") ??
    `attachment; filename="${reportType}-report.${format}"`;

  return new Response(fileContent, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": contentDisposition,
      "Content-Type": contentType,
    },
  });
}

export { getReportDownloadHandler as GET };
