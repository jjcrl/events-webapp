import { Button } from "./ui/button";
import { X, Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { useState } from "react";
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { MapPin } from "lucide-react";

function CityCombobox({ city, cities, onChange }) {
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

function DateRangeFilter({ from, to, onChange }) {
  const range = {
    from: from ? format(new Date(from), "yyyy-MM-dd") : undefined,
    to: to ? format(new Date(to), "yyyy-MM-dd") : undefined,
  }


function handleSelect(selected) {
  if (!selected) return
  const fromStr = selected.from ? format(selected.from, "yyyy-MM-dd") : ""
  const toStr = selected.to ? format(selected.to, "yyyy-MM-dd") : ""
  const sameDay = fromStr && toStr && fromStr === toStr
  onChange({
    from: fromStr,
    to: sameDay ? "" : toStr,
  })
}


  function handleClear() {
    onChange({ from: "", to: "" })
  }
  const hasFilter = Boolean(from || to)
  return (
    <div className="relative inline-block">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal h-[50px]",
              hasFilter && "pr-8",
              !range.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {range.from ? (
              range.to ? (
                <>
                  {format(range.from, "d MMM")} – {format(range.to, "d MMM")}
                </>
              ) : (
                format(range.from, "d MMM yyyy")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
      {hasFilter && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
          aria-label="Clear date filter"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

export default function EventFilters({
  city, from, to, tag,
  cities, topTags,
  onChange,
}) {

  return (
    <div className="flex flex-col gap-3">
      <section className="flex flex-row gap-3 pb-2 pl-3">
        <CityCombobox city={city} cities={cities} onChange={onChange} />
        <DateRangeFilter from={from} to={to} onChange={onChange} />
      </section>
      <section>
        {topTags.filter((t) => t !== "Undefined" && t !== "Other").map((tagName) => (
          <Button
            key={tagName}
            onClick={() => onChange({ tag: tag === tagName ? "" : tagName })}
            variant="secondary"
            className="mx-1 text-xl p-6 text-accent-foreground bg-accent font-bold rounded-full"
          >
            {tagName}
          </Button>
        ))}
      </section>
    </div>
  );
}