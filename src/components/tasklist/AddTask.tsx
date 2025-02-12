import { useFormik } from "formik";
import { CornerDownLeft, Plus } from "lucide-react";
import { useState } from "react";
import { validationSchema } from "../../yup/validation";
import { useUserAuth } from "../../context/userAuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/config";

const AddTask = () => {
  const [showAddSection, setShowAddSection] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUserAuth();

  const formik = useFormik({
    initialValues: {
      title: "",
      category: "",
      dueon: "",
      status: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        if (user) {
          const taskData = {
            userId: user.uid,
            title: values.title,
            category: values.category,
            dueon: values.dueon,
            status: values.status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await addDoc(collection(db, "tasks"), taskData);
          handleCancel();
        }
      } catch (error) {
        console.error("Error creating task:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const statusOptions = ["TO-DO", "IN-PROGRESS", "COMPLETED"];
  const typeOptions = ["Work", "Personal"];

  const handleCancel = () => {
    formik.resetForm();
    setShowAddSection(false);
    setShowStatusDropdown(false);
    setShowTypeDropdown(false);
  };

  return (
    <div className="hidden md:block">
      <div className="px-16 p-4 border-b text-sm bg-gray-100 border-b-gray-300">
        <button
          className="flex gap-3 items-center cursor-pointer hover:text-gray-600"
          onClick={() => setShowAddSection(!showAddSection)}
        >
          <Plus size={18} className="text-purple-700" />
          <span className="font-bold text-sm">ADD TASK</span>
        </button>
      </div>
      {showAddSection && (
        <form onSubmit={formik.handleSubmit} className="border-b border-b-gray-300 p-4">
          <div className="grid grid-cols-5 items-center">
            <div className="col-span-2 pl-16">
              <input
                className="px-3 py-2 text-sm focus:outline-none"
                type="text"
                placeholder="Task Title"
                {...formik.getFieldProps('title')}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="pt-2 text-xs italic text-red-500">
                  {formik.errors.title}
                </p>
              )}
            </div>
            <div>
              <input
                type="date"
                id="dueon"
                {...formik.getFieldProps('dueon')}
                className="px-4 py-3 border border-gray-300 rounded-full text-[12px] text-gray-600 focus:border-purple-400"
              />
              {formik.touched.dueon && formik.errors.dueon && (
                <p className="pt-2 text-xs italic text-red-500">
                  {formik.errors.dueon}
                </p>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                className="justify-between cursor-pointer text-xs border p-3 rounded-full border-gray-300"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                {formik.values.status ? (
                  <span className="text-xs">{formik.values.status}</span>
                ) : (
                  <Plus size={16} />
                )}
              </button>
              {showStatusDropdown && (
                <div className="absolute mt-1 left-6 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  {statusOptions.map((status) => (
                    <div
                      key={status}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[12px]"
                      onClick={() => {
                        formik.setFieldValue('status', status);
                        setShowStatusDropdown(false);
                      }}
                    >
                      {status}
                    </div>
                  ))}
                </div>
              )}
              {formik.touched.status && formik.errors.status && (
                <p className="pt-2 text-xs italic text-red-500">
                  {formik.errors.status}
                </p>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                className="justify-between cursor-pointer text-xs border p-3 rounded-full border-gray-300"
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              >
                {formik.values.category ? (
                  <span className="text-xs">{formik.values.category}</span>
                ) : (
                  <Plus size={16} />
                )}
              </button>
              {showTypeDropdown && (
                <div className="absolute left-6 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  {typeOptions.map((type) => (
                    <div
                      key={type}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[12px]"
                      onClick={() => {
                        formik.setFieldValue('category', type);
                        setShowTypeDropdown(false);
                      }}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
              {formik.touched.category && formik.errors.category && (
                <p className="pt-2 text-xs italic text-red-500">
                  {formik.errors.category}
                </p>
              )}
            </div>
            <div className="flex items-center px-16 col-span-2 gap-3">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer text-sm text-white rounded-full bg-[#7B1984] hover:bg-[#7b1984de] disabled:opacity-50"
              >
                <span>{isSubmitting ? "ADDING..." : "ADD"}</span>
                <CornerDownLeft size={16} />
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm bg-white cursor-pointer hover:bg-[#fdf7f7] rounded-full"
                onClick={handleCancel}
              >
                CANCEL
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddTask;