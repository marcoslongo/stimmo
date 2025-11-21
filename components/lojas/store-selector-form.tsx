"use client"

import * as React from "react"
import { Check, ChevronsUpDown, MapPin, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Store } from "@/types/stores"

interface StoreSelectorProps {
  stores: Store[]
  value: string
  onValueChange: (value: string) => void
  preferredStoreId?: string
  placeholder?: string
  className?: string
}

export function StoreSelectorForm({
  stores,
  value,
  onValueChange,
  preferredStoreId,
  placeholder = "Selecione a unidade mais próxima",
}: StoreSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const selectedStore = stores.find((store) => store.id === value)

  const filteredStores = React.useMemo(() => {
    if (!searchQuery) return stores

    const query = searchQuery.toLowerCase()
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(query) ||
        store.city.toLowerCase().includes(query) ||
        store.state.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query),
    )
  }, [stores, searchQuery])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10 bg-transparent"
        >
          {selectedStore ? (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="truncate">{selectedStore.name}</span>
              {preferredStoreId === selectedStore.id}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder="Buscar por cidade, endereço ou nome..."
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <CommandList>
            <CommandEmpty>Nenhuma unidade encontrada.</CommandEmpty>
            <CommandGroup>
              <RadioGroup value={value} onValueChange={onValueChange}>
                {filteredStores.map((store) => (
                  <CommandItem
                    key={store.id}
                    value={store.id}
                    onSelect={() => {
                      onValueChange(store.id)
                      setOpen(false)
                      setSearchQuery("")
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start gap-3 w-full py-2">
                      <RadioGroupItem value={store.id} id={store.id} className="mt-1" />
                      <Label htmlFor={store.id} className="flex-1 cursor-pointer">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-medium flex items-center gap-2">
                              {store.name}
                              {preferredStoreId === store.id}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">{store.address}</div>
                            <div className="text-sm text-muted-foreground">
                              {store.city} - {store.state}
                            </div>
                          </div>
                          <Check className={cn("h-4 w-4 shrink-0", value === store.id ? "opacity-100" : "opacity-0")} />
                        </div>
                      </Label>
                    </div>
                  </CommandItem>
                ))}
              </RadioGroup>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}