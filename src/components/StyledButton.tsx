import { Button } from '@chakra-ui/react'

export function StyledButton(props: any) {
  const { children, ...rest } = props
  return (
    <Button
      colorScheme="purple"
      bgGradient={'linear(to-r, purple.600, purple.500)'}
      _hover={{
        bgGradient: 'linear(to-r, purple.600, purple.500, purple.400)',
        color: 'white',
      }}
      {...rest}
    >
      {children}
    </Button>
  )
}