"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROLES } from "@/lib/constants";
import { User } from "@/types/user";
import { AlertTriangle, Mail } from "lucide-react";
import { Login } from "@solar-icons/react";

export function CurrentUserDialog({
  user,
  open,
  onClose,
}: {
  user: User | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              {user.avatar}
            </div>
            <div>
              <h4 className="text-base font-semibold capitalize">
                {user.fullName || user.email}
              </h4>
              <p className="text-gray-600">{user.email}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                  user.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Role</p>
              <p className="text-lg font-semibold mt-1">{ROLES[user.role]}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-lg font-semibold mt-1">{user.projects}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Tasks Assigned</p>
              <p className="text-lg font-semibold mt-1">{user.tasks}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-lg font-semibold mt-1">87%</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Mail size={14} className="mr-1" />
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ImpersonateDialog({
  user,
  open,
  onClose,
  onConfirm,
}: {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-500" />
            Sign in as User
          </DialogTitle>
          <DialogDescription>
            You&apos;re about to log in as <strong>{user.name}</strong>. All
            actions will be logged for audit purposes.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-amber-900">Important</p>
          <ul className="text-xs text-amber-700 space-y-1 ml-4 list-disc">
            <li>You&apos;ll see exactly what this user sees</li>
            <li>You can perform actions as this user</li>
            <li>A banner will remind you that you&apos;re impersonating</li>
            <li>Use the exit banner action to return to the admin session</li>
            <li>This session is logged and can be audited</li>
          </ul>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">User Details</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-gray-500">Email:</div>
            <div className="font-medium text-gray-900">{user.email}</div>
            <div className="text-gray-500">Organizations:</div>
            <div className="font-medium text-gray-900">
              {user.user_organizations.map((org, index) => (
                <span key={org.id} className="capitalize">
                  {org.organization.name}
                  {index < user.user_organizations.length - 1 && ", "}
                </span>
              ))}
            </div>
            <div className="text-gray-500">Role:</div>
            <div>
              <Badge variant="outline" className="capitalize text-xs">
                {ROLES[user.role]}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Login size={14} className="mr-1.5" />
            Confirm & Sign In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
