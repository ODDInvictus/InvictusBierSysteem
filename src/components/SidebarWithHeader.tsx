import React, { ReactNode, useEffect, useState } from 'react'
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorMode,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import {
  FiHome,
  FiMenu,
  FiChevronDown,
  FiSettings,
} from 'react-icons/fi'
import { AiOutlineSchedule } from 'react-icons/ai'
import { FaPeopleCarry } from 'react-icons/fa'
import { TbZoomMoney } from 'react-icons/tb' 
import { MdOutlineInventory2, MdOutlinePeopleAlt, MdOutlineAdminPanelSettings } from 'react-icons/md'
import { IconType } from 'react-icons'
import { Link as NavLink, useLocation } from 'wouter'
import config from '../../config.json'
import { Models } from 'appwrite'
import { Committee, CommitteeName, singularCommitteeName, User } from '../types/users'
import { client } from '../utils/client'

interface SidebarWithHeaderProps {
  user: User
  icon: string
  children: ReactNode
  committees: Committee[]
}

interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
}

export default function SidebarWithHeader({ user, children, icon, committees }: SidebarWithHeaderProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        committees={committees}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent committees={committees} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} user={user} icon={icon} committees={committees}/>
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  )
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  committees: Committee[];
}

const SidebarContent = ({ onClose, committees, ...rest }: SidebarProps) => {

  const [isAdmin, setAdmin]         = useState(false)
  const [isColosseum, setColosseum] = useState(false)
  const [isMember, setMember]       = useState(false)

  useEffect(() => {
    committees.forEach(c => {
      if (c.name === CommitteeName.Admins || c.name === CommitteeName.Senaat) {
        setAdmin(true)
      }

      if (c.name === CommitteeName.Colosseum) {
        setColosseum(true)
      }

      if (c.name === CommitteeName.Leden) {
        setMember(true)
      }
    })
  }, [])

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          {config.app.shortName || 'config.app.shortName'}
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <NavItem key={'Home'} icon={FiHome} link="/" onClick={onClose}>
        Home
      </NavItem>
      <NavItem key={'Kalender'} icon={AiOutlineSchedule} link="/kalender" onClick={onClose}>
        Kalender
      </NavItem>
      <NavItem key={'Financieel'} icon={TbZoomMoney} link="/financieel" onClick={onClose}>
        Financieel
      </NavItem>
      <NavItem key={'Voorraad'} icon={MdOutlineInventory2} link="/voorraad" hidden={!(isColosseum || isAdmin)} onClick={onClose}>
        Voorraad
      </NavItem>
      <NavItem key={'Admin'} icon={MdOutlineAdminPanelSettings} link="/admin" hidden={isAdmin} onClick={onClose}>
        Admin
      </NavItem>
      <NavItem key={'Leden'} icon={MdOutlinePeopleAlt} link="/admin/leden" hidden={!isAdmin} onClick={onClose}>
        Leden
      </NavItem>
      <NavItem key={'Commissies'} icon={FaPeopleCarry} link="/admin/rollen" hidden={!isAdmin} onClick={onClose}>
        Commissies
      </NavItem>
      <NavItem key={'Instellingen'} icon={FiSettings} link="/instellingen" onClick={onClose}>
        Instellingen
      </NavItem>
    </Box>
  )
}

interface NavItemProps extends FlexProps {
  icon?: IconType;
  children: string | number;
  link: string;
  onClick: () => void;
}
const NavItem = ({ icon, children, link, onClick, ...rest }: NavItemProps) => {
  return (
    <Link as={NavLink} to={link} onClick={onClick} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bgGradient: 'linear(to-r, purple.600, purple.500, purple.400)',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  )
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
  user?: User
  icon?: string
  committees: Committee[]
}
const MobileNav = ({ onOpen, user, icon, committees, ...rest }: MobileProps) => {
  const [bestCommittee, setBestCommittee] = useState<string>()

  const { toggleColorMode } = useColorMode()
  const [_, setLocation]    = useLocation()

  const signOut = async () => {
    // Clear the cache
    localStorage.clear()
    // Logout
    await client.logout()
    // Redirect to home
    window.location.href = '/'
  }

  useEffect(() => {
    let b = committees[0]

    committees.forEach(c => {
      switch (c.name as CommitteeName) {
      case CommitteeName.Senaat:
        b = c
        break
      case CommitteeName.Admins:
        b = c
        break
      case CommitteeName.Feuten:
        b = c
        break
      case CommitteeName.Leden:
        b = c
        break
      case CommitteeName.Colosseum:
        b = c
        break
      default:
        break
      }
      
      setBestCommittee(singularCommitteeName(b.name as CommitteeName))
    })
  }, [])

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        {config.app.shortName || 'config.app.shortName'}
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  src={ import.meta.env.VITE_STATIC_ENDPOINT + icon ?? config.account.fallbackUserIcon }
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{`${user?.first_name} ${user?.last_name}` ?? 'Username'}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {bestCommittee ?? 'Alles is stuk'}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem onClick={() => setLocation('/profile')}>Profiel</MenuItem>
              <MenuItem onClick={() => setLocation('/instellingen')}>Instellingen</MenuItem>
              <MenuItem onClick={() => setLocation('/about')}>Over IBS</MenuItem>
              <MenuItem onClick={() => toggleColorMode()}>Wissel kleurschema</MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => signOut()}>Log uit</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  )
}