import { Box, VStack, Heading, Text, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

export function Home() {
  const navigate = useNavigate()

  return (
    <Box p={8}>
      <VStack gap={6} align="start">
        <Heading size="2xl">Welcome to Energy Optimization</Heading>
        <Text fontSize="lg" color="gray.600">
          This is the home page of our single-page application. Use the navigation above to explore different sections.
        </Text>
        <Box bg="blue.50" p={6} borderRadius="md" w="full">
          <Text mb={4}>Quick access to key features:</Text>
          <Button colorScheme="blue" mr={4} onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
          <Button colorScheme="green" onClick={() => navigate('/profile')}>
            View Profile
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}
