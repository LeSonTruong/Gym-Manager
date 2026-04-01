import enMessages from '../../locales/en.json';
import viMessages from '../../locales/vi.json';

type LocaleKey = 'en' | 'vi';

type TranslationMessages = {
  RenderRoute: Record<string, string>;
};

const messages: Record<LocaleKey, TranslationMessages> = {
  en: enMessages as TranslationMessages,
  vi: viMessages as TranslationMessages,
};

function buildReverseMap(source: Record<string, string>): Record<string, string> {
  const reversed: Record<string, string> = {};

  for (const [key, value] of Object.entries(source)) {
    reversed[value] = key;
  }

  return reversed;
}

/* eslint-disable @typescript-eslint/naming-convention */
const directVietnameseTranslations: Record<string, string> = {
  'Dashboard overview': 'Tổng quan vận hành',
  'Gym operations': 'Vận hành phòng gym',
  'PT management': 'Quản lý PT',
  'Personal trainers': 'Nhân sự PT',
  'PT attendance': 'Chấm công PT',
  'Attendance logs': 'Nhật ký chấm công',
  'Payroll periods': 'Kỳ lương',
  'Payroll by trainer': 'Bảng lương theo PT',
  'Member management': 'Quản lý hội viên',
  'Member roster': 'Danh sách hội viên',
  'Membership lifecycle': 'Vòng đời gói tập',
  'Sold memberships': 'Gói đã bán',
  'Member assignments': 'Phân công hội viên',
  'Assignments log': 'Nhật ký phân công',
  'Membership plans': 'Gói tập',
  'Plan catalog': 'Danh mục gói tập',
  'Membership invoices': 'Hóa đơn membership',
  'Membership invoice list': 'Danh sách hóa đơn membership',
  'Products': 'Sản phẩm',
  'Product list': 'Danh sách sản phẩm',
  'Inventory transactions': 'Giao dịch kho',
  'Inventory ledger': 'Sổ kho',
  'Import tracker': 'Theo dõi nhập kho',
  'Import transactions': 'Giao dịch nhập kho',
  'Service invoices': 'Hóa đơn dịch vụ',
  'Sales invoices': 'Hóa đơn bán hàng',
  'Expense requests': 'Phiếu đề nghị chi',
  'Expense slips': 'Phiếu chi',
  'Equipment register': 'Danh mục thiết bị',
  'Equipment list': 'Danh sách thiết bị',
  'Maintenance log': 'Nhật ký bảo trì',
  'Maintenance history': 'Lịch sử bảo trì',
  'Revenue report': 'Báo cáo doanh thu',
  'Total revenue': 'Tổng doanh thu',
  'Payroll report': 'Báo cáo lương',
  'Inventory report': 'Báo cáo tồn kho',
  'Top sellers': 'Sản phẩm bán chạy',
  'Expense report': 'Báo cáo chi phí',
  'Expense by category': 'Chi phí theo danh mục',
  'Profit report': 'Báo cáo lợi nhuận',
  'Profit formula': 'Công thức lợi nhuận',
  'Settings': 'Cấu hình hệ thống',
  'System configs': 'Thiết lập hệ thống',
  'Secure access': 'Đăng nhập an toàn',
  'Login form': 'Biểu mẫu đăng nhập',
  'Retail catalog': 'Danh mục bán lẻ',
  'Total products': 'Tổng sản phẩm',
  'Low stock': 'Tồn kho thấp',
  'Stock value': 'Giá trị tồn kho',
  'Service revenue': 'Doanh thu dịch vụ',
};
/* eslint-enable @typescript-eslint/naming-convention */

const renderRouteToVietnameseTranslations: Record<string, string> = {};
for (const [key, englishValue] of Object.entries(messages.en.RenderRoute)) {
  const vietnameseValue = messages.vi.RenderRoute[key];
  if (vietnameseValue) {
    renderRouteToVietnameseTranslations[englishValue] = vietnameseValue;
  }
}

const directEnglishTranslations = buildReverseMap(directVietnameseTranslations);
const renderRouteToEnglishTranslations = buildReverseMap(renderRouteToVietnameseTranslations);

const englishToVietnameseTranslations: Record<string, string> = {
  ...renderRouteToVietnameseTranslations,
  ...directVietnameseTranslations,
};

const vietnameseToEnglishTranslations: Record<string, string> = {
  ...renderRouteToEnglishTranslations,
  ...directEnglishTranslations,
};

function normalizeTranslationKey(value: string): string {
  return value.trim().replaceAll(/\s+/g, ' ');
}

export function translateFromText(value: string, locale: LocaleKey): string {
  const normalized = normalizeTranslationKey(value);
  if (normalized.length === 0) {
    return value;
  }

  if (locale === 'vi') {
    const exactTranslated = englishToVietnameseTranslations[normalized];
    if (exactTranslated) {
      return exactTranslated;
    }

    let translated = normalized;
    for (const [english, vietnamese] of Object.entries(englishToVietnameseTranslations)) {
      translated = translated.replaceAll(english, vietnamese);
    }

    return translated;
  }

  const exactTranslated = vietnameseToEnglishTranslations[normalized];
  if (exactTranslated) {
    return exactTranslated;
  }

  let translated = normalized;
  for (const [vietnamese, english] of Object.entries(vietnameseToEnglishTranslations)) {
    translated = translated.replaceAll(vietnamese, english);
  }

  return translated;
}
