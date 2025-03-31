import { useState, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const allowedFileTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

interface IFormInputs {
  file: FileList;
}

const schema = yup.object({
  file: yup
    .mixed()
    .required("A file is required")
    .test("fileType", "Unsupported file format", (value) => {
      if (value && value instanceof FileList && value.length > 0) {
        return allowedFileTypes.includes(value[0].type);
      }
      return false;
    }),
}) as yup.ObjectSchema<IFormInputs>;

export default function UploadFilePage() {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    setIsUploading(true);
    const file = data.file[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("File uploaded successfully");
        reset();
      } else {
        console.error("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-16">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Upload Your Ebook
        </h1>
        <p className="text-lg text-gray-500 text-center mb-10">
          Drag & drop a file here or click to select one
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors">
            <Upload className="mx-auto mb-6 h-16 w-16 text-primary" />
            <p className="text-xl text-gray-600 mb-6">
              Drag & drop your file here
            </p>
            <input
              type="file"
              id="file-upload"
              className="sr-only"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              {...register("file")}
              ref={fileInputRef}
            />
            <Button
              size="lg"
              disabled={isUploading}
              type="button"
              onClick={handleSelectClick}
            >
              {isUploading ? "Uploading..." : "Select File"}
            </Button>

            {errors.file && (
              <p className="mt-2 text-sm text-red-600">
                {errors.file.message as string}
              </p>
            )}
          </div>
          <div className="mt-8 text-center">
            <Button type="submit" size="lg" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
