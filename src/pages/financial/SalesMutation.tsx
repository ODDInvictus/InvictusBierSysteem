import { Box, Divider, Heading, useColorModeValue, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRoute } from 'wouter'
import { useLoading } from '../../hooks/useLoading'
import { Activiteit } from '../../types/backend'
import { setTitle } from '../../utils/utils'
import ErrorPage from '../ErrorPage'
import LoadingPage from '../LoadingPage'

export default function SalesMutation() {
  
  const [activiteit, setActiviteit] = useState<Activiteit>()

  const [_match, params] = useRoute('/financieel/mutaties/:id')	

  const [loading, load] = useLoading(500)

  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }

  useEffect(() => {
    setTitle('Financieel :: Mutatie')

    if (!params || !params.id) return

    window.db.getDocument('main', 'activiteiten', params.id)
      .then(a => setActiviteit(a as unknown as Activiteit))
      .then(load)
  }, [])

  if (loading) {
    return <LoadingPage />
  }

  if (!params || !params.id) {
    return <ErrorPage error="Activiteit ID mist of is ongeldig" />
  }

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl" textAlign="center">
        Mutaties voor {activiteit?.naam}
      </Heading>


      <Divider borderColor={colors.divider} />
    </VStack>

  </Box> 
}