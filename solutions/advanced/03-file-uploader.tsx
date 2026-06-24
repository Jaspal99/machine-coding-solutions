"use client";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
const MAX = 5 * 1024 * 1024;
export default function FileUploader() {
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const xhr = useRef<XMLHttpRequest | null>(null);
  const accept = (next?: File) => {
    setError("");
    if (!next) return;
    if (!next.type.startsWith("image/")) return setError("Images only.");
    if (next.size > MAX) return setError("Maximum size is 5 MB.");
    setFile(next);
    setPreview(URL.createObjectURL(next));
  };
  const change = (e: ChangeEvent<HTMLInputElement>) =>
    accept(e.target.files?.[0]);
  const drop = (e: DragEvent) => {
    e.preventDefault();
    accept(e.dataTransfer.files[0]);
  };
  const upload = () => {
    if (!file) return;
    const request = new XMLHttpRequest();
    xhr.current = request;
    request.open("POST", "/api/upload");
    request.upload.onprogress = (e) =>
      setProgress(Math.round((e.loaded / e.total) * 100));
    request.onerror = () => setError("Upload failed.");
    const body = new FormData();
    body.append("file", file);
    request.send(body);
  };
  return (
    <section onDragOver={(e) => e.preventDefault()} onDrop={drop}>
      <input type="file" accept="image/*" onChange={change} />
      {file && (
        <>
          <p>{file.name}</p>
          <img src={preview} alt="Preview" width="200" />
          <progress value={progress} max="100" />
          <button onClick={upload}>Upload</button>
          <button onClick={() => xhr.current?.abort()}>Cancel upload</button>
          <button
            onClick={() => {
              setFile(undefined);
              setPreview("");
            }}
          >
            Remove
          </button>
        </>
      )}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
