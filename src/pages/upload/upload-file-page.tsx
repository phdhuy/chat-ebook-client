import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateConversation } from "@/hooks/use-create-conversation";
import { useQueryClient } from "@tanstack/react-query";
import { ALLOW_FILE_TYPES } from "@/common";
import { useNavigate } from "react-router-dom";

interface IFormInputs {
  file: FileList;
}

const schema = yup.object({
  file: yup
    .mixed()
    .required("A file is required")
    .test("fileType", "Unsupported file format", (value) => {
      if (value && value instanceof FileList && value.length > 0) {
        return ALLOW_FILE_TYPES.includes(value[0].type);
      }
      return false;
    }),
}) as yup.ObjectSchema<IFormInputs>;

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(value);
      } else {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

export default function UploadFilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<IFormInputs>({ resolver: yupResolver(schema) });

  const { ref: hookFormRef, ...fileInputProps } = register("file");
  const selectedFile = watch("file")?.[0];

  const { mutate: createConversation, isPending } = useCreateConversation({
    onSuccess: (data) => {
      setUploadStatus('success');
      queryClient.refetchQueries({ queryKey: ["my-conversations"] });
      navigate(`/chat/${data?.data.id}`);
      reset();
    },
    onError: (error) => {
      console.error("Failed to upload file:", error);
      setUploadStatus('error');
      setErrorMessage('Failed to upload file. Please try again.');
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    const file = data.file[0];
    console.log("Submitting file:", file);
    createConversation(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-16">
        <h1 className="text-3xl font-bold mb-6 text-center">Upload Your Ebook</h1>
        <p className="text-lg text-gray-500 text-center mb-10">
          Drag & drop a file here or click to select one
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors">
            <Upload className="mx-auto mb-6 h-16 w-16 text-primary" />
            <p className="text-xl text-gray-600 mb-6">Drag & drop your file here</p>
            <input
              type="file"
              id="file-upload"
              className="sr-only"
              accept=".pdf"
              {...fileInputProps}
              ref={mergeRefs(hookFormRef, fileInputRef)}
            />
            <Button size="lg" disabled={isPending} type="button" onClick={handleSelectClick}>
              {isPending ? "Uploading..." : "Select File"}
            </Button>
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">Selected file: {selectedFile.name}</p>
            )}
            {errors.file && (
              <p className="mt-2 text-sm text-red-600">{errors.file.message as string}</p>
            )}
          </div>
          <div className="mt-8 text-center">
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
        {uploadStatus === 'success' && (
          <p className="mt-4 text-green-600 text-center">File uploaded successfully!</p>
        )}
        {uploadStatus === 'error' && (
          <p className="mt-4 text-red-600 text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
