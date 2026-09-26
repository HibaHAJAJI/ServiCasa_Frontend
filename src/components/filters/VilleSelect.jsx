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
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full border-0 shadow-none">
        <SelectValue placeholder="Toutes les villes" />
      </SelectTrigger>

      <SelectContent>
        {villes.map((ville) => (
          <SelectItem
            key={ville.id}
            value={String(ville.id)}
          >
            {ville.nom}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default VilleSelect;