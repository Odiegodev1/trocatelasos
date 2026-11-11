"use client"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react";

interface InputosProps {
  value: string;
  onChange: (value: string) => void;
  totalResults: number;
}

export function Inputos({ value, onChange, totalResults }: InputosProps) {
  return (
    <InputGroup className="max-w-full h-10">
      <InputGroupInput 
        placeholder="Buscar por número, cliente, telefone ou aparelho" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <InputGroupAddon>
        <Search size={18} />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">{totalResults}</InputGroupAddon>
    </InputGroup>
  );
}
