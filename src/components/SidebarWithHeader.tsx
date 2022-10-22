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
import { MdOutlineInventory2, MdOutlinePeopleAlt, MdOutlineAdminPanelSettings } from 'react-icons/md'
import { IconType } from 'react-icons'
import { Link as NavLink, useLocation } from 'wouter'
import config from '../../config.json'
import { Models } from 'appwrite'
import { getRoles, Roles } from '../utils/user'

interface SidebarWithHeaderProps {
  profile: Models.Account<Models.Preferences>
  icon: URL
  children: ReactNode
  roles: Roles[]
}

interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
}

export default function SidebarWithHeader({ profile, children, icon, roles }: SidebarWithHeaderProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        roles={roles}
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
          <SidebarContent roles={roles} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} profile={profile} icon={icon} roles={roles}/>
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  )
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  roles: Roles[];
}

// const LinkItems: Array<LinkItemProps> = [
//   { name: 'Home', link: '/', icon: FiHome },
//   { name: 'Kalender', link: '/kalender', icon: AiOutlineSchedule },
//   { name: 'Voorraad', link: '/voorraad', icon: MdOutlineInventory2 },
//   { name: 'Instellingen', link: '/instellingen', icon: FiSettings },
// ]

// const adminLinkItems: Array<LinkItemProps> = [
//   { name: 'Admin', link: '/admin', icon: GrUserAdmin },
//   { name: 'Leden', link: '/admin/leden', icon: MdOutlinePeopleAlt },
//   { name: 'Commissies', link: '/admin/rollen', icon: FaPeopleCarry },
// ]

const SidebarContent = ({ onClose, roles, ...rest }: SidebarProps) => {

  const [notAdmin] = useState<boolean>(!(roles.includes(Roles.Admin) || roles.includes(Roles.Senaat)))
  const [notColosseum] = useState<boolean>(!roles.includes(Roles.Colosseum))

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
      <NavItem key={'Home'} icon={FiHome} link="/">
        Home
      </NavItem>
      <NavItem key={'Kalender'} icon={AiOutlineSchedule} link="/kalender">
        Kalender
      </NavItem>
      <NavItem key={'Voorraad'} icon={MdOutlineInventory2} link="/voorraad" hidden={notColosseum && notAdmin}>
        Voorraad
      </NavItem>
      <NavItem key={'Admin'} icon={MdOutlineAdminPanelSettings} link="/admin" hidden={notAdmin}>
        Admin
      </NavItem>
      <NavItem key={'Leden'} icon={MdOutlinePeopleAlt} link="/admin/leden" hidden={notAdmin}>
        Leden
      </NavItem>
      <NavItem key={'Commissies'} icon={FaPeopleCarry} link="/admin/rollen" hidden={notAdmin}>
        Commissies
      </NavItem>
      <NavItem key={'Instellingen'} icon={FiSettings} link="/instellingen">
        Instellingen
      </NavItem>
    </Box>
  )
}

interface NavItemProps extends FlexProps {
  icon?: IconType;
  children: string | number;
  link: string;
}
const NavItem = ({ icon, children, link, ...rest }: NavItemProps) => {
  return (
    <Link as={NavLink} to={link} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
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
  profile?: Models.Account<Models.Preferences>
  icon?: URL
  roles: Roles[]
}
const MobileNav = ({ onOpen, profile, icon, roles, ...rest }: MobileProps) => {
  const [bestRole, setBestRole] = useState<Roles>(Roles.Lid)

  const { toggleColorMode } = useColorMode()
  const [_, setLocation]    = useLocation()

  const signOut = async () => {
    await window.account.deleteSessions()
    window.location.href = '/'
  }

  useEffect(() => {
    const r = roles

    if (r.includes(Roles.Admin)) {
      return setBestRole(Roles.Admin)
    }

    if (r.includes(Roles.Senaat)) {
      return setBestRole(Roles.Senaat)
    }

    if (r.includes(Roles.Proeflid)) {
      return setBestRole(Roles.Proeflid)
    }

    if (r.includes(Roles.Lid)) {
      return setBestRole(Roles.Lid)
    }

    if (r.includes(Roles.Colosseum)) {
      return setBestRole(Roles.Colosseum)
    }
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
                  src={ icon?.href ?? config.account.fallbackUserIcon }
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{profile?.name ?? 'Username'}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {bestRole}
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
              <MenuItem onClick={() => setLocation('/profile')}>Profile</MenuItem>
              <MenuItem onClick={() => setLocation('/settings')}>Settings</MenuItem>
              <MenuItem onClick={() => setLocation('/about')}>About</MenuItem>
              <MenuItem onClick={() => toggleColorMode()}>Toggle color</MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  )
}