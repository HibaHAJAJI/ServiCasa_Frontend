import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VilleSelect = ({
  villes = [],
  value,
  onChange,
  disabled = false,
}) => {
  const selectValue = value === "" || value == null ? undefined : String(value);

  return (
    <Select value={selectValue} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full border-0 shadow-none">
        <SelectValue placeholder="Sélectionnez une ville" />
      </SelectTrigger>

      <SelectContent>
        {villes.map((ville) => (
          <SelectItem
            key={ville.id}
            value={ville.nom}
          >
            {ville.nom}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default VilleSelect;