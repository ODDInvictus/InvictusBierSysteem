import { Heading, Divider, useColorModeValue } from '@chakra-ui/react'

export default function Title(props: {value: string}) {

  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700')
  }

  return <>
  <Heading as="h1" size="2xl" textAlign="center">
    {props.value}
  </Heading>
  <Divider borderColor={colors.divider} />
  </>
}