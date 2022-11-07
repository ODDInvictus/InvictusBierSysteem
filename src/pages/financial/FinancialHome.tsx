import { Box, Divider, Heading, useColorModeValue, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { setTitle } from '../../utils/utils'

export default function FinancialHome() {
  
  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }
  useEffect(() => {
    setTitle('Financieel')  
  }, [])

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl" textAlign="center">
        Financieel
      </Heading>


      <Divider borderColor={colors.divider} />
    </VStack>

  </Box> 
}