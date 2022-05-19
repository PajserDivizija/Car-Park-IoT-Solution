import { Link, LinkProps } from '@chakra-ui/layout';
import { useRouter } from 'next/router';

function NavLink(props: LinkProps) {
  const router = useRouter();

  return (
    <Link
      aria-current={router.pathname === props.href ? 'page' : undefined}
      _activeLink={{ textDecoration: 'underline' }}
      {...props}
    />
  );
}

export default NavLink;
