import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-card border-r p-4">
        <h2 className="text-xl font-bold text-primary mb-6">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <NavLink to="/admin/dashboard" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}`}>Dashboard</NavLink>
          <NavLink to="/admin/consultants" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}`}>Consultants</NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}`}>Users</NavLink>
        </nav>
      </aside>
      <main className="flex-grow p-8 bg-background">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;