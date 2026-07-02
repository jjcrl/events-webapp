import { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Button } from "./ui/button";
import { MapPin } from "lucide-react";

export default function CityCombobox({ city, cities, onChange }) {
  const [open, setOpen] = useState(false)
  function handleCacheSelect(c) {
    onChange({ city: c })
    setOpen(false)
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[220px] h-[50px] justify-start">
          <MapPin className="mr-2 size-6" />
          {city || "Select city..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-2">
        <div className="flex flex-col max-h-64 overflow-y-auto">
          {cities.length === 0 && (
            <p className="text-sm text-muted-foreground px-2 py-1">
              No cities available
            </p>
          )}
          {cities.map((c) => (
            <Button
              key={c}
              variant="ghost"
              className="justify-start"
              onClick={() => handleCacheSelect(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}