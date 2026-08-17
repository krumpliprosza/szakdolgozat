import { Field, HStack, IconButton, Input, NumberInput, Portal, Select, Switch, Text, createListCollection, DatePicker, parseDate } from '@chakra-ui/react'
import { LuInfo, LuMinus, LuPlus, LuCalendar } from 'react-icons/lu'
import { Tooltip } from './Tooltip'
import { useColorModeValue } from './color-mode'

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
  invalid?: boolean
  errorText?: string
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

interface DateFieldProps {
  label: string
  minimum: string
  maximum: string
  startDate: string
  endDate: string
  onChange: (range: { startDate: string; endDate: string }) => void 
  invalid?: boolean
  errorText?: string
}

// (i) ikon es a hozzatartozo leiras
const InfoIcon = ({ info }: { info: string }) => {
  const tooltipBg = useColorModeValue('#641BA3', '#9333EA')
  return (
    <Tooltip content={info} showArrow contentProps={{ maxW: '260px', css: { "--tooltip-bg": tooltipBg, "color": "#FFFFFF", "justify-content": "center" } }} interactive>
      <Text as="span" display="inline-flex" alignItems="center" color="purple.fg" cursor="help">
        <LuInfo size={14} />
      </Text>
    </Tooltip>
  )
}

// Tooltip hozzaadasa
const FieldLabelWithInfo = ({ label, info }: { label: string; info: string }) => (
  <HStack gap={1}>
    <Field.Label>{label}</Field.Label>
    <InfoIcon info={info} />
  </HStack>
)

// Szam bemenet
export const NumField = ({ label, info, value, onChange, min, max, step = 1, helperText, placeholder, invalid, errorText }: NumFieldProps) => (
  <Field.Root invalid={invalid}>
    <FieldLabelWithInfo label={label} info={info} />
    <NumberInput.Root
      colorPalette="purple"
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
      <NumberInput.Control>
        <NumberInput.IncrementTrigger color="purple.fg" _hover={{ bg: 'purple.subtle' }} />
        <NumberInput.DecrementTrigger color="purple.fg" _hover={{ bg: 'purple.subtle' }} />
      </NumberInput.Control>
      <NumberInput.Input placeholder={placeholder} />
    </NumberInput.Root>
    {helperText && <Field.HelperText>{helperText}</Field.HelperText>}
    {invalid && errorText && <Field.ErrorText fontSize="sm" fontWeight={"bold"} color="red.muted">{errorText}</Field.ErrorText>}
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
          <IconButton variant="outline" size="sm" color="purple.fg" aria-label="Csökkentés" _hover={{ bg: 'purple.subtle' }}>
            <LuMinus />
          </IconButton>
        </NumberInput.DecrementTrigger>
        <NumberInput.Input textAlign="center" />
        <NumberInput.IncrementTrigger asChild>
          <IconButton variant="outline" size="sm" color="purple.fg" aria-label="Növelés" _hover={{ bg: 'purple.subtle' }}>
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
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator color="purple.fg" />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner boxShadow="lg" borderRadius="lg">
            <Select.Content
              zIndex="max" 
              boxShadow="none" 
              bg="bg.panel" 
              borderRadius="lg"
              borderColor="border"
              _open={{
                borderWidth: "1px",
                p: 1,
              }}>
              {options.map((option) => (
                <Select.Item item={option} key={option.value} _hover={{ bg: 'purple.subtle' }} _selected={{ bg: 'bg.panel' }}>
                  {option.label}
                  <Select.ItemIndicator color="purple.fg" />
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
    <Input 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder}
    />
    {invalid && errorText && <Field.ErrorText fontSize="sm" fontWeight={"bold"} color="red.muted">{errorText}</Field.ErrorText>}
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
        <Switch.Control bg="fg.muted" _checked={{ bg: 'purple.solid' }}>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>
      <FieldLabelWithInfo label={label} info={info} />
    </HStack>
  </Field.Root>
)

// Datumok kivalasztasa
export const DateField = ({ label, minimum, maximum, startDate, endDate, onChange, invalid, errorText }: DateFieldProps) => (
  <DatePicker.Root 
    selectionMode="range" 
    locale="hu-HU" 
    invalid={invalid} 
    colorPalette="purple"
    min={parseDate(minimum)} 
    max={parseDate(maximum)}
    value={[startDate, endDate].filter(Boolean).map((date) => parseDate(date))}
    onValueChange={(values) => {
      const [start, end] = values.value
      const StartDate = start ? start.toString() : ''
      const EndDate = end ? end.toString() : ''
      onChange({ startDate: StartDate, endDate: EndDate })
    }}
  >
    <DatePicker.Label>{ label }</DatePicker.Label>
    <DatePicker.Control gap={2}>
      <DatePicker.Input index={0} />
      <DatePicker.Input index={1} />
      <DatePicker.IndicatorGroup>
        <DatePicker.Trigger>
          <IconButton variant="ghost" size="sm">
            <LuCalendar />
          </IconButton>
        </DatePicker.Trigger>
      </DatePicker.IndicatorGroup>
    </DatePicker.Control>
    <Portal>
      <DatePicker.Positioner>
        <DatePicker.Content
          bg="bg.panel" 
          borderWidth="1px"
          borderColor="border"
          borderRadius="lg"
          boxShadow="lg"
          p={3}
        >
          <DatePicker.View view="day">
            <DatePicker.Header />
            <DatePicker.DayTable
              css={{
                '& [data-range-start]': {
                  bg: 'purple.solid',
                  color: 'white',
                },
                '& [data-range-end]': {
                  bg: 'purple.solid',
                  color: 'white',
                },
              }}
            />
          </DatePicker.View>
          <DatePicker.View view="month">
            <DatePicker.Header />
            <DatePicker.MonthTable
              css={{
                '& [data-range-start]': {
                  bg: 'purple.solid',
                  color: 'white',
                },
                '& [data-range-end]': {
                  bg: 'purple.solid',
                  color: 'white',
                },
              }}
            />
          </DatePicker.View>
          <DatePicker.View view="year">
            <DatePicker.Header />
            <DatePicker.YearTable
              css={{
                '& [data-range-start]': {
                  bg: 'purple.solid',
                  color: 'white',
                },
                '& [data-range-end]': {
                  bg: 'purple.solid',
                  color: 'white',
                },
              }}
            />
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Positioner>
    </Portal>
    {invalid && errorText && <Field.ErrorText fontSize="sm" fontWeight={"bold"} color="red.muted">{errorText}</Field.ErrorText>}
  </DatePicker.Root>
)