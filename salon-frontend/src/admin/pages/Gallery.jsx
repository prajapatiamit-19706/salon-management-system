import { useState, useRef } from "react";
import { Upload, Trash2, Image, X, Loader2 } from "lucide-react";
import { ConfirmDialog } from "../components/Modal";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGalleryApi, addGalleryItemApi, deleteGalleryItemApi } from "../../API/gallery.api";
import { LoadingSpinner } from "../../components/LoadingSpinner";

export const Gallery = () => {
  const [deleteItem, setDeleteItem] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const queryClient = useQueryClient();

  const {
    data: images = [],
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["gallery"],
    queryFn: fetchGalleryApi,
    staleTime: 5 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGalleryItemApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Image deleted");
      setDeleteItem(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete");
    },
  });

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (const file of files) {
      try {
        await addGalleryItemApi({ file, title: file.name.replace(/\.[^.]+$/, "") });
        successCount++;
      } catch (err) {
        console.error("Upload failed for:", file.name, err);
        toast.error(`Failed to upload: ${file.name}`);
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} image(s) uploaded`);
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    }

    setUploading(false);
    e.target.value = "";
  };

  const handleDelete = () => {
    deleteMutation.mutate(deleteItem._id);
  };

  if (isPending) return <LoadingSpinner />;
  if (isError)
    return (
      <div className="p-4">
        <p>Error: {error.message}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-heading tracking-tight">Gallery</h1>
          <p className="text-[13px] text-text-body mt-0.5">Manage your salon's image gallery</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-text-body">{images.length} images</span>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-text-invert text-[13px] font-medium shadow-medium hover:bg-primary-soft transition-all duration-200 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload Images
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Upload area */}
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        className={`border-2 border-dashed border-border-soft rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-bg-panel/20 transition-all duration-300 group ${uploading ? "pointer-events-none opacity-50" : ""}`}
      >
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-bg-soft group-hover:bg-bg-panel flex items-center justify-center transition-colors">
          {uploading ? (
            <Loader2 size={24} className="text-primary animate-spin" />
          ) : (
            <Image size={24} className="text-text-muted group-hover:text-primary transition-colors" />
          )}
        </div>
        <p className="text-[13px] font-medium text-text-body group-hover:text-text-heading">
          {uploading ? "Uploading to Cloudinary…" : <>Drop images here or <span className="text-primary">browse</span></>}
        </p>
        <p className="text-[11px] text-text-muted mt-1">PNG, JPG, WEBP up to 20MB</p>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((img) => (
          <div
            key={img._id}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-bg-soft cursor-pointer border border-border-soft hover:shadow-medium transition-all duration-300"
          >
            {img.type === "video" ? (
              <video
                src={img.url}
                className="w-full h-full object-cover"
                onClick={() => setPreview(img)}
                muted
              />
            ) : (
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onClick={() => setPreview(img)}
              />
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <p className="text-text-invert text-[12px] font-medium truncate">{img.title}</p>
            </div>

            {/* Type badge */}
            {img.type === "video" && (
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/50 text-white text-[10px] font-medium">
                VIDEO
              </div>
            )}

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteItem(img);
              }}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 text-white/80 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-16">
          <Image size={48} className="mx-auto text-border-soft mb-3" />
          <p className="text-[14px] text-text-muted">No images yet. Upload your first image!</p>
        </div>
      )}

      {/* ── Image Preview (lightbox) ────────── */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <button
            onClick={() => setPreview(null)}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 text-text-invert hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
          {preview.type === "video" ? (
            <video
              src={preview.url}
              controls
              autoPlay
              className="max-w-full max-h-[85vh] rounded-2xl shadow-strong"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={preview.url}
              alt={preview.title}
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-strong"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <p className="absolute bottom-6 text-text-invert text-[14px] font-medium">{preview.title}</p>
        </div>
      )}

      {/* ── Delete Confirm ─────────────────── */}
      <ConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete Image"
        message="Are you sure you want to delete this image? This will also remove it from Cloudinary. This action cannot be undone."
        confirmText="Delete Image"
        variant="danger"
      />
    </div>
  );
};
