-- Esquema de base de datos para CRM Dental
-- Ejecutar en Supabase SQL Editor

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de clínicas
CREATE TABLE IF NOT EXISTS public.clinicas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    rut VARCHAR(12) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de doctores
CREATE TABLE IF NOT EXISTS public.doctores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    especialidad VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pacientes
CREATE TABLE IF NOT EXISTS public.pacientes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    rut VARCHAR(12) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20),
    fecha_nacimiento DATE NOT NULL,
    sexo VARCHAR(10) CHECK (sexo IN ('M', 'F', 'Otro')) NOT NULL,
    direccion TEXT,
    contacto_emergencia VARCHAR(255),
    telefono_emergencia VARCHAR(20),
    alergias TEXT[],
    medicamentos TEXT[],
    enfermedades_previas TEXT[],
    doctor_id UUID REFERENCES public.doctores(id) ON DELETE CASCADE NOT NULL,
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de fichas clínicas
CREATE TABLE IF NOT EXISTS public.fichas_clinicas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES public.doctores(id) ON DELETE CASCADE NOT NULL,
    fecha DATE NOT NULL,
    tipo_tratamiento VARCHAR(255) NOT NULL,
    diagnostico TEXT NOT NULL,
    tratamiento_realizado TEXT NOT NULL,
    observaciones TEXT,
    proxima_cita TIMESTAMP WITH TIME ZONE,
    archivos_adjuntos TEXT[],
    tags TEXT[],
    estado VARCHAR(20) CHECK (estado IN ('activo', 'completado', 'cancelado')) DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    updated_by UUID REFERENCES auth.users(id)
);

-- Tabla de odontogramas
CREATE TABLE IF NOT EXISTS public.dental_charts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE NOT NULL,
    teeth JSONB NOT NULL,
    type VARCHAR(10) CHECK (type IN ('adult', 'child')) DEFAULT 'adult',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_pacientes_rut ON public.pacientes(rut);
CREATE INDEX IF NOT EXISTS idx_pacientes_doctor_id ON public.pacientes(doctor_id);
CREATE INDEX IF NOT EXISTS idx_pacientes_nombre_apellido ON public.pacientes(nombre, apellido);
CREATE INDEX IF NOT EXISTS idx_fichas_clinicas_patient_id ON public.fichas_clinicas(patient_id);
CREATE INDEX IF NOT EXISTS idx_fichas_clinicas_doctor_id ON public.fichas_clinicas(doctor_id);
CREATE INDEX IF NOT EXISTS idx_fichas_clinicas_fecha ON public.fichas_clinicas(fecha);
CREATE INDEX IF NOT EXISTS idx_dental_charts_patient_id ON public.dental_charts(patient_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_clinicas_updated_at BEFORE UPDATE ON public.clinicas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doctores_updated_at BEFORE UPDATE ON public.doctores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pacientes_updated_at BEFORE UPDATE ON public.pacientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fichas_clinicas_updated_at BEFORE UPDATE ON public.fichas_clinicas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dental_charts_updated_at BEFORE UPDATE ON public.dental_charts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.clinicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fichas_clinicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dental_charts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para doctores
CREATE POLICY "Doctores pueden ver sus propios datos" ON public.doctores
    FOR ALL USING (auth.uid() = user_id);

-- Políticas RLS para pacientes
CREATE POLICY "Doctores pueden ver sus pacientes" ON public.pacientes
    FOR ALL USING (
        doctor_id IN (
            SELECT id FROM public.doctores WHERE user_id = auth.uid()
        )
    );

-- Políticas RLS para fichas clínicas
CREATE POLICY "Doctores pueden ver fichas de sus pacientes" ON public.fichas_clinicas
    FOR ALL USING (
        patient_id IN (
            SELECT id FROM public.pacientes WHERE doctor_id IN (
                SELECT id FROM public.doctores WHERE user_id = auth.uid()
            )
        )
    );

-- Políticas RLS para odontogramas
CREATE POLICY "Doctores pueden ver odontogramas de sus pacientes" ON public.dental_charts
    FOR ALL USING (
        patient_id IN (
            SELECT id FROM public.pacientes WHERE doctor_id IN (
                SELECT id FROM public.doctores WHERE user_id = auth.uid()
            )
        )
    );

-- Políticas RLS para clínicas
CREATE POLICY "Doctores pueden ver su clínica" ON public.clinicas
    FOR SELECT USING (
        id IN (
            SELECT clinica_id FROM public.doctores WHERE user_id = auth.uid()
        )
    );

-- Función para buscar pacientes
CREATE OR REPLACE FUNCTION search_patients(search_term TEXT, doctor_user_id UUID)
RETURNS TABLE (
    id UUID,
    rut VARCHAR,
    nombre VARCHAR,
    apellido VARCHAR,
    telefono VARCHAR,
    email VARCHAR,
    fecha_nacimiento DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.rut,
        p.nombre,
        p.apellido,
        p.telefono,
        p.email,
        p.fecha_nacimiento
    FROM public.pacientes p
    JOIN public.doctores d ON p.doctor_id = d.id
    WHERE d.user_id = doctor_user_id
    AND (
        p.nombre ILIKE '%' || search_term || '%' OR
        p.apellido ILIKE '%' || search_term || '%' OR
        p.rut ILIKE '%' || search_term || '%' OR
        p.telefono ILIKE '%' || search_term || '%'
    )
    ORDER BY p.nombre, p.apellido;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Datos de ejemplo para desarrollo (opcional)
-- Insertar clínica de ejemplo
INSERT INTO public.clinicas (nombre, direccion, telefono, email, rut) 
VALUES ('Clínica Dental Sonrisa', 'Av. Providencia 1234, Santiago', '+56912345678', 'contacto@clinicasonrisa.cl', '76.123.456-7')
ON CONFLICT (email) DO NOTHING;

-- Nota: Los doctores y pacientes se crearán a través de la aplicación
-- después de que los usuarios se registren con Supabase Auth

