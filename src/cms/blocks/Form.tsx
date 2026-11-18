import * as React from "react";
import { useState } from "react";

export type CmsFormFieldType =
  "text" | "email" | "tel" | "number" | "date" | "textarea" | "select" | "checkbox";

export interface CmsFormField {
  name: string;
  label: string;
  type: CmsFormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: string;
  width?: "full" | "half";
}

export interface FormProps {
  heading?: string;
  description?: string;
  formType?: string;
  subject?: string;
  submitLabel?: string;
  successMessage?: string;
  compact?: boolean;
  design?: "card" | "bordered" | "minimal";
  layout?: "stacked" | "two-column";
  fields?: CmsFormField[];
}

export const defaultFormProps: FormProps = {
  heading: "Get in Touch",
  description: "Fill out the form and our team will be in touch.",
  formType: "Website Contact Form",
  subject: "",
  submitLabel: "Send Message",
  successMessage: "Thank you! Your submission has been received.",
  design: "card",
  layout: "stacked",
  fields: [
    { name: "name", label: "Full Name", type: "text", required: true, width: "half" },
    { name: "email", label: "Email Address", type: "email", required: true, width: "half" },
    { name: "phone", label: "Phone Number", type: "tel", width: "half" },
    { name: "message", label: "How can we help?", type: "textarea", required: true },
  ],
};

function getFieldName(field: CmsFormField, index: number): string {
  const name = field.name?.trim() || field.label?.trim() || `field-${index + 1}`;
  const safeName = name.toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
  return `${safeName || "field"}-${index}`;
}

function getDesignClasses(design: FormProps["design"]): string {
  switch (design) {
    case "bordered":
      return "rounded-2xl border-2 border-slate-200 bg-white p-6 sm:p-8";
    case "minimal":
      return "bg-transparent py-2";
    case "card":
    default:
      return "rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8";
  }
}

export function FormRender(props: FormProps) {
  const {
    heading = defaultFormProps.heading,
    description = defaultFormProps.description,
    formType = defaultFormProps.formType,
    subject,
    submitLabel = defaultFormProps.submitLabel,
    successMessage = defaultFormProps.successMessage,
    compact = false,
    design = "card",
    layout = "stacked",
    fields = defaultFormProps.fields ?? [],
  } = props;
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const formId = React.useId();
  const emailField = fields.find((field) => field.type === "email");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!emailField) {
      setStatus({
        kind: "error",
        message: "This form needs an email field before it can be submitted.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);
    const formData = new FormData(event.currentTarget);
    const values = fields.map((field, index) => ({
      field,
      key: getFieldName(field, index),
      value:
        field.type === "checkbox"
          ? formData.get(getFieldName(field, index)) === "on"
          : String(formData.get(getFieldName(field, index)) ?? "").trim(),
    }));
    const valueFor = (field?: CmsFormField) =>
      field ? values.find((entry) => entry.field === field)?.value : "";
    const nameField = fields.find((field) => field.name?.trim().toLowerCase() === "name");
    const phoneField = fields.find((field) => field.name?.trim().toLowerCase() === "phone");
    const messageField =
      fields.find((field) => field.name?.trim().toLowerCase() === "message") ??
      fields.find((field) => field.type === "textarea");
    const customFields = Object.fromEntries(
      values
        .filter(({ field }) => ![nameField, emailField, phoneField, messageField].includes(field))
        .map(({ field, value }) => [field.label || field.name, value]),
    );

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: valueFor(nameField) || valueFor(emailField),
          email: valueFor(emailField),
          phone: valueFor(phoneField),
          message: valueFor(messageField),
          source: typeof window === "undefined" ? "cms-page" : window.location.pathname,
          formType,
          ...(subject?.trim() ? { subject: subject.trim() } : {}),
          customFields,
          website: formData.get("website") ?? "",
        }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to submit the form. Please try again.");
      }

      setStatus({ kind: "success", message: result.message || successMessage || "Thank you!" });
      formRef.current?.reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to submit the form. Please try again.";
      setStatus({ kind: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  }

  const formContent = (
    <div className={getDesignClasses(design)}>
      {(heading || description) && (
        <div className="mb-6">
          {heading && (
            <h2 className="text-2xl font-bold tracking-tight text-[#142340]">{heading}</h2>
          )}
          {description && <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>}
        </div>
      )}

      {!emailField ? (
        <p role="alert" className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
          Add an Email field in the form settings to receive submissions.
        </p>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          <div className={layout === "two-column" ? "grid gap-5 sm:grid-cols-2" : "space-y-5"}>
            {fields.map((field, index) => {
              const name = getFieldName(field, index);
              const fieldId = `${formId}-${name}`;
              const fieldClass =
                layout === "two-column" && field.width !== "full" ? "" : "sm:col-span-2";
              const controlClass =
                "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1b4e94] focus:ring-2 focus:ring-blue-100";

              if (field.type === "checkbox") {
                return (
                  <label
                    key={name}
                    htmlFor={fieldId}
                    className={`flex items-start gap-2.5 text-sm text-slate-700 ${fieldClass}`}
                  >
                    <input
                      id={fieldId}
                      type="checkbox"
                      name={name}
                      required={field.required}
                      className="mt-0.5 size-4 rounded border-slate-300 accent-[#1b4e94]"
                    />
                    <span>{field.label}</span>
                  </label>
                );
              }

              return (
                <div key={name} className={fieldClass}>
                  <label
                    htmlFor={fieldId}
                    className="mb-1.5 block text-sm font-medium text-slate-800"
                  >
                    {field.label}
                    {(field.required || field.type === "email") && (
                      <span aria-hidden="true" className="ml-1 text-red-600">
                        *
                      </span>
                    )}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={fieldId}
                      name={name}
                      required={field.required}
                      placeholder={field.placeholder}
                      rows={4}
                      className={`${controlClass} min-h-28 resize-y`}
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={fieldId}
                      name={name}
                      required={field.required}
                      className={controlClass}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        {field.placeholder || "Please select"}
                      </option>
                      {(field.options || "")
                        .split(/[\n,]+/)
                        .map((option) => option.trim())
                        .filter(Boolean)
                        .map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <input
                      id={fieldId}
                      name={name}
                      type={field.type}
                      required={field.required || field.type === "email"}
                      placeholder={field.placeholder}
                      className={controlClass}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div
            className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor={`${formId}-website`}>Leave this field empty</label>
            <input
              id={`${formId}-website`}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0f2142] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1b4e94] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : submitLabel}
          </button>

          {status && (
            <p
              role={status.kind === "error" ? "alert" : "status"}
              className={`rounded-lg p-3 text-sm ${
                status.kind === "success"
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {status.message}
            </p>
          )}
        </form>
      )}
    </div>
  );

  return compact ? (
    formContent
  ) : (
    <section className="mx-auto my-8 w-full max-w-3xl px-4 sm:px-6">{formContent}</section>
  );
}
