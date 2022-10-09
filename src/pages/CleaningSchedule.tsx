import { Box, Heading, Stack, StackDivider, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { setTitle } from '../utils/utils';
import { useEffect } from 'react'

export default function CleaingSchedule() {
    useEffect(() => {
        setTitle('Schoonmaakrooster')
    })

    return <Box>
        <VStack
            divider={<StackDivider borderColor='gray.200' />}
            spacing={8}
            align='stretch'>
            <Heading fontWeight='bold' margin={2}>
                Schoonmaakrooster
            </Heading>

            <TableContainer>
                <Table variant='striped' colorScheme='purple'>
                    <Thead>
                        <Tr>
                            <Th>Week</Th>
                            <Th>Keuken</Th>
                            <Th>Badkamer</Th>
                            <Th>Stofzuigen</Th>
                            <Th>WC</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        <Tr>
                            <Td>39</Td>
                            <Td>🍔</Td>
                            <Td>🍕</Td>
                            <Td>🍟</Td>
                            <Td>🌭</Td>
                        </Tr>
                        <Tr>
                            <Td>40</Td>
                            <Td>🍕</Td>
                            <Td>🍟</Td>
                            <Td>🌭</Td>
                            <Td>🍔</Td>
                        </Tr>
                        <Tr>
                            <Td>41</Td>
                            <Td>🍟</Td>
                            <Td>🌭</Td>
                            <Td>🍔</Td>
                            <Td>🍕</Td>
                        </Tr>
                        <Tr>
                            <Td>42</Td>
                            <Td>🌭</Td>
                            <Td>🍔</Td>
                            <Td>🍕</Td>
                            <Td>🍟</Td>
                        </Tr>
                    </Tbody>
                </ Table>
            </TableContainer>
        </VStack>
    </Box>
}