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
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full border-0 shadow-none">
        <SelectValue placeholder="Toutes les spécialités" />
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