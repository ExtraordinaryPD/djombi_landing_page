"use client";

import ProfileContent from "@/components/ProfileContent";
import { Suspense } from "react";

export default function ProfilePage() {
  return (
    // <ProtectedRoute>
      <Suspense fallback={<div className="p-6">Loading profile settings...</div>}>
        <ProfileContent />
      </Suspense>
    // {/* </ProtectedRoute> */}
  );
}