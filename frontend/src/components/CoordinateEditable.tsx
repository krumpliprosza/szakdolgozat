import { Editable, HStack, IconButton, Mark, Text } from '@chakra-ui/react'
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu"

// Leiras: A koordinatak megadasahoz keszitett mezo.

interface CoordinateEditableProps {
  value: string
  onCommit: (value: string) => void
  placeholder: string
  unitLabel: string
}

export const CoordinateEditable = ({ value, onCommit, placeholder, unitLabel }: CoordinateEditableProps) => (
  <HStack>
    <Mark variant="subtle" colorPalette="purple">
      <Editable.Root
        key={value}
        defaultValue={value}
        onValueCommit={(details) => onCommit(details.value)}
        placeholder={placeholder}
      >
        <Editable.Preview />
        <Editable.Input />
        <Editable.Control>
          <Editable.EditTrigger asChild>
            <IconButton variant="outline" size="xs">
              <LuPencilLine />
            </IconButton>
          </Editable.EditTrigger>
          <Editable.CancelTrigger asChild>
            <IconButton variant="outline" size="xs">
              <LuX />
            </IconButton>
          </Editable.CancelTrigger>
          <Editable.SubmitTrigger asChild>
            <IconButton variant="outline" size="xs">
              <LuCheck />
            </IconButton>
          </Editable.SubmitTrigger>
        </Editable.Control>
      </Editable.Root>
    </Mark>
    <Text as="span">{unitLabel}</Text>
  </HStack>
)
