import { HStack, Button, Box } from '@chakra-ui/react'
import { Link as RouterLink, useLocation } from 'react-router-dom'

export function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <Box bg="white" boxShadow="sm" borderBottom="1px solid" borderColor="gray.200">
      <HStack maxW="1200px" mx="auto" px={8} py={4} gap={4} justifyContent="flex-start">
        <Button
          asChild
          variant={isActive('/') ? 'solid' : 'ghost'}
          colorScheme={isActive('/') ? 'blue' : 'gray'}
        >
          <RouterLink to="/">Home</RouterLink>
        </Button>
        <Button
          asChild
          variant={isActive('/dashboard') ? 'solid' : 'ghost'}
          colorScheme={isActive('/dashboard') ? 'blue' : 'gray'}
        >
          <RouterLink to="/dashboard">Dashboard</RouterLink>
        </Button>
        <Button
          asChild
          variant={isActive('/profile') ? 'solid' : 'ghost'}
          colorScheme={isActive('/profile') ? 'blue' : 'gray'}
        >
          <RouterLink to="/profile">Profile</RouterLink>
        </Button>
        <Button
          asChild
          variant={isActive('/settings') ? 'solid' : 'ghost'}
          colorScheme={isActive('/settings') ? 'blue' : 'gray'}
        >
          <RouterLink to="/settings">Settings</RouterLink>
        </Button>
      </HStack>
    </Box>
  )
}
