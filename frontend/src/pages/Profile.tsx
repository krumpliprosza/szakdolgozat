import { Box, VStack, Heading, Text, HStack, Badge, Button } from '@chakra-ui/react'

export function Profile() {
  return (
    <Box p={8}>
      <VStack gap={6} align="start" w="full">
        <Heading size="2xl">User Profile</Heading>

        <HStack gap={6} w="full">
          <Box
            w={16}
            h={16}
            borderRadius="full"
            bg="blue.200"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="2xl"
            fontWeight="bold"
            color="blue.600"
          >
            JD
          </Box>
          <VStack align="start" gap={2}>
            <Heading size="md">John Doe</Heading>
            <Text color="gray.600">Premium User</Text>
            <Badge colorScheme="green">Active</Badge>
          </VStack>
        </HStack>

        <Box w="full" h="1px" bg="gray.200" />

        <VStack align="start" gap={4} w="full">
          <Heading size="sm">Account Information</Heading>
          <Box>
            <Text fontWeight="bold">Email:</Text>
            <Text color="gray.600">john.doe@example.com</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Location:</Text>
            <Text color="gray.600">San Francisco, CA</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Member Since:</Text>
            <Text color="gray.600">January 15, 2024</Text>
          </Box>
        </VStack>

        <Box w="full" h="1px" bg="gray.200" />

        <VStack align="start" gap={4} w="full">
          <Heading size="sm">Usage Statistics</Heading>
          <HStack gap={8}>
            <Box>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                1,245
              </Text>
              <Text color="gray.600" fontSize="sm">Optimizations</Text>
            </Box>
            <Box>
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                $342.50
              </Text>
              <Text color="gray.600" fontSize="sm">Saved</Text>
            </Box>
          </HStack>
        </VStack>

        <Button colorScheme="blue">Edit Profile</Button>
      </VStack>
    </Box>
  )
}
