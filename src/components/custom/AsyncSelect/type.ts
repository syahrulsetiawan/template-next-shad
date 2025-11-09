export type Option = {
  label: string;
  value: string | number;
};

export interface AsyncSelectProps {
  label?: string;
  value?: Option | null;
  onChange?: (value: Option | null) => void;
  options?: Option[]; // buat static
  fetchUrl?: string; // buat dynamic
  params?: Record<string, any>;
  placeholder?: string;
  debounceDuration?: number;
  disabled?: boolean;
}
