import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Heading,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { signIn, signOut, useSession } from "next-auth/react";

const Links = ['Dog Parks', 'Events', 'Chat', 'Notifications'];
const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
    }}
    href={'#'}>
    {children}
  </Link>
);

export default function Simple() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();

  return (
    <>
      <Box bg={"#886E58"} textColor="white" px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
              _hover={{
                textDecoration: 'none',
              }}
          bg={"#886E58"}
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={12} alignItems={'center'} fontWeight={'hairline'} fontSize={'18px'}>
            <Heading fontWeight={'hairline'} id='whistl'>
              Whistl
            </Heading>
            <HStack
              as={'nav'}
              spacing={5}
              display={{ base: 'none', md: 'flex'}}>
              {Links.map((link) => (
                <Link key={link} href={`/${link}`}>{link}</Link>
              ))}
            </HStack>
          </HStack>

          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                 <Avatar size={"md"} src={session?.user?.image} />
              </MenuButton>
              <MenuList textColor={"black"}>
                <Heading as='h4' size='md' ml='2%'>{session?.user?.name}</Heading>
                <MenuDivider />
                <MenuItem>Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuItem>Billing</MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                Sign out
              </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}