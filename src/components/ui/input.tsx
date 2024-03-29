import * as React from "react";

import { cn } from "@/lib/utils";

interface InputPropsBase {
  className?: string;
  type?: "text" | "email" | "password" | "date" | "number" | "file" | "textarea";
  placeholder?: string;
  disabled?: boolean; // Add disabled property
}

interface InputProps<T extends HTMLElement> extends InputPropsBase {
  onChange?: React.ChangeEventHandler<T>;
}

type Props = InputProps<HTMLInputElement> | InputProps<HTMLTextAreaElement>;

const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  Props
>((props, ref) => {
  const { className, type, onChange, ...rest } = props;

  if (type === "textarea") {
    return (
      <textarea
        className={cn(
          "flex w-full rounded-md border-2 resize-none border-black px-3 py-2 text-sm",
          className
        )}
        ref={ref as React.RefObject<HTMLTextAreaElement>}
        {...rest}
        onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
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
      onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
    />
  );
});

Input.displayName = "Input";

export { Input };
