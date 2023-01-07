import { Box, Divider, Heading, SimpleGrid, useColorModeValue, useToast, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { Activity } from '../../types/activity'
import { Product, ProductCategory } from '../../types/financial'
import { User } from '../../types/users'
import { client } from '../../utils/client'
import { setTitle } from '../../utils/utils'
import LoadingPage from '../LoadingPage'
import { UserProductTable } from './UserProductTable'

export default function Streeplijst() {
  
  const [activities, setActivities] = useState<Activity[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const toast = useToast()

  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }
  useEffect(() => {
    setTitle('TODO: Streeplijst')

    // Fetch all data
    Promise.all([
      client.get<Activity[]>('/activity/').then(setActivities),
      client.get<User[]>('/user/all/').then(setUsers),
      client.get<Product[]>('/financial/products/').then(setProducts),
    ])
      .then(() => setTimeout(() => setLoading(false), 1000))
      .catch(err => {
        console.error(err)
        toast({
          title: 'Er ging iets mis',
          description: err.message,
          status: 'error',
          duration: 5000,
        })
      })
  }, [])

  if (loading) return <LoadingPage title="Bezig met laden van alle data..." h="80vh" />

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl" textAlign="center">
        Verwerk een streeplijst
      </Heading>


      <Divider borderColor={colors.divider} />

      <UserProductTable users={users} products={products} />
    </VStack>

  </Box> 
}