import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  useToast,
} from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import UploadButton from '../../components/UploadButton'
import { useEffect, useState } from 'react'
import { getConfig, setTitle } from '../../utils/utils'
import { Models } from 'appwrite'
import LoadingPage from '../LoadingPage'
import { setUserPreferences } from '../../utils/user'
import { useLocation } from 'wouter'

export default function EditProfile(): JSX.Element {

  const [profile, setProfile] = useState<Models.Account<Models.Preferences>>()
  const [loading, setLoading] = useState<boolean>(true)

  const [userIcon, setUserIcon] = useState<URL>()

  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [oldPassword, setOldPassword] = useState<string>('')

  const toast = useToast()

  const [_, setLocation] = useLocation()

  const bgValue = useColorModeValue('gray.100', 'gray.900')
  const boxBgValue = useColorModeValue('white', 'gray.700')

  useEffect(() => {
    setTitle('Profile')
    window.account.get()
      .then(p => {
        const url = window.storage.getFilePreview(
          import.meta.env.VITE_APPWRITE_USER_ICON_BUCKET_ID,
          p.prefs.icon,
        )
        setUserIcon(url)
        return p
      })
      .then(p => {
        setName(p.name)
        setEmail(p.email)
        setProfile(p)
      })
      .then(load)
  }, [])

  const load = () => setTimeout(() => setLoading(false), getConfig().app.minimalLoadingTime)

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files)

    if (e.target.files) {
      const file = e.target.files[0]

      window.storage.createFile(import.meta.env.VITE_APPWRITE_USER_ICON_BUCKET_ID, 'unique()', file)
        .then(f => {
          console.log(f)
          setUserPreferences({ icon: f.$id })
          toast({
            title: 'Icon uploaded!',
            description: 'Refresh the page to see it',
            isClosable: true,
          })
        })
    }
  }

  const save = () => {
    if (profile?.name !== name) {
      window.account.updateName(name)
        .then(() => {
          toast({
            title: 'Name updated!',
            isClosable: true,
          })
        })
    }
    if (profile?.email !== email) {
      if (password === '') {
        toast({
          title: 'Password required!',
          description: 'You must enter your password to change your email',
          status: 'error',
        })
      }

      console.log({ email, password, oldEmail: profile?.email })

      window.account.updateEmail(profile!.email, password)
        .then(() => {
          toast({
            title: 'Email updated!',
            isClosable: true,
          })
        })
        .catch(err => {
          console.error(err)
          toast({
            title: 'Error updating email!',
            description: err.message,
            status: 'error',
          })
        })
    }

    if (password !== '' && oldPassword !== '') {
      window.account.updatePassword(password)
        .then(() => {
          toast({
            title: 'Password updated!',
            isClosable: true,
          })
        })
    }

  }

  if (loading || !profile) return <LoadingPage h="80vh"/>

  return (
    <Flex
      align={'center'}
      justify={'center'}
      bg={bgValue}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={boxBgValue}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          Edit Profile
        </Heading>
        <FormControl id="userName">
          <FormLabel>User Icon</FormLabel>
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" src={userIcon?.toString() ?? 'https://bit.ly/sage-adebayo'}>
                <AvatarBadge
                  as={IconButton}
                  size="sm"
                  rounded="full"
                  top="-10px"
                  colorScheme="red"
                  aria-label="remove Image"
                  icon={<SmallCloseIcon />}
                />
              </Avatar>
            </Center>
            <Center w="full">
              <UploadButton w="full" onFileSelect={onFileSelect}/>
            </Center>
          </Stack>
        </FormControl>
        <FormControl id="userName">
          <FormLabel>User name</FormLabel>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            _placeholder={{ color: 'gray.500' }}
            type="email"
          />
        </FormControl>

        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Leave blank to keep the same"
            _placeholder={{ color: 'gray.500' }}
            type="password"
          />
        </FormControl>

        <FormControl id="old-password">
          <FormLabel>Old password</FormLabel>
          <Input
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            placeholder="Fill this in to change your password!"
            _placeholder={{ color: 'gray.500' }}
            type="password"
          />
        </FormControl>

        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bgGradient="linear(to-r, red.600, red.500, red.400)"
            color="white"
            w="full"
            onClick={() => setLocation('/')}
            _hover={{
              bgGradient: 'linear(to-r, red.600, red.500, red.600)',
            }}>
            Cancel
          </Button>
          <Button
            bgGradient="linear(to-l, purple.600, purple.500, purple.400)"
            color={'white'}
            w="full"
            onClick={save}
            _hover={{
              bgGradient: 'linear(to-l, purple.600, purple.500, purple.600)',
            }}>
            Save
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}