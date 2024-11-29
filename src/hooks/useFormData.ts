import { useRef, useState } from 'react';

// Tipar 'initial' con un tipo más flexible
const useFormData = <T>(initial: T) => {
  const form = useRef<HTMLFormElement | null>(null);

  // Cambiar el tipo de 'formData' para aceptar Record<string, any>
  const [formData, setFormData] = useState<Record<string, any>>(initial as any);

  const getFormData = (): Record<string, any> => {
    if (!form.current) return {}; // Si no hay formulario, retornamos un objeto vacío

    const fd = new FormData(form.current);
    const obj: Record<string, any> = {};  // Este objeto es del tipo Record<string, any>

    fd.forEach((value, key) => {
      const str = key.split(':');
      if (str.length > 1) {
        obj[str[0]] = {
          ...obj[str[0]],
          [str[1]]: value,
        };
      } else {
        obj[str[0]] = value;
      }
    });

    return obj;
  };

  const updateFormData = () => {
    setFormData(getFormData()); // Ahora acepta Record<string, any>
  };

  return { form, formData, updateFormData } as const;
};

export default useFormData;
