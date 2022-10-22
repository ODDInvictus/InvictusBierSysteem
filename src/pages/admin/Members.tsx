import { Box, Divider, Heading, Table, Tbody, Image, Td, Th, Thead, Tr, useColorModeValue, VStack, Link as LinkElem, Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { setTitle } from '../../utils/utils'
import { createColumnHelper, flexRender, getCoreRowModel } from '@tanstack/react-table'
import { useReactTable } from '@tanstack/react-table'
import { Link } from 'wouter'
import { EditIcon } from '@chakra-ui/icons'

type Member = {
  name: string,
  email: string,
  birthday: Date,
  roles: string[],
  profilePicture: string,
}

const columnHelper = createColumnHelper<Member>()

const columns = [
  columnHelper.accessor('profilePicture', {
    cell: (info) => (
      <Box height="150px" width="150px">
        <Image 
          src={info.getValue()}
          borderRadius="10px" 
          alt='Profielfoto' />
      </Box>
    ),
    header: 'Foto'
  }),
  columnHelper.accessor('name', {
    cell: (info) => info.getValue(),
    header: 'Voornaam'
  }),
  columnHelper.accessor('email', {
    cell: (info) => <LinkElem href={'mailto://' + info.getValue()}>{info.getValue()}</LinkElem>,
    header: 'Email'
  }),
  columnHelper.accessor('birthday', {
    cell: (info) => <span>{formatDate(info.getValue())}</span>,
    header: 'Verjaardag',
  }),
  columnHelper.accessor('roles', {
    cell: (info) => (
      info.getValue().map((r, idx) => <LinkElem as={Link} href={'/admin/rollen/' + r.toLowerCase()} key={idx}>{r}<Divider orientation="vertical"/></LinkElem>)
    ),
    header: 'Rollen',
  }),
  columnHelper.display({
    id: 'edit',
    header: 'Bewerken',
    cell: props => <RowActions row={props.row} />,
  })
]

function formatDate(d: Date): string {
  return `${d.getDate() }-${d.getMonth()}-${d.getFullYear()}`
}

export default function Members() {

  const [data, setData] = useState<Member[]>([])

  const table = useReactTable({
    data,
    columns,  
    getCoreRowModel: getCoreRowModel()
  })
  
  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }
  useEffect(() => {
    setTitle('Leden')

    fetch(import.meta.env.VITE_BACKEND_ENDPOINT + 'users', {
      method: 'GET'
    }).then(res => res.json())
      .then(data => {
        const d = []
        for (const user of data.users) {
          const roles = data.roles.perUser[user.$id]
          let icon = ''
          try {
            icon = window.storage.getFilePreview(
              import.meta.env.VITE_APPWRITE_USER_ICON_BUCKET_ID,
              user.prefs.icon,
            ).href
          } catch (e) {
            icon = '/public/missing.jpg'
          }

          d.push({
            profilePicture: icon,
            name: user.name,
            email: user.email,
            id: user.$id,
            birthday: new Date(),
            roles
          })
        }
        setData(d)
      })
  }, [])

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl">
        Leden
      </Heading>

      <Divider borderColor={colors.divider} />

      <Box>
        <Table variant="striped" colorScheme="purple">
          <Thead>
            {table.getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Th key={header.id}>
                    {header.isPlaceholder ? null : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map(row => (
              <Tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>

  </Box> 
}

function RowActions({ row }: { row: any }) {

  const onClick = () => {
    console.log(row)
    alert('TODO')
  }

  return <Box>
    <Button colorScheme="purple" size="sm" onClick={onClick} leftIcon={<EditIcon />}>
      Bewerken 
    </Button>
  </Box>
}