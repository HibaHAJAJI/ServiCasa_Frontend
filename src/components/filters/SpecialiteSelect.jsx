import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SpecialiteSelect = ({
  specialites = [],
  value,
  onChange,
  disabled = false,
}) => {
  const selectValue = value === "" || value == null ? undefined : String(value);

  return (
    <Select value={selectValue} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full border-0 shadow-none">
        <SelectValue placeholder="Sélectionnez une spécialité" />
      </SelectTrigger>

      <SelectContent>
        {specialites.map((specialite) => (
          <SelectItem
            key={specialite.id}
            value={String(specialite.id)}
          >
            {specialite.nom}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SpecialiteSelect;