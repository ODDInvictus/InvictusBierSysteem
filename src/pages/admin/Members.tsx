import { Box, Divider, Heading, useColorModeValue, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { DataTable } from '../../components/DataTable'
import { setTitle } from '../../utils/utils'
import { createColumnHelper } from '@tanstack/react-table'

type MembersTable = {
  firstName: string,
  lastName: string,
  email: string,
  birthday: string
}

const columnHelper = createColumnHelper<MembersTable>()

const columns = [
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    header: 'Voornaam'
  }),
  columnHelper.accessor('lastName', {
    cell: (info) => info.getValue(),
    header: 'Achternaam'
  }),
  columnHelper.accessor('email', {
    cell: (info) => info.getValue(),
    header: 'Email'
  }),
  columnHelper.accessor('birthday', {
    cell: (info) => info.getValue(),
    header: 'Verjaardag',
  })
]

function formatDate(d: Date): string {
  return `${d.getDay()}-${d.getMonth()}-${d.getFullYear()}`
}

export default function Members() {
  
  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }
  useEffect(() => {
    setTitle('Leden')
  }, [])


  const data: MembersTable[] = [
    {
      firstName: 'Miel',
      lastName: 'Monteur',
      email: 'miel@monteur.nl',
      birthday: formatDate(new Date('02/02/2001'))
    },
    {
      firstName: 'Peter',
      lastName: 'Monteur',
      email: 'peter@monteur.nl',
      birthday: formatDate(new Date('02/02/2002'))
    },
    {
      firstName: 'Pieter-Tjerk',
      lastName: 'Monteur',
      email: 'miel@monteur.nl',
      birthday: formatDate(new Date('03/03/2003'))

    }
  ]

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl">
        Leden
      </Heading>

      <Divider borderColor={colors.divider} />

      <Box>
        
      </Box>
    </VStack>

  </Box> 
}