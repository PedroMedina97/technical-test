import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'es' | 'en';

export interface TranslationData {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<Language>('es');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();
  
  private translationsSubject = new BehaviorSubject<TranslationData>({});
  public translations$ = this.translationsSubject.asObservable();
  
  private readonly STORAGE_KEY = 'selectedLanguage';
  private readonly DEFAULT_LANGUAGE: Language = 'es';
  
  private translations: { [key in Language]: TranslationData } = {
    es: {
      "common": {
        "loading": "Cargando...",
        "save": "Guardar",
        "cancel": "Cancelar",
        "edit": "Editar",
        "delete": "Eliminar",
        "view": "Ver",
        "create": "Crear",
        "update": "Actualizar",
        "back": "Volver",
        "close": "Cerrar",
        "confirm": "Confirmar",
        "yes": "Sí",
        "no": "No",
        "search": "Buscar",
        "filter": "Filtrar",
        "clear": "Limpiar",
        "actions": "Acciones",
        "details": "Detalles",
        "name": "Nombre",
        "email": "Email",
        "phone": "Teléfono",
        "company": "Empresa",
        "address": "Dirección",
        "city": "Ciudad",
        "street": "Calle",
        "zipcode": "Código Postal",
        "website": "Sitio Web",
        "username": "Usuario",
        "password": "Contraseña",
        "required": "Requerido",
        "optional": "Opcional",
        "users": "usuarios"
      },
      "auth": {
        "login": "Iniciar Sesión",
        "logout": "Cerrar Sesión",
        "welcome": "Bienvenido",
        "loginSuccess": "Inicio de sesión exitoso",
        "loginError": "Error de autenticación",
        "invalidCredentials": "Credenciales inválidas",
        "userNotFound": "Usuario no encontrado",
        "wrongPassword": "Contraseña incorrecta",
        "rememberMe": "Recordarme",
        "forgotPassword": "¿Olvidaste tu contraseña?",
        "usernameOrEmail": "Usuario o Email",
        "enterUsernameOrEmail": "Ingresa tu usuario o email",
        "enterPassword": "Ingresa tu contraseña",
        "formIncomplete": "Por favor, complete todos los campos requeridos",
        "formIncompleteTitle": "Formulario incompleto"
      },
      "navigation": {
        "home": "Inicio",
        "users": "Usuarios",
        "language": "Idioma",
        "spanish": "Español",
        "english": "Inglés"
      },
      "users": {
        "title": "Gestión de Usuarios",
        "createUser": "Crear Usuario",
        "editUser": "Editar Usuario",
        "userDetails": "Detalles del Usuario",
        "userList": "Lista de Usuarios",
        "featuredUsers": "Usuarios Destacados",
        "addToFeatured": "Destacar",
        "removeFromFeatured": "Quitar de Destacados",
        "isFeatured": "Destacado",
        "personalInfo": "Información Personal",
        "addressInfo": "Información de Dirección",
        "companyInfo": "Información de la Empresa",
        "coordinates": "Coordenadas Geográficas",
        "latitude": "Latitud",
        "longitude": "Longitud",
        "suite": "Suite/Apartamento",
        "catchPhrase": "Eslogan",
        "businessDescription": "Descripción del Negocio",
        "deleteUser": "Eliminar Usuario",
        "deleteConfirm": "¿Estás seguro de que deseas eliminar este usuario?",
        "deleteWarning": "Esta acción no se puede deshacer",
        "userCreated": "Usuario creado exitosamente",
        "userUpdated": "Usuario actualizado exitosamente",
        "userDeleted": "Usuario eliminado exitosamente",
        "noUsers": "No hay usuarios disponibles",
        "noResults": "No se encontraron resultados",
        "updateUser": "Actualizar Usuario",
        "accessDenied": "Acceso denegado",
        "noPermission": "No tienes permisos para realizar esta acción",
        "manager": "Manager",
        "coordinator": "Coordinador"
      },
      "forms": {
        "validation": {
          "required": "Este campo es requerido",
          "minLength": "Mínimo {0} caracteres",
          "maxLength": "Máximo {0} caracteres",
          "email": "Email inválido",
          "phoneMinLength": "El teléfono debe tener al menos {0} dígitos",
          "phoneMaxLength": "El teléfono no puede exceder {0} dígitos",
          "phonePattern": "Solo se permiten números, +, #, espacios, guiones y paréntesis",
          "invalidFormat": "Formato inválido"
        },
        "placeholders": {
          "enterFullName": "Ingresa el nombre completo",
          "enterUsername": "Ingresa el nombre de usuario",
          "enterEmail": "Ingresa el email",
          "enterPhone": "Ej: +1 (555) 123-4567 o 555#123",
          "enterWebsite": "Ingresa el sitio web",
          "enterStreet": "Ingresa la calle",
          "enterSuite": "Ingresa la suite o apartamento",
          "enterCity": "Ingresa la ciudad",
          "enterZipcode": "Ingresa el código postal",
          "enterCompanyName": "Ingresa el nombre de la empresa",
          "enterCatchPhrase": "Ingresa el eslogan de la empresa",
          "enterBusinessDescription": "Ingresa la descripción del negocio",
          "latitudeExample": "Ej: -37.3159",
          "longitudeExample": "Ej: 81.1496",
          "phoneExample": "Ej: +1 (555) 123-4567 o 555#123"
        },
        "help": {
          "phoneFormat": "Solo se permiten números (0-9), +, #, espacios, guiones (-) y paréntesis ()"
        }
      },
      "alerts": {
        "success": "Éxito",
        "error": "Error",
        "warning": "Advertencia",
        "info": "Información"
      }
    },
    en: {
      "common": {
        "loading": "Loading...",
        "save": "Save",
        "cancel": "Cancel",
        "edit": "Edit",
        "delete": "Delete",
        "view": "View",
        "create": "Create",
        "update": "Update",
        "back": "Back",
        "close": "Close",
        "confirm": "Confirm",
        "yes": "Yes",
        "no": "No",
        "search": "Search",
        "filter": "Filter",
        "clear": "Clear",
        "actions": "Actions",
        "details": "Details",
        "name": "Name",
        "email": "Email",
        "phone": "Phone",
        "company": "Company",
        "address": "Address",
        "city": "City",
        "street": "Street",
        "zipcode": "ZIP Code",
        "website": "Website",
        "username": "Username",
        "password": "Password",
        "required": "Required",
        "optional": "Optional",
        "users": "users"
      },
      "auth": {
        "login": "Login",
        "logout": "Logout",
        "welcome": "Welcome",
        "loginSuccess": "Login successful",
        "loginError": "Authentication error",
        "invalidCredentials": "Invalid credentials",
        "userNotFound": "User not found",
        "wrongPassword": "Incorrect password",
        "rememberMe": "Remember me",
        "forgotPassword": "Forgot your password?",
        "usernameOrEmail": "Username or Email",
        "enterUsernameOrEmail": "Enter your username or email",
        "enterPassword": "Enter your password",
        "formIncomplete": "Please complete all required fields",
        "formIncompleteTitle": "Incomplete form"
      },
      "navigation": {
        "home": "Home",
        "users": "Users",
        "language": "Language",
        "spanish": "Spanish",
        "english": "English"
      },
      "users": {
        "title": "User Management",
        "createUser": "Create User",
        "editUser": "Edit User",
        "userDetails": "User Details",
        "userList": "User List",
        "featuredUsers": "Featured Users",
        "addToFeatured": "Feature",
        "removeFromFeatured": "Remove from Featured",
        "isFeatured": "Featured",
        "personalInfo": "Personal Information",
        "addressInfo": "Address Information",
        "companyInfo": "Company Information",
        "coordinates": "Geographic Coordinates",
        "latitude": "Latitude",
        "longitude": "Longitude",
        "suite": "Suite/Apartment",
        "catchPhrase": "Catchphrase",
        "businessDescription": "Business Description",
        "deleteUser": "Delete User",
        "deleteConfirm": "Are you sure you want to delete this user?",
        "deleteWarning": "This action cannot be undone",
        "userCreated": "User created successfully",
        "userUpdated": "User updated successfully",
        "userDeleted": "User deleted successfully",
        "noUsers": "No users available",
        "noResults": "No results found",
        "updateUser": "Update User",
        "accessDenied": "Access denied",
        "noPermission": "You don't have permission to perform this action",
        "manager": "Manager",
        "coordinator": "Coordinator"
      },
      "forms": {
        "validation": {
          "required": "This field is required",
          "minLength": "Minimum {0} characters",
          "maxLength": "Maximum {0} characters",
          "email": "Invalid email",
          "phoneMinLength": "Phone must have at least {0} digits",
          "phoneMaxLength": "Phone cannot exceed {0} digits",
          "phonePattern": "Only numbers, +, #, spaces, hyphens and parentheses are allowed",
          "invalidFormat": "Invalid format"
        },
        "placeholders": {
          "enterFullName": "Enter full name",
          "enterUsername": "Enter username",
          "enterEmail": "Enter email",
          "enterPhone": "Ex: +1 (555) 123-4567 or 555#123",
          "enterWebsite": "Enter website",
          "enterStreet": "Enter street",
          "enterSuite": "Enter suite or apartment",
          "enterCity": "Enter city",
          "enterZipcode": "Enter ZIP code",
          "enterCompanyName": "Enter company name",
          "enterCatchPhrase": "Enter company catchphrase",
          "enterBusinessDescription": "Enter business description",
          "latitudeExample": "Ex: -37.3159",
          "longitudeExample": "Ex: 81.1496",
          "phoneExample": "Ex: +1 (555) 123-4567 or 555#123"
        },
        "help": {
          "phoneFormat": "Only numbers (0-9), +, #, spaces, hyphens (-) and parentheses () are allowed"
        }
      },
      "alerts": {
        "success": "Success",
        "error": "Error",
        "warning": "Warning",
        "info": "Information"
      }
    }
  };

  constructor() {
    this.loadLanguageFromStorage();
    this.loadTranslations();
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  /**
   * Set language
   */
  setLanguage(language: Language): void {
    this.currentLanguageSubject.next(language);
    localStorage.setItem(this.STORAGE_KEY, language);
    this.loadTranslations();
  }

  /**
   * Get translation by key
   */
  translate(key: string, params?: { [key: string]: string | number }): string {
    const translation = this.getTranslationByKey(key);
    
    if (params) {
      return this.interpolateParams(translation, params);
    }
    
    return translation;
  }

  /**
   * Get translation by key with fallback
   */
  private getTranslationByKey(key: string): string {
    const currentLang = this.getCurrentLanguage();
    const keys = key.split('.');
    let translation: any = this.translations[currentLang];
    
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        // Fallback to Spanish if translation not found
        translation = this.translations['es'];
        for (const fallbackKey of keys) {
          if (translation && typeof translation === 'object' && fallbackKey in translation) {
            translation = translation[fallbackKey];
          } else {
            return key; // Return key if no translation found
          }
        }
        break;
      }
    }
    
    return typeof translation === 'string' ? translation : key;
  }

  /**
   * Interpolate parameters in translation string
   */
  private interpolateParams(translation: string, params: { [key: string]: string | number }): string {
    let result = translation;
    
    for (const [key, value] of Object.entries(params)) {
      const placeholder = `{${key}}`;
      result = result.replace(new RegExp(placeholder, 'g'), String(value));
    }
    
    return result;
  }

  /**
   * Load language from localStorage
   */
  private loadLanguageFromStorage(): void {
    try {
      const storedLanguage = localStorage.getItem(this.STORAGE_KEY) as Language;
      if (storedLanguage && (storedLanguage === 'es' || storedLanguage === 'en')) {
        this.currentLanguageSubject.next(storedLanguage);
      } else {
        this.currentLanguageSubject.next(this.DEFAULT_LANGUAGE);
      }
    } catch (error) {
      console.error('Error loading language from storage:', error);
      this.currentLanguageSubject.next(this.DEFAULT_LANGUAGE);
    }
  }

  /**
   * Load translations from embedded data
   */
  private loadTranslations(): void {
    const currentLang = this.getCurrentLanguage();
    const translations = this.translations[currentLang];
    this.translationsSubject.next(translations);
  }

  /**
   * Get available languages
   */
  getAvailableLanguages(): { code: Language; name: string }[] {
    return [
      { code: 'es', name: 'Español' },
      { code: 'en', name: 'English' }
    ];
  }

  /**
   * Check if current language is RTL
   */
  isRTL(): boolean {
    return false; // Neither Spanish nor English are RTL
  }

  /**
   * Get language direction
   */
  getLanguageDirection(): 'ltr' | 'rtl' {
    return 'ltr';
  }
}