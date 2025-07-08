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
import { useCreateConversationByUrl } from "@/pages/upload/hooks/use-create-conversation-by-url";
import { useQueryClient } from "@tanstack/react-query";
import { ALLOW_FILE_TYPES, isValidDomain, MAX_FILE_SIZE } from "@/common";
import { useNavigate } from "react-router-dom";
import React from "react";
import { CreateConversationByUrlRequest } from "@/api/conversation-api";
import { useTranslation } from "react-i18next";

interface IFileFormInputs {
  file: FileList;
}

interface IUrlFormInputs {
  url: string;
}

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
  const { t } = useTranslation();
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

  const fileSchema = yup.object({
    file: yup
      .mixed()
      .test(
        "fileRequired",
        t("upload_file.file_required"),
        (value) => value && value instanceof FileList && value.length > 0
      )
      .test("fileType", t("upload_file.unsupported_format"), (value) => {
        if (value && value instanceof FileList && value.length > 0) {
          return ALLOW_FILE_TYPES.includes(value[0].type);
        }
        return true;
      })
      .test("fileSize", t("upload_file.file_size_limit"), (value) => {
        if (value && value instanceof FileList && value.length > 0) {
          return value[0].size <= MAX_FILE_SIZE;
        }
        return true;
      }),
  }) as yup.ObjectSchema<IFileFormInputs>;

  const urlSchema = yup.object({
    url: yup
      .string()
      .required(t("upload_file.url_required"))
      .url(t("upload_file.invalid_url"))
      .test("validDomain", t("upload_file.invalid_domain"), (value) => {
        if (!value) return false;
        return isValidDomain(value);
      }),
  }) as yup.ObjectSchema<IUrlFormInputs>;

  const processingSteps = [
    {
      id: 1,
      label: t("upload_file.uploading_file"),
      icon: Upload,
      duration: 2000,
    },
    {
      id: 2,
      label: t("upload_file.analyzing_content"),
      icon: Brain,
      duration: 3000,
    },
    {
      id: 3,
      label: t("upload_file.processing_text"),
      icon: FileText,
      duration: 2500,
    },
    {
      id: 4,
      label: t("upload_file.preparing_conversation"),
      icon: BookOpen,
      duration: 1500,
    },
  ];

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

  const { mutate: createConversation, isPending: isFilePending } =
    useCreateConversation({
      onSuccess: (data) => {
        setProgress(100);
        setProcessingMessage(t("upload_file.complete"));
        setTimeout(() => {
          setUploadStatus("success");
          queryClient.refetchQueries({ queryKey: ["my-conversations"] });
          setTimeout(() => {
            navigate(`/chat/${data?.data.id}`);
          }, 500);
          fileForm.reset();
          urlForm.reset();
        }, 500);
      },
      onError: (error) => {
        console.error("Failed to upload file:", error);
        setUploadStatus("error");
        setErrorMessage(t("upload_file.failed_upload_file"));
        setCurrentStep(0);
        setProgress(0);
        setProcessingMessage("");
      },
    });

  const { mutate: createConversationByUrl, isPending: isUrlPending } =
    useCreateConversationByUrl({
      onSuccess: (data) => {
        setProgress(100);
        setProcessingMessage(t("upload_file.complete"));
        setTimeout(() => {
          setUploadStatus("success");
          queryClient.refetchQueries({ queryKey: ["my-conversations"] });
          setTimeout(() => {
            navigate(`/chat/${data?.data.id}`);
          }, 500);
          fileForm.reset();
          urlForm.reset();
        }, 500);
      },
      onError: (error) => {
        console.error("Failed to create conversation from URL:", error);
        setUploadStatus("error");
        setErrorMessage(t("upload_file.failed_upload_url"));
        setCurrentStep(0);
        setProgress(0);
        setProcessingMessage("");
      },
    });

  useEffect(() => {
    if (!isFilePending && !isUrlPending) {
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
  }, [isFilePending, isUrlPending]);

  const onFileSubmit: SubmitHandler<IFileFormInputs> = (data) => {
    const file = data.file[0];
    setUploadStatus("idle");
    createConversation(file);
  };

  const onUrlSubmit: SubmitHandler<IUrlFormInputs> = (data) => {
    setUploadStatus("idle");
    const request: CreateConversationByUrlRequest = { url: data.url };
    createConversationByUrl(request);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/30 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 to-indigo-500/30 dark:from-blue-600/20 dark:to-indigo-700/20 rounded-full blur-3xl opacity-60 -translate-y-1/3 translate-x-1/4 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-400/30 to-pink-500/30 dark:from-purple-600/20 dark:to-pink-700/20 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4"></div>
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gradient-to-r from-cyan-400/20 to-blue-500/20 dark:from-cyan-600/10 dark:to-blue-700/10 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-3xl relative z-10">
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-[0_16px_32px_rgba(8,_112,_184,_0.1)] dark:shadow-[0_16px_32px_rgba(59,_130,_246,_0.05)] border-0 rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

          <CardContent className="p-4 md:p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-4 shadow-md shadow-blue-500/20">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t("upload_file.title")}
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                {t("upload_file.subtitle")}
              </p>
            </div>

            {(isFilePending || isUrlPending) && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4 border-0">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-md shadow-blue-500/20 animate-pulse">
                        {currentStep > 0 &&
                        currentStep <= processingSteps.length ? (
                          React.createElement(
                            processingSteps[currentStep - 1].icon,
                            {
                              className: "w-10 h-10 text-white animate-bounce",
                            }
                          )
                        ) : (
                          <Loader2 className="w-10 h-10 text-white animate-spin" />
                        )}
                      </div>
                      <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto"></div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                        {processingMessage || t("upload_file.initializing")}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("upload_file.please_wait")}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Progress
                        value={progress}
                        className="h-2 bg-gray-200 dark:bg-gray-700"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {t("upload_file.step_of", {
                            current: currentStep,
                            total: processingSteps.length,
                          })}
                        </span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {processingSteps.map((step, index) => (
                        <div
                          key={step.id}
                          className={`flex items-center gap-2 p-1 rounded-lg transition-all duration-300 ${
                            index + 1 === currentStep
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                              : index + 1 < currentStep
                              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                              : "text-gray-400 dark:text-gray-600"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                              index + 1 === currentStep
                                ? "bg-blue-500 text-white animate-pulse"
                                : index + 1 < currentStep
                                ? "bg-green-500 text-white"
                                : "bg-gray-300 dark:bg-gray-600 text-gray-500"
                            }`}
                          >
                            {index + 1 < currentStep ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : index + 1 === currentStep ? (
                              <Zap className="w-2 h-2" />
                            ) : (
                              step.id
                            )}
                          </div>
                          <span className="text-xs font-medium">
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
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100/80 dark:bg-gray-700/50 rounded-xl p-1 backdrop-blur-sm">
                <TabsTrigger
                  value="file"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/10 transition-all duration-300"
                  onClick={resetUploadStatus}
                >
                  <Upload className="w-3 h-3 mr-1" />
                  {t("upload_file.upload_file_tab")}
                </TabsTrigger>
                <TabsTrigger
                  value="url"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/10 transition-all duration-300"
                  onClick={resetUploadStatus}
                >
                  <Link2 className="w-3 h-3 mr-1" />
                  {t("upload_file.from_url_tab")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="space-y-4">
                <form onSubmit={fileForm.handleSubmit(onFileSubmit)}>
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-6 md:p-8 text-center transition-all duration-300 group cursor-pointer
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
                      hover:shadow-[0_10px_20px_rgba(59,_130,_246,_0.1)] dark:hover:shadow-[0_10px_20px_rgba(59,_130,_246,_0.05)]
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleSelectClick}
                  >
                    <div
                      className={`mx-auto mb-4 w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-md
                        ${
                          selectedFile
                            ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/20"
                            : "bg-gradient-to-br from-blue-400 to-indigo-500 shadow-blue-500/20"
                        }
                        ${
                          fileForm.formState.errors.file
                            ? "bg-gradient-to-br from-red-400 to-pink-500 shadow-red-500/20"
                            : ""
                        }
                        group-hover:scale-105 group-hover:shadow-lg
                      `}
                    >
                      {selectedFile ? (
                        <CheckCircle className="h-10 w-10 text-white" />
                      ) : fileForm.formState.errors.file ? (
                        <AlertCircle className="h-10 w-10 text-white" />
                      ) : (
                        <Upload className="h-10 w-10 text-white group-hover:scale-105 transition-transform duration-300" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
                        {selectedFile
                          ? t("upload_file.file_ready")
                          : t("upload_file.drop_file_here")}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-base">
                        {t("upload_file.file_support")}
                      </p>

                      {!selectedFile && (
                        <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                          <Sparkles className="w-4 h-4" />
                          <span className="font-medium text-sm">
                            {t("upload_file.click_to_browse")}
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
                    <div className="mt-4 flex items-center justify-between bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
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
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}

                  {fileForm.formState.errors.file && (
                    <div className="mt-4 flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-900/20 p-3 rounded-xl border border-red-200/50 dark:border-red-800/50">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <p className="text-sm">
                        {fileForm.formState.errors.file.message as string}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-center">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={
                        isFilePending ||
                        !selectedFile ||
                        !!fileForm.formState.errors.file
                      }
                      className="px-8 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t("upload_file.start_conversation")}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <form onSubmit={urlForm.handleSubmit(onUrlSubmit)}>
                  <div className="space-y-4">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-purple-500/20">
                        <Link2 className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                        {t("upload_file.upload_from_url")}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {t("upload_file.url_subtitle")}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Input
                        {...urlForm.register("url")}
                        placeholder={t("upload_file.url_placeholder")}
                        className="h-12 px-4 text-base rounded-xl border-2 border-gray-200/70 dark:border-gray-600/50 focus:border-purple-400 dark:focus:border-purple-400 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm transition-all duration-300"
                      />

                      {urlForm.formState.errors.url && (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-900/20 p-3 rounded-xl border border-red-200/50 dark:border-red-800/50">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <p className="text-sm">
                            {urlForm.formState.errors.url.message}
                          </p>
                        </div>
                      )}

                      {urlValue && !urlForm.formState.errors.url && (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50/80 dark:bg-green-900/20 p-3 rounded-xl border border-green-200/50 dark:border-green-800/50">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <p className="text-sm">
                            {t("upload_file.valid_url")}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex justify-center">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={
                          isUrlPending ||
                          !urlValue ||
                          !!urlForm.formState.errors.url
                        }
                        className="px-8 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t("upload_file.fetch_process")}
                      </Button>
                    </div>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            {uploadStatus === "success" && (
              <div className="mt-6 flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50/80 dark:bg-green-900/20 p-4 rounded-xl border border-green-200/50 dark:border-green-800/50 animate-fade-in">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">
                    {t("upload_file.upload_successful")}
                  </p>
                  <p className="text-xs opacity-80">
                    {t("upload_file.redirecting")}
                  </p>
                </div>
              </div>
            )}

            {uploadStatus === "error" && (
              <div className="mt-6 flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-900/20 p-4 rounded-xl border border-red-200/50 dark:border-red-800/50 animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">
                    {t("upload_file.upload_failed")}
                  </p>
                  <p className="text-xs opacity-80">{errorMessage}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
