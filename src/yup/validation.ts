import * as Yup from "yup";

export const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),

  description: Yup.string()
    .optional()
    .min(10, "Description must be at least 10 characters")
    .nullable(),

  category: Yup.string().required("Category is required"),
  dueon: Yup.string().required("Due date is required"),
  status: Yup.string().required("Status is required"),

  image: Yup.mixed()
    .notRequired()
    .test("fileSize", "File size is too large (max 2MB)", (value) => {
      if (!value) return true; // Skip validation if no file is selected
      return (value as File).size <= 2 * 1024 * 1024; // 2MB max size
    }),
});
