import { TextField } from "@mui/material";
import styles from "./Book.module.scss";

export const FormField = ({
  label,
  value,
  displayValue,
  editMode,
  inputValue,
  inputType = "text",
  onChange,
  required,
  error,
  shake,
  className,
}: {
  label: string;
  value?: string | number | null;
  displayValue?: string;
  editMode: boolean;
  inputValue?: string | number | null;
  inputType?: "text" | "number" | "date";
  onChange: (value: string) => void;
  required?: boolean;
  error?: boolean;
  shake?: boolean;
  className?: string;
}) => {
  const dateValue =
    inputType === "date" && !!inputValue
      ? new Date(inputValue).toISOString().substring(0, 10)
      : null;
  const localValue = inputType !== "date" ? inputValue ?? "" : dateValue ?? "";
  const isError = required && !!error && !localValue;

  return (
    <div className="flex flex-row gap-4">
      <div
        className={`flex-grow-0 flex-shrink-0 flex flex-col justify-center w-32 text-slate-500 ${className ?? ""}`}
      >{`${label}:${editMode && !!required ? "*" : ""}`}</div>
      <div className="flex-auto">
        {!editMode && (displayValue ?? value)}
        {editMode && (
          <TextField
            type={inputType}
            size="small"
            className={`w-full ${isError && shake ? styles.shake : ""}`}
            value={localValue}
            error={isError}
            onChange={(e) => {
              if (e.target.value && inputType === "date")
                onChange(new Date(e.target.value).toISOString());
              else onChange(e.target.value);
            }}
          />
        )}
      </div>
    </div>
  );
};
