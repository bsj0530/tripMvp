import { Outlet } from "react-router";

export default function GlobalLayout() {
  return (
    <div className="text-dark min-h-screen w-full bg-white">
      <Outlet />
    </div>
  );
}
