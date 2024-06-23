import { SuperAdminPanel } from "@/features/SuperAdminPanel/SuperAdminPanel";

const SuperAdmin = () => {
  return (
    <div className="flex flex-col gap-8">
      <div>Super Admin</div>
      <SuperAdminPanel />
    </div>
  );
};

export default SuperAdmin;
