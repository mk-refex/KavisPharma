import { useRef, useState } from "react";
import { resolveImageUrl, uploadImage } from "@/services/api";

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}

export default function ImageField({
  label,
  value,
  onChange,
  hint,
}: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const result = await uploadImage(file);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const previewSrc = value ? resolveImageUrl(value) : "";

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground-700">
        {label}
      </label>
      {hint && <p className="text-xs text-foreground-500">{hint}</p>}

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste image URL or upload a file"
          className="flex-1 px-4 py-2.5 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-background-300 bg-background-50 text-sm font-medium text-foreground-700 hover:bg-background-100 disabled:opacity-50 whitespace-nowrap"
        >
          {uploading ? (
            <>
              <i className="ri-loader-4-line animate-spin"></i>
              Uploading...
            </>
          ) : (
            <>
              <i className="ri-upload-cloud-line"></i>
              Upload
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files?.[0])}
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {previewSrc && (
        <img
          src={previewSrc}
          alt="Preview"
          className="mt-1 h-24 w-auto max-w-full rounded-lg border border-background-200 object-cover"
        />
      )}
    </div>
  );
}
