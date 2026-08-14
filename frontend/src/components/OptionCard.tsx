import { Badge, Box, Button, Card } from '@chakra-ui/react'

// Leiras: Ujrafelhasznalhato valaszthato lehetoseg kartya.

interface OptionCardImage {
  light: string
  dark: string
  ariaLabel: string
}

interface OptionCardProps {
  image?: OptionCardImage
  title: string
  description: string
  buttonLabel: string
  onSelect: () => void
  selected?: boolean
  flex?: string | number
  alwaysPurpleButton?: boolean
}

export const OptionCard = ({
  image,
  title,
  description,
  buttonLabel,
  onSelect,
  selected = false,
  flex,
  alwaysPurpleButton = false,
}: OptionCardProps) => (
  <Card.Root
    overflow="hidden"
    pt={image ? 2 : undefined}
    borderColor={selected ? "purple.solid" : "purple.border"}
    borderWidth="2px"
    flex={flex}
  >
    {image && (
      <Box
        backgroundImage={`url(${image.light})`}
        _dark={{ backgroundImage: `url(${image.dark})` }}
        backgroundSize="cover"
        backgroundPosition="center"
        aspectRatio="5/3"
        role="img"
        aria-label={image.ariaLabel}
      />
    )}
    <Card.Body gap="2">
      <Card.Title>
        {title}<br></br>{selected && <Badge colorPalette="purple">Kiválasztva</Badge>}
      </Card.Title>
      <Card.Description color="fg.muted">
        {description}
      </Card.Description>
    </Card.Body>
    <Card.Footer>
      <Button
        variant={selected ? "solid" : "outline"}
        colorPalette={alwaysPurpleButton || selected ? "purple" : undefined}
        onClick={onSelect}
      >
        {buttonLabel}
      </Button>
    </Card.Footer>
  </Card.Root>
)
