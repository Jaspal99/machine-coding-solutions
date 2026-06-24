"use client";
import { FormEvent, useState } from "react";
type Data = { name: string; email: string; company: string };
export default function MultiStepForm({
  submit,
}: {
  submit: (data: Data) => Promise<void>;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>({ name: "", email: "", company: "" });
  const [error, setError] = useState("");
  const valid =
    step === 0
      ? data.name.trim().length > 1
      : step === 1
        ? /^\S+@\S+\.\S+$/.test(data.email)
        : data.company.trim().length > 1;
  async function next(e: FormEvent) {
    e.preventDefault();
    if (!valid) return setError("Complete this step.");
    setError("");
    if (step < 2) setStep((s) => s + 1);
    else
      try {
        await submit(data);
        localStorage.removeItem("form-draft");
      } catch {
        setError("Submission failed.");
      }
  }
  const update = (key: keyof Data, value: string) => {
    const next = { ...data, [key]: value };
    setData(next);
    localStorage.setItem("form-draft", JSON.stringify(next));
  };
  const fields: (keyof Data)[] = ["name", "email", "company"];
  const field = fields[step];
  return (
    <form onSubmit={next}>
      <p>Step {step + 1} of 3</p>
      <label>
        {field}
        <input
          value={data[field]}
          type={field === "email" ? "email" : "text"}
          onChange={(e) => update(field, e.target.value)}
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <button
        type="button"
        disabled={step === 0}
        onClick={() => setStep((s) => s - 1)}
      >
        Previous
      </button>
      <button disabled={!valid}>{step === 2 ? "Submit" : "Next"}</button>
    </form>
  );
}
