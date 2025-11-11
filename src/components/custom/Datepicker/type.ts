interface IBase {
  label?: string;
  defaultValue?: string;
}
export interface IDatepicker extends IBase {
  placeholder?: string;
  onChange?: (value: Date | undefined) => void; // ✅ trigger perubahan tanggal
}

export interface ITimepicker extends IBase {
  onChange?: (value: string) => void; // ✅ trigger perubahan waktu
}
