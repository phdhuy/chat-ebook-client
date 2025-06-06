import { useRef, useState, useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Upload,
  Link2,
  FileText,
  Cloud,
  Sparkles,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  Zap,
  Brain,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCreateConversation } from "@/pages/upload/hooks/use-create-conversation";
import { useQueryClient } from "@tanstack/react-query";
import { ALLOW_FILE_TYPES, MAX_FILE_SIZE } from "@/common";
import { useNavigate } from "react-router-dom";
import React from "react";

interface IFileFormInputs {
  file: FileList;
}

interface IUrlFormInputs {
  url: string;
}

const fileSchema = yup.object({
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
}) as yup.ObjectSchema<IFileFormInputs>;

const urlSchema = yup.object({
  url: yup
    .string()
    .required("URL is required")
    .url("Please enter a valid URL"),
}) as yup.ObjectSchema<IUrlFormInputs>;

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

const processingSteps = [
  { id: 1, label: "Uploading file", icon: Upload, duration: 2000 },
  { id: 2, label: "Analyzing content", icon: Brain, duration: 3000 },
  { id: 3, label: "Processing text", icon: FileText, duration: 2500 },
  { id: 4, label: "Preparing conversation", icon: BookOpen, duration: 1500 },
];

export default function UploadFilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("file");
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const fileForm = useForm<IFileFormInputs>({
    resolver: yupResolver(fileSchema),
    mode: "onChange",
  });

  const urlForm = useForm<IUrlFormInputs>({
    resolver: yupResolver(urlSchema),
    mode: "onChange",
  });

  const { ref: hookFormRef, ...fileInputProps } = fileForm.register("file");
  const selectedFile = fileForm.watch("file")?.[0];
  const urlValue = urlForm.watch("url");

  const { mutate: createConversation, isPending } = useCreateConversation({
    onSuccess: (data) => {
      setProgress(100);
      setProcessingMessage("Complete!");
      setTimeout(() => {
        setUploadStatus("success");
        queryClient.refetchQueries({ queryKey: ["my-conversations"] });
        setTimeout(() => {
          navigate(`/chat/${data?.data.id}`);
        }, 1500);
        fileForm.reset();
        urlForm.reset();
      }, 500);
    },
    onError: (error) => {
      console.error("Failed to upload file:", error);
      setUploadStatus("error");
      setErrorMessage("Failed to upload file. Please try again.");
      setCurrentStep(0);
      setProgress(0);
      setProcessingMessage("");
    },
  });

  useEffect(() => {
    if (!isPending) {
      setCurrentStep(0);
      setProgress(0);
      setProcessingMessage("");
      return;
    }

    let stepIndex = 0;
    let totalProgress = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < processingSteps.length) {
        const step = processingSteps[stepIndex];
        setCurrentStep(stepIndex + 1);
        setProcessingMessage(step.label);

        const stepProgress = (stepIndex + 1) * (100 / processingSteps.length);
        const progressInterval = setInterval(() => {
          totalProgress += 2;
          if (totalProgress >= stepProgress) {
            clearInterval(progressInterval);
            stepIndex++;
          } else {
            setProgress(totalProgress);
          }
        }, step.duration / 50);

        if (stepIndex === processingSteps.length - 1) {
          clearInterval(stepInterval);
        }
      }
    }, processingSteps[stepIndex]?.duration || 1000);

    return () => {
      clearInterval(stepInterval);
    };
  }, [isPending]);

  const onFileSubmit: SubmitHandler<IFileFormInputs> = (data) => {
    const file = data.file[0];
    setUploadStatus("idle");
    createConversation(file);
  };

  const onUrlSubmit: SubmitHandler<IUrlFormInputs> = (data) => {
    setUploadStatus("idle");
    console.log(data);
    // createConversation(data.url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(files[0]);
      fileForm.setValue("file", dataTransfer.files);
    }
  };

  const resetUploadStatus = () => {
    setUploadStatus("idle");
    setErrorMessage(null);
    setCurrentStep(0);
    setProgress(0);
    setProcessingMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/30 p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-400/30 to-indigo-500/30 dark:from-blue-600/20 dark:to-indigo-700/20 rounded-full blur-3xl opacity-60 -translate-y-1/3 translate-x-1/4 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-400/30 to-pink-500/30 dark:from-purple-600/20 dark:to-pink-700/20 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-r from-cyan-400/20 to-blue-500/20 dark:from-cyan-600/10 dark:to-blue-700/10 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-[0_32px_64px_rgba(8,_112,_184,_0.15)] dark:shadow-[0_32px_64px_rgba(59,_130,_246,_0.1)] border-0 rounded-3xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
                <Cloud className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Upload Your Document
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Transform your documents into interactive conversations. Upload
                files or provide URLs to get started.
              </p>
            </div>

            {isPending && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 border-0">
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25 animate-pulse">
                        {currentStep > 0 &&
                        currentStep <= processingSteps.length ? (
                          React.createElement(
                            processingSteps[currentStep - 1].icon,
                            {
                              className: "w-12 h-12 text-white animate-bounce",
                            }
                          )
                        ) : (
                          <Loader2 className="w-12 h-12 text-white animate-spin" />
                        )}
                      </div>
                      <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto"></div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        {processingMessage || "Initializing..."}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Please wait while we process your document
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Progress
                        value={progress}
                        className="h-3 bg-gray-200 dark:bg-gray-700"
                      />
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>
                          Step {currentStep} of {processingSteps.length}
                        </span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {processingSteps.map((step, index) => (
                        <div
                          key={step.id}
                          className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
                            index + 1 === currentStep
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                              : index + 1 < currentStep
                              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                              : "text-gray-400 dark:text-gray-600"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index + 1 === currentStep
                                ? "bg-blue-500 text-white animate-pulse"
                                : index + 1 < currentStep
                                ? "bg-green-500 text-white"
                                : "bg-gray-300 dark:bg-gray-600 text-gray-500"
                            }`}
                          >
                            {index + 1 < currentStep ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : index + 1 === currentStep ? (
                              <Zap className="w-3 h-3" />
                            ) : (
                              step.id
                            )}
                          </div>
                          <span className="text-sm font-medium">
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100/80 dark:bg-gray-700/50 rounded-2xl p-1 backdrop-blur-sm">
                <TabsTrigger
                  value="file"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/10 transition-all duration-300"
                  onClick={resetUploadStatus}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger
                  value="url"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/10 transition-all duration-300"
                  onClick={resetUploadStatus}
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  From URL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="space-y-6">
                <form onSubmit={fileForm.handleSubmit(onFileSubmit)}>
                  <div
                    className={`relative border-2 border-dashed rounded-3xl p-12 md:p-16 text-center transition-all duration-300 group cursor-pointer
                      ${
                        isDragOver
                          ? "border-blue-400 bg-blue-50/50 dark:bg-blue-900/20 scale-[1.02]"
                          : ""
                      }
                      ${
                        selectedFile
                          ? "border-green-400 bg-green-50/50 dark:bg-green-900/20"
                          : "border-gray-300/70 dark:border-gray-600/50 hover:border-blue-400 dark:hover:border-blue-400/70"
                      } 
                      ${
                        fileForm.formState.errors.file
                          ? "border-red-400 bg-red-50/50 dark:bg-red-900/20"
                          : ""
                      }
                      hover:shadow-[0_20px_40px_rgba(59,_130,_246,_0.1)] dark:hover:shadow-[0_20px_40px_rgba(59,_130,_246,_0.05)]
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleSelectClick}
                  >
                    <div
                      className={`mx-auto mb-8 w-32 h-32 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-lg
                        ${
                          selectedFile
                            ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/25"
                            : "bg-gradient-to-br from-blue-400 to-indigo-500 shadow-blue-500/25"
                        } 
                        ${
                          fileForm.formState.errors.file
                            ? "bg-gradient-to-br from-red-400 to-pink-500 shadow-red-500/25"
                            : ""
                        }
                        group-hover:scale-110 group-hover:shadow-xl
                      `}
                    >
                      {selectedFile ? (
                        <CheckCircle className="h-16 w-16 text-white" />
                      ) : fileForm.formState.errors.file ? (
                        <AlertCircle className="h-16 w-16 text-white" />
                      ) : (
                        <Upload className="h-16 w-16 text-white group-hover:scale-110 transition-transform duration-300" />
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
                        {selectedFile
                          ? "File ready to upload!"
                          : "Drop your file here"}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Supports PDF• Max 10MB
                      </p>

                      {!selectedFile && (
                        <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                          <Sparkles className="w-5 h-5" />
                          <span className="font-medium">
                            Click to browse or drag & drop
                          </span>
                        </div>
                      )}
                    </div>

                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf,.epub,.txt,.doc,.docx"
                      {...fileInputProps}
                      ref={mergeRefs(hookFormRef, fileInputRef)}
                    />
                  </div>

                  {selectedFile && (
                    <div className="mt-6 flex items-center justify-between bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            {selectedFile.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileForm.reset();
                        }}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {fileForm.formState.errors.file && (
                    <div className="mt-6 flex items-center gap-3 text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-900/20 p-4 rounded-2xl border border-red-200/50 dark:border-red-800/50">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p>{fileForm.formState.errors.file.message as string}</p>
                    </div>
                  )}

                  <div className="mt-8 flex justify-center">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={
                        isPending ||
                        !selectedFile ||
                        !!fileForm.formState.errors.file
                      }
                      className="px-12 py-4 rounded-2xl text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Start Conversation
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="url" className="space-y-6">
                <form onSubmit={urlForm.handleSubmit(onUrlSubmit)}>
                  <div className="space-y-6">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/25">
                        <Link2 className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                        Upload from URL
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Provide a direct link to your document and we'll fetch
                        it for you
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Input
                        {...urlForm.register("url")}
                        placeholder="https://example.com/document.pdf"
                        className="h-14 px-6 text-lg rounded-2xl border-2 border-gray-200/70 dark:border-gray-600/50 focus:border-purple-400 dark:focus:border-purple-400 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm transition-all duration-300"
                      />

                      {urlForm.formState.errors.url && (
                        <div className="flex items-center gap-3 text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-900/20 p-4 rounded-2xl border border-red-200/50 dark:border-red-800/50">
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                          <p>{urlForm.formState.errors.url.message}</p>
                        </div>
                      )}

                      {urlValue && !urlForm.formState.errors.url && (
                        <div className="flex items-center gap-3 text-green-600 dark:text-green-400 bg-green-50/80 dark:bg-green-900/20 p-4 rounded-2xl border border-green-200/50 dark:border-green-800/50">
                          <CheckCircle className="w-5 h-5 flex-shrink-0" />
                          <p>Valid URL detected</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 flex justify-center">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={
                          isPending ||
                          !urlValue ||
                          !!urlForm.formState.errors.url
                        }
                        className="px-12 py-4 rounded-2xl text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Fetch & Process
                      </Button>
                    </div>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            {uploadStatus === "success" && (
              <div className="mt-8 flex items-center gap-3 text-green-600 dark:text-green-400 bg-green-50/80 dark:bg-green-900/20 p-6 rounded-2xl border border-green-200/50 dark:border-green-800/50 animate-fade-in">
                <CheckCircle className="w-6 h-6 flex-shrink-0" />
                <div>
                  <p className="font-medium">Upload successful!</p>
                  <p className="text-sm opacity-80">
                    Redirecting to your conversation...
                  </p>
                </div>
              </div>
            )}

            {uploadStatus === "error" && (
              <div className="mt-8 flex items-center gap-3 text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-900/20 p-6 rounded-2xl border border-red-200/50 dark:border-red-800/50 animate-fade-in">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <div>
                  <p className="font-medium">Upload failed</p>
                  <p className="text-sm opacity-80">{errorMessage}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
