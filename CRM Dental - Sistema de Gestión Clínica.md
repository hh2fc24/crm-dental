# CRM Dental - Sistema de Gestión Clínica

Un sistema de gestión clínica dental profesional con diseño estilo Apple, construido con Next.js, TypeScript, TailwindCSS y Supabase.

## 🚀 Características

### Diseño y UX
- **Interfaz estilo Apple**: Diseño minimalista, elegante y ultra intuitivo
- **Responsive**: Optimizado para desktop, tablet y mobile
- **Animaciones suaves**: Transiciones y micro-interacciones pulidas
- **Tipografía clara**: Espacios generosos y alta legibilidad

### Funcionalidades Core
- **Sidebar fija**: Buscador de pacientes en tiempo real (nombre, RUT, teléfono)
- **Vista de paciente completa**: Historial clínico, tratamientos, evolución
- **Odontograma interactivo**: SVG de dentadura completa (32 piezas adultos, 20 niños)
- **Header tipo Apple Card**: Información del paciente con diseño elegante

### Funcionalidades Premium
- **Exportación PDF**: Fichas clínicas con diseño profesional
- **Sistema de tags**: Categorización por tratamiento y estado
- **Notas privadas**: Sistema confidencial para doctores
- **Historial de edición**: Auditoría completa de cambios
- **Recordatorios**: Timeline de seguimiento automático

### Seguridad y Multiusuario
- **Supabase Auth**: Autenticación segura
- **RLS (Row Level Security)**: Protección de datos por doctor/clínica
- **Sesiones persistentes**: Manejo seguro de autenticación
- **Datos protegidos**: Cada ficha asociada a doctor_id/clinica_id

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **UI Components**: Componentes personalizados estilo Apple
- **Icons**: Lucide React
- **PDF**: jsPDF + html2canvas
- **Deployment**: Vercel Ready

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm, yarn o pnpm

### Configuración

1. **Clonar e instalar dependencias**
```bash
git clone <repository>
cd crm-dental
npm install
# o
yarn install
# o
pnpm install
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

3. **Configurar base de datos**
- Crear proyecto en [Supabase](https://supabase.com)
- Ejecutar el script `supabase-schema.sql` en el SQL Editor
- Configurar RLS según las políticas incluidas

4. **Ejecutar en desarrollo**
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 🗄️ Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Button, Card, etc.)
│   ├── auth/             # Sistema de autenticación
│   ├── dental/           # Componentes del odontograma
│   ├── Sidebar.tsx       # Barra lateral con buscador
│   ├── PatientView.tsx   # Vista principal del paciente
│   ├── PatientHeader.tsx # Header estilo Apple Card
│   ├── PatientTabs.tsx   # Navegación por tabs
│   ├── TagSystem.tsx     # Sistema de etiquetas
│   ├── PrivateNotes.tsx  # Notas privadas
│   ├── EditHistory.tsx   # Historial de cambios
│   └── ReminderSystem.tsx # Recordatorios
├── lib/                  # Utilidades y configuración
│   ├── supabase.ts       # Cliente Supabase
│   ├── database.ts       # Funciones de BD
│   ├── pdf-export.ts     # Exportación PDF
│   └── utils.ts          # Utilidades generales
└── types/                # Tipos TypeScript
    ├── patient.ts        # Tipos de paciente
    └── database.ts       # Tipos de BD
```

## 🎨 Componentes Principales

### Odontograma Interactivo
- SVG anatómicamente correcto
- 32 dientes adultos / 20 niños
- Estados: sano, caries, endodoncia, corona, implante, extracción
- Modal de edición por diente
- Responsive y touch-friendly

### Sistema de Búsqueda
- Búsqueda en tiempo real
- Filtros: nombre, RUT, teléfono
- Resultados instantáneos
- Navegación por teclado

### Exportación PDF
- Diseño profesional
- Header personalizable
- Información completa del paciente
- Historial clínico detallado
- Marca de agua configurable

## 🔐 Seguridad

### Row Level Security (RLS)
```sql
-- Ejemplo de política RLS
CREATE POLICY "Doctores solo ven sus pacientes" ON pacientes
FOR ALL USING (doctor_id = auth.uid());
```

### Autenticación
- Email/password con Supabase Auth
- Recuperación de contraseña
- Sesiones seguras
- Perfiles de doctor automáticos

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Optimizaciones Mobile
- Sidebar colapsable
- Touch gestures en odontograma
- Formularios optimizados
- Navegación simplificada

## 🚀 Deployment

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Variables de entorno en producción
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📄 Licencia

Este proyecto es privado y confidencial. Todos los derechos reservados.

## 🤝 Soporte

Para soporte técnico o consultas sobre implementación, contactar al equipo de desarrollo.

---

**CRM Dental** - Sistema profesional de gestión clínica con calidad estética y experiencia de usuario a nivel Apple.

