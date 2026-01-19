import React from 'react';
import * as Select from '@radix-ui/react-select';
import * as Label from '@radix-ui/react-label';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

// Item individual
const SelectItem = React.forwardRef(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className={`
        relative flex items-center h-9 px-8 rounded-md text-sm leading-none 
        text-gray-700 select-none cursor-pointer outline-none
        data-[highlighted]:bg-indigo-100 data-[highlighted]:text-indigo-900
        ${className}
      `}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-2 inline-flex items-center justify-center">
        <Check size={16} />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

// Componente Principal
const CustomSelect = ({ 
    data = [], // 🔥 CORRECCIÓN: Valor por defecto para evitar crash
    label = "",
    placeholder = "Selecciona una opción",
    value, 
    onChange
}) => {
  return (
    <div className="flex flex-col">
    <Label.Root className="text-sm font-semibold text-gray-700 mb-1 select-none">{label}</Label.Root>
    <Select.Root
      value={value ? String(value) : 'all'} // Aseguramos que sea string
      onValueChange={onChange}
      defaultValue="all"
    >
      <Select.Trigger 
        className="
        inline-flex items-center justify-between w-[240px] px-4 py-3 
          text-sm leading-none text-gray-700 bg-white border border-gray-300 
          rounded shadow-sm hover:bg-gray-50 focus:shadow-[0_0_0_2px] focus:shadow-indigo-400 outline-none
          data-[placeholder]:text-gray-400 transition-all
          "
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown size={16} className="text-gray-500" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content asChild position="popper" sideOffset={5}>
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-y bg-white rounded-lg shadow-xl border border-gray-200 min-w-[240px] z-50, max-h-100"
          
          >
            <Select.Viewport className="p-2">
              <Select.Group>
                <Select.Label className="px-6 py-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Opciones
                </Select.Label>

                {/* 🔥 CORRECCIÓN: Mapeo seguro */}
                {data.map((item) => (
                  <SelectItem 
                    key={item.id} 
                    value={String(item.id)} // El valor interno es el ID
                  >
                    {item.value} {/* El texto visible es el VALUE */}
                  </SelectItem>
                ))}
              </Select.Group>
            </Select.Viewport>
            <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet-700 cursor-default">
              <ChevronDown />
            </Select.ScrollDownButton>
          </motion.div>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
    </div>
  
  );
};

// 🔥 IMPORTANTE: Export por defecto
export default CustomSelect;