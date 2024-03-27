import * as React from "react";

import { cn } from "@/lib/utils";

interface InputPropsBase {
  className?: string;
  type?: "text" | "email" | "password" | "date" | "number" | "file" | "textarea";
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, InputPropsBase {
  type?: Exclude<"text" | "email" | "password" | "date" | "number" | "file", "textarea">;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, InputPropsBase {
  type: "textarea";
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

type Props = InputProps | TextareaProps;

const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  Props
>((props, ref) => {
  const { className, type, ...rest } = props;

  if (type === "textarea") {
    const { type: _, ...textareaProps } = props as TextareaProps;
    return (
      <textarea
        className={cn(
          "flex  w-full rounded-md border-2 resize-none border-black  px-3 py-2 text-sm ",
          className
        )}
        ref={ref as React.RefObject<HTMLTextAreaElement>}
        rows={4}
        {...textareaProps}
      />
    );
  }

  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-100 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-100 dark:ring-offset-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300",
        className
      )}
      ref={ref as React.RefObject<HTMLInputElement>}
      {...rest}
    />
  );
});

Input.displayName = "Input";

export { Input };
