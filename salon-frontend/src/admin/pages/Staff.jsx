import { useState } from "react";
import { Plus, Pencil, Trash2, Star, Briefcase, Calendar } from "lucide-react";
import { Modal, ConfirmDialog } from "../components/Modal";
import { StatusBadge } from "../components/StatusBadge";
import { ImageUpload } from "../components/ImageUpload";
import toast from "react-hot-toast";
import { createStaffApi, getAllStaffApi, removeStaffApi, updateStaffApi } from "../../API/staffs.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const skillOptions = ["hair", "beard", "spa", "facial", "makeup", "waxing", "nail", "eyebrow"];
const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const emptyStaff = {
  name: "",
  phone: "",
  role: "",
  experience: 0,
  specialties: [],
  skills: [],
  gender: "male",
  rating: 0,
  bio: "",
  image: "",
  availability: [],
  socials: { instagram: "", facebook: "", twitter: "" },
  isActive: true,
};

export const Staff = () => {
  // const [data, setData] = useState(initialStaff);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [form, setForm] = useState(emptyStaff);
  const [specialtiesInput, setSpecialtiesInput] = useState(
    form.specialties?.join(", ") || ""
  );

  const queryClient = useQueryClient();

  const {
    data: staffs = [],
    isPending,
    error,
    refetch
  } = useQuery({

    queryKey: ["staffs"],
    queryFn: getAllStaffApi,
    staleTime: 5 * 60 * 1000,

  })


  const createMutation = useMutation({
    mutationFn: createStaffApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["staffs"]) //refetch the page
      toast.success("Staff created successfully");
      setShowForm(false);
      setForm(emptyStaff);
    },
    onError: (error) => {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to create staff");
    },
  })

  const deleteMutation = useMutation({
    mutationFn: removeStaffApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["staffs"]) //refetch the page
      toast.success("Staff deleted successfully");
      setDeleteItem(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove staff");
    }
  })

  const updateMutation = useMutation({
    mutationFn: updateStaffApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["staffs"])
      toast.success("staff updated successfully")
      setShowForm(false)
      setForm(emptyStaff)
      setEditItem(null)
    },
    onError: (error) => {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to update staff")
    }
  })


  const openAdd = () => {
    setForm(emptyStaff);
    setSpecialtiesInput("");
    setEditItem(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm({ ...item });
    setSpecialtiesInput(item.specialties?.join(", ") || "");
    setEditItem(item);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.role) {
      toast.error("Name and role are required");
      return;
    }

    const finalSpecialties = specialtiesInput.split(",").map((s) => s.trim()).filter(Boolean);
    const finalForm = { ...form, specialties: finalSpecialties };

    if (editItem) {
      updateMutation.mutate({ id: editItem._id, data: finalForm })
    } else {
      createMutation.mutate(finalForm)
    }
    setShowForm(false);
  };

  const handleDelete = () => {
    deleteMutation.mutate(deleteItem._id);
    setDeleteItem(null);
  };

  const toggleSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter((d) => d !== day)
        : [...prev.availability, day],
    }));
  };

  if (isPending) return <LoadingSpinner />
  if (error)
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
          <h1 className="text-xl font-bold text-text-heading tracking-tight">Staff</h1>
          <p className="text-[13px] text-text-body mt-0.5">Manage your salon team members</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-text-invert text-[13px] font-medium shadow-medium hover:bg-primary-soft transition-all duration-200"
        >
          <Plus size={16} />
          Add Staff
        </button>
      </div>

      {/* Staff cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {staffs.map((member) => (
          <div
            key={member._id}
            className="group bg-bg-main rounded-2xl border border-border-soft overflow-hidden hover:shadow-medium hover:-translate-y-0.5 transition-all duration-300"
          >
            {/* Profile header */}
            <div className="relative h-28 bg-bg-dark">
              <div className="absolute -bottom-8 left-5">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-16 h-16 rounded-2xl object-cover shadow-strong ring-4 ring-bg-main" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-text-invert text-xl font-bold shadow-strong ring-4 ring-bg-main">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute top-3 right-3">
                <StatusBadge status={member.isActive ? "active" : "inactive"} />
              </div>
            </div>

            <div className="pt-10 px-5 pb-5 space-y-3">
              <div>
                <h3 className="text-[15px] font-semibold text-text-heading">{member.name}</h3>
                <p className="text-[12px] text-primary font-medium">{member.role}</p>
              </div>

              {member.bio && (
                <p className="text-[11px] text-text-body leading-relaxed line-clamp-2">{member.bio}</p>
              )}

              <div className="flex items-center gap-4 text-[11px] text-text-body">
                <div className="flex items-center gap-1">
                  <Briefcase size={12} />
                  <span>{member.experience} yrs exp</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-primary-soft fill-primary-soft" />
                  <span className="font-medium text-text-heading">{member.rating}</span>
                </div>
                <div className="flex items-center gap-1 capitalize">
                  <span>{member.gender}</span>
                </div>
              </div>

              {/* Specialties */}
              {member.specialties?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {member.specialties.map((s) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-bg-panel text-primary font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Availability */}
              <div className="flex items-center gap-1">
                <Calendar size={11} className="text-text-muted" />
                <div className="flex gap-1">
                  {dayOptions.map((d) => (
                    <span
                      key={d}
                      className={`text-[9px] w-6 h-5 rounded flex items-center justify-center font-medium
                        ${member.availability?.includes(d) ? "bg-emerald-100 text-emerald-700" : "bg-bg-soft text-text-muted"}
                      `}
                    >
                      {d.charAt(0)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-border-soft">
                <button
                  onClick={() => openEdit(member)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-medium text-text-body bg-bg-soft hover:bg-bg-panel transition-colors"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteItem(member)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={13} />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Add/Edit Modal ─────────────────── */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editItem ? "Edit Staff" : "Add Staff Member"} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Full Name *">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input text-sm" placeholder="e.g. Arjun Patel" />
          </FormField>
          <FormField label="Phone">
            <input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-input text-sm" placeholder="e.g. +91 9876543210" />
          </FormField>
          <FormField label="Role *">
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="form-input text-sm" placeholder="e.g. Senior Stylist" />
          </FormField>
          <FormField label="Experience (years)">
            <input type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: parseInt(e.target.value) || 0 })} className="form-input text-sm" min="0" />
          </FormField>
          <FormField label="Gender">
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="form-input text-sm">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
          </FormField>
          <FormField label="Rating">
            <input type="number" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })} className="form-input text-sm" min="0" max="5" step="0.1" />
          </FormField>
          <FormField label="Specialties (comma separated)">
            <input
              value={specialtiesInput}
              onChange={(e) => setSpecialtiesInput(e.target.value)}
              onBlur={() => {
                setForm({
                  ...form,
                  specialties: specialtiesInput.split(",").map((t) => t.trim()).filter(Boolean)
                });
              }}
              className="form-input text-sm"
              placeholder="e.g. Haircut, Coloring"
            />
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="Bio">
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="form-input text-sm h-20 resize-none" placeholder="Short bio..." />
            </FormField>
          </div>

          {/* Image Upload */}
          <div className="sm:col-span-2">
            <FormField label="Profile Image">
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                placeholder="Upload staff profile image"
              />
            </FormField>
          </div>

          <FormField label="Instagram URL">
            <input value={form.socials?.instagram} onChange={(e) => setForm({ ...form, socials: { ...form.socials, instagram: e.target.value } })} className="form-input text-sm" placeholder="Instagram link" />
          </FormField>
          <FormField label="Facebook URL">
            <input value={form.socials?.facebook} onChange={(e) => setForm({ ...form, socials: { ...form.socials, facebook: e.target.value } })} className="form-input text-sm" placeholder="Facebook link" />
          </FormField>
          <FormField label="Twitter URL">
            <input value={form.socials?.twitter} onChange={(e) => setForm({ ...form, socials: { ...form.socials, twitter: e.target.value } })} className="form-input text-sm" placeholder="Twitter link" />
          </FormField>

          {/* Skills */}
          <div className="sm:col-span-2">
            <FormField label="Skills">
              <div className="flex flex-wrap gap-2 mt-1">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-200
                      ${form.skills?.includes(skill)
                        ? "bg-bg-panel text-primary border border-primary-soft"
                        : "bg-bg-soft text-text-body border border-border-soft hover:border-primary-soft"
                      }
                    `}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </FormField>
          </div>

          {/* Availability */}
          <div className="sm:col-span-2">
            <FormField label="Availability">
              <div className="flex flex-wrap gap-2 mt-1">
                {dayOptions.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${form.availability?.includes(day)
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                        : "bg-bg-soft text-text-body border border-border-soft hover:border-emerald-200"
                      }
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </FormField>
          </div>

          <FormField label="Active">
            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-5 h-5 rounded text-primary focus:ring-primary border-border-soft" />
              <span className="text-sm text-text-body">Staff member is active</span>
            </label>
          </FormField>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border-soft">
          <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-[13px] font-medium text-text-body bg-bg-soft hover:bg-bg-panel transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 rounded-xl text-[13px] font-medium text-text-invert bg-primary hover:bg-primary-soft shadow-sm transition-all duration-200">
            {editItem ? "Update Staff" : "Add Staff"}
          </button>
        </div>
      </Modal>

      {/* ── Delete Confirm ─────────────────── */}
      <ConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Remove Staff Member"
        message={`Are you sure you want to remove "${deleteItem?.name}"? This action cannot be undone.`}
        confirmText="Remove Staff"
        variant="danger"
      />
    </div>
  );
};

const FormField = ({ label, children }) => (
  <div>
    <label className="block text-sm font-semibold text-text-body uppercase tracking-wide mb-1.5">{label}</label>
    {children}
  </div>
);
