export interface ICompanySetting {
  company_name: string;
  company_address: string;
  company_photo?: string;

  company_phone: string;
  company_email: string;
  company_website: string;
  company_tax_number: string;

  company_country: string;
  company_province: string;
  company_city: string;
  company_postal_code: string;

  config_date_format: string;
  config_currency_format: string /** #,### | #.### */;
  config_timezone: string /** WIB | WITA | WIT */;
  config_currency_code: string;
  config_default_language: string /** id | en */;
  config_accounting_fiscal_year_start: string /** YYYY-MM */;
  config_available_vat: boolean;
  config_vat_percentage: number;
}
