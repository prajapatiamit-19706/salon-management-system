import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Star, Clock, IndianRupee } from "lucide-react";
import { Modal, ConfirmDialog } from "../components/Modal";
import { StatusBadge } from "../components/StatusBadge";
// import { services as initialServices } from "../data/mockData";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createServiceApi, deleteServiceApi, fetchServices, updateServiceApi } from "../../API/service.api";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const categories = ["all", "hair", "beard", "spa", "facial", "makeup", "waxing", "nail", "eyebrow", "package"];
const genders = ["unisex", "male", "female"];

const emptyService = {
  displayOrder: 0,
  name: "",
  category: "hair",
  description: "",
  gender: "unisex",
  duration: 30,
  priceFrom: 0,
  tags: [],
  isActive: true,
};

export const Services = () => {

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [form, setForm] = useState(emptyService);
  const [tagsInput, setTagsInput] = useState(
    form.tags?.join(", ") || ""  // initialize from existing tags if editing
  );


  const queryClient = useQueryClient();

  const {
    data: services = [],
    isPending,
    isError,
    error,
    refetch,

  } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes   
  })


  const createMutation = useMutation({
    mutationFn: createServiceApi,       // your API function
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] }); // refetch the list
      toast.success("Service added successfully");
      setShowForm(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add service");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteServiceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] }); // refetch the list
      toast.success("Service deleted successfully");
      setDeleteItem(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete service");
    },
  })


  const updateMutation = useMutation({
    mutationFn: updateServiceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });   //refetch the list 
      toast.success("Service upadate successfully");
      setShowForm(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update service");
    },
  })


  if (isPending) return <LoadingSpinner />;
  if (isError)
    return (
      <div className="p-4">
        <p>Error: {error.message}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );


  const filtered = services
    .filter((s) => (catFilter === "all" || s.category === catFilter))
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setForm(emptyService);
    setEditItem(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ ...item });
    setTagsInput(item.tags?.join(", ") || ""); // ← add this line
    setShowForm(true);
  };

  const handleSave = () => {

    if (!form.name || !form.priceFrom || !form.duration) {
      toast.error("Please fill in all required fields");
      return;
    }
    const finalTags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    if (editItem) {
      // TODO: call update API mutation
      updateMutation.mutate(
        { id: editItem._id, data: { ...form, tags: finalTags } },
        {
          onSuccess: () => {
            setShowForm(false); // ✅ close only after success
          },
        }
      );
    } else {
      createMutation.mutate({ ...form, tags: finalTags });
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate(deleteItem._id);
    toast.success("Service deleted");
    setDeleteItem(null);
    refetch();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-heading tracking-tight">Services</h1>
          <p className="text-[13px] text-text-body mt-0.5">Manage your salon services and pricing</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-text-invert text-[13px] font-medium shadow-medium hover:bg-primary-soft transition-all duration-200"
        >
          <Plus size={16} />
          Add Service
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex flex-wrap items-center gap-1.5 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium capitalize whitespace-nowrap transition-all duration-200
                ${catFilter === cat
                  ? "bg-primary text-text-invert shadow-sm"
                  : "bg-bg-main border border-border-soft text-text-body hover:border-primary-soft hover:text-primary"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative ml-auto w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search services…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-bg-main border border-border-soft text-[12px] text-text-heading
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-soft
              placeholder:text-text-muted transition-all duration-200"
          />
        </div>
      </div>

      {/* Service cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((service) => (
          <div
            key={service._id}
            className="group bg-bg-main rounded-2xl border border-border-soft overflow-hidden hover:shadow-medium hover:-translate-y-0.5 transition-all duration-300"
          >
            {/* Image placeholder */}
            <div className="h-36 bg-bg-soft flex items-center justify-center relative">
              <span className="text-3xl">
                {service.category === "hair" ? "✂️" : service.category === "beard" ? "🪒" : service.category === "spa" ? "💆" : service.category === "facial" ? "✨" : service.category === "makeup" ? "💄" : service.category === "waxing" ? "🌿" : service.category === "nail" ? "💅" : service.category === "eyebrow" ? "👁️" : "📦"}
              </span>
              <div className="absolute top-3 right-3">
                <StatusBadge status={service.isActive ? "active" : "inactive"} />
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-[14px] font-semibold text-text-heading group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <p className="text-[11px] text-text-muted capitalize mt-0.5">{service.category} · {service.gender}</p>
              </div>

              {service.description && (
                <p className="text-[11px] text-text-body leading-relaxed line-clamp-2">{service.description}</p>
              )}

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[11px] text-text-body">
                    <Clock size={12} />
                    <span>{service.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-primary font-semibold">
                    <IndianRupee size={11} />
                    <span>{service.priceFrom}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={11} className="text-primary-soft fill-primary-soft" />
                  <span className="text-[11px] font-medium text-text-body">{service.rating}</span>
                </div>
              </div>

              {/* Tags */}
              {service.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {service.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-bg-panel text-primary font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-border-soft">
                <button
                  onClick={() => openEdit(service)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-medium text-text-body bg-bg-soft hover:bg-bg-panel transition-colors"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteItem(service)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16">
            <p className="text-[14px] text-text-muted">No services found</p>
          </div>
        )}
      </div>

      {/* ── Add/Edit Modal ─────────────────── */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editItem ? "Edit Service" : "Add New Service"}
        size="lg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Display order*">
            <input
              value={form.displayOrder}
              onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
              className="form-input"
              placeholder="e.g. 1"
            />
          </FormField>
          <FormField label="Service Name *">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="form-input"
              placeholder="e.g. Premium Haircut"
            />
          </FormField>
          <FormField label="Category *">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="form-input"
            >
              {categories.filter((c) => c !== "all").map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Gender *">
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="form-input"
            >
              {genders.map((g) => (
                <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Duration (minutes) *">
            <input
              type="text"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 0 })}
              className="form-input"
              min="5"
            />
          </FormField>
          <FormField label="Price From (₹) *">
            <input
              type="text"
              value={form.priceFrom}
              onChange={(e) => setForm({ ...form, priceFrom: parseInt(e.target.value) || 0 })}
              className="form-input"
              min="0"
            />
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="Description">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="form-input h-24 resize-none"
                placeholder="Describe the service..."
              />
            </FormField>
          </div>
          <div className="sm:col-span-2">
            <FormField label="Tags (comma separated)">
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onBlur={() => {
                  // Convert to array only when user leaves the field
                  setForm({
                    ...form,
                    tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
                  });
                }}
                className="form-input"
                placeholder="e.g. trending, popular, bestseller"
              />
            </FormField>
          </div>
          <FormField label="Active Status">
            <label className="flex items-center gap-3 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-5 h-5 rounded text-primary focus:ring-primary border-border-soft"
              />
              <span className="text-[14px] text-text-body">Service is active and visible to customers</span>
            </label>
          </FormField>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-border-soft">
          <button
            onClick={() => setShowForm(false)}
            className="px-5 py-2.5 rounded-xl text-[14px] font-medium text-text-body bg-bg-soft hover:bg-bg-panel transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="px-6 py-2.5 rounded-xl text-[14px] font-medium text-text-invert bg-primary hover:bg-primary-soft shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? "Adding..." : editItem ? "Update Service" : "Add Service"}
          </button>
        </div>
      </Modal>

      {/* ── Delete Confirm ─────────────────── */}
      <ConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
        confirmText="Delete Service"
        variant="danger"
      />
    </div>
  );
};

const FormField = ({ label, children }) => (
  <div>
    <label className="block text-[13px] font-semibold text-text-body uppercase tracking-wide mb-2">
      {label}
    </label>
    {children}
  </div>
);
