import { AVAILABLE_TOKENS } from '@/shared/enums/tokens'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/shared/ui/select'

interface TokenPickerProps {
  value: string
  onValueChange: (value: string) => void
}

export function TokenPicker({ value, onValueChange }: TokenPickerProps) {
  return (
    <Select defaultValue={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-fit bg-transparent px-2 h-9 dark:border-white/40">
        <span className="text-sm text-muted-foreground">{value}</span>
      </SelectTrigger>
      <SelectContent>
        {Object.values(AVAILABLE_TOKENS).map((token, idx) => (
          <SelectItem value={token} key={idx}>
            {token}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
