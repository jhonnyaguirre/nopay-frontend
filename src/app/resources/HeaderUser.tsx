'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, ChevronRight, Menu, X, ChevronDown, Rocket, User, Shield, Mail, Truck, FileText, Briefcase, Award, Clock } from 'lucide-react';
import Link from 'next/link';
import { getUserProfile } from '../../lib/seguridad/SessionUser';

import { Button } from '../../components/ui/Button';

export const HeaderUser = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [userProfile, setUserProfile] = useState<{ name: string; photoUrl: string }>({ name: '', photoUrl: '' });

  useEffect(() => {
    const loadProfile = () => {
      const profile = getUserProfile();
      setUserProfile(profile);
    };

    // Cargar al inicio
    loadProfile();

    // Escuchar cambios en localStorage (por login)
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'userName' || event.key === 'userPhoto') {
        loadProfile();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
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

  const menuItems = [
    {
      name: 'Servicios',
      submenu: [
        { name: 'Nuestros Servicios', href: '/Servicios', icon: <Rocket className="h-4 w-4" /> },
        { name: 'Consultoría Legal', href: '/consultoria', icon: <Briefcase className="h-4 w-4" /> },
        { name: 'Defensa Judicial', href: '/defensa', icon: <Shield className="h-4 w-4" /> },
        { name: 'Asesoría 24/7', href: '/asesoria', icon: <Clock className="h-4 w-4" /> },
        { name: 'Casos de Éxito', href: '/casos-exito', icon: <Award className="h-4 w-4" /> },
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

  useEffect(() => {
    const profile = getUserProfile();
    setUserProfile(profile);
  }, [typeof window !== 'undefined' && localStorage.getItem('userName')]);


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

          <Link
            href="/logInSocio"
            className="px-3 py-2.5 rounded-lg text-gray-700 hover:text-indigo-600 font-medium transition-colors hover:bg-gray-50 flex items-center gap-1"
            onClick={closeAllMenus}
          >
            <User className="h-4 w-4" />
            <span>Acceso Abogados</span>
          </Link>

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

              {userProfile.name && userProfile.photoUrl && (
                <div className="flex items-center gap-2 pr-2">
                  <img src={userProfile.photoUrl} alt="Usuario" className="w-8 h-8 rounded-full shadow-md" />
                  <span className="text-sm font-medium text-gray-700">{userProfile.name}</span>
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

              <Link
                href="/logInSocio"
                className="flex items-center px-3 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-indigo-600"
                onClick={closeAllMenus}
              >
                <User className="h-4 w-4 mr-3" />
                Acceso Abogados
              </Link>

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