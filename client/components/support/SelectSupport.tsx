"use client";

import { useEffect } from "react";
import useSupportUsersStore from "@/store/supportUsersStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface SelectSupportProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function SelectSupport({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Selecciona un usuario de soporte",
}: SelectSupportProps) {
  const { supportUsers, loading, fetchSupportUsers } = useSupportUsersStore();

  useEffect(() => {
    if (supportUsers.length === 0) {
      fetchSupportUsers();
    }
  }, [fetchSupportUsers, supportUsers.length]);

  if (loading && supportUsers.length === 0) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {supportUsers.length === 0 ? (
          <div className="px-2 py-6 text-center text-sm text-gray-500">
            No hay usuarios de soporte disponibles
          </div>
        ) : (
          supportUsers.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              <div className="flex flex-col">
                <span className="font-medium">
                  {user.name} {user.lastname}
                </span>
              </div>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
