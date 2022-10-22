import { Heading, Divider, Box, useColorModeValue } from '@chakra-ui/react'

export function Card({ title, children, ...rest}: any) {

  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
    box: useColorModeValue('white', 'gray.800'),
  }

  return <Box p={5} shadow="md" borderWidth="1px" bgColor={colors.box} {...rest}>
    <Heading fontSize="xl" textAlign="center">
      {title}
    </Heading>

    <Divider borderColor={colors.divider} pt="10px" mb="10px" />

    <Box>
      {children}
    </Box>
  </Box>
}