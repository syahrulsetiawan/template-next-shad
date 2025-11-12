import * as React from 'react';
import {FormLabel} from '@/components/ui/form';
import {cn} from '@/lib/utils';

interface MyFormLabelProps
  extends React.ComponentPropsWithoutRef<typeof FormLabel> {
  required?: boolean;
}

const MyFormLabel = React.forwardRef<
  React.ElementRef<typeof FormLabel>,
  MyFormLabelProps
>(({children, required = false, className, ...props}, ref) => {
  return (
    <FormLabel ref={ref} className={cn(className)} {...props}>
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </FormLabel>
  );
});

MyFormLabel.displayName = 'MyFormLabel';

export {MyFormLabel};
