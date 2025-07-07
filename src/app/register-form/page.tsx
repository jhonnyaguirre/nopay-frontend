'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Car, ChevronRight, Check } from 'lucide-react';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';
import {
  createSessionNonce,
  getSessionNonce,


  setWizardToken,
  getWizardToken
} from '../../lib/seguridad/sessionUtils';
import { crearSesionJWT } from 'lib/seguridad/JwtSessionService';
import { SessionWizardData } from 'lib/seguridad/SessionWizardData';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../components/ui/Card";
import { PlusCircle } from 'lucide-react';
import { getColorCode } from 'utils/ColorUtils';
import BackgroundWithSideSvg from 'app/resources/BackgroundWithSideSvg';
import { getUserProfile, setUserProfile } from 'lib/seguridad/SessionUser';
import { API_BASE_URL } from 'config/apiConfig';

// [Tus imports y funciones de validación se mantienen igual...]

const Notification = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-8 right-8 bg-gradient-to-r from-[#7F1D1D] to-[#EC4899] p-6 rounded-xl shadow-2xl z-50 max-w-sm border border-white/20"
    >
      <div className="flex items-start gap-3">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6 }}
          className="bg-white/20 p-2 rounded-full"
        >
          <Check className="h-5 w-5 text-white" />
        </motion.div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">¡Éxito!</h3>
          <p className="text-white/90 mt-1 text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors text-lg"
        >
          &times;
        </button>
      </div>
    </motion.div>
  );
};

const AdvancedForm = () => {

  const [checkingAuth, setCheckingAuth] = useState(true);
  const emailInicial = '';
  const [cedulaBloqueada, setCedulaBloqueada] = useState(false);
  const [vehiculosUsuario, setVehiculosUsuario] = useState<any[]>([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<string>('');
  const [mostrarNuevoVehiculo, setMostrarNuevoVehiculo] = useState(false);
  const [omitValidacionInicial, setOmitValidacionInicial] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatDateToInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`; // ✅ formato para <input type="date">
  };

  const validarPlacaEcuador = (placa: string) => {
    const regex = /^[A-Z]{3}-?\d{3,4}$/;
    const provinciasValidas = ['A', 'B', 'C', 'E', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    if (!regex.test(placa)) return false;
    return provinciasValidas.includes(placa.charAt(0));
  };

  const validarCedulaEcuador = (cedula: string) => {
    if (!/^\d{10}$/.test(cedula)) return false;

    const provincia = parseInt(cedula.substring(0, 2), 10);
    if (provincia < 1 || provincia > 24) return false;

    const digitos = cedula.split('').map(Number);
    const verificador = digitos[9];

    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let valor = digitos[i];
      if (i % 2 === 0) {
        valor *= 2;
        if (valor > 9) valor -= 9;
      }
      suma += valor;
    }

    const decenaSuperior = Math.ceil(suma / 10) * 10;
    const digitoCalculado = decenaSuperior - suma;

    return digitoCalculado === verificador || (digitoCalculado === 10 && verificador === 0);
  };


  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [nombreParam, setNombreParam] = useState('');

  const [secuencialUser, setSecuencialUser] = useState('');


  const cedulaValida = validarCedulaEcuador(cedula);

  const [placa, setPlaca] = useState('');
  const placaValida = validarPlacaEcuador(placa);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [userData, setUserData] = useState({
    secuencial: '',
    nombres: '',
    apellidos: '',
    genero: '',
    fechaNacimiento: null as Date | null,
    email: '',
    telefono: ''
  });
  const [vehicleData, setVehicleData] = useState({
    placa: '',
    marca: '',
    modelo: '',
    año: '',
    color: '',
    tipo: '',
    chasis: '',
    motor: '',
    cmv: '',
    cilindraje: ''
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [fetchingUserData, setFetchingUserData] = useState(false);

  //  useEffect(() => {
  // Solo actualizar showVehicleForm si NO estamos mostrando un nuevo vehículo
  //  if (!mostrarNuevoVehiculo) {
  //  setShowVehicleForm(placaValida);
  //}
  //}, [placa, placaValida, mostrarNuevoVehiculo]);

  // Reemplaza ambos useEffect por este:
  useEffect(() => {
    // Si estoy en "nuevo vehículo" o la placa es válida, muestro el form
    setShowVehicleForm(mostrarNuevoVehiculo || placaValida);
  }, [mostrarNuevoVehiculo, placaValida]);



  useEffect(() => {
    const token = getWizardToken();
    //console.log("TOKEN ENVIADO para 1:", token); // <-- Asegúrate de que aquí hay un valor válido
    try {
      if (!token) {
        ////console.warn("⛔ No hay token. Redirigiendo a login...");
        setLoading(false); // 👈 Agrega esto
        router.replace('/login');
      } else {
        setLoading(false); // 👈 Y si hay token, también termina el loading
      }
    } catch (error) {
      ////console.error("❌ Error en  fetch line 156:", error);
    }

    setCheckingAuth(false);
  }, []);



  // Efectos y funciones se mantienen iguales
  // Efectos y funciones se mantienen iguales
  useEffect(() => {
    const token = getWizardToken();
    //console.log("TOKEN ENVIADO para 2:", token); // <-- Asegúrate de que aquí hay un valor válido
    try {
      if (!token) {
        ////console.warn("🚫 No hay token, se cancela fetchUserData");
        return;
      }

      const isTokenExpired = (token: string): boolean => {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const now = Math.floor(Date.now() / 1000);
          return payload.exp && payload.exp < now;
        } catch (e) {
          return true;
        }
      };

      if (isTokenExpired(token)) {
        ////console.warn("⏳ El token ha expirado. Redirigiendo...");
        router.replace('/login');
        return;
      }

      const fetchUserData = async () => {
        const token = getWizardToken();

        if (!token) {
          router.replace('/login');
          return;
        }

        const debeConsultar = omitValidacionInicial || (cedula.length === 10 && cedulaValida);
        if (!debeConsultar) {
          setShowUserForm(false);
          return;
        }

        setFetchingUserData(true);
        try {

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


          //console.log('este valor es antes que llame a función de cedula: ' + cedula)
          const esCedulaValida = true;
          /*
            cedula &&
              typeof cedula === 'string' &&
              cedula.trim() !== '' &&
              cedula !== 'null' &&
              cedula !== 'undefined' &&
              !emailRegex.test(cedula); // ← Asegúrate de que no sea un email
  
  
            if (!esCedulaValida) {
              setCedula("");
              // si quieres que, tras esto, no siga el flujo de validación,
              // puedes hacer return o cualquier otra lógica:
              return;
            }
              */
          //console.log('este valor se mantiene en la  función de cedula: ' + cedula)

          if (esCedulaValida) {

            const url = `${API_BASE_URL}/usuariosid/${cedula}`;


            //console.log("🔍 Consultando URL:", url);

            let response: Response;
            try {
              response = await fetch(url, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
            } catch (err: any) {
              ////console.error("❌ Error de red o fetch fallido:", err.message || err);
              if (!emailRegex.test(cedula))
                setCedula("");

              setFetchingUserData(false);
              setShowUserForm(false);
              return;
            }


            if (!response.ok) {
              if (response.status === 403) {
                //console.warn("🔐 Acceso denegado (403). Probablemente token inválido o expirado.");
                return;
              } else {
                ////console.error(`⚠️ Error HTTP inesperado: ${response.status}`);
                return;
              }
            }

            const data = await response.json();



            // ✅ Sobrescribir cédula si viene desde backend (cuando se consultó por correo)
            if (data.cedula && data.cedula !== cedula) {
              //console.log("🆕 Cédula corregida desde backend yyyy:", data.cedula);
              //console.log("🆕 secuencial desde backend:", data.secuencial);

              //console.log(" usaurio cargados:", data);
              setCedula(data.cedula);
              //console.log('se pasó y se bloquro ' + cedula);
              //console.log('se pasó y se bloquro ' + data.cedula);


              setCedulaBloqueada(true); // 🔒 Bloquear edición

            }

            const wizardData = SessionWizardData.obtener();
            console.log("el email con el que hace login es : " + wizardData?.cedula);
            console.log("el email que devuelve desde el backend es : " + data.email);

            if (
              data.email.length > 3 &&
              (wizardData?.cedula ?? '').toUpperCase() !== data.email.toUpperCase()
            ) {
              setErrorMsg("La cédula consultada corresponde a otra cuenta.");
              setCedula("");
              return;
            }

            if (wizardData?.cedula) {
              setCedula(wizardData.cedula.trim());
              //console.log("📥 Se cargó cédula desde wizardData: " + wizardData.cedula + " - " + cedula);
            }

            let emailFinall = "";


            if (data.email) {
              emailFinall = data.email;
            } else if (wizardData?.cedula) {
              emailFinall = wizardData.cedula;
              //data.email =  wizardData.cedula;
            }

            if (wizardData && data.email != null) {
              //console.log("cadena de compa 1" + wizardData.cedula)
              //console.log("cadena de compa 2" + data.email)


              setCedula(wizardData.cedula);//?wizardData.cedula:data.email);

              /*
              if (!(wizardData.cedula === data.email && !emailRegex.test(wizardData.cedula) )) {
                //console.log("wizardData.cedula: " + wizardData.cedula)
                //console.log("data.email: " + data.email)
                //console.log("data.cedula " + data.cedula)
                //console.log("wizardData.cedula" + wizardData.cedula)
                //console.log("TODA LA DATA" + wizardData)
                //console.log("TODA LA DATA" + data)
                //console.log("se compara y sale")
                setErrorMsg("La cédula consultada corresponde a otra cuenta.");
                setCedula("");
                // Podemos abortar el resto:
                return;
              }
                */

            }
            //console.log('Se manda a setear los valores')
            setCedula(data.cedula);
            const secuencialFinal = wizardData?.secuencial?.toString() ?? data.secuencial?.toString() ?? '';


            setUserData({

              secuencial: data.secuencial?.toString() || '',
              nombres: data.nombres || '',
              apellidos: data.apellidos || '',
              genero: data.desSexo === 'HOMBRE' ? 'masculino'
                : data.desSexo === 'MUJER' ? 'femenino' : '',
              fechaNacimiento: data.fechaNacimiento ? new Date(Number(data.fechaNacimiento)) : null,
              email: emailFinall,
              telefono: data.celular || ''
            });


            const profile = getUserProfile();
            setUserProfile({ name: data.nombres, photoUrl: profile.photoUrl ? profile.photoUrl : "/images/avatar.png" });


            setShowUserForm(true);
          }
        } catch (error) {
          ////console.error('Error al obtener datos del usuario:', error);
          setShowUserForm(true);
        } finally {
          setFetchingUserData(false);
          setOmitValidacionInicial(false); // ✅ luego del primer intento
        }
      };
      fetchUserData();

    } catch (error) {
      ////console.error("❌ Error en  fetch line 271:", error);
    }


  }, [cedula]);


  // ⚙️ Hook para cargar vehículos cuando ya tienes el secuencial
  useEffect(() => {


    const fetchVehiculos = async () => {


      const token = getWizardToken();
      const usuarioId = userData.secuencial;

      //console.log("✅ Consultando vehículos para ID:", usuarioId);

      if (usuarioId === '0' || !usuarioId || typeof usuarioId !== 'string' || usuarioId.trim() === '' || isNaN(Number(usuarioId))) {
        //console.log("⛔️ Secuencial inválido, no se consultan vehículos");
        setVehiculosUsuario([]); // 🔁 Limpia la lista
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/vehiculos/detalle/${usuarioId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Si no hay vehículos, el backend responde 404 con { "mensaje": "No se encontraron vehículos registrados" }
        if (res.status === 404) {
          ////console.warn("⚠️ No se encontraron vehículos registrados para este usuario (404).");
          setVehiculosUsuario([]); // Asignamos lista vacía en lugar de error
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          ////console.error(`⚠️ Error HTTP: ${res.status}`, text);
          throw new Error("Error al obtener vehículos");
        }

        const data = await res.json();
        //console.log("🚗 Vehículos cargados:", data);
        setVehiculosUsuario(data);
      } catch (err: any) {
        ////console.error("❌ Error cargando vehículos:", err.message || err);
      }
    };

    fetchVehiculos();
  }, [userData.secuencial]);






  useEffect(() => {
    try {
      const wizardData = SessionWizardData.obtener();
      if (wizardData) {
        setCedula(wizardData.cedula || '');

        setSecuencialUser(wizardData.secuencial?.toString() || '');
        setNombreParam(`${wizardData.nombres || ''} ${wizardData.apellidos || ''}`);
        setEmail(wizardData.cedula || '');

        setOmitValidacionInicial(true);
      }
    } catch (error) {
      ////console.error("❌ Error en  fetch line 284:", error);
    }
  }, []);

  /*
    useEffect(() => {
      const fetchUserData = async () => {
        if (cedula.length === 10 && cedulaValida) {
          setFetchingUserData(true);
          try {
            const token = getWizardToken();
            if (!token) {
              //console.warn('⛔ No hay token. Redirigiendo a login...');
              router.replace('/login');
              return;
            }
  
            const response = await fetch(`${API_BASE_URL}/usuariosid/${cedula}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
  
            if (!response.ok) {
              if (response.status === 403) {
                //console.warn("🔐 Acceso denegado (403). Probablemente token inválido o expirado.");
                // Opcional: puedes redirigir o mostrar un mensaje
                return;
              } else {
                //console.error(`⚠️ Error HTTP inesperado: ${response.status}`);
                return;
              }
            }
  
            const data = await response.json();
  
            setUserData({
              nombres: data.nombres || '',
              apellidos: data.apellidos || '',
              genero: data.desSexo === 'HOMBRE' ? 'masculino' :
                data.desSexo === 'MUJER' ? 'femenino' : '',
              fechaNacimiento: data.fechaNacim ? new Date(Number(data.fechaNacim)) : null,
              email: data.email || '',
              telefono: data.telefono || ''
            });
  
            setShowUserForm(true);
          } catch (error) {
            //console.error('Error al obtener datos del usuario:', error);
            setShowUserForm(true);
          } finally {
            setFetchingUserData(false);
          }
        } else {
          setShowUserForm(false);
        }
      };
  
      fetchUserData();
    }, [cedula]);
  
    */



  const handleFormSubmit = async (e: React.FormEvent) => {


    e.preventDefault();

    vehicleData.placa = placa;

    if (!userData.telefono) {
      setAuthError('El número de teléfono es obligatorio');
      return;
    }

    if (!userData.email) {
      setAuthError('El email es obligatorio');
      return;
    }

    if (!placa) {
      setAuthError('La placa del vehículo es obligatoria');
      return;
    }

    const token = getWizardToken();
    //console.log("TOKEN 4:", token); // <-- Asegúrate de que aquí hay un valor válido
    if (!token) {
      setAuthError('No hay token de autenticación disponible');
      return;
    }

    const wizardData = SessionWizardData.obtener();
    const payload = {
      nombres: userData.nombres,
      apellidos: userData.apellidos,
      cedula: cedula,
      fechaNacimiento: userData.fechaNacimiento?.toISOString().split('T')[0],
      email: userData.email ? userData.email : wizardData ? wizardData.cedula : '',
      usuarioCrea: 'admin',
      celular: userData.telefono,
      //password: '123456',
      vehiculo: {
        placa: placa,
        marca: vehicleData.marca,
        modelo: vehicleData.modelo,
        anio: vehicleData.año ? parseInt(vehicleData.año.toString(), 10) : null,
        color: vehicleData.color,
        tipo: vehicleData.tipo,
        chasis: "",
        motor: "",
        cmv: "",
        cilindraje: null
      }
    };

    // ▶️ Aquí imprimes en consola todo el body que vas a mandar:
    //console.log("Enviando al backend payload de registro:", payload);



    try {
      console.time('⏳ regusuarios POST');
      const response = await fetch(`${API_BASE_URL}/regusuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.timeEnd('⏳ regusuarios POST');

      console.time('⏳ crearSesionJWT');

      const nonce = createSessionNonce(); // 🔐 Genera y guarda la clave única de sesión
      //console.log("sessionNonce generado:", nonce);

      try {
        await crearSesionJWT(cedula, result.secuencial_usuario, token);
        //console.log("JWT recibido y almacenado localmente");
      } catch (error) {
        ////console.error("Error al registrar sesión:", error);
      }




      setNotificationMessage(result.mensaje || 'El primer paso está listo');
      console.timeEnd('⏳ crearSesionJWT');

      //setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);

        SessionWizardData.guardar({
          cedula,
          secuencial: result.secuencial_usuario,
          nombres: userData.nombres,
          apellidos: userData.apellidos,
        });

        router.push('/wizard-form');
      }, 10);

    } catch (error: any) {
      ////console.error('Error al enviar datos:', error);
      //setAuthError(error.message || 'Error al enviar el formulario');

    }
  };




  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-4 border-white/30 border-t-white rounded-full"
        />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] p-4">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 text-center max-w-md"
        >
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-white mb-2">Error</h3>
          <p className="text-white/90 mb-6">{authError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-[#7F1D1D] font-medium py-2 px-6 rounded-full hover:bg-[#EC4899] hover:text-white transition-all"
          >
            Reintentar
          </button>
        </motion.div>
      </div>
    );
  }
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-4 border-white/30 border-t-white rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      <BackgroundWithSideSvg>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-28">
          <Header />

          <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              {/* Encabezado Mejorado */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-10"
              >
                <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 mb-6">
                  <span className="text-sm font-medium text-white/90">Paso 1 de 3</span>
                </div>
                <h1 className="text-3xl md:text-3xl font-bold text-white mb-3">
                  <span className="bg-gradient-to-r from-white to-[#FDE68A] bg-clip-text text-transparent">
                    Completa tus datos
                  </span>
                </h1>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  Necesitamos verificar tu información personal y de tu vehículo para continuar
                </p>
              </motion.div>

              {/* Formulario Principal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20"
              >
                <div className="relative isolate overflow-hidden rounded-3xl bg-gray-900/50 backdrop-blur-2xl border border-gray-700 shadow-2xl p-8">
                  {/* ✦ Fondos Decorativos Flotantes */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Círculo radial suave */}
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-full blur-3xl"></div>
                    {/* Forma abstracta irregular */}
                    <svg
                      className="absolute bottom-0 right-0 w-96 h-96 opacity-20"
                      viewBox="0 0 500 500"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient id="formGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M367.952 256.814c250.946 24.661 375.994 152.533 375.142 383.617-1.277 346.625-356.944 302.013-358.51 751.042-1.565 449.029 478.798 368.77 478.798 730.552 0 241.188-89.933 378.432-269.798 411.73l1402.92 2.06V258.872l-1628.552-2.059Z"
                        fill="url(#formGrad)"
                        transform="rotate(40 1182.228 1396.314)"
                      />
                    </svg>
                  </div>

                  {/* ✦ Contenedor Interior */}
                  <div className="relative z-10 bg-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-8">
                    <form onSubmit={handleFormSubmit} className="space-y-10">
                      {/* Sección de Cédula - Diseño Mejorado */}
                      <div>
                        <div className="flex items-center gap-3 mb-5">
                          <div className="p-3 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-white shadow-inner">
                            <User className="h-6 w-6" />
                          </div>
                          <h2 className="text-2xl font-extrabold text-white drop-shadow-lg">Identificación</h2>
                        </div>

                        <div className="space-y-6">
                          {/* === Input de cédula === */}
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Cédula</label>
                            <div className="relative">
                              <input
                                type="text"
                                value={cedula}
                                onChange={(e) => {
                                  setCedula(e.target.value);
                                  setErrorMsg(null); // limpiamos el error cuando el usuario vuelve a escribir
                                }}
                                placeholder="Ej: 1712345678"
                                className="w-full bg-white/90 text-gray-900 rounded-xl py-3 px-4 placeholder-gray-500 focus:ring-2 focus:ring-[#EC4899] transition-all shadow-sm"
                                maxLength={10}
                                disabled={cedulaBloqueada}
                              />
                              {cedula.length === 10 && (
                                <div className="absolute right-3 top-3">
                                  {fetchingUserData ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#EC4899] border-t-transparent"></div>
                                  ) : cedulaValida ? (
                                    <Check className="h-5 w-5 text-green-400" />
                                  ) : (
                                    <span className="text-red-400">✖</span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Mensaje cuando la longitud es 10 pero la validación falla */}
                            {cedula.length === 10 && !cedulaValida && (
                              <p className="text-sm text-red-300 mt-2">Ingresa una cédula válida</p>
                            )}

                            {/* Aquí mostramos el error de “cédula corresponde a otra cuenta” siempre que errorMsg no sea null */}
                            {errorMsg && (
                              <p className="text-sm text-red-500 mt-2">{errorMsg}</p>
                            )}
                          </div>

                        </div>

                        {/* Subformulario de Usuario */}
                        <AnimatePresence>
                          {showUserForm && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4 }}
                              className="mt-8 overflow-hidden"
                            >
                              <div className="bg-gray-700/50 backdrop-blur-md rounded-2xl p-6 border border-gray-600 shadow-xl">
                                {/* Encabezado con icono */}
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-600">
                                  <div className="p-3 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-white shadow-inner">
                                    <User className="h-6 w-6" />
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-semibold text-white">Información Personal</h3>
                                    <p className="text-sm text-white/60">Verifica y actualiza tus datos</p>
                                  </div>
                                </div>

                                {/* Grid de campos del formulario */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Columna izquierda */}
                                  <div className="space-y-6">
                                    {/* Campo Nombres */}
                                    <div className="space-y-2">
                                      <label className="block text-sm font-medium text-white/80">Nombres</label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          value={userData.nombres}
                                          onChange={(e) => setUserData({ ...userData, nombres: e.target.value })}
                                          className="w-full bg-white/90 text-gray-900 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#EC4899] focus:bg-white transition-all placeholder-gray-400 shadow-sm"
                                          placeholder="Ej: Juan Carlos"
                                        />
                                        {userData.nombres && (
                                          <Check className="absolute right-3 top-3 h-5 w-5 text-green-400" />
                                        )}
                                      </div>
                                    </div>

                                    {/* Campo Apellidos */}
                                    <div className="space-y-2">
                                      <label className="block text-sm font-medium text-white/80">Apellidos</label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          value={userData.apellidos}
                                          onChange={(e) => setUserData({ ...userData, apellidos: e.target.value })}
                                          className="w-full bg-white/90 text-gray-900 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#EC4899] focus:bg-white transition-all placeholder-gray-400 shadow-sm"
                                          placeholder="Ej: Pérez Gómez"
                                        />
                                        {userData.apellidos && (
                                          <Check className="absolute right-3 top-3 h-5 w-5 text-green-400" />
                                        )}
                                      </div>
                                    </div>

                                    {/* Campo Género (si lo agregas) */}
                                  </div>

                                  {/* Columna derecha */}
                                  <div className="space-y-6">
                                    {/* Campo Fecha Nacimiento */}
                                    <div className="space-y-2">
                                      <label className="block text-sm font-medium text-white/80">Fecha de Nacimiento</label>
                                      <div className="relative">
                                        <input
                                          type="date"
                                          value={userData.fechaNacimiento ? formatDateToInput(userData.fechaNacimiento) : ''}
                                          onChange={(e) => {
                                            const date = e.target.value ? new Date(e.target.value) : null;
                                            setUserData({ ...userData, fechaNacimiento: date });
                                          }}
                                          className="w-full bg-white/90 text-gray-900 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#EC4899] focus:bg-white transition-all shadow-sm"
                                        />
                                        {userData.fechaNacimiento && (
                                          <Check className="absolute right-3 top-3 h-5 w-5 text-green-400" />
                                        )}
                                      </div>
                                    </div>

                                    {/* Campo Teléfono */}
                                    <div className="space-y-2">
                                      <label className="block text-sm font-medium text-white/80 flex items-center">
                                        Teléfono
                                        <span className="text-red-400 ml-1">*</span>
                                      </label>
                                      <div className="relative">
                                        <input
                                          type="tel"
                                          value={userData.telefono}
                                          onChange={(e) => setUserData({ ...userData, telefono: e.target.value })}
                                          required
                                          pattern="[0-9]{10,15}"
                                          className="w-full bg-white/90 text-gray-900 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#EC4899] focus:bg-white transition-all placeholder-gray-400 shadow-sm"
                                          placeholder="Ej: 0987654321"
                                        />
                                        {userData.telefono && (
                                          <Check className="absolute right-3 top-3 h-5 w-5 text-green-400" />
                                        )}
                                      </div>
                                    </div>

                                    {/* Campo Email */}
                                    <div className="space-y-2">
                                      <label className="block text-sm font-medium text-white/80 flex items-center">
                                        Correo Electrónico
                                        <span className="text-red-400 ml-1">*</span>
                                      </label>
                                      <div className="relative">
                                        <input
                                          type="email"
                                          value={userData.email}
                                          // ya no hace falta onChange porque el campo está deshabilitado
                                          disabled
                                          required
                                          className="w-full bg-gray-200 text-gray-700 rounded-xl py-2.5 px-4 placeholder-gray-400 shadow-sm cursor-not-allowed"
                                          placeholder="Ej: ejemplo@correo.com"
                                        />
                                        {userData.email && (
                                          <Check className="absolute right-3 top-3 h-5 w-5 text-green-400" />
                                        )}
                                      </div>
                                    </div>

                                  </div>
                                </div>

                                {/* Nota de campos obligatorios */}
                                <div className="mt-6 pt-4 border-t border-gray-600">
                                  <p className="text-xs text-white/50">
                                    <span className="text-red-400">*</span> Campos obligatorios
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Sección de Vehículo - Diseño Mejorado */}
                      {vehiculosUsuario.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-white/90 mb-4">Mis Vehículos Registrados</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
                            {vehiculosUsuario.map((vehiculo, index) => (
                              <motion.div
                                key={index}
                                whileHover={{ y: -3 }}
                                className={`relative overflow-hidden rounded-2xl p-5 border shadow-lg cursor-pointer transition-all duration-200 ${vehiculoSeleccionado === vehiculo.placa
                                  ? 'border-cyan-400 bg-cyan-400/10 ring-2 ring-cyan-400/30'
                                  : 'border-gray-600 bg-gray-800/40 hover:bg-gray-800/30'
                                  }`}
                                onClick={() => {
                                  setVehiculoSeleccionado(vehiculo.placa);
                                  setPlaca(vehiculo.placa);
                                  setVehicleData({
                                    placa: vehiculo.placa,
                                    marca: vehiculo.marca || '',
                                    modelo: vehiculo.modelo || '',
                                    año: vehiculo.anio?.toString() || '',
                                    color: vehiculo.color || '',
                                    tipo: vehiculo.tipo || '',
                                    chasis: vehiculo.chasis || '',
                                    motor: vehiculo.motor || '',
                                    cmv: vehiculo.cmv || '',
                                    cilindraje: vehiculo.cilindraje?.toString() || '',
                                  });
                                  setMostrarNuevoVehiculo(false);
                                }}
                              >
                                {/* Encabezado con placa y tipo */}
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h4 className="text-xl font-bold text-white tracking-wider">{vehiculo.placa}</h4>
                                    <span
                                      className={`text-xs font-medium px-2 py-1 rounded-full ${vehiculo.tipo === 'motocicleta'
                                        ? 'bg-blue-500/20 text-blue-300'
                                        : vehiculo.tipo === 'camioneta'
                                          ? 'bg-green-500/20 text-green-300'
                                          : 'bg-purple-500/20 text-purple-300'
                                        }`}
                                    >
                                      {vehiculo.tipo || 'Vehículo'}
                                    </span>
                                  </div>

                                  {vehiculoSeleccionado === vehiculo.placa && (
                                    <div className="bg-cyan-400 text-gray-900 text-xs px-2 py-1 rounded-full flex items-center">
                                      <Check className="h-3 w-3 mr-1" />
                                      Seleccionado
                                    </div>
                                  )}
                                </div>

                                {/* Detalles del vehículo */}
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-xs text-white/60 mb-1">Marca/Modelo</p>
                                    <p className="text-white font-medium truncate">
                                      {vehiculo.marca || 'Sin marca'} {vehiculo.modelo && `- ${vehiculo.modelo}`}
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <p className="text-xs text-white/60 mb-1">Año</p>
                                      <p className="text-white font-medium">{vehiculo.anio || 'N/A'}</p>
                                    </div>

                                    <div>
                                      <p className="text-xs text-white/60 mb-1">Color</p>
                                      <div className="flex items-center gap-2">
                                        <span
                                          className="inline-block h-4 w-4 rounded-full border border-gray-600"
                                          style={{ backgroundColor: getColorCode(vehiculo.color) }}
                                        />
                                        <span className="text-white font-medium capitalize truncate">
                                          {vehiculo.color || 'N/A'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Efecto sutil de selección */}
                                {vehiculoSeleccionado === vehiculo.placa && (
                                  <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-cyan-400/50 animate-pulse-slow"></div>
                                )}
                              </motion.div>
                            ))}
                          </div>

                          {/* Botón para nuevo vehículo */}
                          <div className="mt-8 flex justify-center">
                            <motion.button
                              type="button"
                              onClick={() => {
                                setMostrarNuevoVehiculo(true);
                                setShowVehicleForm(true); // Forzar mostrar el formulario
                                setVehiculoSeleccionado('');
                                setVehicleData({
                                  placa: '',
                                  marca: '',
                                  modelo: '',
                                  año: '',
                                  color: '',
                                  tipo: '',
                                  chasis: '',
                                  motor: '',
                                  cmv: '',
                                  cilindraje: '',
                                });
                                setPlaca('');
                                setTimeout(() => {
                                  const formElement = document.getElementById('nuevo-vehiculo-form');
                                  if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
                                }, 100);
                              }}
                              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-tr from-cyan-400 to-blue-500 text-white rounded-full hover:shadow-lg transition-all text-sm font-medium"
                            >
                              <PlusCircle className="h-4 w-4" />
                              Agregar nuevo vehículo
                            </motion.button>



                          </div>
                        </div>
                      )}

                      {(vehiculosUsuario.length === 0 || mostrarNuevoVehiculo) && (
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mt-8"
                          >
                            {/* Aquí va tu formulario de registro de nuevo vehículo existente */}
                            <div>
                              <div className="flex items-center gap-3 mb-5">
                                <div className="p-3 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-white shadow-inner">
                                  <Car className="h-6 w-6" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">Vehículo</h2>
                              </div>

                              <div className="space-y-6">
                                <div>
                                  <label className="block text-sm font-medium text-white/80 mb-2">Placa</label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      value={placa}
                                      onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                                      placeholder="Ej: ABC1234"
                                      className="w-full bg-white/90 text-gray-900 rounded-xl py-3 px-4 placeholder-gray-500 focus:ring-2 focus:ring-[#EC4899] focus:bg-white transition-all shadow-sm"
                                      maxLength={7}
                                    />
                                    {placa.length >= 6 && (
                                      <div className="absolute right-3 top-3">
                                        {placaValida ? (
                                          <Check className="h-5 w-5 text-green-400" />
                                        ) : (
                                          <span className="text-red-400">✖</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  {placa.length >= 6 && !placaValida && (
                                    <p className="text-sm text-red-300 mt-2">Formato de placa inválido</p>
                                  )}
                                </div>
                              </div>

                              {/* Subformulario de Vehículo */}
                              {(vehiculosUsuario.length === 0 || mostrarNuevoVehiculo) && (
                                <AnimatePresence>
                                  {showVehicleForm && (
                                    <motion.div
                                      id="nuevo-vehiculo-form"
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.4 }}
                                      className="mt-8 overflow-hidden"
                                    >
                                      <div className="bg-gray-700/50 backdrop-blur-md border border-gray-600 rounded-xl p-6 space-y-6">
                                        <h3 className="text-lg font-semibold text-white/90 mb-2">Detalles del Vehículo</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                          <div>
                                            <label className="block text-sm font-medium text-white/80 mb-2">Marca</label>
                                            <input
                                              type="text"
                                              value={vehicleData.marca}
                                              placeholder="Ej. Chevrolet"
                                              onChange={(e) => setVehicleData({ ...vehicleData, marca: e.target.value })}
                                              className="w-full bg-white/90 text-gray-900 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#EC4899] focus:bg-white transition-all shadow-sm"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-sm font-medium text-white/80 mb-2">Modelo</label>
                                            <input
                                              type="text"
                                              value={vehicleData.modelo}
                                              placeholder="Ej: Aveo Emotion"
                                              onChange={(e) => setVehicleData({ ...vehicleData, modelo: e.target.value })}
                                              className="w-full bg-white/90 text-gray-900 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#EC4899] focus:bg-white transition-all shadow-sm"
                                            />
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                          <div>
                                            <label className="block text-sm font-medium text-white/80 mb-2">Año</label>
                                            <input
                                              type="number"
                                              placeholder="Ej: 2020"
                                              value={vehicleData.año}
                                              onChange={(e) =>
                                                setVehicleData({ ...vehicleData, año: e.target.value })
                                              }
                                              className="w-full bg-white/90 text-gray-900 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#EC4899] focus:bg-white transition-all shadow-sm"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-sm font-medium text-white/80 mb-2">Color</label>
                                            <input
                                              type="text"
                                              placeholder="Ej. Rojo"
                                              value={vehicleData.color}
                                              onChange={(e) =>
                                                setVehicleData({ ...vehicleData, color: e.target.value })
                                              }
                                              className="w-full bg-white/90 text-gray-900 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#EC4899] focus:bg-white transition-all shadow-sm"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-sm font-medium text-white/80 mb-2">Tipo</label>
                                            <select
                                              value={vehicleData.tipo}
                                              onChange={(e) =>
                                                setVehicleData({ ...vehicleData, tipo: e.target.value })
                                              }
                                              className="w-full bg-white/90 text-gray-900 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#EC4899] focus:bg-white transition-all shadow-sm"
                                            >
                                              <option value="">Seleccionar</option>
                                              <option value="automovil">Automóvil</option>
                                              <option value="camioneta">Camioneta</option>
                                              <option value="motocicleta">Motocicleta</option>
                                              <option value="comercial">Comercial</option>
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              )}
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      )}

                      {/* Botón de Envío Mejorado */}
                      <div className="flex justify-end pt-4">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          type="submit"
                          disabled={!showUserForm || !showVehicleForm}
                          className={`py-3 px-8 rounded-full font-medium flex items-center gap-2 shadow-lg ${showUserForm && showVehicleForm
                            ? 'bg-gradient-to-tr from-cyan-400 to-blue-500 text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                          Continuar
                          <ChevronRight className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </div>

              </motion.div>
            </div>

            <AnimatePresence>
              {showNotification && (
                <Notification
                  message={notificationMessage}
                  onClose={() => setShowNotification(false)}
                />
              )}

            </AnimatePresence>

          </main>

        </div>
        <NoPayChatLauncher />

      </BackgroundWithSideSvg>
      <Footer />
    </>
  );
};

export default AdvancedForm;