'use client';

import { type JSX, useEffect, useMemo, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ToastMessage } from 'primereact/toast';
import { useToast } from '@/hooks/use-toast/use-toast.hook.tsx';

const actionToastSeverityQueryKey = 'toastSeverity';
const actionToastMessageQueryKey = 'toastMessage';

type ToastSeverity = Extract<ToastMessage['severity'], 'error' | 'info' | 'success' | 'warn'>;

function resolveToastSeverity(rawSeverity: string | undefined): ToastSeverity {
  if (rawSeverity === 'error' || rawSeverity === 'info' || rawSeverity === 'success' || rawSeverity === 'warn') {
    return rawSeverity;
  }

  return 'error';
}

function resolveToastSummary(locale: string, severity: ToastSeverity): string {
  if (locale === 'vi') {
    if (severity === 'success') {
      return 'Thành công';
    }

    if (severity === 'info') {
      return 'Thông báo';
    }

    if (severity === 'warn') {
      return 'Cần chú ý';
    }

    return 'Có lỗi xảy ra';
  }

  if (severity === 'success') {
    return 'Success';
  }

  if (severity === 'info') {
    return 'Information';
  }

  if (severity === 'warn') {
    return 'Warning';
  }

  return 'Action failed';
}

export function ActionToastBridge({ locale }: { readonly locale: string }): JSX.Element | undefined {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const lastShownSignatureRef = useRef('');
  const searchParamsSnapshot = searchParams.toString();

  const toastPayload = useMemo(() => {
    const message = searchParams.get(actionToastMessageQueryKey);

    if (!message) {
      return null;
    }

    const severity = resolveToastSeverity(searchParams.get(actionToastSeverityQueryKey) ?? undefined);

    return {
      detail: message,
      severity,
      summary: resolveToastSummary(locale, severity),
    } satisfies ToastMessage;
  }, [locale, searchParams]);

  useEffect(() => {
    if (!toastPayload) {
      return;
    }

    const signature = `${toastPayload.severity}:${toastPayload.detail}`;

    if (lastShownSignatureRef.current === signature) {
      return;
    }

    lastShownSignatureRef.current = signature;
    showToast(toastPayload);

    const nextSearchParams = new URLSearchParams(searchParamsSnapshot);

    nextSearchParams.delete(actionToastSeverityQueryKey);
    nextSearchParams.delete(actionToastMessageQueryKey);

    const nextQuery = nextSearchParams.toString();
    const nextUrl = nextQuery.length > 0 ? `${pathname}?${nextQuery}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }, [pathname, router, searchParamsSnapshot, showToast, toastPayload]);

  return undefined;
}
