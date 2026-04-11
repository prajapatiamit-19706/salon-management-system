import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadImageApi } from "../../API/upload.api";
import toast from "react-hot-toast";

/**
 * Reusable image upload component with drag-drop, preview, and Cloudinary integration.
 *
 * Props:
 *  - value        (string)   current image URL (from DB / form state)
 *  - onChange      (fn)       callback with the new Cloudinary URL
 *  - placeholder   (string)   optional placeholder text
 */
export const ImageUpload = ({ value, onChange, placeholder = "Upload an image" }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    // Validate type
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP, or GIF images are allowed");
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }

    setUploading(true);
    try {
      const data = await uploadImageApi(file);
      onChange(data.url);
      toast.success("Image uploaded!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleRemove = () => {
    onChange("");
  };

  // ── If an image is already set, show preview ──────────────────
  if (value) {
    return (
      <div className="relative group w-full rounded-xl overflow-hidden border border-border-soft bg-bg-soft">
        <img
          src={value}
          alt="Uploaded"
          className="w-full h-48 object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="px-3 py-1.5 text-[12px] font-medium bg-white/90 text-gray-900 rounded-lg hover:bg-white transition"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 bg-red-500/90 text-white rounded-lg hover:bg-red-600 transition"
          >
            <X size={14} />
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    );
  }

  // ── Empty state: drop zone ────────────────────────────────────
  return (
    <div
      onClick={() => !uploading && fileRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300
        ${dragActive
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border-soft hover:border-primary/50 hover:bg-bg-panel/30"
        }
        ${uploading ? "pointer-events-none opacity-60" : ""}
      `}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-2">
        {uploading ? (
          <>
            <Loader2 size={28} className="text-primary animate-spin" />
            <p className="text-[12px] text-text-muted">Uploading…</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-bg-soft flex items-center justify-center">
              <ImageIcon size={20} className="text-text-muted" />
            </div>
            <p className="text-[12px] font-medium text-text-body">
              {placeholder}
            </p>
            <p className="text-[10px] text-text-muted">
              Drag & drop or <span className="text-primary font-medium">browse</span> · JPG, PNG, WEBP · Max 5 MB
            </p>
          </>
        )}
      </div>
    </div>
  );
};
