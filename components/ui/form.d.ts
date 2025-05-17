import type * as React from "react"
import type { FieldPath, FieldValues } from "react-hook-form"

export declare const Form: React.FC<React.PropsWithChildren<any>>
export declare const FormItem: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement>>
export declare const FormLabel: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<any>>
export declare const FormControl: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<any>>
export declare const FormDescription: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement>>
export declare const FormMessage: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement>>
export declare const FormField: <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: any,
) => React.ReactElement
export declare const useFormField: () => any
