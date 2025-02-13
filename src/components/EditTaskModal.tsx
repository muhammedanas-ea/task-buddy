import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { db, storage } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useUserAuth } from "../context/userAuthContext";

interface EditTaskModalProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface TaskData {
  title: string;
  description: string;
  category: "Work" | "Personal";
  dueon: string;
  status: "TO-DO" | "IN-PROGRESS" | "COMPLETED";
  imageUrl: string | null;
  updatedAt: Date | undefined;
  createdAt: Date | undefined;
}

interface FormValues {
  title: string;
  description: string;
  category: "Work" | "Personal" | "";
  dueon: string;
  status: "TO-DO" | "IN-PROGRESS" | "COMPLETED" | "";
  image: File | null;
  imageUrl?: string | null;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string()
    .oneOf(["Work", "Personal"])
    .required("Category is required"),
  dueon: Yup.string().required("Due date is required"),
  status: Yup.string()
    .oneOf(["TO-DO", "IN-PROGRESS", "COMPLETED"])
    .required("Status is required"),
});

export default function EditTaskModal({
  taskId,
  isOpen,
  onClose,
}: EditTaskModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "activity">("details");
  const [data, setData] = useState<TaskData | null>(null);
  const { user } = useUserAuth();

  console.log(data);

  const initialValues: FormValues = {
    title: "",
    description: "",
    category: "",
    dueon: "",
    status: "",
    image: null,
    imageUrl: null,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        if (!user) return;

        let imageUrl = values.imageUrl;

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
          updatedAt: new Date().toISOString(),
        };

        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, taskData);
        onClose();
      } catch (error) {
        console.error("Error updating task:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const taskRef = doc(db, "tasks", taskId);
        const taskSnap = await getDoc(taskRef);

        if (taskSnap.exists()) {
          const taskData = taskSnap.data() as TaskData;
          setData(taskData);
          formik.setValues({
            ...initialValues,
            ...taskData,
            image: null,
            imageUrl: taskData.imageUrl,
          });

          if (taskData.imageUrl) {
            setImagePreview(taskData.imageUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    if (isOpen && taskId) {
      fetchTaskData();
    }
  }, [taskId, isOpen]);

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
    formik.setFieldValue("imageUrl", null);
    setImagePreview(null);
  };

  const renderDetailsSection = () => (
    <div className="space-y-4">
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
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Task Category*
          </label>
          <div className="flex flex-wrap gap-2">
            {["Work", "Personal"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => formik.setFieldValue("category", cat)}
                className={`px-4 py-2 border border-gray-300 rounded-[41px] text-[12px] ${
                  formik.values.category === cat
                    ? "bg-[#7B1984] text-white"
                    : "bg-gray-50 text-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {formik.touched.category && formik.errors.category && (
            <p className="pt-2 text-xs italic text-red-500">
              {formik.errors.category}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Due on*
          </label>
          <input
            type="date"
            id="dueon"
            {...formik.getFieldProps("dueon")}
            className="w-full px-4 py-2 border border-gray-300 rounded-[41px] text-[12px] text-gray-600 focus:border-purple-400"
          />
          {formik.touched.dueon && formik.errors.dueon && (
            <p className="pt-2 text-xs italic text-red-500">
              {formik.errors.dueon}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Task Status*
          </label>
          <select
            id="status"
            {...formik.getFieldProps("status")}
            className="w-full px-4 py-2 border border-gray-300 rounded-[41px] text-[12px] text-gray-600 focus:border-purple-400"
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
        <label className="block text-sm font-medium text-gray-500 mb-2">
          Attachment
        </label>
        <div className="border border-gray-300 rounded-md p-3 text-center">
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-32 rounded"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
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
  );

  const renderActivitySection = () => (
    <div className="p-4 flex flex-col gap-4 text-[#1E212A] text-[10px]">
      <div className="flex justify-between items-center">
        <p>You created this task</p>
        <p>
          {data?.createdAt
            ? String(
                new Date(data?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              )
            : ""}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p>
          You changed status from in <br /> progress to complete
        </p>
        <p>
          {data?.updatedAt
            ? String(
                new Date(data?.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              )
            : ""}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p>You uploaded file</p>
        <p>
          {data?.createdAt
            ? String(
                new Date(data?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              )
            : ""}
        </p>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-start justify-center md:p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-2xl md:rounded-2xl fixed bottom-0 md:static md:bottom-auto w-full max-w-[52rem] shadow-lg flex flex-col md:my-8">
        <div className="flex justify-end items-center p-4 border-b border-gray-300">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-4 h-[63vh] overflow-y-auto md:col-span-2 p-4">
              {/* Mobile Toggle Buttons - Only visible on small screens */}
              <div className="md:hidden w-full grid grid-cols-2 items-center gap-5">
                <button
                  type="button"
                  onClick={() => setActiveTab("details")}
                  className={`${
                    activeTab === "details"
                      ? "bg-black text-white"
                      : "border border-gray-300 bg-white"
                  } w-full px-4 py-2 rounded-[60px]`}
                >
                  Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("activity")}
                  className={`${
                    activeTab === "activity"
                      ? "bg-black text-white"
                      : "border border-gray-300 bg-white"
                  } w-full py-2 rounded-[60px] px-4`}
                >
                  Activity
                </button>
              </div>

              {/* Mobile View Content */}
              <div className="md:hidden">
                {activeTab === "details" && renderDetailsSection()}
                {activeTab === "activity" && renderActivitySection()}
              </div>

              {/* Desktop View Content - Always show details */}
              <div className="hidden md:block">{renderDetailsSection()}</div>
            </div>

            {/* Desktop Activity Section - Always visible on md and above */}
            <div className="hidden md:block md:col-span-1 bg-[#F1F1F1]">
              <div className="bg-white p-4">
                <h1 className="text-[16px]">Activity</h1>
              </div>
              {renderActivitySection()}
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4">
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
              {isSubmitting ? "UPDATING..." : "UPDATE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
