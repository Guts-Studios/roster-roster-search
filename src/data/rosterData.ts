
import { Person } from "../types";

// This is placeholder data - replace with your actual roster data from the spreadsheet
export const rosterData: Person[] = [
  {
    id: "1",
    name: "John Doe",
    badgeNumber: "B12345",
    rank: "Lieutenant",
    department: "Operations",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    division: "Field Operations", // Changed from position to division
    salary: 78500, // Added salary
    hireDate: "2018-05-15",
    status: "Active",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "2",
    name: "Jane Smith",
    badgeNumber: "B12346",
    rank: "Officer",
    department: "Patrol",
    email: "jane.smith@example.com",
    phone: "(555) 123-4568",
    division: "South District", // Changed from position to division
    salary: 65000, // Added salary
    hireDate: "2019-03-22",
    status: "Active",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "3",
    name: "Robert Johnson",
    badgeNumber: "B12347",
    rank: "Sergeant",
    department: "Investigations",
    email: "robert.johnson@example.com",
    phone: "(555) 123-4569",
    division: "Criminal Investigations", // Changed from position to division
    salary: 82000, // Added salary
    hireDate: "2015-11-08",
    status: "Active",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "4",
    name: "Emily Davis",
    badgeNumber: "B12348",
    rank: "Officer",
    department: "Special Units",
    email: "emily.davis@example.com",
    phone: "(555) 123-4570",
    division: "K9 Unit", // Changed from position to division
    salary: 68500, // Added salary
    hireDate: "2020-01-15",
    status: "Active",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "5",
    name: "Michael Wilson",
    badgeNumber: "B12349",
    rank: "Captain",
    department: "Administration",
    email: "michael.wilson@example.com",
    phone: "(555) 123-4571",
    division: "Command Staff", // Changed from position to division
    salary: 105000, // Added salary
    hireDate: "2010-07-22",
    status: "Active",
    imageUrl: "/placeholder.svg"
  }
];
