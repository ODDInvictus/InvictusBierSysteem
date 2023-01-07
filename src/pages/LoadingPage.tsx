import { Heading, Spinner, Stack, useColorModeValue } from '@chakra-ui/react'

type LoadingPageProps = {
  h?: string
  title?: string
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
    {props.title !== undefined
      ? <Heading pt="20px">
        {props.title ?? 'Laden...'}
      </Heading>
      : null}
  </Stack>
}