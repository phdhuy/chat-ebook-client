export const formatDateTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

export const mapSenderTypeToRole = (senderType: string): "user" | "bot" => {
  return senderType.toLowerCase() === "user" ? "user" : "bot";
};

export const ACCESS_TOKEN = "accessToken";
export const REFRESH_TOKEN = "refreshToken";
export const ALLOW_FILE_TYPES = ["application/pdf"];
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MESSAGE_PER_PAGE = 10;
