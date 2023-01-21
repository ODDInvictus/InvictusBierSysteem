import { Box, Divider, Heading, useColorModeValue, VStack, Flex, TableContainer, Table, Thead, Tr, Tbody, Th, Td, Center, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, FormControl, FormLabel, Input, Button, useDisclosure, useToast } from "@chakra-ui/react"
import { StyledButton } from '../../components/StyledButton'
import { AddIcon, MinusIcon } from "@chakra-ui/icons"
import { useState, useEffect } from "react"
import { useLocation } from 'wouter'
import { client } from '../../utils/client'
import { StrafbakOverview } from '../../types/chugs'
import '../../styles/Chugs.css'

export default function Chugs() {

  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700')
  }

  const [_, setLocation] = useLocation()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [ selected, setSelected ] = useState<string | undefined>(undefined)

  const [ strafbakken, setStrafbakken ] = useState<StrafbakOverview[]>([])
  const [ err, setErr ] = useState<string | undefined>(undefined)

  useEffect( () => {
    client.get('/chugs/strafbakken/')
    .then(setStrafbakken)
    .catch(setErr)
  },[])

  function trekbak(name: string) {
    let succes = false;
    let newStrafbakken: StrafbakOverview[] = [];
    strafbakken.forEach(s => {
      if (s.username === name && s.strafbakken > 0) {
        s.strafbakken -= 1
        succes = true
      }
      newStrafbakken.push(s)
    })

    if (succes) {
      setStrafbakken(newStrafbakken)
      client.delete(`/chugs/strafbakken/${name}`)
      .catch(setErr)
    }
  }

  if (err) return (
    <Box>
      <VStack spacing="20px">
        <Heading as="h1" size="2xl">
          Strafbakken
        </Heading>
        <Divider borderColor={colors.divider} />
        <Center>
          <Heading>
            Is weer stuk...
          </Heading>
        </Center>
      </VStack>
    </Box>
  )

  return (
    <Box>
      <Reason
        selected={selected}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        strafbakken={strafbakken}
        setStrafbakken={setStrafbakken}
      />
      <VStack spacing="20px">
        <Heading as="h1" size="2xl">
          Strafbakken
        </Heading>
        <Divider borderColor={colors.divider} />
        <TableContainer>
          <Table variant='striped' colorScheme='purple'>
            <Thead>
              <Tr>
                <Th>Naam</Th>
                <Th>Bakken</Th>
                <Th>Acties</Th>
              </Tr>
            </Thead>
            <Tbody>
              {strafbakken.map(s => (
                <Tr key={s.username}>
                  <Td
                    onClick={() => setLocation(`/chugs/${s.username}/`)}
                    cursor="pointer"
                    className="clickable-td">
                    {(s.nickname||s.username).charAt(0).toUpperCase() + (s.nickname||s.username).slice(1)}
                  </Td>
                  <Td 
                    onClick={() => setLocation(`/chugs/${s.username}/`)}
                    cursor="pointer"
                    className="clickable-td">
                    {s.strafbakken}
                  </Td>
                  <Td>
                    <Flex gap="24px">
                      <AddIcon
                        onClick={() => {
                          setSelected(s.username)
                          onOpen()
                        }}
                        cursor="pointer"
                        transition="0.3s ease"
                        _hover={{opacity: 0.7}}
                      />

                      {(s.strafbakken > 0) ? 
                      <MinusIcon 
                        onClick={() => trekbak(s.username)}
                        cursor="pointer"
                        transition="0.3s ease"
                        _hover={{opacity: 0.7}}
                      />
                      : <MinusIcon opacity="0.5" />}
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </Box>
  );
}

type ReasonProps = {
  selected: string | undefined
  isOpen: boolean
  strafbakken: StrafbakOverview[]
  setStrafbakken: (x:StrafbakOverview[]) => void
  onClose: () => void
  onOpen: () => void
}

function Reason(props: ReasonProps) {

  const toast = useToast()

  const [ reason, setReason ] = useState<string | undefined>(undefined)

  function formatName(name: string | undefined) {
    if (name === undefined) return ''
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  function save() {
    client.post('/chugs/strafbakken/', {'receiver': props.selected, 'reason': reason})
    .then(() => {
      let newStrafbakken: StrafbakOverview[] = [];
      props.strafbakken.forEach(s => {
        if (s.username === props.selected) {
          s.strafbakken += 1
        }
        newStrafbakken.push(s)
      })
      props.setStrafbakken(newStrafbakken)
      props.onClose()
      toast({
        title: 'Gelukt!',
        description: `Yes hoppa ${formatName(props.selected)} heeft een bak verdiend`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    })
    .catch( error => {
      props.onClose()
      toast({
        title: 'Strafbakken is weer stuk!',
        description: error,
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    })
  }

  return <>
  <Modal isOpen={props.isOpen} onClose={props.onClose}>
    <ModalOverlay />
    <ModalContent> 
      <ModalHeader>
        Geef {formatName(props.selected)} een strafbak
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl>
          <FormLabel>Reden</FormLabel>
          <Input onChange={(e) => setReason(e.target.value)}></Input>
        </FormControl>
      </ModalBody>
      <ModalFooter>
          <StyledButton mr={3} onClick={save}>
            Opslaan
          </StyledButton>
          <Button variant='ghost' onClick={props.onClose}>
            Niet opslaan
          </Button>
        </ModalFooter>
    </ModalContent>
  </Modal>
  </>
}