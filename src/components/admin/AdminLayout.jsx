// client/src/components/admin/AdminLayout.jsx
import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    Users,
    FileText,
    Settings,
    LogOut,
    BarChart3,
    Shield,
    Bell,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', icon: Home, label: 'Dashboard', exact: true },
        { path: '/admin/bookings', icon: FileText, label: 'Bookings' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/services', icon: Settings, label: 'Services' },
        { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/', icon: Home, label: 'Home', exact: true },
    ];

    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    React.useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    if (user && user.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 lg:static lg:inset-auto
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-4 border-b border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-lg font-bold truncate">Admin</h1>
                                <p className="text-xs text-gray-400">1Point 1Solution</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path, item.exact);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium
                                        ${active 
                                            ? 'bg-blue-600 text-white' 
                                            : 'text-gray-300 hover:bg-gray-800'
                                        }
                                    `}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <span className="truncate">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile */}
                    <div className="p-3 border-t border-gray-800 space-y-3">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold">
                                    {user?.fullName?.charAt(0) || 'A'}
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{user?.fullName || 'Admin'}</p>
                                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-0">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
                    <div className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center justify-center lg:justify-between">
                            {/* Mobile: Centered content */}
                            <div className="lg:hidden text-center">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                    {navItems.find(item => isActive(item.path, item.exact))?.label || 'Dashboard'}
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-600">Manage your platform</p>
                            </div>
                            
                            {/* Desktop: Left aligned content */}
                            <div className="hidden lg:block min-w-0">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {navItems.find(item => isActive(item.path, item.exact))?.label || 'Dashboard'}
                                </h2>
                                <p className="text-sm text-gray-600">Manage your platform</p>
                            </div>
                            
                            {/* Right side items for desktop (if needed) */}
                            <div className="hidden lg:flex items-center gap-4">
                                {/* Add any right-aligned items here (notifications, etc.) */}
                                {/* <button className="p-2 text-gray-600 hover:text-gray-900">
                                    <Bell className="w-5 h-5" />
                                </button> */}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-4 sm:p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;