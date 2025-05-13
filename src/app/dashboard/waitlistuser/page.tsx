// // src/app/dashboard/waitlist/page.tsx

// "use client";

// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getWaitlistUsers } from "@/lib/api/waitlist";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//     Pagination,
//     PaginationContent,
//     PaginationEllipsis,
//     PaginationItem,
//     PaginationLink,
//     PaginationNext,
//     PaginationPrevious,
// } from "@/components/ui/pagination";
// import { Badge } from "@/components/ui/badge";
// import { Download, Filter, MoreHorizontal, Search, SortAsc, SortDesc } from "lucide-react";

// interface WaitlistUser {
//     _id: string;
//     email: string;
//     fullName: string;
//     position: string;
//     country: string;
//     joinedAt: string;
//     [key: string]: string; // Index signature for dynamic field access
// }

// type SortField = "fullName" | "email" | "position" | "country" | "joinedAt";
// type SortDirection = "asc" | "desc";

// export default function WaitlistPage() {
//     const [searchQuery, setSearchQuery] = useState("");
//     const [positionFilter, setPositionFilter] = useState<string>("");
//     const [sortField, setSortField] = useState<SortField>("joinedAt");
//     const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
//     const [currentPage, setCurrentPage] = useState(1);
//     const pageSize = 10;

//     const { data, isLoading, isError, error } = useQuery({
//         queryKey: ["waitlistUsers"],
//         queryFn: () => getWaitlistUsers(),
//     });

//     const users = data?.data || [];

//     // Format position for display (first letter capitalized)
//     const formatPosition = (position: string): string => {
//         const displayName: Record<string, string> = {
//             sales: "Sales",
//             admin: "Admin",
//             digital: "Digital Marketing",
//             manager: "Manager",
//             freelancer: "Freelancer",
//             intern: "Intern",
//             finance: "Finance",
//             others: "Others",
//         };

//         return displayName[position] || position;
//     };

//     // Format date
//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString() + " " + date.toLocaleTimeString();
//     };

//     // Get unique position values for filter dropdown
//     const uniquePositions = [...new Set(users.map((user: WaitlistUser) => user.position))].filter(Boolean);

//     // Filter users based on search query and position filter
//     const filteredUsers = users.filter((user: WaitlistUser) => {
//         const matchesSearch = searchQuery === "" ||
//             user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             user.country.toLowerCase().includes(searchQuery.toLowerCase());

//         const matchesPosition = positionFilter === "" || user.position === positionFilter;

//         return matchesSearch && matchesPosition;
//     });

//     // Sort users
//     const sortedUsers = [...filteredUsers].sort((a: WaitlistUser, b: WaitlistUser) => {
//         let comparison = 0;

//         if (sortField === "joinedAt") {
//             comparison = new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
//         } else {
//             comparison = a[sortField] > b[sortField] ? 1 : -1;
//         }

//         return sortDirection === "desc" ? -comparison : comparison;
//     });

//     // Paginate users
//     const totalPages = Math.ceil(sortedUsers.length / pageSize);
//     const paginatedUsers = sortedUsers.slice(
//         (currentPage - 1) * pageSize,
//         currentPage * pageSize
//     );

//     // Toggle sort direction for a field
//     const toggleSort = (field: SortField) => {
//         if (sortField === field) {
//             setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//         } else {
//             setSortField(field);
//             setSortDirection("asc");
//         }
//     };

//     // Generate page numbers for pagination
//     const getPageNumbers = () => {
//         const pages: (number | string)[] = [];
//         const maxPagesToShow = 5;

//         if (totalPages <= maxPagesToShow) {
//             for (let i = 1; i <= totalPages; i++) {
//                 pages.push(i);
//             }
//         } else {
//             pages.push(1);

//             let startPage = Math.max(2, currentPage - 1);
//             let endPage = Math.min(currentPage + 1, totalPages - 1);

//             if (startPage > 2) {
//                 pages.push("ellipsis");
//             }

//             for (let i = startPage; i <= endPage; i++) {
//                 pages.push(i);
//             }

//             if (endPage < totalPages - 1) {
//                 pages.push("ellipsis");
//             }

//             pages.push(totalPages);
//         }

//         return pages;
//     };

//     // Handle export to CSV
//     const exportToCSV = () => {
//         const headers = ["Full Name", "Email", "Position", "Country", "Joined At"];

//         const csvContent = [
//             headers.join(","),
//             ...filteredUsers.map((user: WaitlistUser) => [
//                 `"${user.fullName}"`,
//                 `"${user.email}"`,
//                 `"${formatPosition(user.position)}"`,
//                 `"${user.country}"`,
//                 `"${formatDate(user.joinedAt)}"`
//             ].join(","))
//         ].join("\n");

//         const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.setAttribute("href", url);
//         link.setAttribute("download", "waitlist_users.csv");
//         link.style.visibility = "hidden";
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <Card className="border-0 shadow-sm">
//                 <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-t-lg">
//                     <div className="flex justify-between items-center">
//                         <div>
//                             <CardTitle className="text-2xl font-bold">Waitlist Users</CardTitle>
//                             <CardDescription className="text-indigo-100 mt-1">
//                                 Manage and review users who registered for the waitlist
//                             </CardDescription>
//                         </div>
//                         <Badge variant="secondary" className="text-sm px-3 py-1">
//                             Total: {filteredUsers.length}
//                         </Badge>
//                     </div>
//                 </CardHeader>
//                 <CardContent className="p-6">
//                     {isLoading ? (
//                         <div className="flex justify-center items-center h-64">
//                             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//                         </div>
//                     ) : isError ? (
//                         <div className="text-center py-8 text-red-600">
//                             Error loading users: {(error as Error).message}
//                         </div>
//                     ) : (
//                         <>
//                             <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
//                                 <div className="flex flex-1 w-full md:w-auto relative">
//                                     <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                                     <Input
//                                         placeholder="Search by name, email or country..."
//                                         value={searchQuery}
//                                         onChange={(e) => setSearchQuery(e.target.value)}
//                                         className="pl-10 w-full"
//                                     />
//                                 </div>
//                                 <div className="flex gap-2 w-full md:w-auto">
//                                     <Select value={positionFilter} onValueChange={setPositionFilter}>
//                                         <SelectTrigger className="w-full md:w-[180px]">
//                                             <div className="flex items-center gap-2">
//                                                 <Filter className="h-4 w-4" />
//                                                 <SelectValue placeholder="Filter by position" />
//                                             </div>
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="">All Positions</SelectItem>
//                                             {uniquePositions.map((position: string) => (
//                                                 <SelectItem key={position} value={position}>
//                                                     {formatPosition(position)}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                     <Button variant="outline" onClick={exportToCSV}>
//                                         <Download className="h-4 w-4 mr-2" />
//                                         Export
//                                     </Button>
//                                 </div>
//                             </div>

//                             <div className="rounded-lg border overflow-hidden">
//                                 <Table>
//                                     <TableHeader className="bg-gray-50">
//                                         <TableRow>
//                                             <TableHead
//                                                 className="cursor-pointer hover:bg-gray-100"
//                                                 onClick={() => toggleSort("fullName")}
//                                             >
//                                                 <div className="flex items-center">
//                                                     Full Name
//                                                     {sortField === "fullName" && (
//                                                         sortDirection === "asc" ?
//                                                             <SortAsc className="ml-1 h-4 w-4" /> :
//                                                             <SortDesc className="ml-1 h-4 w-4" />
//                                                     )}
//                                                 </div>
//                                             </TableHead>
//                                             <TableHead
//                                                 className="cursor-pointer hover:bg-gray-100"
//                                                 onClick={() => toggleSort("email")}
//                                             >
//                                                 <div className="flex items-center">
//                                                     Email
//                                                     {sortField === "email" && (
//                                                         sortDirection === "asc" ?
//                                                             <SortAsc className="ml-1 h-4 w-4" /> :
//                                                             <SortDesc className="ml-1 h-4 w-4" />
//                                                     )}
//                                                 </div>
//                                             </TableHead>
//                                             <TableHead
//                                                 className="cursor-pointer hover:bg-gray-100"
//                                                 onClick={() => toggleSort("position")}
//                                             >
//                                                 <div className="flex items-center">
//                                                     Position
//                                                     {sortField === "position" && (
//                                                         sortDirection === "asc" ?
//                                                             <SortAsc className="ml-1 h-4 w-4" /> :
//                                                             <SortDesc className="ml-1 h-4 w-4" />
//                                                     )}
//                                                 </div>
//                                             </TableHead>
//                                             <TableHead
//                                                 className="cursor-pointer hover:bg-gray-100"
//                                                 onClick={() => toggleSort("country")}
//                                             >
//                                                 <div className="flex items-center">
//                                                     Country
//                                                     {sortField === "country" && (
//                                                         sortDirection === "asc" ?
//                                                             <SortAsc className="ml-1 h-4 w-4" /> :
//                                                             <SortDesc className="ml-1 h-4 w-4" />
//                                                     )}
//                                                 </div>
//                                             </TableHead>
//                                             <TableHead
//                                                 className="cursor-pointer hover:bg-gray-100"
//                                                 onClick={() => toggleSort("joinedAt")}
//                                             >
//                                                 <div className="flex items-center">
//                                                     Joined At
//                                                     {sortField === "joinedAt" && (
//                                                         sortDirection === "asc" ?
//                                                             <SortAsc className="ml-1 h-4 w-4" /> :
//                                                             <SortDesc className="ml-1 h-4 w-4" />
//                                                     )}
//                                                 </div>
//                                             </TableHead>
//                                             <TableHead className="w-10"></TableHead>
//                                         </TableRow>
//                                     </TableHeader>
//                                     <TableBody>
//                                         {paginatedUsers.length === 0 ? (
//                                             <TableRow>
//                                                 <TableCell colSpan={6} className="text-center py-8 text-gray-500">
//                                                     No users found matching your criteria
//                                                 </TableCell>
//                                             </TableRow>
//                                         ) : (
//                                             paginatedUsers.map((user: WaitlistUser) => (
//                                                 <TableRow key={user._id} className="hover:bg-gray-50">
//                                                     <TableCell className="font-medium">{user.fullName}</TableCell>
//                                                     <TableCell>{user.email}</TableCell>
//                                                     <TableCell>
//                                                         <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
//                                                             {formatPosition(user.position)}
//                                                         </Badge>
//                                                     </TableCell>
//                                                     <TableCell>{user.country}</TableCell>
//                                                     <TableCell className="text-gray-500 text-sm">
//                                                         {formatDate(user.joinedAt)}
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <DropdownMenu>
//                                                             <DropdownMenuTrigger asChild>
//                                                                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                                                                     <MoreHorizontal className="h-4 w-4" />
//                                                                 </Button>
//                                                             </DropdownMenuTrigger>
//                                                             <DropdownMenuContent align="end">
//                                                                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                                                                 <DropdownMenuSeparator />
//                                                                 <DropdownMenuItem>View Details</DropdownMenuItem>
//                                                                 <DropdownMenuItem>Send Email</DropdownMenuItem>
//                                                                 <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
//                                                             </DropdownMenuContent>
//                                                         </DropdownMenu>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             ))
//                                         )}
//                                     </TableBody>
//                                 </Table>
//                             </div>

//                             {totalPages > 1 && (
//                                 <div className="mt-6">
//                                     <Pagination>
//                                         <PaginationContent>
//                                             <PaginationItem>
//                                                 <PaginationPrevious
//                                                     onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                                                     className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
//                                                 />
//                                             </PaginationItem>

//                                             {getPageNumbers().map((page, index) => (
//                                                 page === "ellipsis" ? (
//                                                     <PaginationItem key={`ellipsis-${index}`}>
//                                                         <PaginationEllipsis />
//                                                     </PaginationItem>
//                                                 ) : (
//                                                     <PaginationItem key={`page-${page}`}>
//                                                         <PaginationLink
//                                                             onClick={() => setCurrentPage(page as number)}
//                                                             isActive={currentPage === page}
//                                                         >
//                                                             {page}
//                                                         </PaginationLink>
//                                                     </PaginationItem>
//                                                 )
//                                             ))}

//                                             <PaginationItem>
//                                                 <PaginationNext
//                                                     onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                                                     className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
//                                                 />
//                                             </PaginationItem>
//                                         </PaginationContent>
//                                     </Pagination>
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }