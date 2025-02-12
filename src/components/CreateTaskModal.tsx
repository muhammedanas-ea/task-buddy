import { useState } from "react";
import { X } from "lucide-react";
import { useFormik } from "formik";
import { validationSchema } from "../yup/validation";
import { db, storage } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useUserAuth } from "../context/userAuthContext";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
}: CreateTaskModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUserAuth();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category: "",
      dueon: "",
      status: "",
      image: null as File | null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        if (user) {
          let imageUrl = null;

          if (values.image) {
            const imageRef = ref(
              storage,
              `tasks/${user.uid}/${values.image.name}_${Date.now()}`
            );
            const uploadResult = await uploadBytes(imageRef, values.image);
            imageUrl = await getDownloadURL(uploadResult.ref);
          }

          const taskData = {
            userId: user.uid,
            title: values.title,
            description: values.description,
            category: values.category,
            dueon: values.dueon,
            status: values.status,
            imageUrl,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          await addDoc(collection(db, "tasks"), taskData);

          formik.resetForm();
          setImagePreview(null);
          onClose();
        }
      } catch (error) {
        console.error("Error creating task:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("image", null);
    setImagePreview(null);
  };

  const handleCategoryChange = (newCategory: "Work" | "Personal") => {
    formik.setFieldValue("category", newCategory);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center md:p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full mt-20 md:mt-0 md:max-w-xl shadow-lg flex flex-col h-[calc(100vh-2rem)] md:h-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <h2 className="text-lg font-medium text-gray-800">Create Task</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            <div>
              <input
                type="text"
                placeholder="Task title"
                id="title"
                {...formik.getFieldProps("title")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:border-purple-400"
              />
              {formik.touched.title && formik.errors.title && (
                <p className="pt-2 text-xs italic text-red-500">
                  {formik.errors.title}
                </p>
              )}
            </div>

            <div>
              <textarea
                placeholder="Description"
                id="description"
                {...formik.getFieldProps("description")}
                className="w-full px-3 py-2 border rounded-md border-gray-300 text-sm placeholder-gray-400 focus:border-purple-400 min-h-[100px] resize-none"
              />
              {formik.touched.description && formik.errors.description && (
                <p className="pt-2 text-xs italic text-red-500">
                  {formik.errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Task Category*
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handleCategoryChange("Work")}
                    className={`px-4 py-2 border border-gray-300 rounded-[41px] text-[12px] ${
                      formik.values.category === "Work"
                        ? "bg-[#7B1984] text-white"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    Work
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategoryChange("Personal")}
                    className={`px-4 py-2 border border-gray-300 rounded-[41px] text-[12px] ${
                      formik.values.category === "Personal"
                        ? "bg-[#7B1984] text-white"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    Personal
                  </button>
                </div>
                {formik.touched.category && formik.errors.category && (
                  <p className="pt-2 text-xs italic text-red-500">
                    {formik.errors.category}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Due on*
                </label>
                <input
                  type="date"
                  id="dueon"
                  {...formik.getFieldProps("dueon")}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-[41px] text-[12px] text-gray-600 focus:border-purple-400"
                />
                {formik.touched.dueon && formik.errors.dueon && (
                  <p className="pt-2 text-xs italic text-red-500">
                    {formik.errors.dueon}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Task Status*
                </label>
                <select
                  id="status"
                  {...formik.getFieldProps("status")}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-[41px] text-[12px] text-gray-600 focus:border-purple-400"
                >
                  <option value="">Choose</option>
                  <option value="TO-DO">TO-DO</option>
                  <option value="IN-PROGRESS">IN-PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
                {formik.touched.status && formik.errors.status && (
                  <p className="pt-2 text-xs italic text-red-500">
                    {formik.errors.status}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Attachment
              </label>
              <div className="border mt-2 border-gray-300 rounded-md p-3 text-center relative">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-32 mx-auto rounded"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 text-black rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="image"
                      className="text-[12px] text-gray-500 cursor-pointer"
                    >
                      Drop your files here or{" "}
                      <span className="text-blue-500 underline hover:text-blue-600">
                        Upload
                      </span>
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#F1F1F1] rounded-b-2xl border-t border-gray-300 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-sm bg-white hover:bg-gray-50 rounded-[41px]"
              disabled={isSubmitting}
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#7B1984] text-sm text-white rounded-[41px] hover:bg-purple-700 disabled:opacity-50"
            >
              {isSubmitting ? "CREATING..." : "CREATE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
