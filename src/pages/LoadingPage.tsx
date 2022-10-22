import { Spinner, Stack, useColorModeValue } from '@chakra-ui/react'

type LoadingPageProps = {
  h?: string
}

export default function LoadingPage(props: LoadingPageProps) {
  const bgValue = useColorModeValue('gray.100', 'gray.900')

  return <Stack
    minH={ props.h ?? '100vh'}
    align={'center'}
    justify={'center'}
    overflow={'hidden'}
    bg={bgValue}>
    <Spinner size="xl" emptyColor='purple.400' color='purple.800' />
  </Stack>
}