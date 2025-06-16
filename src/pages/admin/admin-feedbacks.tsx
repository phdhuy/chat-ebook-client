import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Download,
  Eye,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { formatDateTime } from "@/common";
import { useGetListFeedback } from "./hooks/use-get-list-feedback";
import { FeedbackResponse } from "@/api/admin-api";

export default function AdminFeedbackPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const {
    data: response,
    isLoading,
    error,
  } = useGetListFeedback({
    sort: sortField,
    order: sortOrder,
    page: 1,
    paging: 10000,
    query: searchTerm,
  });

  const feedbacks: FeedbackResponse[] = response?.data || [];

  const formatReason = (reason: string) => {
    return reason
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Error loading feedback
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Feedback
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and review user feedback
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>
            Filter feedback by search terms or reason
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                <SelectItem value="POOR_FORMATTING">Poor Formatting</SelectItem>
                <SelectItem value="MISSING_OR_INCORRECT_CITATION">
                  Missing/Incorrect Citation
                </SelectItem>
                {/* Add more reasons as needed */}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>All Feedback ({feedbacks.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Sorting Controls */}
          <div className="flex justify-end space-x-2 mb-4">
            <Select value={sortField} onValueChange={setSortField}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="created_at">Created At</SelectItem>
                <SelectItem value="reason_feedback">Reason</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4 animate-pulse">
                  <div className="w-1/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-1/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-1/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-1/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feedback ID</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Additional Feedback</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell>{feedback.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {formatReason(feedback.reason_feedback)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {feedback.additional_feedback || "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span>{feedback.user.username}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({feedback.user.email})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDateTime(feedback.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DialogTrigger asChild>
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Message
                              </DropdownMenuItem>
                            </DialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DialogContent className="sm:max-w-[625px]">
                          <DialogHeader>
                            <DialogTitle>Message Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                Message ID: {feedback.message.id}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Created At:{" "}
                                {formatDateTime(feedback.message.created_at)}
                              </p>
                            </div>
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                              <ReactMarkdown>
                                {feedback.message.content}
                              </ReactMarkdown>
                            </div>
                            {feedback.message.cited_excerpts.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                  Cited Excerpts
                                </h4>
                                {feedback.message.cited_excerpts.map(
                                  (excerpt) => (
                                    <div
                                      key={excerpt.id}
                                      className="text-xs mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-blue-600 dark:text-blue-400">
                                          [Source {excerpt.source_id}]
                                        </span>
                                        <span className="text-gray-500">
                                          Page {excerpt.page} • Confidence:{" "}
                                          {excerpt.score.toFixed(1)}
                                        </span>
                                      </div>
                                      <p className="mt-1 text-gray-700 dark:text-gray-300">
                                        {excerpt.text}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
