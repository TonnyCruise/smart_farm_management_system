import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Wheat, 
  Leaf, 
  CheckSquare, 
  Package, 
  Beef, 
  Users,
  Warehouse,
  TrendingUp,
  LogOut,
  Wrench,
  DollarSign
} from "lucide-react";

function Sidebar({ onLogout, user }) {
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["admin", "manager", "worker"] },
    { to: "/fields", icon: Wheat, label: "Fields", roles: ["admin", "manager", "worker"] },
    { to: "/crops", icon: Leaf, label: "Crops", roles: ["admin", "manager", "worker"] },
    { to: "/tasks", icon: CheckSquare, label: "Tasks", roles: ["admin", "manager", "worker"] },
    { to: "/inputs", icon: Package, label: "Inputs", roles: ["admin", "manager", "worker"] },
    { to: "/animals", icon: Beef, label: "Livestock", roles: ["admin", "manager", "worker"] },
    { to: "/equipment", icon: Wrench, label: "Equipment", roles: ["admin", "manager", "worker"] },
    { to: "/finances", icon: DollarSign, label: "Finances", roles: ["admin", "manager"] },
    { to: "/workers", icon: Users, label: "Workers", roles: ["admin", "manager"] },
    { to: "/inventories", icon: Warehouse, label: "Inventory", roles: ["admin", "manager", "worker"] },
    { to: "/harvests", icon: TrendingUp, label: "Harvests", roles: ["admin", "manager", "worker"] },
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(user?.role));
  const mainMenuItems = visibleNavItems.slice(0, 5);
  const resourceItems = visibleNavItems.slice(5);

  const getRoleBadge = () => {
    switch(user?.role) {
      case "admin": return { label: "Admin", color: "#7c3aed" };
      case "manager": return { label: "Manager", color: "#0891b2" };
      default: return { label: "Worker", color: "#16a34a" };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <aside style={sidebarStyle}>
      <div style={logoSection}>
        <div style={logoIcon}>
          <Wheat size={28} color="white" />
        </div>
        <div>
          <h1 style={logoTitle}>SmartFarm</h1>
          <p style={logoSubtitle}>ERP System</p>
        </div>
      </div>

      <div style={userSection}>
        <div style={userInfo}>
          <div style={userAvatar}>
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div style={userDetails}>
            <p style={userName}>{user?.name || "User"}</p>
            <span style={{ ...roleBadgeStyle, background: roleBadge.color }}>
              {roleBadge.label}
            </span>
          </div>
        </div>
      </div>

      <nav style={navStyle}>
        <div style={sectionLabel}>Main Menu</div>
        {mainMenuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => linkStyle(isActive)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {resourceItems.length > 0 && (
          <>
            <div style={sectionLabel}>Resources</div>
            {resourceItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => linkStyle(isActive)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div style={bottomSection}>
        <button onClick={onLogout} style={logoutButton}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

const sidebarStyle = {
  position: "fixed",
  left: 0,
  top: 0,
  width: "var(--sidebar-width)",
  height: "100vh",
  background: "var(--bg-sidebar)",
  display: "flex",
  flexDirection: "column",
  zIndex: 50,
};

const logoSection = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "24px 20px",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};

const logoIcon = {
  width: "44px",
  height: "44px",
  background: "var(--primary)",
  borderRadius: "var(--radius)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const logoTitle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "white",
  margin: 0,
  lineHeight: 1.2,
};

const logoSubtitle = {
  fontSize: "11px",
  color: "var(--text-light)",
  margin: 0,
};

const userSection = {
  padding: "16px 20px",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};

const userInfo = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const userAvatar = {
  width: "40px",
  height: "40px",
  background: "var(--primary)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontWeight: 600,
  fontSize: 16,
};

const userDetails = {
  flex: 1,
};

const userName = {
  color: "white",
  fontWeight: 500,
  fontSize: 14,
  margin: "0 0 4px",
};

const roleBadgeStyle = {
  display: "inline-flex",
  padding: "2px 8px",
  borderRadius: 12,
  fontSize: 11,
  fontWeight: 500,
  color: "white",
};

const navStyle = {
  flex: 1,
  padding: "16px 12px",
  overflowY: "auto",
};

const sectionLabel = {
  color: "var(--text-light)",
  fontSize: "11px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  padding: "16px 12px 8px",
};

const linkStyle = (isActive) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 14px",
  borderRadius: "var(--radius)",
  color: isActive ? "white" : "var(--text-light)",
  background: isActive ? "var(--primary)" : "transparent",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: isActive ? "500" : "400",
  transition: "all 0.2s ease",
  marginBottom: "2px",
});

const bottomSection = {
  padding: "16px",
  borderTop: "1px solid rgba(255,255,255,0.1)",
};

const logoutButton = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  padding: "12px 14px",
  background: "transparent",
  border: "none",
  color: "var(--text-light)",
  fontSize: "14px",
  borderRadius: "var(--radius)",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

export default Sidebar;
