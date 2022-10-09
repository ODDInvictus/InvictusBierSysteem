import { Box, Divider, Heading, HStack, useColorModeValue, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { setTitle } from '../utils/utils'

export default function Index() {

  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }
  useEffect(() => {
    setTitle('Home')  
  })

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl">
        Invictus Bier Systeem
      </Heading>

      <Divider borderColor={colors.divider} />
    </VStack>

  </Box> 
}