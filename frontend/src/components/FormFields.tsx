import { Field, HStack, IconButton, Input, NumberInput, Portal, Select, Switch, Text, createListCollection } from '@chakra-ui/react'
import { LuInfo, LuMinus, LuPlus } from 'react-icons/lu'
import { Tooltip } from './Tooltip'

// Leiras: ujrafelhasznalhato urlap mezok.

interface NumFieldProps {
  label: string
  info: string
  value: number | null
  onChange: (value: number | null) => void
  min?: number
  max?: number
  step?: number
  helperText?: string
  placeholder?: string
}

interface CounterFieldProps {
  label: string
  info: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

interface Option {
  label: string
  value: string
}

interface SelectFieldProps {
  label: string
  info: string
  value: string
  onChange: (value: string) => void
  options: Option[]
}

interface TextFieldProps {
  label: string
  info: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  invalid?: boolean
  errorText?: string
}

interface SwitchFieldProps {
  label: string
  info: string
  checked: boolean
  onChange: (checked: boolean) => void
}

const InfoIcon = ({ info }: { info: string }) => (
  <Tooltip content={info} showArrow contentProps={{ maxW: '260px', css: { "--tooltip-bg": "#9333EA", "color": "#FFFFFF", "justify-content": "center" } }} interactive>
    <Text as="span" display="inline-flex" alignItems="center" color="fg.muted" cursor="help">
      <LuInfo size={14} />
    </Text>
  </Tooltip>
)

// Tooltip hozzaadasa
const FieldLabelWithInfo = ({ label, info }: { label: string; info: string }) => (
  <HStack gap={1}>
    <Field.Label>{label}</Field.Label>
    <InfoIcon info={info} />
  </HStack>
)

// Szam bemenet
export const NumField = ({
  label,
  info,
  value,
  onChange,
  min,
  max,
  step = 1,
  helperText,
  placeholder,
}: NumFieldProps) => (
  <Field.Root>
    <FieldLabelWithInfo label={label} info={info} />
    <NumberInput.Root
      value={value === null ? '' : String(value)}
      onValueChange={(details) => {
        if (details.value === '') {
          onChange(null)
          return
        }
        if (!Number.isNaN(details.valueAsNumber)) onChange(details.valueAsNumber)
      }}
      min={min}
      max={max}
      step={step}
      w="full"
    >
      <NumberInput.Control />
      <NumberInput.Input placeholder={placeholder} />
    </NumberInput.Root>
    {helperText && <Field.HelperText>{helperText}</Field.HelperText>}
  </Field.Root>
)

// Darabszam bemenet
export const CounterField = ({ label, info, value, onChange, min = 0, max, step = 1 }: CounterFieldProps) => (
  <Field.Root>
    <FieldLabelWithInfo label={label} info={info} />
    <NumberInput.Root
      value={String(value)}
      onValueChange={(details) => {
        if (!Number.isNaN(details.valueAsNumber)) onChange(details.valueAsNumber)
      }}
      min={min}
      max={max}
      step={step}
      w="full"
    >
      <HStack gap={2}>
        <NumberInput.DecrementTrigger asChild>
          <IconButton variant="outline" size="sm" aria-label="Csökkentés">
            <LuMinus />
          </IconButton>
        </NumberInput.DecrementTrigger>
        <NumberInput.Input textAlign="center" />
        <NumberInput.IncrementTrigger asChild>
          <IconButton variant="outline" size="sm" aria-label="Növelés">
            <LuPlus />
          </IconButton>
        </NumberInput.IncrementTrigger>
      </HStack>
    </NumberInput.Root>
  </Field.Root>
)

// Opciovalasztos mezo
export const SelectField = ({ label, info, value, onChange, options }: SelectFieldProps) => {
  const collection = createListCollection({ items: options })
  return (
    <Field.Root>
      <FieldLabelWithInfo label={label} info={info} />
      <Select.Root
        collection={collection}
        value={[value]}
        onValueChange={(details) => {
          if (details.value[0]) onChange(details.value[0])
        }}
      >
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {options.map((opt) => (
                <Select.Item item={opt} key={opt.value}>
                  {opt.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Field.Root>
  )
}

// Szoveg bemenet
export const TextField = ({ label, info, value, onChange, placeholder, invalid, errorText}: TextFieldProps) => (
  <Field.Root invalid={invalid}>
    <FieldLabelWithInfo label={label} info={info}/>
    <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    {invalid && errorText && <Field.ErrorText>{errorText}</Field.ErrorText>}
  </Field.Root>
)

// Kapcsologomb
export const SwitchField = ({ label, info, checked, onChange }: SwitchFieldProps) => (
  <Field.Root>
    <HStack gap={2}>
      <Switch.Root
        checked={checked}
        onCheckedChange={(details) => onChange(details.checked)}
        colorPalette="purple"
      >
        <Switch.HiddenInput />
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>
      <FieldLabelWithInfo label={label} info={info} />
    </HStack>
  </Field.Root>
)
