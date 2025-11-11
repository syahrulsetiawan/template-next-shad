'use client';

import * as React from 'react';
import {ChevronDownIcon} from 'lucide-react';

import {Calendar} from '@/components/ui/calendar';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import CustomInput from '../Input';
import {IDatepicker, ITimepicker} from './type';
import {format} from 'date-fns';
import {FORMAT_DATE} from '@/helpers/formatter';

export const Datepicker: React.FC<IDatepicker> = ({
  label,
  placeholder,
  defaultValue,
  onChange
}) => {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  const handleSelectDate = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setOpen(false);
    if (onChange) onChange(selectedDate); // ✅ kirim tanggal ke parent
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label htmlFor="date-picker" className="px-1">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex gap-2 relative">
            <CustomInput
              id="date-picker"
              className="bg-white justify-between font-normal hover:cursor-pointer"
              placeholder={placeholder ?? 'Select date'}
              value={date ? format(date.toLocaleDateString(), FORMAT_DATE) : ''}
              readOnly
              onClick={() => setOpen(true)}
            />
            <ChevronDownIcon
              size={22}
              className="text-gray-500 absolute right-2 top-[15%] hover:cursor-pointer"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            className="w-[20rem]"
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={handleSelectDate} // ✅ handler onChange date
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const Timepicker: React.FC<ITimepicker> = ({
  label,
  defaultValue = '00:00:00',
  onChange
}) => {
  const [time, setTime] = React.useState(defaultValue);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (onChange) onChange(newTime); // ✅ kirim waktu ke parent
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label htmlFor="time-picker" className="px-1">
          {label}
        </Label>
      )}
      <CustomInput
        type="time"
        id="time-picker"
        step="1"
        value={time}
        onChange={handleTimeChange}
        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
    </div>
  );
};
