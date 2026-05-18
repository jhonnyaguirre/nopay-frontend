'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Car,
  FileText,
  Landmark,
  List,
  ChevronRight,
  Menu,
  X,
  ChevronDown,
  Shield,
  Mail,
  Truck,
  LogOut,
  Settings,
  User as UserIcon,
  Briefcase,
  LockKeyhole,
  Gavel,
  Sparkles,
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
      setScrolled(window.scrollY > 10);
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
    { name: 'Todos los Servicios', href: '/Servicios', icon: <List className="h-4 w-4" />, desc: 'Explora las soluciones legales disponibles.', featured: false },
    { name: 'Apelación de Multas', href: '/Servicios/Impugnacion', icon: <Car className="h-4 w-4" />, desc: 'Impugna multas de tránsito sin demora y automático.', featured: true },
    { name: 'Permisos de Salida', href: '/Servicios/PermisoSalida', icon: <UserIcon className="h-4 w-4" />, desc: 'Minuta para salida de menores (EN MINUTOS 24/7).', featured: true },
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
    { name: 'Servicios', type: 'services' },
    { name: 'Empresa', type: 'company' },
  ];

  const renderDesktopDropdown = (item: typeof desktopMenu[number]) => {
    const isServices = item.type === 'services';

    return (
      <AnimatePresence>
        {openSubMenu === item.name && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute top-full mt-4 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/98 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl ring-1 ring-black/5 ${
              isServices ? 'left-1/2 w-[780px] -translate-x-1/2' : 'left-0 w-[340px]'
            }`}
          >
            {isServices ? (
              <div className="grid grid-cols-[280px_1fr]">
                {/* Panel de Descripción con Logo de Fondo Integrado */}
                <div className="relative border-r border-slate-100 bg-gradient-to-b from-slate-50/80 to-white p-6 flex flex-col justify-between overflow-hidden">
                  
                  {/* Marca de agua sutil del Logo */}
                  <div className="absolute right-[-15px] bottom-[-15px] w-40 h-40 opacity-[0.04] pointer-events-none select-none">
                    <img src="/images/logo.png" alt="" className="w-full h-full object-contain object-right-bottom" />
                  </div>

                  <div className="relative z-10">
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                      <Sparkles className="h-3 w-3 text-amber-600 animate-pulse" />
                      Ecosistema Legal AI
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                      Plataforma
                    </p>
                    <h3 className="mt-2.5 text-xl font-black leading-tight text-slate-950">
                      Gestión jurídica <br />inteligente y fluida.
                    </h3>
                    <p className="mt-3 text-xs leading-5 text-slate-500 font-medium">
                      Automatización de trámites con la transparencia y el respaldo técnico que necesitas en cada etapa.
                    </p>
                  </div>

                  <Link
                    href="/Servicios"
                    onClick={closeAllMenus}
                    className="relative z-10 mt-6 inline-flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-800 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
                  >
                    Explorar catálogo completo
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                  </Link>
                </div>

                {/* Grid de Ítems */}
                <div className="grid max-h-[500px] grid-cols-2 gap-1.5 overflow-y-auto p-4 bg-white">
                  {serviceItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      onClick={closeAllMenus}
                      className="group rounded-xl border border-transparent p-3.5 transition-all duration-200 hover:border-slate-200/80 hover:bg-slate-50/60 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3.5">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105 ${
                            subItem.featured
                              ? 'border-orange-100 bg-gradient-to-br from-orange-50/60 to-white text-orange-600 shadow-sm'
                              : 'border-slate-200/70 bg-white text-slate-500'
                          }`}
                        >
                          {subItem.icon}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                            {subItem.name}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-slate-500 font-medium">
                            {subItem.desc}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-2 bg-white">
                {companyItems.map((subItem) => (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    onClick={closeAllMenus}
                    className="group flex items-start gap-3.5 rounded-xl p-3 transition-all duration-150 hover:bg-slate-50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-500 group-hover:border-slate-300 transition-colors">
                      {subItem.icon}
                    </span>
                    <div>
                      <span className="block text-sm font-bold text-slate-900">
                        {subItem.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500 font-medium">
                        {subItem.desc}
                      </span>
                    </div>
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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/60 bg-white/80 shadow-[0_2px_20px_rgba(0,0,0,0.03)] backdrop-blur-xl'
          : 'border-b border-transparent bg-white/40 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8 lg:py-4">
        {/* Logo + Marca */}
        <Link href="/" onClick={closeAllMenus} className="group flex items-center gap-3.5">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 group-hover:scale-102 group-hover:shadow-md">
            <img
              src="/images/logo.png"
              alt="NoPay Logo"
              className="h-full w-full object-contain p-2 relative z-10"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/0 via-amber-500/0 to-rose-500/0 transition duration-500 group-hover:from-orange-500/5 group-hover:via-amber-500/5 group-hover:to-rose-500/5" />
          </div>

          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-slate-950 transition group-hover:text-slate-800">
                NoPay
              </span>
              <span className="hidden rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-800 sm:inline-flex">
                Legal AI
              </span>
            </div>
            <p className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 sm:block">
              Justicia más simple
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1.5 md:flex">
          {desktopMenu.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setOpenSubMenu(item.name)}
              onMouseLeave={() => setOpenSubMenu(null)}
            >
              <button
                onClick={() => toggleSubMenu(item.name)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  openSubMenu === item.name
                    ? 'bg-slate-100 text-slate-950'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                {item.name}
                <ChevronDown
                  className={`h-3.5 w-3.5 opacity-70 transition-transform duration-250 ${
                    openSubMenu === item.name ? 'rotate-180 opacity-100' : ''
                  }`}
                />
              </button>
              {renderDesktopDropdown(item)}
            </div>
          ))}

          <Link
            href="/contacto"
            onClick={closeAllMenus}
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-slate-950"
          >
            Contacto
          </Link>
        </div>

        {/* Right side: User & CTA */}
        <div className="hidden items-center gap-4 md:flex">
          {userProfile.name ? (
            <div
              className="relative"
              onMouseEnter={() => setOpenSubMenu('user-menu')}
              onMouseLeave={() => setOpenSubMenu(null)}
            >
              <button
                onClick={() => toggleSubMenu('user-menu')}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
              >
                <img
                  src={userProfile.photoUrl || '/images/asdavatar (2).png'}
                  alt="Usuario"
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                />
                <span className="max-w-[120px] truncate text-xs font-bold text-slate-700">
                  {userProfile.name}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              <AnimatePresence>
                {openSubMenu === 'user-menu' && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.99 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-4 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5"
                  >
                    <div className="border-b border-slate-100 px-4 py-3 bg-slate-50/50">
                      <p className="text-sm font-bold text-slate-900">{userProfile.name}</p>
                      <p className="mt-0.5 text-xs text-slate-400 font-medium">Cuenta NoPay</p>
                    </div>
                    <div className="p-1.5">
                      {userMenuItems.map((item) =>
                        item.href ? (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={closeAllMenus}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                          >
                            {item.icon}
                            {item.name}
                          </Link>
                        ) : (
                          <button
                            key={item.name}
                            onClick={item.action}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
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
            <Button
            className="rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:brightness-105 active:scale-98"
            onClick={closeAllMenus}
          >
            <Link href="/Servicios" className="flex items-center gap-1.5">
              Iniciar trámite
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
          )}

         
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm md:hidden active:scale-95 transition-transform"
          aria-label="Menú"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 text-slate-900" />
          ) : (
            <Menu className="h-5 w-5 text-slate-900" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-slate-100 bg-white md:hidden shadow-inner"
          >
            <div className="max-h-[calc(100vh-80px)] overflow-y-auto px-4 py-5">
              {userProfile.name && (
                <div className="mb-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={userProfile.photoUrl || '/images/asdavatar (2).png'}
                      alt="Usuario"
                      className="h-11 w-11 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{userProfile.name}</p>
                      <p className="text-xs text-slate-400 font-medium">Mi cuenta activa</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3.5">
                {/* Servicios accordion */}
                <div>
                  <button
                    onClick={() => toggleSubMenu('Servicios')}
                    className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5 text-left text-sm font-bold text-slate-900"
                  >
                    Servicios
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${openSubMenu === 'Servicios' ? 'rotate-180 text-slate-900' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openSubMenu === 'Servicios' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1.5 overflow-hidden rounded-xl bg-slate-50/30 p-1.5 mt-1"
                      >
                        {serviceItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={closeAllMenus}
                            className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-white border border-transparent hover:border-slate-100"
                          >
                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                              item.featured ? 'border-orange-100 bg-orange-50 text-orange-600' : 'border-slate-200 bg-white text-slate-500'
                            }`}>
                              {item.icon}
                            </span>
                            <div>
                              <span className="block text-sm font-bold text-slate-900">{item.name}</span>
                              <span className="block text-xs text-slate-500 font-medium mt-0.5">{item.desc}</span>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Empresa accordion */}
                <div>
                  <button
                    onClick={() => toggleSubMenu('Empresa')}
                    className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5 text-left text-sm font-bold text-slate-900"
                  >
                    Empresa
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${openSubMenu === 'Empresa' ? 'rotate-180 text-slate-900' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openSubMenu === 'Empresa' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1 overflow-hidden rounded-xl bg-slate-50/30 p-1.5 mt-1"
                      >
                        {companyItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={closeAllMenus}
                            className="flex items-center gap-3 rounded-lg p-3 transition hover:bg-white"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
                              {item.icon}
                            </span>
                            <span className="text-sm font-bold text-slate-900">{item.name}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  href="/contacto"
                  onClick={closeAllMenus}
                  className="flex w-full items-center rounded-xl bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900"
                >
                  Contacto
                </Link>

                {userProfile.name ? (
                  <div>
                    <button
                      onClick={() => toggleSubMenu('user-menu-mobile')}
                      className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5 text-left text-sm font-bold text-slate-900"
                    >
                      Mi cuenta NoPay
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${openSubMenu === 'user-menu-mobile' ? 'rotate-180 text-slate-900' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openSubMenu === 'user-menu-mobile' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-1 overflow-hidden rounded-xl bg-slate-50/30 p-1.5 mt-1"
                        >
                          {userMenuItems.map((item) =>
                            item.href ? (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={closeAllMenus}
                                className="flex items-center gap-3 rounded-lg p-3 text-sm font-bold text-slate-900 transition hover:bg-white"
                              >
                                <span className="text-slate-500">{item.icon}</span>
                                {item.name}
                              </Link>
                            ) : (
                              <button
                                key={item.name}
                                onClick={item.action}
                                className="flex w-full items-center gap-3 rounded-lg p-3 text-sm font-bold text-red-600 transition hover:bg-white"
                              >
                                {item.icon}
                                {item.name}
                              </button>
                            )
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Button
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 py-4 text-sm font-bold text-white shadow-md active:scale-98 transition-transform"
                  onClick={closeAllMenus}
                >
                  <Link href="/Servicios" className="flex w-full items-center justify-center gap-2">
                    Iniciar trámite
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                )}

                
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};