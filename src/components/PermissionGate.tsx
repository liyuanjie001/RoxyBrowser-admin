import type { ReactNode } from 'react';
import { hasCapability } from '@/auth/permissions';
import type { Capability, Role } from '@/auth/permissions';

interface Props {
  role: Role;
  capability: Capability;
  children: ReactNode;
}

export function PermissionGate({ role, capability, children }: Props) {
  if (!hasCapability(role, capability)) return null;
  return <>{children}</>;
}
