import type React from "react";
import { useRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateConversation } from "@/pages/upload/hooks/use-create-conversation";
import { useQueryClient } from "@tanstack/react-query";
import { ALLOW_FILE_TYPES, MAX_FILE_SIZE } from "@/common";
import { useNavigate } from "react-router-dom";

interface IFormInputs {
  file: FileList;
}

const schema = yup.object({
  file: yup
    .mixed()
    .test(
      "fileRequired",
      "A file is required",
      (value) => value && value instanceof FileList && value.length > 0
    )
    .test("fileType", "Unsupported file format", (value) => {
      if (value && value instanceof FileList && value.length > 0) {
        return ALLOW_FILE_TYPES.includes(value[0].type);
      }
      return true;
    })
    .test("fileSize", "File size must not exceed 10 MB", (value) => {
      if (value && value instanceof FileList && value.length > 0) {
        return value[0].size <= MAX_FILE_SIZE;
      }
      return true;
    }),
}) as yup.ObjectSchema<IFormInputs>;

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
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
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
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
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { ref: hookFormRef, ...fileInputProps } = register("file");
  const selectedFile = watch("file")?.[0];

  const { mutate: createConversation, isPending } = useCreateConversation({
    onSuccess: (data) => {
      setUploadStatus("success");
      queryClient.refetchQueries({ queryKey: ["my-conversations"] });
      navigate(`/chat/${data?.data.id}`);
      reset();
    },
    onError: (error) => {
      console.error("Failed to upload file:", error);
      setUploadStatus("error");
      setErrorMessage("Failed to upload file. Please try again.");
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    const file = data.file[0];
    console.log("Submitting file:", file);
    createConversation(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-purple-50 to-slate-100 dark:from-gray-900 dark:via-purple-950/10 dark:to-gray-950 p-4 md:p-8 relative overflow-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-300/40 to-indigo-300/40 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full blur-3xl opacity-70 -translate-y-1/3 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-300/40 to-cyan-300/40 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full blur-3xl opacity-70 translate-y-1/3 -translate-x-1/4"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-r from-pink-300/30 to-purple-300/30 dark:from-pink-900/10 dark:to-purple-900/10 rounded-full blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)] dark:shadow-[0_20px_50px_rgba(139,_92,_246,_0.15)] rounded-3xl p-10 md:p-16 border border-white/50 dark:border-gray-700/50 relative z-10">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 rounded-t-3xl"></div>

        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Upload Your Ebook
        </h1>
        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-300 text-center mb-10">
          Drag & drop a file here or click to select one
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`border-3 border-dashed rounded-2xl p-10 md:p-14 text-center transition-all duration-300 group
              ${
                selectedFile
                  ? "border-green-400 bg-green-50/50 dark:bg-green-900/10"
                  : "border-gray-300/70 dark:border-gray-600/70 hover:border-purple-400 dark:hover:border-purple-400/70"
              } 
              ${
                isPending
                  ? "border-blue-400 bg-blue-50/50 dark:bg-blue-900/10"
                  : ""
              }
              ${
                errors.file
                  ? "border-red-400 bg-red-50/50 dark:bg-red-900/10"
                  : ""
              }
              hover:shadow-[0_10px_30px_rgba(139,_92,_246,_0.1)] dark:hover:shadow-[0_10px_30px_rgba(139,_92,_246,_0.05)]
            `}
          >
            <div
              className={`mx-auto mb-8 w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500
              ${
                selectedFile
                  ? "bg-gradient-to-br from-green-400/80 to-emerald-500/80 dark:from-green-500/50 dark:to-emerald-600/50"
                  : "bg-gradient-to-br from-purple-400/80 to-indigo-500/80 dark:from-purple-500/50 dark:to-indigo-600/50"
              } 
              ${
                isPending
                  ? "bg-gradient-to-br from-blue-400/80 to-cyan-500/80 dark:from-blue-500/50 dark:to-cyan-600/50"
                  : ""
              }
              ${
                errors.file
                  ? "bg-gradient-to-br from-red-400/80 to-pink-500/80 dark:from-red-500/50 dark:to-pink-600/50"
                  : ""
              }
              group-hover:scale-110 group-hover:shadow-lg
            `}
            >
              <Upload
                className={`h-14 w-14 transition-all duration-300 text-white
                ${isPending ? "animate-pulse" : ""}
              `}
              />
            </div>

            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-6 font-medium">
              {isPending
                ? "Uploading your file..."
                : "Drag & drop your file here"}
            </p>

            <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md mx-auto">
              Supported format: PDF. Maximum file size: 10MB.
            </p>

            <input
              type="file"
              id="file-upload"
              className="sr-only"
              accept=".pdf"
              {...fileInputProps}
              ref={mergeRefs(hookFormRef, fileInputRef)}
            />

            <Button
              size="lg"
              disabled={isPending}
              type="button"
              onClick={handleSelectClick}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-10 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 text-lg"
            >
              {isPending ? "Uploading..." : "Select File"}
            </Button>

            {selectedFile && (
              <div className="mt-8 flex items-center justify-center gap-3 text-base text-gray-600 dark:text-gray-300 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm py-3 px-6 rounded-full border border-gray-100 dark:border-gray-600 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <p>
                  Selected:{" "}
                  <span className="font-medium">{selectedFile.name}</span>
                </p>
              </div>
            )}

            {errors.file && (
              <div className="mt-6 text-sm text-red-600 dark:text-red-400 bg-red-50/90 dark:bg-red-900/20 py-3 px-6 rounded-lg border border-red-200 dark:border-red-800/50 flex items-center justify-center gap-2 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>{errors.file.message as string}</p>
              </div>
            )}
          </div>

          <div className="mt-10 text-center">
            <Button
              type="submit"
              size="lg"
              disabled={isPending || !selectedFile || !!errors.file}
              className={`relative overflow-hidden px-12 py-4 rounded-full transition-all duration-300 text-lg
                ${
                  selectedFile && !isPending && !errors.file
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }
                ${
                  isPending
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    : ""
                }
              `}
            >
              {isPending && (
                <span className="absolute inset-0 w-full h-full">
                  <span className="absolute left-0 top-0 h-full bg-white/20 animate-progress-bar"></span>
                </span>
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </span>
            </Button>
          </div>
        </form>

        {uploadStatus === "success" && (
          <div className="mt-8 text-green-600 dark:text-green-400 text-center bg-green-50/90 dark:bg-green-900/20 py-4 px-6 rounded-lg border border-green-200 dark:border-green-800/50 animate-fade-in shadow-sm flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p>File uploaded successfully!</p>
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="mt-8 text-red-600 dark:text-red-400 text-center bg-red-50/90 dark:bg-red-900/20 py-4 px-6 rounded-lg border border-red-200 dark:border-red-800/50 animate-fade-in shadow-sm flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
