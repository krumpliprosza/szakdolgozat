import { Box, VStack, Heading, Grid, GridItem, Text } from '@chakra-ui/react'
import { useState } from 'react'

export function Dashboard() {
  const [stats] = useState([
    { label: 'Energy Used Today', value: '145 kWh', change: '+5.2%' },
    { label: 'Cost Savings', value: '$24.50', change: '-3.1%' },
    { label: 'Efficiency Score', value: '87%', change: '+12%' },
    { label: 'Peak Hours', value: '2-4 PM', change: 'Alert' },
  ])

  return (
    <Box p={8}>
      <VStack gap={8} align="start" w="full">
        <Heading size="2xl">Dashboard</Heading>
        <Text color="gray.600">
          Monitor your energy consumption and optimization metrics in real-time.
        </Text>

        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} w="full">
          {stats.map((stat, idx) => (
            <GridItem key={idx} bg="white" p={6} borderRadius="lg" boxShadow="sm" border="1px solid" borderColor="gray.200">
              <Text fontWeight="bold" mb={2}>{stat.label}</Text>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600" mb={1}>{stat.value}</Text>
              <Text fontSize="sm" color="gray.600">{stat.change}</Text>
            </GridItem>
          ))}
        </Grid>

        <Box bg="gray.50" p={6} borderRadius="md" w="full" h="300px">
          <Text fontWeight="bold" mb={4}>Energy Usage Chart</Text>
          <Text color="gray.600">[Chart visualization would go here]</Text>
        </Box>
      </VStack>
    </Box>
  )
}
