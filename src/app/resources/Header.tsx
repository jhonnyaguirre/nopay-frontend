'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Scale,
  Car,
  FileText,
  BookOpen,
  Landmark,
  Factory,
  Home,
  List,
  Plane,
  Lightbulb,
  UserCheck,
  ChevronRight,
  Menu,
  X,
  ChevronDown,
  User,
  Shield,
  Mail,
  Truck,
  LogOut,
  Settings,
  User as UserIcon,
  Briefcase,
  LockKeyhole,
  Gavel,
} from 'lucide-react';

import {
  getUserProfile,
  onUserProfileChange,
  removeUserProfileListener,
} from '../../lib/seguridad/SessionUser';

import { Button } from '../../components/ui/Button';
import { useLogout } from 'lib/seguridad/prevalidadorToken';

export const Header = () => {
  const router = useRouter();
  const logout = useLogout();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [userProfile, setUserProfile] = useState<{ name: string; photoUrl: string }>({
    name: '',
    photoUrl: '',
  });

  useEffect(() => {
    const profile = getUserProfile();
    setUserProfile(profile);

    const handleProfileUpdate = (newProfile: typeof userProfile) => {
      setUserProfile(newProfile);
    };

    onUserProfileChange(handleProfileUpdate);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userName' || e.key === 'userPhotoUrl') {
        setUserProfile(getUserProfile());
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      removeUserProfileListener(handleProfileUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
      setOpenSubMenu(null);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenSubMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeAllMenus = () => {
    setOpenSubMenu(null);
    setIsMobileMenuOpen(false);
  };

  const toggleSubMenu = (menu: string) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  const handleLogout = () => {
    closeAllMenus();
    logout();
    router.replace('/login');
  };

  const serviceItems = [
    { name: 'Todos los Servicios', href: '/Servicios', icon: <List className="h-4 w-4" />, desc: 'Explora las soluciones legales disponibles.', featured: true },
    { name: 'Apelación de Multas', href: '/Servicios/Impugnacion', icon: <Car className="h-4 w-4" />, desc: 'Impugna multas de tránsito sin demora y automático.', featured: true },
    { name: 'Permisos de Salida', href: '/Servicios/PermisoSalida', icon: <UserCheck className="h-4 w-4" />, desc: 'Minuta para salida de menores (EN MINUTOS 24/7).', featured: true },
    { name: 'Registro de Marcas', href: '/Servicios/Marcas', icon: <Landmark className="h-4 w-4" />, desc: 'Protege tu marca en Ecuador: pagas solo por fase aprobada. Sin arriesgar todo el proceso.', featured: true },
     
  ];

  const companyItems = [
    { name: 'Políticas de Privacidad', href: '/politicas-privacidad', icon: <Shield className="h-4 w-4" />, desc: 'Tratamiento de datos personales.' },
    { name: 'Seguridad de Datos', href: '/SeguridadDatos', icon: <LockKeyhole className="h-4 w-4" />, desc: 'Protección de tu información.' },
    { name: 'Términos y Condiciones', href: '/terminos-condiciones', icon: <FileText className="h-4 w-4" />, desc: 'Condiciones de uso.' },
    { name: 'Políticas de Envío', href: '/politicas-envio-entrega', icon: <Truck className="h-4 w-4" />, desc: 'Gestión documental.' },
    { name: 'Contacto', href: '/contacto', icon: <Mail className="h-4 w-4" />, desc: 'Comunícate con nosotros.' },
  ];

  const userMenuItems = [
    { name: 'Mi Perfil', href: '/Servicios/landingActivos', icon: <UserIcon className="h-4 w-4" /> },
    { name: 'Mis Procesos', href: '/Servicios/landingActivos', icon: <Briefcase className="h-4 w-4" /> },
    { name: 'Configuración', href: '/configuracion', icon: <Settings className="h-4 w-4" /> },
    { name: 'Cerrar Sesión', action: handleLogout, icon: <LogOut className="h-4 w-4" /> },
  ];

  const desktopMenu = [
    { name: 'Servicios', type: 'services', submenu: serviceItems },
    { name: 'Empresa', type: 'company', submenu: companyItems },
  ];

  const renderDesktopDropdown = (item: typeof desktopMenu[number]) => {
    const isServices = item.type === 'services';

    return (
      <AnimatePresence>
        {openSubMenu === item.name && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.99 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`absolute top-full mt-3 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/98 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl ${
              isServices ? 'left-1/2 w-[720px] -translate-x-1/2' : 'left-0 w-[340px]'
            }`}
          >
            {isServices ? (
              <div className="grid grid-cols-[240px_1fr]">
                <div className="border-r border-slate-100 bg-slate-50/70 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                    Servicios
                  </p>

                  <h3 className="mt-3 text-xl font-black leading-tight text-slate-950">
                    Trámites legales con una experiencia más simple.
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Selecciona el servicio que necesitas y avanza con orientación clara.
                  </p>

                  <Link
                    href="/Servicios"
                    onClick={closeAllMenus}
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Ver todos
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid max-h-[480px] grid-cols-2 gap-1.5 overflow-y-auto p-3">
                  {serviceItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      onClick={closeAllMenus}
                      className="group rounded-2xl border border-transparent p-3.5 transition hover:border-slate-200 hover:bg-slate-50"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                            subItem.featured
                              ? 'border-rose-100 bg-rose-50 text-rose-600'
                              : 'border-slate-200 bg-white text-slate-500'
                          }`}
                        >
                          {subItem.icon}
                        </span>

                        <div>
                          <p className="text-[13px] font-bold text-slate-900">
                            {subItem.name}
                          </p>
                          <p className="mt-1 text-[11px] leading-4 text-slate-500">
                            {subItem.desc}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-2.5">
                {companyItems.map((subItem) => (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    onClick={closeAllMenus}
                    className="group flex items-start gap-3 rounded-2xl p-3 transition hover:bg-slate-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500">
                      {subItem.icon}
                    </span>

                    <span>
                      <span className="block text-[13px] font-bold text-slate-900">
                        {subItem.name}
                      </span>
                      <span className="mt-1 block text-[11px] leading-4 text-slate-500">
                        {subItem.desc}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <motion.nav
      ref={menuRef}
      initial={{ y: -72 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-slate-200/80 bg-white/90 shadow-[0_8px_28px_rgba(15,23,42,0.045)] backdrop-blur-xl'
          : 'border-transparent bg-white/76 backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" onClick={closeAllMenus} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <Scale className="h-5 w-5 text-rose-600" />
          </div>

          <div className="leading-none">
            <div className="flex items-center gap-2">
              <span className="text-[23px] font-black tracking-tight text-slate-950">
                NoPay
              </span>
              <span className="hidden rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:inline-flex">
                Legal AI
              </span>
            </div>
            <p className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 sm:block">
              Justicia más simple
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {desktopMenu.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setOpenSubMenu(item.name)}
              onMouseLeave={() => setOpenSubMenu(null)}
            >
              <button
                onClick={() => toggleSubMenu(item.name)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  openSubMenu === item.name
                    ? 'bg-slate-100 text-slate-950'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                {item.name}
                <ChevronDown
                  className={`h-4 w-4 transition ${
                    openSubMenu === item.name ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {renderDesktopDropdown(item)}
            </div>
          ))}

          <Link
            href="/contacto"
            onClick={closeAllMenus}
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
          >
            Contacto
          </Link>
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          {userProfile.name ? (
            <div
              className="relative"
              onMouseEnter={() => setOpenSubMenu('user-menu')}
              onMouseLeave={() => setOpenSubMenu(null)}
            >
              <button
                onClick={() => toggleSubMenu('user-menu')}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 transition hover:bg-slate-50"
              >
                <img
                  src={userProfile.photoUrl || '/images/asdavatar (2).png'}
                  alt="Usuario"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="max-w-[120px] truncate text-xs font-bold text-slate-700">
                  {userProfile.name}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              <AnimatePresence>
                {openSubMenu === 'user-menu' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.99 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-3 w-60 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
                  >
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-xs font-bold text-slate-900">{userProfile.name}</p>
                      <p className="mt-1 text-[10px] text-slate-400">Cuenta NoPay</p>
                    </div>

                    <div className="p-2">
                      {userMenuItems.map((item) =>
                        item.href ? (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={closeAllMenus}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                          >
                            {item.icon}
                            {item.name}
                          </Link>
                        ) : (
                          <button
                            key={item.name}
                            onClick={item.action}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                          >
                            {item.icon}
                            {item.name}
                          </button>
                        )
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/logInSocio"
              onClick={closeAllMenus}
              className="flex items-center gap-2 rounded-full px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <User className="h-4 w-4" />
              Acceso Abogados
            </Link>
          )}

           
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white md:hidden"
          aria-label="Menú"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 text-slate-900" />
          ) : (
            <Menu className="h-5 w-5 text-slate-900" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="border-t border-slate-100 bg-white md:hidden"
          >
            <div className="max-h-[calc(100vh-72px)] overflow-y-auto px-4 py-4">
              {userProfile.name && (
                <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={userProfile.photoUrl || '/images/asdavatar (2).png'}
                      alt="Usuario"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{userProfile.name}</p>
                      <p className="text-[11px] text-slate-400">Mi cuenta</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={() => toggleSubMenu('Servicios')}
                  className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm font-bold text-slate-900"
                >
                  Servicios
                  <ChevronDown className={`h-4 w-4 transition ${openSubMenu === 'Servicios' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {openSubMenu === 'Servicios' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1 overflow-hidden"
                    >
                      {serviceItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeAllMenus}
                          className="flex items-start gap-3 rounded-2xl px-3 py-3 hover:bg-slate-50"
                        >
                          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                            item.featured
                              ? 'border-rose-100 bg-rose-50 text-rose-600'
                              : 'border-slate-200 bg-white text-slate-500'
                          }`}>
                            {item.icon}
                          </span>
                          <span>
                            <span className="block text-xs font-bold text-slate-900">
                              {item.name}
                            </span>
                            <span className="block text-[11px] leading-4 text-slate-500">
                              {item.desc}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => toggleSubMenu('Empresa')}
                  className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm font-bold text-slate-900"
                >
                  Empresa
                  <ChevronDown className={`h-4 w-4 transition ${openSubMenu === 'Empresa' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {openSubMenu === 'Empresa' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1 overflow-hidden"
                    >
                      {companyItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeAllMenus}
                          className="flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-slate-50"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500">
                            {item.icon}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{item.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {userProfile.name ? (
                  <>
                    <button
                      onClick={() => toggleSubMenu('user-menu-mobile')}
                      className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm font-bold text-slate-900"
                    >
                      Mi cuenta
                      <ChevronDown className={`h-4 w-4 transition ${openSubMenu === 'user-menu-mobile' ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {openSubMenu === 'user-menu-mobile' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-1 overflow-hidden"
                        >
                          {userMenuItems.map((item) =>
                            item.href ? (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={closeAllMenus}
                                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-xs font-bold text-slate-900 hover:bg-slate-50"
                              >
                                <span className="text-slate-500">{item.icon}</span>
                                {item.name}
                              </Link>
                            ) : (
                              <button
                                key={item.name}
                                onClick={item.action}
                                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-xs font-bold text-red-600 hover:bg-red-50"
                              >
                                {item.icon}
                                {item.name}
                              </button>
                            )
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href="/logInSocio"
                    onClick={closeAllMenus}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50"
                  >
                    <Gavel className="h-4 w-4" />
                    Acceso Abogados
                  </Link>
                )}

                <Button
                  className="mt-3 w-full rounded-2xl bg-slate-950 py-3 text-white shadow-none hover:bg-slate-800"
                  onClick={closeAllMenus}
                >
                  <Link href="/Servicios" className="flex w-full items-center justify-center gap-2 font-bold">
                    Iniciar trámite
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};