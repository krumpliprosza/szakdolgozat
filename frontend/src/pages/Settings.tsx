import { Box, VStack, Heading, Button, HStack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import type { ChangeEvent } from 'react'

export function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    autoOptimize: true,
    theme: 'light',
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleChange = (key: keyof typeof settings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Box p={8}>
      <VStack gap={8} align="start" w="full" maxW="md">
        <Heading size="2xl">Settings</Heading>

        <Box w="full" display="flex" alignItems="center" justifyContent="space-between" p={4} bg="gray.50" borderRadius="md">
          <Text>Enable Notifications</Text>
          <Button
            size="sm"
            colorScheme={settings.notifications ? 'green' : 'gray'}
            onClick={() => handleToggle('notifications')}
          >
            {settings.notifications ? 'On' : 'Off'}
          </Button>
        </Box>

        <Box w="full" display="flex" alignItems="center" justifyContent="space-between" p={4} bg="gray.50" borderRadius="md">
          <Text>Auto-Optimize Mode</Text>
          <Button
            size="sm"
            colorScheme={settings.autoOptimize ? 'green' : 'gray'}
            onClick={() => handleToggle('autoOptimize')}
          >
            {settings.autoOptimize ? 'On' : 'Off'}
          </Button>
        </Box>

        <Box w="full">
          <Text mb={2} fontWeight="bold">Theme</Text>
          <select
            value={settings.theme}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange('theme', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
              fontSize: '16px',
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </Box>

        <Box bg="blue.50" p={4} borderRadius="md" w="full">
          <Text fontSize="sm" color="blue.700">
            Settings are automatically saved. Changes take effect immediately.
          </Text>
        </Box>

        <HStack>
          <Button colorScheme="blue">Save All</Button>
          <Button variant="outline">Reset to Defaults</Button>
        </HStack>
      </VStack>
    </Box>
  )
}
