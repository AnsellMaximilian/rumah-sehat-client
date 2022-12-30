import { Outlet } from "react-router-dom";

export default function DataLayout({ title }) {
  return (
    <main>
      <h1>{title}</h1>
      <Outlet />
    </main>
  );
}
