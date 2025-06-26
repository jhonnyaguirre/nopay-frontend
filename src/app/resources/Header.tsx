'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  FileText,
  Scale,
  BookOpen,
  Landmark,
  Factory,
  Home, List,
  Plane,
  Lightbulb,
  UserCheck
} from 'lucide-react'
import {
  ChevronRight, Menu, X, ChevronDown, Rocket,
  User, Shield, Mail, Truck, Briefcase,
  Award, Clock, LogOut, Settings, User as UserIcon
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getUserProfile, onUserProfileChange, removeUserProfileListener } from '../../lib/seguridad/SessionUser';
import { Button } from '../../components/ui/Button';

export const Header = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [userProfile, setUserProfile] = useState<{ name: string; photoUrl: string }>({ name: '', photoUrl: '' });

  useEffect(() => {
    const profile = getUserProfile();
    setUserProfile(profile);

    const handleProfileUpdate = (newProfile: typeof userProfile) => {
      setUserProfile(newProfile);
    };

    onUserProfileChange(handleProfileUpdate);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userName' || e.key === 'userPhotoUrl') {
        const updatedProfile = getUserProfile();
        setUserProfile(updatedProfile);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      removeUserProfileListener(handleProfileUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Cerrar menú al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      setOpenSubMenu(null);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenSubMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSubMenu = (menu: string) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  const closeAllMenus = () => {
    setOpenSubMenu(null);
    setIsMobileMenuOpen(false);
  };
  const handleLogout = () => {
    // 🔐 Eliminar todos los datos relacionados con la sesión
    localStorage.removeItem('userName');
    localStorage.removeItem('userPhotoUrl');
    localStorage.removeItem('authToken');         // token general
    localStorage.removeItem('authTokenWizard');   // token del wizard
    localStorage.removeItem('sessionNonce');      // clave única de sesión
    localStorage.removeItem('sessionWizardData'); // datos del wizard si usas SessionWizardData.guardar()

    // 🧠 Limpiar visualmente el estado del usuario
    setUserProfile({ name: '', photoUrl: '' });

    // 🚪 Redirigir a la pantalla inicial
    closeAllMenus();
    //router.push('/');
  };


  useEffect(() => {
    let logoutTriggered = false;

    const interval = setInterval(() => {
      const authToken = localStorage.getItem('authToken');
      const sessionNonce = localStorage.getItem('sessionNonce');

      if (!authToken || !sessionNonce && !logoutTriggered) {
        console.warn('⚠️ Sesión inactiva detectada. Cerrando sesión automáticamente...');
        logoutTriggered = true;
        handleLogout();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);




  const menuItems = [
    {
      name: 'Servicios',
      submenu: [
        { name: 'Todos los Servicios', href: '/Servicios', icon: <List className="h-4 w-4" /> },
        { name: 'Apelación de Multas de Tránsito', href: '/Servicios/Impugnacion', icon: <Car className="h-4 w-4" /> },
        { name: 'Matriculación Vehicular', href: '/Servicios/Matriculacion', icon: <FileText className="h-4 w-4" /> },
        { name: 'Asesoría Legal Automatizada', href: '/Servicios/AsesoriaLegal', icon: <Scale className="h-4 w-4" /> },
        { name: 'Redacción de Documentos Legales', href: '/Servicios/DocumentosLegales', icon: <BookOpen className="h-4 w-4" /> },
        { name: 'Registro de Marcas', href: '/Servicios/Marcas', icon: <Landmark className="h-4 w-4" /> },
        { name: 'Propiedad Intelectual', href: '/Servicios/PropiedadIntelectual', icon: <Lightbulb className="h-4 w-4" /> },
        { name: 'Constitución de Empresas', href: '/Servicios/ConstitucionEmpresasPage', icon: <Factory className="h-4 w-4" /> },
        { name: 'Permisos de Salida de Menores', href: '/Servicios/PermisoSalida', icon: <UserCheck className="h-4 w-4" /> },
        { name: 'Regularización de Propiedades', href: '/Servicios/Inmuebles', icon: <Home className="h-4 w-4" /> },
        { name: 'Trámites Migratorios', href: '/Servicios/TramitesMigratorios', icon: <Plane className="h-4 w-4" /> },
      ]
    },
    {
      name: 'Empresa',
      submenu: [
        { name: 'Políticas de Privacidad', href: '/politicas-privacidad', icon: <Shield className="h-4 w-4" /> },
        { name: 'Seguridad de Datos', href: '/SeguridadDatos', icon: <Shield className="h-4 w-4" /> },
        { name: 'Términos y Condiciones', href: '/terminos-condiciones', icon: <FileText className="h-4 w-4" /> },
        { name: 'Políticas de Envío', href: '/politicas-envio-entrega', icon: <Truck className="h-4 w-4" /> },
        { name: 'Contacto', href: '/contacto', icon: <Mail className="h-4 w-4" /> },
      ]
    }
  ];

  const userMenuItems = [
    { name: 'Mi Perfil', href: '/Usuario/ServiciosPorUsuario', icon: <UserIcon className="h-4 w-4" /> },
    { name: 'Mis Impugnaciones', href: '/Usuario/ServiciosPorUsuario', icon: <UserIcon className="h-4 w-4" /> },
    { name: 'Configuración', href: '/configuracion', icon: <Settings className="h-4 w-4" /> },
    { name: 'Cerrar Sesión', action: handleLogout, icon: <LogOut className="h-4 w-4" /> }
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/90 backdrop-blur-sm'} border-b border-gray-100 transition-all duration-300`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      ref={menuRef}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group relative" onClick={closeAllMenus}>
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Scale className="h-8 w-8 text-indigo-600 transition-all duration-300 group-hover:text-indigo-500" />
          </motion.div>
          <div className="relative">
            <motion.span
              className="text-2xl md:text-3xl font-bold tracking-tight relative z-10"
              whileHover={{ scale: 1.05 }}
            >
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                NoPay
              </span>
            </motion.span>
            <motion.span
              className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-pink-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isMobileMenuOpen ? 0 : 1 }}
              whileHover={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </Link>

        {/* Menú móvil - Botón */}
        <div className="md:hidden">
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 p-2 rounded-lg hover:bg-gray-100"
            whileTap={{ scale: 0.95 }}
            aria-label="Menú"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-indigo-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </motion.button>
        </div>

        {/* Menú desktop */}
        <div className="hidden md:flex items-center gap-4">
          {menuItems.map((item) => (
            <div key={item.name} className="relative"
              onMouseEnter={() => setOpenSubMenu(item.name)}
              onMouseLeave={() => setOpenSubMenu(null)}
            >
              <motion.button
                className={`px-3 py-2.5 rounded-lg flex items-center gap-1 transition-colors ${openSubMenu === item.name ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'}`}
                onClick={() => toggleSubMenu(item.name)}
                whileHover={{ scale: 1.05 }}
              >
                <span className="font-medium">{item.name}</span>
                <motion.span
                  animate={{ rotate: openSubMenu === item.name ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {openSubMenu === item.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-40"
                  >
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        onClick={closeAllMenus}
                      >
                        <span className="mr-3 text-indigo-500">{subItem.icon}</span>
                        {subItem.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {userProfile.name ? (
            <div className="relative"
              onMouseEnter={() => setOpenSubMenu('user-menu')}
              onMouseLeave={() => setOpenSubMenu(null)}>
              <motion.button
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => toggleSubMenu('user-menu')}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={userProfile.photoUrl || '/images/user-placeholder.png'}
                  alt="Usuario"
                  className="w-8 h-8 rounded-full shadow-md"
                />
                <span className="text-sm font-medium text-gray-700">{userProfile.name}</span>
                <motion.span
                  animate={{ rotate: openSubMenu === 'user-menu' ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {openSubMenu === 'user-menu' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-50"
                  >
                    {userMenuItems.map((item) => (
                      item.href ? (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          onClick={closeAllMenus}
                        >
                          <span className="mr-3 text-indigo-500">{item.icon}</span>
                          {item.name}
                        </Link>
                      ) : (
                        <button
                          key={item.name}
                          onClick={item.action}
                          className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          <span className="mr-3 text-indigo-500">{item.icon}</span>
                          {item.name}
                        </button>
                      )
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/logInSocio"
              className="px-3 py-2.5 rounded-lg text-gray-700 hover:text-indigo-600 font-medium transition-colors hover:bg-gray-50 flex items-center gap-1"
              onClick={closeAllMenus}
            >
              <User className="h-4 w-4" />
              <span>Acceso Abogados</span>
            </Link>
          )}

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="relative overflow-hidden group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-500/30 transition-all"
              onClick={closeAllMenus}
            >
              <Link href="/Servicios" className="relative z-10 flex items-center">
                Comenzar
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Menú móvil - Contenido */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-white overflow-hidden border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-1">
              {userProfile.name && (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
                    <img
                      src={userProfile.photoUrl || '/images/user-placeholder.png'}
                      alt="Usuario"
                      className="w-10 h-10 rounded-full shadow-md"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                      <p className="text-xs text-gray-500">Mi cuenta</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleSubMenu('user-menu-mobile')}
                    className={`w-full text-left px-3 py-3 rounded-lg flex justify-between items-center ${openSubMenu === 'user-menu-mobile' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <span className="font-medium">Mi Cuenta</span>
                    <motion.span
                      animate={{ rotate: openSubMenu === 'user-menu-mobile' ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {openSubMenu === 'user-menu-mobile' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 space-y-1 border-l border-gray-200 pl-2"
                      >
                        {userMenuItems.map((item) => (
                          item.href ? (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center px-3 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600"
                              onClick={closeAllMenus}
                            >
                              <span className="mr-3 text-indigo-500">{item.icon}</span>
                              {item.name}
                            </Link>
                          ) : (
                            <button
                              key={item.name}
                              onClick={item.action}
                              className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600"
                            >
                              <span className="mr-3 text-indigo-500">{item.icon}</span>
                              {item.name}
                            </button>
                          )
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {menuItems.map((item) => (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleSubMenu(item.name)}
                    className={`w-full text-left px-3 py-3 rounded-lg flex justify-between items-center ${openSubMenu === item.name ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <span className="font-medium">{item.name}</span>
                    <motion.span
                      animate={{ rotate: openSubMenu === item.name ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openSubMenu === item.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 space-y-1 border-l border-gray-200 pl-2"
                      >
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="flex items-center px-3 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600"
                            onClick={closeAllMenus}
                          >
                            <span className="mr-3 text-indigo-500">{subItem.icon}</span>
                            {subItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {!userProfile.name && (
                <Link
                  href="/logInSocio"
                  className="flex items-center px-3 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-indigo-600"
                  onClick={closeAllMenus}
                >
                  <User className="h-4 w-4 mr-3" />
                  Acceso Abogados
                </Link>
              )}

              <motion.div
                whileTap={{ scale: 0.95 }}
                className="pt-2"
              >
                <Button
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:from-indigo-700 hover:to-purple-700"
                  onClick={closeAllMenus}
                >
                  <Link href="/Servicios" className="w-full flex justify-center items-center">
                    Comenzar
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};